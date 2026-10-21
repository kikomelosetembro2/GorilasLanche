import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { MenuCatalog } from './components/MenuCatalog';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { DeliveryCalculatorModal } from './components/DeliveryCalculatorModal';
import { ThermalReceipt } from './components/ThermalReceipt';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { ProjectDownloadModal } from './components/ProjectDownloadModal';
import { SharePublicModal } from './components/SharePublicModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { ENRICHED_MENU_ITEMS, RESTAURANT_INFO } from './data/menuData';
import { MenuItem, CartItem, Order } from './types';
import {
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Globe,
  Sparkles,
  Check,
  Copy,
  Bike,
  Palette,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'receipt' | 'architecture'>('catalog');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isDeliveryCalcOpen, setIsDeliveryCalcOpen] = useState<boolean>(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [copiedPublicLink, setCopiedPublicLink] = useState<boolean>(false);
  const [isCartAnimating, setIsCartAnimating] = useState<boolean>(false);

  // Initialize theme from localStorage or default to modern 'warm-artisanal'
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return localStorage.getItem('gorillas_theme') || 'warm-artisanal';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentThemeId);
    localStorage.setItem('gorillas_theme', currentThemeId);
  }, [currentThemeId]);

  const publicAppUrl = 'https://ais-pre-ic5lzjsyno5gxudax3k63z-478599787022.us-east5.run.app';

  // Initial demo order so the Thermal Receipt is immediately interactive
  const [currentOrder, setCurrentOrder] = useState<Order | null>({
    id: 'GOR-1042',
    createdAt: new Date().toISOString(),
    customer: {
      name: 'Carlos Albuquerque',
      phone: '+55 68 8102-1682',
      deliveryType: 'delivery',
      address: {
        street: 'Rua Floriano Peixoto',
        number: '480',
        neighborhood: 'Bosque',
        complement: 'Apto 302',
        reference: 'Próximo à pracinha',
        distanceKm: 2.5,
        tierName: 'Faixa 2 — Raio Próximo (2.1 a 4.0 km)',
        estimatedMinutes: '25 a 40 min',
        isFreeDelivery: false,
      },
      paymentMethod: 'pix',
      couponCode: 'GORILLA10',
    },
    items: [
      {
        cartItemId: 'item-demo-1',
        product: ENRICHED_MENU_ITEMS[5], // X-Bagunça
        quantity: 1,
        selectedAddons: [
          { id: 'add-queijo', name: 'Queijo Duplo Derretido', price: 3.5, quantity: 1 },
          { id: 'add-bacon', name: 'Bacon Crocante Fatiado', price: 4.5, quantity: 1 },
        ],
        removedIngredients: ['Sem Cebola'],
        notes: 'Carne bem passada por favor',
        unitPrice: 32.0,
        totalPrice: 32.0,
      },
      {
        cartItemId: 'item-demo-2',
        product: ENRICHED_MENU_ITEMS[0], // Combo 1
        quantity: 1,
        selectedAddons: [],
        removedIngredients: [],
        unitPrice: 22.0,
        totalPrice: 22.0,
      },
    ],
    subtotal: 54.0,
    deliveryFee: 7.0,
    discount: 5.4,
    total: 55.6,
    status: 'recebido',
  });

  // Calculate cart count & subtotal
  const { cartCount, cartSubtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    cartItems.forEach((item) => {
      count += item.quantity;
      subtotal += item.totalPrice;
    });
    return { cartCount: count, cartSubtotal: subtotal };
  }, [cartItems]);

  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.product.id === newItem.product.id &&
          i.selectedSize?.label === newItem.selectedSize?.label &&
          JSON.stringify(i.selectedAddons) === JSON.stringify(newItem.selectedAddons) &&
          JSON.stringify(i.removedIngredients) === JSON.stringify(newItem.removedIngredients) &&
          i.notes === newItem.notes
      );

      if (existingIndex >= 0) {
        const copy = [...prev];
        const existing = copy[existingIndex];
        const updatedQty = existing.quantity + newItem.quantity;
        copy[existingIndex] = {
          ...existing,
          quantity: updatedQty,
          totalPrice: existing.unitPrice * updatedQty,
        };
        return copy;
      }
      return [...prev, newItem];
    });

    // Trigger bounce and shake animation on cart icon
    setIsCartAnimating(true);
    setTimeout(() => {
      setIsCartAnimating(false);
    }, 700);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQty, totalPrice: item.unitPrice * newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleOrderCreated = (order: Order) => {
    setCurrentOrder(order);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setActiveTab('receipt');
  };

  const handleUpdateStatus = (status: Order['status']) => {
    if (!currentOrder) return;
    setCurrentOrder((prev) => (prev ? { ...prev, status } : null));
  };

  const handleCopyPublicLink = async () => {
    try {
      await navigator.clipboard.writeText(publicAppUrl);
      setCopiedPublicLink(true);
      setTimeout(() => setCopiedPublicLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-body)] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[var(--color-brand-primary)] selection:text-white transition-colors duration-200">
      {/* Header com Navegação e Ações Rápidas */}
      <Header
        restaurant={RESTAURANT_INFO}
        cartCount={cartCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenThemes={() => setIsThemeModalOpen(true)}
        isCartAnimating={isCartAnimating}
      />

      {/* Main Responsive Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 sm:py-6">
        {/* Barra de Atendimento e Ações Rápidas */}
        {activeTab === 'catalog' && (
          <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-[var(--color-bg-muted)] border border-[var(--color-border)] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors duration-200">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] text-[var(--color-brand-primary)] flex items-center justify-center font-bold shrink-0 border border-[var(--color-border)] shadow-xs">
                <Sparkles className="w-5 h-5 text-[var(--color-brand-primary)]" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--color-text-title)] text-sm">
                    {RESTAURANT_INFO.name} • Cardápio Digital Oficial
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    ONLINE
                  </span>
                </div>
                <p className="text-[var(--color-text-muted)] text-[11px] mt-0.5 max-w-md">
                  Faça seu pedido online, calcule o frete por km e receba quentinho via WhatsApp oficial <strong>{RESTAURANT_INFO.phone}</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setIsThemeModalOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--color-bg-card)] hover:opacity-80 text-[var(--color-text-title)] font-bold text-xs border border-[var(--color-border)] shadow-2xs transition-colors"
                title="Personalizar tema de cores"
              >
                <Palette className="w-4 h-4 text-[var(--color-brand-primary)]" />
                <span>Paletas</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDeliveryCalcOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                title="Simular frete por km"
              >
                <Bike className="w-4 h-4 text-white" />
                <span>Calcular Frete (km)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyPublicLink}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--color-bg-card)] hover:opacity-80 text-[var(--color-text-title)] font-semibold text-xs border border-[var(--color-border)] transition-colors"
              >
                {copiedPublicLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[var(--color-text-title)]" />}
                <span>{copiedPublicLink ? 'Copiado!' : 'Copiar Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--color-bg-card)] hover:opacity-80 text-[var(--color-text-title)] font-semibold text-xs border border-[var(--color-border)] transition-colors"
              >
                <Globe className="w-4 h-4 text-[var(--color-brand-primary)]" />
                <span>QR Code</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <MenuCatalog
            items={ENRICHED_MENU_ITEMS}
            onSelectItem={(item) => setSelectedProduct(item)}
            onOpenDeliveryCalculator={() => setIsDeliveryCalcOpen(true)}
          />
        )}

        {activeTab === 'receipt' && (
          <ThermalReceipt
            order={currentOrder}
            restaurant={RESTAURANT_INFO}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureGuide />}
      </main>

      {/* Mobile Floating WhatsApp Quick Button when cart is empty */}
      {cartCount === 0 && activeTab === 'catalog' && (
        <aside
          aria-label="Pedir no WhatsApp"
          className="fixed bottom-4 right-4 sm:hidden z-30 animate-in slide-in-from-bottom-2 duration-300"
        >
          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappFormatted}?text=${encodeURIComponent('Olá Gorilla\'s Lanches! Gostaria de fazer um pedido.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-white text-white" />
            <span>{RESTAURANT_INFO.phone}</span>
          </a>
        </aside>
      )}

      {/* Mobile Floating Bottom Cart Bar com Animação Shake/Bounce */}
      {cartCount > 0 && activeTab === 'catalog' && (
        <aside
          aria-label="Resumo do Pedido"
          className="fixed bottom-3 inset-x-3 sm:hidden z-30 animate-in slide-in-from-bottom-4 duration-200"
        >
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-white font-bold shadow-xl active:scale-98 transition-all ${
              isCartAnimating ? 'animate-cart-bounce ring-4 ring-white/30' : ''
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl bg-[var(--color-bg-card)] text-[var(--color-brand-primary)] flex items-center justify-center font-black text-xs ${
                isCartAnimating ? 'animate-badge-pop' : ''
              }`}>
                {cartCount}
              </div>
              <div className="text-left">
                <span className="block text-[10px] uppercase font-semibold text-white/95 leading-none">
                  Ver Pedido & Checkout
                </span>
                <span className="text-sm font-bold leading-none text-white font-mono">
                  R$ {cartSubtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-white text-[var(--color-brand-hover)] px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs">
              <span>Finalizar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </aside>
      )}

      {/* Product Customization Modal */}
      {selectedProduct && (
        <ProductModal
          item={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        subtotal={cartSubtotal}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal with Radius Delivery Calculation */}
      {isCheckoutOpen && (
        <CheckoutModal
          items={cartItems}
          subtotal={cartSubtotal}
          restaurant={RESTAURANT_INFO}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderCreated={handleOrderCreated}
        />
      )}

      {/* Delivery Calculator Modal */}
      <DeliveryCalculatorModal
        restaurant={RESTAURANT_INFO}
        isOpen={isDeliveryCalcOpen}
        onClose={() => setIsDeliveryCalcOpen(false)}
      />

      {/* Project Download Modal */}
      <ProjectDownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />

      {/* Share / Public Domain Modal */}
      <SharePublicModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        phone={RESTAURANT_INFO.phone}
      />

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentThemeId={currentThemeId}
        onSelectTheme={(id) => setCurrentThemeId(id)}
      />

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-card)] py-6 text-center text-xs text-[var(--color-text-muted)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-[var(--color-text-title)]">
            © 2026 Gorilla&apos;s Lanches • Mais Sabor, Mais Qualidade, Mais Você!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5 text-[var(--color-text-body)] font-medium">
            <span className="text-[var(--color-text-title)]">Rua Santo André, 199</span>
            <span>•</span>
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="text-[var(--color-brand-primary)] hover:text-[var(--color-brand-hover)] hover:underline font-bold flex items-center gap-1 transition-colors"
            >
              <Palette className="w-3.5 h-3.5" /> Temas & Cores
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDeliveryCalcOpen(true)}
              className="text-[var(--color-brand-primary)] hover:text-[var(--color-brand-hover)] hover:underline font-bold flex items-center gap-1 transition-colors"
            >
              <Bike className="w-3.5 h-3.5" /> Tabela de Frete (km)
            </button>
            <span>•</span>
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappFormatted}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5" /> {RESTAURANT_INFO.phone}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
