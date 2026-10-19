/**
 * BACEN EMV BR Code (PIX) Payload Generator
 * Implements CRC16-CCITT (0xFFFF polynomial 0x1021)
 */

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function emvField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

export interface PixParams {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  txId?: string;
  description?: string;
}

export function generatePixPayload({
  pixKey,
  merchantName,
  merchantCity,
  amount,
  txId = '***',
  description = "GORILLA LANCHES",
}: PixParams): string {
  // Clean merchant name and city (max 25 and 15 chars, ascii only)
  const cleanName = merchantName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").slice(0, 25);
  const cleanCity = merchantCity.normalize("NFD").replace(/[\u0300-\u036f]/g, "").slice(0, 15);
  const cleanPixKey = pixKey.replace(/[^\w@.-]/g, '');
  const cleanAmount = amount.toFixed(2);
  const cleanTxId = (txId || '***').replace(/[^a-zA-Z0-9]/g, '').slice(0, 25) || '***';

  // 26: Merchant Account Information - Pix
  const gui = emvField('00', 'br.gov.bcb.pix');
  const keyField = emvField('01', cleanPixKey);
  const descField = description ? emvField('02', description.slice(0, 40)) : '';
  const merchantAccountInfo = emvField('26', `${gui}${keyField}${descField}`);

  // 62: Additional Data Field (TxID)
  const additionalDataField = emvField('62', emvField('05', cleanTxId));

  // Construct raw payload without CRC (tag 63)
  const rawPayload =
    emvField('00', '01') + // Format Indicator
    emvField('01', '12') + // Point of Initiation (12 = Dynamic/QR Code)
    merchantAccountInfo +
    emvField('52', '0000') + // Merchant Category Code
    emvField('53', '986') + // Transaction Currency (986 = BRL)
    emvField('54', cleanAmount) + // Transaction Amount
    emvField('58', 'BR') + // Country Code
    emvField('59', cleanName) + // Merchant Name
    emvField('60', cleanCity) + // Merchant City
    additionalDataField +
    '6304'; // CRC placeholder ID and Length

  const checksum = crc16(rawPayload);
  return `${rawPayload}${checksum}`;
}
