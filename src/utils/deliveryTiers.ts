import { DeliveryTier } from '../types';

// Gorilla's Lanches - Rua Santo André, 199, Rio Branco - AC
export const STORE_COORDINATES = {
  lat: -9.97544,
  lng: -67.81052,
  address: 'Rua Santo André, 199, Rio Branco - AC',
};

// Faixas personalizadas de entrega por raio de distância
export const DEFAULT_DELIVERY_TIERS: DeliveryTier[] = [
  {
    id: 'tier-1',
    name: 'Faixa 1 — Raio Imediato',
    rangeLabel: 'Até 2.0 km',
    minKm: 0,
    maxKm: 2.0,
    fee: 5.0,
    estimatedMinutes: '20 a 30 min',
    badge: 'Mais Rápido ⚡',
    description: 'Bairros centrais e entorno imediato da hamburgueria.',
  },
  {
    id: 'tier-2',
    name: 'Faixa 2 — Raio Próximo',
    rangeLabel: '2.1 a 4.0 km',
    minKm: 2.1,
    maxKm: 4.0,
    fee: 7.0,
    estimatedMinutes: '25 a 40 min',
    badge: 'Popular 🛵',
    description: 'Bairros intermediários (Bosque, Cerâmica, Estação).',
  },
  {
    id: 'tier-3',
    name: 'Faixa 3 — Zona Expandida',
    rangeLabel: '4.1 a 7.0 km',
    minKm: 4.1,
    maxKm: 7.0,
    fee: 10.0,
    estimatedMinutes: '35 a 50 min',
    badge: 'Raio Médio 📍',
    description: 'Região do Floresta, Isaura Parente, Calafate e adjacências.',
  },
  {
    id: 'tier-4',
    name: 'Faixa 4 — Bairros Afastados',
    rangeLabel: '7.1 a 10.0 km',
    minKm: 7.1,
    maxKm: 10.0,
    fee: 14.0,
    estimatedMinutes: '45 a 60 min',
    badge: 'Zona Ampla 🗺️',
    description: 'Tancredo Neves, Vila Acre, Segundo Distrito e periferia próxima.',
  },
  {
    id: 'tier-5',
    name: 'Faixa 5 — Zona Limite',
    rangeLabel: '10.1 a 15.0 km',
    minKm: 10.1,
    maxKm: 15.0,
    fee: 18.0,
    estimatedMinutes: '50 a 70 min',
    badge: 'Raio Limite 🚀',
    description: 'Extremos urbanos da Grande Rio Branco.',
  },
  {
    id: 'tier-6',
    name: 'Faixa 6 — Especial / Sob Consulta',
    rangeLabel: 'Acima de 15.0 km',
    minKm: 15.1,
    maxKm: 999.0,
    fee: 22.0,
    estimatedMinutes: '60 a 80 min',
    badge: 'Sob Consulta 💬',
    description: 'Distâncias longas; confirmação prévia com o entregador.',
  },
];

export interface NeighborhoodDistance {
  name: string;
  km: number;
  region: string;
}

export const RIO_BRANCO_NEIGHBORHOODS: NeighborhoodDistance[] = [
  { name: 'Centro / Praça da Revolução', km: 1.5, region: 'Central' },
  { name: 'Bosque / Cerâmica', km: 2.5, region: 'Central' },
  { name: 'José Augusto / Abraão Alab', km: 2.8, region: 'Central' },
  { name: 'Estação Experimental', km: 3.5, region: 'Central' },
  { name: 'Isaura Parente / Procon', km: 4.2, region: 'Zona Oeste' },
  { name: 'Floresta / Conjunto Esperança', km: 5.0, region: 'Zona Norte' },
  { name: 'Vila Ivonete / Manoel Julião', km: 4.8, region: 'Zona Norte' },
  { name: 'Segundo Distrito / Seis de Agosto', km: 4.5, region: 'Segundo Distrito' },
  { name: 'Calafate / Portal da Amazônia', km: 6.8, region: 'Zona Sul' },
  { name: 'Baixa da Colina / Mocinha Magalhães', km: 6.2, region: 'Zona Oeste' },
  { name: 'Rui Lino / Distrito Industrial', km: 5.8, region: 'Zona Sul' },
  { name: 'Cidade Nova / Triângulo', km: 7.5, region: 'Segundo Distrito' },
  { name: 'Tancredo Neves / Adalberto Sena', km: 8.2, region: 'Zona Leste' },
  { name: 'Vila Acre / Via Verde Shopping', km: 9.8, region: 'Segundo Distrito' },
  { name: 'Belo Jardim / Santo Afonso', km: 11.5, region: 'Zona Rural/Periferia' },
  { name: 'Custódio Freire / Rodovia AC-40', km: 12.8, region: 'Periferia' },
  { name: 'Outro Bairro / Ajuste Livre (km)', km: 3.0, region: 'Personalizado' },
];

/**
 * Calculates Haversine distance in km between two GPS coordinates,
 * multiplied by an urban road circuit factor (~1.28) for Rio Branco streets.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistance = R * c;

  // Road circuit coefficient in urban Acre
  const roadFactor = 1.28;
  const roadKm = straightDistance * roadFactor;

  return Math.round(roadKm * 10) / 10; // 1 decimal place
}

/**
 * Finds the matching delivery tier for a given distance in km.
 */
export function findDeliveryTier(
  distanceKm: number,
  tiers: DeliveryTier[] = DEFAULT_DELIVERY_TIERS
): DeliveryTier {
  const normalizedKm = Math.max(0.1, distanceKm);
  const match = tiers.find(
    (tier) => normalizedKm >= tier.minKm && normalizedKm <= tier.maxKm
  );
  return match || tiers[tiers.length - 1];
}

/**
 * Calculates delivery fee taking into account free delivery threshold
 */
export function calculateDeliveryFeeDetails(
  distanceKm: number,
  subtotal: number,
  freeDeliveryThreshold: number = 80,
  tiers: DeliveryTier[] = DEFAULT_DELIVERY_TIERS
): {
  tier: DeliveryTier;
  standardFee: number;
  finalFee: number;
  isFree: boolean;
  estimatedMinutes: string;
  remainingForFree: number;
} {
  const tier = findDeliveryTier(distanceKm, tiers);
  const standardFee = tier.fee;
  const isFree = subtotal >= freeDeliveryThreshold && freeDeliveryThreshold > 0;
  const finalFee = isFree ? 0 : standardFee;
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  return {
    tier,
    standardFee,
    finalFee,
    isFree,
    estimatedMinutes: tier.estimatedMinutes,
    remainingForFree,
  };
}
