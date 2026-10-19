export interface MenuItem {
  id: string;
  name: string;
  category: 'sanduiches' | 'batatas' | 'acai' | 'combos' | 'bebidas';
  price: number;
  description: string;
  image?: string;
  badge?: string;
  isPopular?: boolean;
  availableAddons?: string[];
  removableIngredients?: string[];
  sizes?: MenuItemSize[];
}

export type MenuItemSize = { label: string; price: number };

export interface CartAddon {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

export type SelectedAddon = CartAddon;

export interface CartItem {
  cartItemId: string;
  product: MenuItem;
  quantity: number;
  selectedSize?: { label: string; price: number };
  selectedAddons: CartAddon[];
  removedIngredients: string[];
  notes?: string;
  unitPrice: number;
  totalPrice: number;
}

export type DeliveryType = 'delivery' | 'pickup' | 'dinein';

export type PaymentMethodType = 'pix' | 'cash' | 'credit' | 'debit';

export interface DeliveryTier {
  id: string;
  name: string;
  rangeLabel: string;
  minKm: number;
  maxKm: number;
  fee: number;
  estimatedMinutes: string;
  badge: string;
  description: string;
}

export interface CustomerData {
  name: string;
  phone: string;
  deliveryType: DeliveryType;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
    reference?: string;
    distanceKm: number;
    tierName?: string;
    estimatedMinutes?: string;
    isFreeDelivery?: boolean;
  };
  tableNumber?: string;
  paymentMethod: PaymentMethodType;
  cashChangeFor?: number;
  couponCode?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  description: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerData;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'recebido' | 'preparando' | 'em_rota' | 'entregue';
  pixPayload?: string;
}

export interface RestaurantConfig {
  name: string;
  tagline: string;
  phone: string;
  whatsappFormatted: string;
  address: string;
  city: string;
  state: string;
  openingHours: string;
  daysOpen: string;
  closedDay: string;
  pixKey: string;
  pixKeyType: 'telefone' | 'cpf' | 'cnpj' | 'email' | 'aleatoria';
  merchantCity: string;
  baseDeliveryFee: number;
  feePerKm: number;
  freeDeliveryThreshold?: number;
  latitude: number;
  longitude: number;
  deliveryTiers: DeliveryTier[];
}
