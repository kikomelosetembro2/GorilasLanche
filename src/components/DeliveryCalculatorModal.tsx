import React, { useState } from 'react';
import {
  X,
  MapPin,
  Navigation,
  Bike,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { DeliveryTier, RestaurantConfig } from '../types';
import {
  DEFAULT_DELIVERY_TIERS,
  RIO_BRANCO_NEIGHBORHOODS,
  calculateDistanceKm,
  findDeliveryTier,
  STORE_COORDINATES,
} from '../utils/deliveryTiers';

interface DeliveryCalculatorModalProps {
  restaurant: RestaurantConfig;
  isOpen: boolean;
  onClose: () => void;
  onSelectDistance?: (distanceKm: number, neighborhoodName?: string) => void;
}

export const DeliveryCalculatorModal: React.FC<DeliveryCalculatorModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  onSelectDistance,
}) => {
  const [distanceKm, setDistanceKm] = useState<number>(2.5);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>(
    RIO_BRANCO_NEIGHBORHOODS[1].name
  );
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [gpsSuccessMessage, setGpsSuccessMessage] = useState<string>('');
  const [gpsErrorMessage, setGpsErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const currentTier: DeliveryTier = findDeliveryTier(
    distanceKm,
    restaurant.deliveryTiers || DEFAULT_DELIVERY_TIERS
  );

  // GPS auto-detection
  const handleDetectGps = () => {
    setGpsErrorMessage('');
    setGpsSuccessMessage('');

    if (!navigator.geolocation) {
      setGpsErrorMessage('Geolocalização não é suportada pelo seu navegador.');
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
        setSelectedNeighborhood('📍 Localização Atual (GPS)');
        setGpsSuccessMessage(`GPS detectado: ~${calculated.toFixed(1)} km do Gorilla's Lanches!`);
      },
      (error) => {
        setIsGpsLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsErrorMessage('Permissão de GPS negada. Selecione seu bairro na lista abaixo.');
        } else {
          setGpsErrorMessage('Não foi possível obter a localização. Selecione o bairro na lista.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSelectNeighborhood = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedNeighborhood(val);
    const found = RIO_BRANCO_NEIGHBORHOODS.find((n) => n.name === val);
    if (found) {
      setDistanceKm(found.km);
      setGpsSuccessMessage('');
      setGpsErrorMessage('');
    }
  };

  const handleApplyToOrder = () => {
    if (onSelectDistance) {
      onSelectDistance(distanceKm, selectedNeighborhood);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-[#FFFFFF] rounded-3xl max-w-xl w-full border border-stone-200/80 shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header - Fundo #FFFFFF com Ícone #7A3E1D */}
        <div className="bg-[#FFFFFF] p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5EBE1] text-[#7A3E1D] border border-orange-200/60 flex items-center justify-center">
              <Bike className="w-5 h-5 text-[#7A3E1D]" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-stone-500 block">
                Cálculo Automático por Raio (km)
              </span>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Simulador de Frete Delivery
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

        {/* Content Body - Fundo #FFFFFF */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FFFFFF]">
          {/* Origin Card */}
          <div className="bg-[#FFFFFF] rounded-2xl p-3.5 border border-stone-200/70 flex items-center gap-3 shadow-xs">
            <MapPin className="w-5 h-5 text-[#7A3E1D] shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-stone-900 block">Origem do Pedido:</span>
              <span className="text-stone-600">
                {restaurant.name} · {restaurant.address}, {restaurant.city} - {restaurant.state}
              </span>
            </div>
          </div>

          {/* GPS Auto-Detect Button - Primária #7A3E1D */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={isGpsLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#7A3E1D] hover:bg-[#54250C] active:scale-98 text-white font-medium text-xs transition-colors shadow-xs"
            >
              <Navigation className={`w-4 h-4 text-white ${isGpsLoading ? 'animate-spin' : ''}`} />
              <span>{isGpsLoading ? 'Calculando Distância via GPS...' : 'Detectar Raio Automaticamente (GPS)'}</span>
            </button>

            {gpsSuccessMessage && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{gpsSuccessMessage}</span>
              </div>
            )}

            {/* Secundária #EF4444 para Alertas */}
            {gpsErrorMessage && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-[#EF4444] text-xs font-medium">
                <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                <span>{gpsErrorMessage}</span>
              </div>
            )}
          </div>

          {/* Neighborhood Selector */}
          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-stone-200/70 shadow-xs space-y-1.5">
            <label className="block text-xs font-semibold text-stone-800">
              Ou Selecione o Bairro de Rio Branco:
            </label>
            <select
              value={selectedNeighborhood}
              onChange={handleSelectNeighborhood}
              className="w-full bg-stone-50 text-stone-900 text-xs rounded-xl p-2.5 border border-stone-200 focus:border-[#7A3E1D] outline-none"
            >
              {RIO_BRANCO_NEIGHBORHOODS.map((n) => (
                <option key={n.name} value={n.name}>
                  {n.name} (~{n.km.toFixed(1)} km) — {n.region}
                </option>
              ))}
            </select>
          </div>

          {/* Interactive KM Slider - Acento #7A3E1D */}
          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-stone-200/70 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800">Ajuste do Raio (km):</span>
              <span className="font-bold text-xs px-2.5 py-0.5 rounded-md bg-[#F5EBE1] text-[#7A3E1D] border border-orange-200 font-mono">
                {distanceKm.toFixed(1)} km
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15.0"
              step="0.1"
              value={distanceKm}
              onChange={(e) => {
                setDistanceKm(parseFloat(e.target.value));
                setGpsSuccessMessage('');
              }}
              className="w-full accent-[#7A3E1D] h-2 bg-stone-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>0.5 km (Centro)</span>
              <span>7.0 km (Médio)</span>
              <span>15.0 km (Limite)</span>
            </div>
          </div>

          {/* Current Calculated Result Highlight Card - Destaque #F59E0B e Primária #7A3E1D */}
          <div className="bg-[#FFFFFF] text-stone-900 rounded-2xl p-4 sm:p-5 border border-orange-200/90 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-[#F59E0B] text-xs font-semibold border border-amber-200/70">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                <span>Faixa Ativa de Entrega</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#7A3E1D] text-white text-[11px] font-semibold">
                {currentTier.badge}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {currentTier.name} ({currentTier.rangeLabel})
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              {currentTier.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-stone-100">
              <div className="bg-[#F5EBE1]/50 p-3 rounded-xl border border-orange-100">
                <span className="block text-[10px] uppercase font-medium text-stone-500">
                  Taxa de Entrega:
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-[#7A3E1D]">
                  R$ {currentTier.fee.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex flex-col justify-center">
                <span className="block text-[10px] uppercase font-medium text-stone-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#7A3E1D]" /> Tempo Estimado:
                </span>
                <span className="text-sm sm:text-base font-semibold text-stone-900">
                  {currentTier.estimatedMinutes}
                </span>
              </div>
            </div>

            {/* Free Shipping Hint */}
            <div className="mt-3 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs">
              <span className="text-stone-700">🎁 Pedidos acima de R$ {restaurant.freeDeliveryThreshold?.toFixed(2).replace('.', ',')}:</span>
              <span className="bg-[#F59E0B] text-white px-2 py-0.5 rounded font-bold text-[10px]">
                FRETE GRÁTIS!
              </span>
            </div>
          </div>

          {/* Full Tiers Table */}
          <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-stone-200/70 shadow-xs space-y-2.5">
            <h4 className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#7A3E1D]" />
              Tabela de Faixas por Raio de Distância
            </h4>

            <div className="space-y-1.5">
              {(restaurant.deliveryTiers || DEFAULT_DELIVERY_TIERS).map((tier) => {
                const isSelected = tier.id === currentTier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setDistanceKm((tier.minKm + tier.maxKm) / 2)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-[#F5EBE1]/70 border-[#7A3E1D] text-stone-900 shadow-xs'
                        : 'bg-white border-stone-100 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-stone-900">{tier.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-medium">
                          {tier.rangeLabel}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 mt-0.5 block">
                        Tempo médio: {tier.estimatedMinutes}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-[#7A3E1D] block">
                        R$ {tier.fee.toFixed(2).replace('.', ',')}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] text-[#7A3E1D] font-semibold">
                          Selecionada
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions - Primária #7A3E1D */}
        <div className="p-4 bg-[#FFFFFF] border-t border-stone-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleApplyToOrder}
            className="px-4 py-2 rounded-xl bg-[#7A3E1D] hover:bg-[#54250C] text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-all active:scale-98"
          >
            <span>Confirmar Raio (~{distanceKm.toFixed(1)} km)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
