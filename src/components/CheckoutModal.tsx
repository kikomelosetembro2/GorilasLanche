import React, { useState, useMemo } from 'react';
import {
  X,
  MapPin,
  Bike,
  Store,
  QrCode,
  DollarSign,
  CreditCard,
  Copy,
  Check,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  MessageCircle,
  Navigation,
  Clock,
  CheckCircle2,
  Star,
} from 'lucide-react';
import {
  CartItem,
  CustomerData,
  DeliveryType,
  PaymentMethodType,
  Order,
  RestaurantConfig,
  Coupon,
} from '../types';
import { SAMPLE_COUPONS } from '../data/menuData';
import { generatePixPayload } from '../utils/pix';
import { buildWhatsAppLink } from '../utils/whatsapp';
import {
  DEFAULT_DELIVERY_TIERS,
  RIO_BRANCO_NEIGHBORHOODS,
  calculateDistanceKm,
  calculateDeliveryFeeDetails,
  STORE_COORDINATES,
} from '../utils/deliveryTiers';

interface CheckoutModalProps {
  items: CartItem[];
  subtotal: number;
  restaurant: RestaurantConfig;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  subtotal,
  restaurant,
  onClose,
  onOrderCreated,
}) => {
  // Step indicator: 1 = Details & Delivery, 2 = Payment & Confirm
  const [step, setStep] = useState<1 | 2>(1);

  // Form states
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');

  // Address & Distance Tiers Calculation
  const [street, setStreet] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [neighborhood, setNeighborhood] = useState<string>(RIO_BRANCO_NEIGHBORHOODS[1].name);
  const [distanceKm, setDistanceKm] = useState<number>(RIO_BRANCO_NEIGHBORHOODS[1].km);
  const [complement, setComplement] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('');

  // GPS auto-detection states
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [gpsMessage, setGpsMessage] = useState<string>('');
  const [gpsError, setGpsError] = useState<string>('');
  const [showTiersTable, setShowTiersTable] = useState<boolean>(false);

  // Coupon
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string>('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('pix');
  const [cashChangeFor, setCashChangeFor] = useState<string>('');
  const [copiedPix, setCopiedPix] = useState<boolean>(false);
  const [orderSent, setOrderSent] = useState<boolean>(false);
  const [lastWaUrl, setLastWaUrl] = useState<string>('');

  const tiers = restaurant.deliveryTiers || DEFAULT_DELIVERY_TIERS;
  const freeThreshold = restaurant.freeDeliveryThreshold || 80.0;

  // Real-time Delivery Fee calculation based on radius & custom tiers
  const feeDetails = useMemo(() => {
    if (deliveryType !== 'delivery') {
      return {
        tier: tiers[0],
        standardFee: 0,
        finalFee: 0,
        isFree: true,
        estimatedMinutes: '15 a 25 min',
        remainingForFree: 0,
      };
    }
    return calculateDeliveryFeeDetails(distanceKm, subtotal, freeThreshold, tiers);
  }, [deliveryType, distanceKm, subtotal, freeThreshold, tiers]);

  const deliveryFee = feeDetails.finalFee;

  // Calculate coupon discount
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.minOrderValue && subtotal < appliedCoupon.minOrderValue) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return (subtotal * appliedCoupon.value) / 100;
    }
    return Math.min(subtotal, appliedCoupon.value);
  }, [appliedCoupon, subtotal]);

  // Final Total
  const total = Math.max(0, subtotal + deliveryFee - discount);

  // Real PIX EMV BR Code Payload
  const pixPayload = useMemo(() => {
    try {
      return generatePixPayload({
        pixKey: restaurant.pixKey,
        merchantName: restaurant.name,
        merchantCity: restaurant.merchantCity,
        amount: total,
        txId: `GOR${Date.now().toString().slice(-6)}`,
        description: `GORILLAS #${Date.now().toString().slice(-4)}`,
      });
    } catch {
      return 'PIX_ERROR';
    }
  }, [restaurant, total]);

  // GPS auto-detect handler
  const handleDetectGps = () => {
    setGpsError('');
    setGpsMessage('');

    if (!navigator.geolocation) {
      setGpsError('Geolocalização não é suportada por seu navegador.');
      return;
    }

    setIsGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsGpsLoading(false);
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const calculated = calculateDistanceKm(
          restaurant.latitude || STORE_COORDINATES.lat,
          restaurant.longitude || STORE_COORDINATES.lng,
          userLat,
          userLng
        );
        const boundedKm = Math.min(15, Math.max(0.5, calculated));
        setDistanceKm(boundedKm);
        setNeighborhood('📍 Localização Atual (GPS)');
        setGpsMessage(`Raio detectado: ~${calculated.toFixed(1)} km do Gorilla's Lanches!`);
      },
      (error) => {
        setIsGpsLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('Permissão GPS negada. Selecione seu bairro abaixo.');
        } else {
          setGpsError('Não foi possível obter GPS. Selecione o bairro na lista.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSelectNeighborhood = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setNeighborhood(val);
    const found = RIO_BRANCO_NEIGHBORHOODS.find((n) => n.name === val);
    if (found) {
      setDistanceKm(found.km);
      setGpsMessage('');
      setGpsError('');
    }
  };

  // Apply Coupon Logic
  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const found = SAMPLE_COUPONS.find((c) => c.code === code);
    if (!found) {
      setCouponError('Cupom inválido ou expirado. Tente GORILLA10');
      setAppliedCoupon(null);
      return;
    }

    if (found.minOrderValue && subtotal < found.minOrderValue) {
      setCouponError(
        `Pedido mínimo de R$ ${found.minOrderValue.toFixed(2).replace('.', ',')} para este cupom.`
      );
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(found);
  };

  // Validation
  const isStep1Valid = useMemo(() => {
    if (!name.trim() || !phone.trim()) return false;
    if (deliveryType === 'delivery') {
      return street.trim().length > 0 && number.trim().length > 0;
    }
    return true;
  }, [name, phone, deliveryType, street, number]);

  // Handle final submission and open WhatsApp directly
  const handleSubmitOrder = () => {
    const customerData: CustomerData = {
      name: name.trim(),
      phone: phone.trim(),
      deliveryType,
      address: {
        street: street.trim(),
        number: number.trim(),
        neighborhood,
        complement: complement.trim(),
        reference: reference.trim(),
        distanceKm,
        tierName: `${feeDetails.tier.name} (${feeDetails.tier.rangeLabel})`,
        estimatedMinutes: feeDetails.tier.estimatedMinutes,
        isFreeDelivery: feeDetails.isFree,
      },
      tableNumber: tableNumber.trim(),
      paymentMethod,
      cashChangeFor: cashChangeFor ? parseFloat(cashChangeFor.replace(',', '.')) : undefined,
      couponCode: appliedCoupon?.code,
    };

    const orderId = `GOR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: customerData,
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      status: 'recebido',
      pixPayload: paymentMethod === 'pix' ? pixPayload : undefined,
    };

    onOrderCreated(newOrder);

    // Build URL for WhatsApp (+55 68 8102-1682)
    const waUrl = buildWhatsAppLink(newOrder, restaurant);
    setLastWaUrl(waUrl);
    setOrderSent(true);

    try {
      window.location.href = waUrl;
    } catch {
      // Fallback
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-[#FFFFFF] rounded-3xl max-w-2xl w-full border border-stone-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header - Fundo #FFFFFF */}
        <div className="bg-[#FFFFFF] p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5EBE1] text-[#7A3E1D] border border-orange-200/60 flex items-center justify-center text-lg shrink-0">
              🦍
            </div>
            <div>
              <span className="text-[11px] font-medium text-stone-500 block">
                {step === 1 ? 'Passo 1 de 2: Endereço & Frete' : 'Passo 2 de 2: Pagamento & WhatsApp'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Finalizar Pedido · {restaurant.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors active:scale-95"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Fundo #FFFFFF */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-[#FFFFFF]">
          {/* STEP 1: DADOS, ENTREGA E FRETE POR RAIO */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Customer Contact */}
              <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-stone-200/70 shadow-xs space-y-3">
                <h3 className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#7A3E1D] text-white flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  <span>Seus Dados de Contato</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João da Silva"
                      className="w-full bg-stone-50 text-stone-900 text-xs rounded-xl p-2.5 border border-stone-200 focus:border-[#7A3E1D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      WhatsApp de Contato *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(68) 99999-9999"
                      className="w-full bg-stone-50 text-stone-900 text-xs rounded-xl p-2.5 border border-stone-200 focus:border-[#7A3E1D] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Type Tabs */}
              <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-stone-200/70 shadow-xs space-y-2.5">
                <label className="block text-xs font-semibold text-stone-800">
                  Como deseja receber o pedido?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-medium flex flex-col items-center gap-1 border transition-all ${
                      deliveryType === 'delivery'
                        ? 'bg-[#F5EBE1] border-[#7A3E1D] text-[#7A3E1D] font-semibold shadow-xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Bike className="w-4 h-4 text-[#7A3E1D]" />
                    <span>Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-medium flex flex-col items-center gap-1 border transition-all ${
                      deliveryType === 'pickup'
                        ? 'bg-[#F5EBE1] border-[#7A3E1D] text-[#7A3E1D] font-semibold shadow-xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Store className="w-4 h-4 text-stone-600" />
                    <span>Retirada Balcão</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('dinein')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-medium flex flex-col items-center gap-1 border transition-all ${
                      deliveryType === 'dinein'
                        ? 'bg-[#F5EBE1] border-[#7A3E1D] text-[#7A3E1D] font-semibold shadow-xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-stone-600" />
                    <span>Comer no Local</span>
                  </button>
                </div>
              </div>

              {/* Delivery Address & Radius Calculator */}
              {deliveryType === 'delivery' && (
                <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-stone-200/70 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                      <Bike className="w-4 h-4 text-[#7A3E1D]" />
                      <span>Cálculo de Frete por Raio (km)</span>
                    </h3>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Origem: Rua Santo André, 199
                    </span>
                  </div>

                  {/* GPS Auto-detect Button - Primária #7A3E1D */}
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={handleDetectGps}
                      disabled={isGpsLoading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#7A3E1D] hover:bg-[#54250C] text-white font-medium text-xs transition-colors shadow-xs"
                    >
                      <Navigation
                        className={`w-4 h-4 text-white ${isGpsLoading ? 'animate-spin' : ''}`}
                      />
                      <span>
                        {isGpsLoading ? 'Calculando Raio pelo GPS...' : 'Detectar Raio Automaticamente (GPS)'}
                      </span>
                    </button>

                    {gpsMessage && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{gpsMessage}</span>
                      </div>
                    )}

                    {/* Secundária #EF4444 para Erros */}
                    {gpsError && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-200 text-[#EF4444] text-xs font-medium">
                        <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" />
                        <span>{gpsError}</span>
                      </div>
                    )}
                  </div>

                  {/* Neighborhood Selector */}
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Bairro em Rio Branco:
                    </label>
                    <select
                      value={neighborhood}
                      onChange={handleSelectNeighborhood}
                      className="w-full bg-stone-50 text-stone-900 text-xs rounded-xl p-2.5 border border-stone-200 focus:border-[#7A3E1D] outline-none"
                    >
                      {RIO_BRANCO_NEIGHBORHOODS.map((n) => (
                        <option key={n.name} value={n.name}>
                          {n.name} (~{n.km.toFixed(1)} km)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Distance Slider with Tier Info */}
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-700">
                        Raio de Distância do Restaurante:
                      </span>
                      <span className="font-bold text-xs px-2 py-0.5 rounded-md bg-[#F5EBE1] text-[#7A3E1D] border border-orange-200 font-mono">
                        {distanceKm.toFixed(1)} km
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0.5"
                      max="15.0"
                      step="0.1"
                      value={distanceKm}
                      onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                      className="w-full accent-[#7A3E1D] h-2 bg-stone-200 rounded-lg cursor-pointer"
                    />

                    {/* Calculated Tier Highlight Box */}
                    <div className="mt-2 p-3 rounded-xl bg-[#F5EBE1]/70 border border-orange-200/90 text-stone-900 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold">{feeDetails.tier.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-[#F59E0B] font-semibold">
                            {feeDetails.tier.rangeLabel}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-600 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-[#7A3E1D]" /> Entrega em {feeDetails.tier.estimatedMinutes}
                        </span>
                      </div>

                      <div className="text-right">
                        {feeDetails.isFree ? (
                          <div>
                            <span className="text-[10px] text-stone-400 line-through block">
                              R$ {feeDetails.standardFee.toFixed(2).replace('.', ',')}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-[#F59E0B] uppercase">
                              GRÁTIS!
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[10px] text-stone-500 block">Taxa Frete:</span>
                            <span className="text-sm font-bold font-mono text-[#7A3E1D]">
                              R$ {feeDetails.finalFee.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowTiersTable(!showTiersTable)}
                      className="text-[11px] text-stone-500 hover:text-stone-800 block text-center w-full pt-1"
                    >
                      {showTiersTable ? '▲ Ocultar Tabela de Faixas' : '▼ Ver Faixas de Distância'}
                    </button>

                    {/* Collapsible Tiers Table */}
                    {showTiersTable && (
                      <div className="mt-2 space-y-1 pt-2 border-t border-stone-200">
                        {tiers.map((t) => (
                          <div
                            key={t.id}
                            className={`p-2 rounded-lg border text-xs flex justify-between items-center ${
                              t.id === feeDetails.tier.id
                                ? 'bg-[#F5EBE1] border-[#7A3E1D] text-[#7A3E1D] font-semibold'
                                : 'bg-white border-stone-100 text-stone-600'
                            }`}
                          >
                            <span>
                              {t.name} ({t.rangeLabel}) — {t.estimatedMinutes}
                            </span>
                            <span className="font-mono font-medium">
                              R$ {t.fee.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Street & Number */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Rua / Avenida *
                      </label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Ex: Rua Floriano Peixoto"
                        className="w-full bg-stone-50 text-stone-900 text-xs rounded-xl p-2.5 border border-stone-200 focus:border-[#7A3E1D] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Ex: 480"
                        className="w-full bg-stone-50 text-stone-900 text-xs rounded-xl p-2.5 border border-stone-200 focus:border-[#7A3E1D] outline-none"
                      />
                    </div>
                  </div>

                  {/* Complement & Reference */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Complemento
                      </label>
                      <input
                        type="text"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        placeholder="Ex: Apto 204, Bloco B"
                        className="w-full bg-stone-50 text-stone-900 text-xs rounded-xl p-2.5 border border-stone-200 focus:border-[#7A3E1D] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Ponto de Referência
                      </label>
                      <input
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Ex: Ao lado do mercado"
                        className="w-full bg-stone-50 text-stone-900 text-xs rounded-xl p-2.5 border border-stone-200 focus:border-[#7A3E1D] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Table number if dine-in */}
              {deliveryType === 'dinein' && (
                <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-stone-200/70 shadow-xs">
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Número da Mesa *
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Ex: Mesa 04"
                    className="w-full bg-stone-50 text-stone-900 text-xs rounded-xl p-2.5 border border-stone-200 focus:border-[#7A3E1D] outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PAGAMENTO, CUPOM E FINALIZAÇÃO WHATSAPP */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Order Items Summary */}
              <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-stone-200/70 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-stone-800 block">
                  Itens Selecionados ({items.length}):
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {items.map((it) => (
                    <div
                      key={it.cartItemId}
                      className="flex justify-between text-xs text-stone-700 border-b border-stone-100 pb-1"
                    >
                      <span>
                        {it.quantity}x {it.product.name}{' '}
                        {it.selectedSize ? `(${it.selectedSize.label})` : ''}
                      </span>
                      <span className="font-mono font-medium">
                        R$ {it.totalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Bar */}
              <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-stone-200/70 shadow-xs space-y-2">
                <label className="block text-xs font-semibold text-stone-800">
                  Cupom de Desconto:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Código (Ex: GORILLA10)"
                    className="flex-1 bg-stone-50 text-stone-900 uppercase text-xs rounded-xl p-2.5 border border-stone-200 outline-none focus:border-[#7A3E1D]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3.5 py-2.5 rounded-xl bg-[#7A3E1D] hover:bg-[#54250C] text-white font-medium text-xs transition-colors shadow-xs"
                  >
                    Aplicar
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-xs font-medium text-emerald-700">
                    ✓ Cupom {appliedCoupon.code} aplicado: {appliedCoupon.description}
                  </p>
                )}
                {/* Secundária #EF4444 para erro no cupom */}
                {couponError && (
                  <p className="text-xs font-medium text-[#EF4444]">✕ {couponError}</p>
                )}
              </div>

              {/* Payment Methods */}
              <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-stone-200/70 shadow-xs space-y-2.5">
                <label className="block text-xs font-semibold text-stone-800">
                  Forma de Pagamento:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-2.5 rounded-xl text-xs font-medium flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === 'pix'
                        ? 'bg-[#F5EBE1] border-[#7A3E1D] text-[#7A3E1D] font-semibold shadow-xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-[#7A3E1D]" />
                    <span>PIX Online</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded-xl text-xs font-medium flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-[#F5EBE1] border-[#7A3E1D] text-[#7A3E1D] font-semibold shadow-xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 text-stone-600" />
                    <span>Dinheiro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit')}
                    className={`p-2.5 rounded-xl text-xs font-medium flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === 'credit'
                        ? 'bg-[#F5EBE1] border-[#7A3E1D] text-[#7A3E1D] font-semibold shadow-xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-stone-600" />
                    <span>Crédito</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('debit')}
                    className={`p-2.5 rounded-xl text-xs font-medium flex flex-col items-center gap-1 border transition-all ${
                      paymentMethod === 'debit'
                        ? 'bg-[#F5EBE1] border-[#7A3E1D] text-[#7A3E1D] font-semibold shadow-xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-stone-600" />
                    <span>Débito</span>
                  </button>
                </div>

                {/* PIX Details */}
                {paymentMethod === 'pix' && (
                  <div className="mt-2 p-3 rounded-xl bg-[#F5EBE1]/70 border border-orange-200 space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-800">
                      <span className="font-medium">Chave PIX (Telefone):</span>
                      <span className="font-mono font-semibold">{restaurant.pixKey}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="w-full py-2 px-3 rounded-lg bg-[#7A3E1D] text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-[#54250C] transition-colors"
                    >
                      {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPix ? 'Copia e Cola Copiado!' : 'Copiar Chave / Código PIX'}</span>
                    </button>
                  </div>
                )}

                {/* Cash Change */}
                {paymentMethod === 'cash' && (
                  <div className="mt-2 p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <label className="block text-xs font-medium text-stone-700">Troco para quanto?</label>
                    <input
                      type="text"
                      value={cashChangeFor}
                      onChange={(e) => setCashChangeFor(e.target.value)}
                      placeholder="Ex: 50,00 (ou deixe em branco se não precisar)"
                      className="w-full bg-white text-stone-900 text-xs rounded-lg p-2 border border-stone-200 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Financial Totals Breakdown */}
              <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-stone-200/80 space-y-1.5 text-stone-700 shadow-xs">
                <div className="flex justify-between text-xs">
                  <span>Subtotal:</span>
                  <span className="font-mono">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Frete por Raio ({distanceKm.toFixed(1)} km · {feeDetails.tier.name}):</span>
                  <span className="font-mono">
                    {deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700 font-medium">
                    <span>Desconto ({appliedCoupon?.code}):</span>
                    <span className="font-mono">- R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-stone-900">
                  <span>Total Final:</span>
                  <span className="text-xl font-mono text-[#7A3E1D]">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* WhatsApp Submit Button */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-white shrink-0" />
                  <span>Enviar Pedido ao WhatsApp ({restaurant.phone})</span>
                </button>

                <p className="text-[11px] text-center text-stone-500">
                  Seu pedido será estruturado e enviado pronto para o WhatsApp da hamburgueria!
                </p>

                {orderSent && lastWaUrl && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                    <p className="text-xs font-semibold text-emerald-900">Pedido gerado com sucesso!</p>
                    <a
                      href={lastWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs text-emerald-700 underline"
                    >
                      Clique aqui se a janela do WhatsApp não abriu automaticamente
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="p-4 bg-[#FFFFFF] border-t border-stone-100 flex items-center justify-between gap-3">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
            >
              ← Voltar
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
            >
              Cancelar
            </button>
          )}

          {step === 1 && (
            <button
              type="button"
              disabled={!isStep1Valid}
              onClick={() => setStep(2)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isStep1Valid
                  ? 'bg-[#7A3E1D] hover:bg-[#54250C] text-white shadow-xs cursor-pointer active:scale-98'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>Ir para Pagamento (R$ {total.toFixed(2).replace('.', ',')})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
