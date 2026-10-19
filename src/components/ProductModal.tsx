import React, { useState, useMemo } from 'react';
import { X, Plus, Minus, Check, ShoppingBag, Utensils, Star, MessageCircle } from 'lucide-react';
import { MenuItem, MenuItemSize, SelectedAddon, CartItem } from '../types';
import { ADDONS, RESTAURANT_INFO } from '../data/menuData';

interface ProductModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

const CATEGORY_TABS = [
  { id: 'todos', label: 'Todos os Adicionais', icon: '⭐' },
  { id: 'proteinas', label: 'Carnes & Proteínas', icon: '🥩' },
  { id: 'queijos_cremes', label: 'Queijos & Cremes', icon: '🧀' },
  { id: 'chapa_extras', label: 'Chapa & Crocantes', icon: '🥓' },
  { id: 'molhos', label: 'Molhos Especiais', icon: '🥣' },
];

export const ProductModal: React.FC<ProductModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<MenuItemSize | undefined>(
    item.sizes && item.sizes.length > 0 ? item.sizes[0] : undefined
  );

  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeAddonTab, setActiveAddonTab] = useState<string>('todos');

  const availableAddonsList = ADDONS;

  const filteredAddons = useMemo(() => {
    if (activeAddonTab === 'todos') return availableAddonsList;
    return availableAddonsList.filter((a) => a.category === activeAddonTab);
  }, [availableAddonsList, activeAddonTab]);

  const handleToggleRemoveIngredient = (ingredient: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleIncreaseAddon = (addonId: string, maxQty: number = 5) => {
    setAddonQuantities((prev) => {
      const current = prev[addonId] || 0;
      if (current >= maxQty) return prev;
      return { ...prev, [addonId]: current + 1 };
    });
  };

  const handleDecreaseAddon = (addonId: string) => {
    setAddonQuantities((prev) => {
      const current = prev[addonId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[addonId];
        return next;
      }
      return { ...prev, [addonId]: current - 1 };
    });
  };

  const selectedAddonsList: SelectedAddon[] = useMemo(() => {
    const list: SelectedAddon[] = [];
    Object.entries(addonQuantities).forEach(([addonId, qty]) => {
      if (qty > 0) {
        const addonData = availableAddonsList.find((a) => a.id === addonId);
        if (addonData) {
          list.push({
            id: addonData.id,
            name: addonData.name,
            price: addonData.price,
            quantity: qty,
          });
        }
      }
    });
    return list;
  }, [addonQuantities, availableAddonsList]);

  const totalAddonsPrice = useMemo(() => {
    return selectedAddonsList.reduce(
      (sum, addon) => sum + addon.price * (addon.quantity || 1),
      0
    );
  }, [selectedAddonsList]);

  const totalAddonsSelectedCount = useMemo(() => {
    return selectedAddonsList.reduce((sum, addon) => sum + (addon.quantity || 1), 0);
  }, [selectedAddonsList]);

  const unitBasePrice = selectedSize ? selectedSize.price : item.price;
  const unitPrice = unitBasePrice + totalAddonsPrice;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    const cartItemId = `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newCartItem: CartItem = {
      cartItemId,
      product: item,
      quantity,
      selectedSize,
      selectedAddons: selectedAddonsList,
      removedIngredients,
      notes: notes.trim() || undefined,
      unitPrice,
      totalPrice,
    };

    onAddToCart(newCartItem);
    onClose();
  };

  const handleQuickOrderWhatsApp = () => {
    let msg = `*🍔 Pedido Rápido - Gorilla's Lanches*\n\n`;
    msg += `*Item:* ${item.name} (${quantity}x)\n`;
    if (selectedSize) {
      msg += `*Tamanho:* ${selectedSize.label} (R$ ${selectedSize.price.toFixed(2)})\n`;
    }
    if (removedIngredients.length > 0) {
      msg += `*Retirar:* ${removedIngredients.join(', ')}\n`;
    }
    if (selectedAddonsList.length > 0) {
      msg += `*Adicionais:*\n`;
      selectedAddonsList.forEach((a) => {
        const qty = a.quantity || 1;
        msg += `  + ${qty}x ${a.name} (R$ ${(a.price * qty).toFixed(2)})\n`;
      });
    }
    if (notes.trim()) {
      msg += `*Observações:* ${notes.trim()}\n`;
    }
    msg += `\n*Total estimado:* R$ ${totalPrice.toFixed(2).replace('.', ',')}\n\n`;
    msg += `Gostaria de confirmar a entrega e o endereço!`;

    const encoded = encodeURIComponent(msg);
    const url = `https://wa.me/${RESTAURANT_INFO.whatsappFormatted}?text=${encoded}`;
    window.open(url, '_blank');
  };

  const isSandwichOrCombo = item.category === 'sanduiches' || item.category === 'combos';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-2xl bg-[var(--color-bg-card)] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border border-[var(--color-border)] transition-colors duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] flex items-center justify-between gap-3 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-muted)] text-[var(--color-brand-primary)] border border-[var(--color-border)] flex items-center justify-center text-lg shrink-0">
              {item.category === 'sanduiches' ? '🥪' : item.category === 'combos' ? '⭐' : '🍟'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                  {isSandwichOrCombo ? 'Personalize seu Sanduíche' : 'Personalize seu Pedido'}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] text-[var(--color-brand-primary)] font-black bg-[var(--color-bg-muted)] px-1.5 py-0.2 rounded border border-[var(--color-border)]">
                  <Star className="w-2.5 h-2.5 fill-[var(--color-brand-primary)]" /> 4.9
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[var(--color-text-title)] line-clamp-1">
                {item.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--color-bg-muted)] hover:opacity-80 text-[var(--color-text-title)] flex items-center justify-center transition-colors active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-[var(--color-bg-card)]">
          {/* Ingredients / Description Banner */}
          <div className="bg-[var(--color-bg-muted)] rounded-2xl p-4 border border-[var(--color-border)] shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[var(--color-text-title)] font-bold text-xs flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-[var(--color-brand-primary)]" /> Ingredientes da Chapa Gorilla:
              </span>
              <span className="font-mono font-bold text-[var(--color-brand-hover)] bg-[var(--color-bg-card)] text-xs px-2.5 py-0.5 rounded-md border border-[var(--color-border)]">
                R$ {unitBasePrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-[var(--color-text-body)] text-xs sm:text-sm leading-relaxed">{item.description}</p>
          </div>

          {/* Size Options (if applicable) */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="bg-[var(--color-bg-card)] p-4 rounded-2xl border border-[var(--color-border)] shadow-xs">
              <label className="block text-xs font-bold text-[var(--color-text-title)] mb-2">
                Escolha o Tamanho:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.sizes.map((size) => {
                  const isSelected = selectedSize?.label === size.label;
                  return (
                    <button
                      key={size.label}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-xl border text-left font-medium transition-all ${
                        isSelected
                          ? 'border-[var(--color-brand-primary)] bg-[var(--color-bg-muted)] text-[var(--color-text-title)] shadow-xs font-bold ring-1 ring-[var(--color-brand-primary)]'
                          : 'border-[var(--color-border)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-muted)]/50 text-[var(--color-text-body)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{size.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[var(--color-brand-primary)]" />}
                      </div>
                      <span className="text-xs text-[var(--color-brand-hover)] font-mono mt-0.5 block font-bold">
                        R$ {size.price.toFixed(2).replace('.', ',')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Remove Ingredients Option */}
          {item.removableIngredients && item.removableIngredients.length > 0 && (
            <div className="bg-[var(--color-bg-card)] p-4 rounded-2xl border border-[var(--color-border)] shadow-xs">
              <span className="block text-xs font-bold text-[var(--color-text-title)] mb-2">
                Deseja retirar algum ingrediente? (Sem custo)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.removableIngredients.map((ing) => {
                  const isRemoved = removedIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      type="button"
                      onClick={() => handleToggleRemoveIngredient(ing)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isRemoved
                          ? 'bg-[var(--color-bg-muted)] text-[var(--color-brand-hover)] border border-[var(--color-brand-hover)]/40 font-bold'
                          : 'bg-[var(--color-bg-muted)]/60 text-[var(--color-text-muted)] border border-[var(--color-border)] hover:opacity-80'
                      }`}
                    >
                      {isRemoved ? `✕ Sem ${ing}` : `Com ${ing}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Addons Tool */}
          {availableAddonsList.length > 0 && (
            <div className="bg-[var(--color-bg-card)] p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-title)]">
                    Turbine seu Lanche (Adicionais na Chapa)
                  </h4>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    Selecione porções extras preparadas na hora
                  </p>
                </div>
                {totalAddonsSelectedCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[var(--color-bg-muted)] text-[var(--color-brand-hover)] border border-[var(--color-border)]">
                    +{totalAddonsSelectedCount} selecionados (+R$ {totalAddonsPrice.toFixed(2).replace('.', ',')})
                  </span>
                )}
              </div>

              {/* Addon Category Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-nowrap">
                {CATEGORY_TABS.map((tab) => {
                  const countInCat = availableAddonsList.filter(
                    (a) => tab.id === 'todos' || a.category === tab.id
                  ).length;
                  if (countInCat === 0 && tab.id !== 'todos') return null;

                  const isActive = activeAddonTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveAddonTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        isActive
                          ? 'bg-[var(--color-brand-primary)] text-white shadow-xs'
                          : 'bg-[var(--color-bg-muted)] text-[var(--color-text-title)] hover:opacity-80'
                      }`}
                    >
                      <span>{tab.icon}</span> <span className="ml-1">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Addons List */}
              <div className="space-y-2 pt-1 max-h-60 overflow-y-auto pr-1">
                {filteredAddons.map((addon) => {
                  const qty = addonQuantities[addon.id] || 0;
                  return (
                    <div
                      key={addon.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                        qty > 0
                          ? 'border-[var(--color-brand-primary)]/50 bg-[var(--color-bg-muted)]'
                          : 'border-[var(--color-border)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-muted)]/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base select-none">{addon.icon || '➕'}</span>
                        <div>
                          <p className="text-xs font-bold text-[var(--color-text-title)] leading-tight">
                            {addon.name}
                          </p>
                          <span className="text-xs text-[var(--color-brand-hover)] font-mono font-bold">
                            +R$ {addon.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {qty > 0 && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDecreaseAddon(addon.id)}
                              className="w-7 h-7 rounded-lg bg-[var(--color-bg-card)] hover:opacity-80 text-[var(--color-text-title)] flex items-center justify-center transition-colors border border-[var(--color-border)]"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-5 text-center text-xs font-black text-[var(--color-text-title)] font-mono">
                              {qty}
                            </span>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => handleIncreaseAddon(addon.id, addon.maxQuantity || 5)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                            qty > 0
                              ? 'bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-white'
                              : 'bg-[var(--color-bg-muted)] hover:opacity-80 text-[var(--color-text-title)] border border-[var(--color-border)]'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Observations */}
          <div className="bg-[var(--color-bg-card)] p-4 rounded-2xl border border-[var(--color-border)] shadow-xs">
            <label className="block text-xs font-bold text-[var(--color-text-title)] mb-1.5">
              Observações do pedido (Opcional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Ponto da carne bem passado, pouco molho, etc."
              className="w-full bg-[var(--color-bg-card)] text-[var(--color-text-title)] placeholder-[var(--color-text-muted)] text-xs rounded-xl px-3 py-2 border border-[var(--color-border)] focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 outline-none"
            />
          </div>
        </div>

        {/* Modal Sticky Footer */}
        <div className="p-4 sm:p-5 border-t border-[var(--color-border)] bg-[var(--color-bg-card)] flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20">
          {/* Quantity Selector & Total */}
          <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
            <div className="flex items-center bg-[var(--color-bg-muted)] rounded-xl p-1 gap-1 border border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-[var(--color-bg-card)] text-[var(--color-text-title)] hover:opacity-80 flex items-center justify-center shadow-xs transition-colors border border-[var(--color-border)]"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-black text-[var(--color-text-title)] font-mono text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-[var(--color-bg-card)] text-[var(--color-text-title)] hover:opacity-80 flex items-center justify-center shadow-xs transition-colors border border-[var(--color-border)]"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-right sm:text-left">
              <span className="block text-[10px] text-[var(--color-text-muted)] font-bold uppercase">Total do Item</span>
              <span className="text-lg font-black text-[var(--color-brand-hover)] font-mono">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleQuickOrderWhatsApp}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              title="Pedir este lanche direto no WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden xs:inline">WhatsApp Direto</span>
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Adicionar ao Carrinho</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
