import React, { useState } from 'react';
import {
  Globe,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  X,
  HardDrive,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { signInWithGoogleDrive, uploadZipToGoogleDrive } from '../utils/googleDrive';

interface SharePublicModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
}

export const SharePublicModal: React.FC<SharePublicModalProps> = ({ isOpen, onClose, phone }) => {
  const [copied, setCopied] = useState(false);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveSuccessLink, setDriveSuccessLink] = useState<string | null>(null);
  const [driveError, setDriveError] = useState<string | null>(null);

  if (!isOpen) return null;

  // The official public domain provided by AI Studio
  const publicAppUrl = 'https://ais-pre-ic5lzjsyno5gxudax3k63z-478599787022.us-east5.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `🍔 *Cardápio Digital Oficial - Gorilla's Lanches*\nFaça seu pedido online com cálculo de frete por km e envie direto para o nosso WhatsApp (${phone}):\n👉 ${publicAppUrl}`;
    window.location.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const handleSaveToGoogleDrive = async () => {
    const confirmed = window.confirm(
      'Deseja fazer login com sua conta Google e salvar o arquivo ZIP completo do projeto no seu Google Drive?'
    );
    if (!confirmed) return;

    setDriveLoading(true);
    setDriveError(null);
    setDriveSuccessLink(null);

    try {
      const authResult = await signInWithGoogleDrive();
      if (!authResult) {
        throw new Error('Autenticação cancelada.');
      }

      const response = await fetch('/gorillas-lanches-cardapio-completo.zip');
      if (!response.ok) {
        throw new Error('Não foi possível carregar o arquivo ZIP do projeto.');
      }
      const zipBlob = await response.blob();

      const uploadResult = await uploadZipToGoogleDrive(
        zipBlob,
        `Gorillas-Lanches-Backup-${new Date().toISOString().slice(0, 10)}.zip`
      );

      setDriveSuccessLink(uploadResult.webViewLink || 'https://drive.google.com');
    } catch (err: any) {
      setDriveError(err?.message || 'Erro ao conectar ao Google Drive');
    } finally {
      setDriveLoading(false);
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=1c1917&bgcolor=ffffff&data=${encodeURIComponent(
    publicAppUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-2xl bg-[#FFFFFF] border border-stone-200/80 rounded-3xl shadow-xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header - Fundo #FFFFFF com Ícone #7A3E1D */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-[#FFFFFF] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5EBE1] text-[#7A3E1D] border border-orange-200/60 flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#7A3E1D]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                Domínio Público & Compartilhamento
              </h3>
              <p className="text-xs text-stone-500">
                Acesso oficial e seguro para seus clientes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors active:scale-95 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body - Fundo #FFFFFF */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-sm bg-[#FFFFFF]">
          {/* Public Link Card */}
          <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-stone-200/70 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" /> Link Público do Cardápio:
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                Online (HTTPS)
              </span>
            </div>

            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-stone-800 truncate flex-1">
                {publicAppUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-[#7A3E1D] hover:bg-[#54250C] text-white font-medium text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={publicAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir Cardápio</span>
              </a>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>Compartilhar no WhatsApp</span>
              </button>
            </div>
          </div>

          {/* QR Code and Tables Flyer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-[#FFFFFF] p-5 rounded-2xl border border-stone-200/70 shadow-xs">
            <div className="flex flex-col items-center justify-center p-3 bg-stone-50 rounded-xl border border-stone-100">
              <img
                src={qrCodeUrl}
                alt="QR Code do Cardápio"
                className="w-32 h-32 rounded-lg"
              />
              <span className="text-[10px] text-stone-500 font-mono mt-1.5 font-medium">
                Aponte a câmera do celular
              </span>
            </div>

            <div className="space-y-2 text-xs text-stone-600">
              <h4 className="font-semibold text-stone-900 text-sm flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#7A3E1D]" /> Cardápio na Mesa e Embalagens
              </h4>
              <p className="leading-relaxed">
                Utilize este QR Code para displays de mesa na lanchonete (Rua Santo André, 199) ou adesivos das embalagens delivery.
              </p>
              <div className="p-2.5 bg-[#F5EBE1]/70 rounded-xl border border-orange-200/60 text-xs">
                <strong className="text-stone-900 block font-semibold">Atendimento Centralizado:</strong>
                <span className="text-stone-700">Todos os pedidos chegam formatados no WhatsApp <strong>{phone}</strong></span>
              </div>
            </div>
          </div>

          {/* Google Drive Backup Section */}
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-stone-200/70 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-[#7A3E1D]" /> Salvar Projeto no Google Drive
              </span>
              <span className="text-[10px] text-stone-600 font-medium bg-stone-100 px-2 py-0.5 rounded-md">
                Backup em Nuvem
              </span>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Salve uma cópia completa de todos os arquivos do projeto (código-fonte, cardápio, estilos e utilitários) diretamente na sua conta do Google Drive com autenticação Google oficial.
            </p>

            <button
              type="button"
              onClick={handleSaveToGoogleDrive}
              disabled={driveLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#7A3E1D] hover:bg-[#54250C] disabled:opacity-50 text-white font-medium text-xs transition-colors shadow-xs"
            >
              <HardDrive className="w-4 h-4" />
              <span>{driveLoading ? 'Conectando ao Google Drive...' : 'Salvar no meu Google Drive'}</span>
            </button>

            {driveSuccessLink && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between font-medium">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Arquivo salvo com sucesso no seu Google Drive!
                </span>
                <a
                  href={driveSuccessLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-emerald-800 ml-2 shrink-0 flex items-center gap-1"
                >
                  Abrir no Drive <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {driveError && (
              <p className="text-xs text-[#EF4444] bg-red-50 p-2.5 rounded-xl border border-red-200">
                {driveError}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-[#FFFFFF] flex items-center justify-between gap-3 sticky bottom-0">
          <span className="text-xs text-stone-400 font-mono">
            Ambiente Cloud AI Studio
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
