import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-[var(--color-bg-card)] h-full shadow-2xl border-l border-[var(--color-border)] flex flex-col justify-between transition-colors duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-bg-muted)] text-[var(--color-brand-primary)] flex items-center justify-center border border-[var(--color-border)]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-[var(--color-text-title)]">
                Seu Carrinho
              </h3>
              <span className="text-xs text-[var(--color-text-muted)] block">
                {items.length === 0 ? 'Nenhum item adicionado' : `${items.length} produto(s)`}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--color-bg-muted)] hover:opacity-80 text-[var(--color-text-title)] flex items-center justify-center transition-colors active:scale-95"
            title="Fechar Carrinho"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3 bg-[var(--color-bg-main)]">
          {items.length === 0 ? (
            <div className="text-center py-20 text-[var(--color-text-muted)]">
              <ShoppingBag className="w-12 h-12 text-[var(--color-brand-primary)]/40 mx-auto mb-3 stroke-1" />
              <p className="text-sm font-bold text-[var(--color-text-title)]">Seu carrinho está vazio</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-xs mx-auto">
                Adicione deliciosos lanches artesanais, combos e adicionais da chapa para continuar.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-white font-bold text-xs transition-colors shadow-xs active:scale-95"
              >
                Ver Cardápio
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-[var(--color-bg-card)] rounded-2xl p-4 border border-[var(--color-border)] shadow-xs space-y-2.5 relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 pr-4">
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-title)] leading-tight">
                      {item.product.name}
                      {item.selectedSize && (
                        <span className="text-[var(--color-text-muted)] font-normal text-xs ml-1">
                          ({item.selectedSize.label})
                        </span>
                      )}
                    </h4>
                    <span className="text-xs font-mono text-[var(--color-brand-hover)] font-bold">
                      R$ {item.unitPrice.toFixed(2).replace('.', ',')} un.
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.cartItemId)}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-hover)] p-1 transition-colors"
                    title="Remover do carrinho"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Addons List */}
                {item.selectedAddons.length > 0 && (
                  <div className="bg-[var(--color-bg-muted)] rounded-xl p-2.5 border border-[var(--color-border)] text-xs space-y-1">
                    <span className="font-bold text-[var(--color-text-title)] block text-[10px] uppercase tracking-wide">
                      Adicionais:
                    </span>
                    {item.selectedAddons.map((addon, idx) => (
                      <div key={idx} className="flex justify-between text-[var(--color-text-body)] text-[11px]">
                        <span>+ {addon.name}</span>
                        <span className="font-mono text-[var(--color-brand-hover)] font-bold">
                          R$ {addon.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Removed items & Notes */}
                {item.removedIngredients.length > 0 && (
                  <p className="text-xs text-[var(--color-brand-hover)] font-medium">
                    <span className="font-bold">Sem:</span> {item.removedIngredients.join(', ')}
                  </p>
                )}

                {item.notes && (
                  <p className="text-xs text-[var(--color-text-muted)] italic">
                    <span className="not-italic font-medium text-[var(--color-text-title)]">Obs:</span> &quot;{item.notes}&quot;
                  </p>
                )}

                {/* Quantity and Subtotal bar */}
                <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
                  <div className="flex items-center bg-[var(--color-bg-muted)] rounded-lg p-0.5 gap-1 border border-[var(--color-border)]">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-6 h-6 rounded-md bg-[var(--color-bg-card)] hover:opacity-80 text-[var(--color-text-title)] flex items-center justify-center shadow-xs transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-black text-[var(--color-text-title)] font-mono">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-6 h-6 rounded-md bg-[var(--color-bg-card)] hover:opacity-80 text-[var(--color-text-title)] flex items-center justify-center shadow-xs transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-sm font-black text-[var(--color-text-title)] font-mono">
                    R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[var(--color-border)] bg-[var(--color-bg-card)] space-y-3 sticky bottom-0">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-text-muted)] font-bold text-xs uppercase tracking-wide">
                Subtotal dos Itens:
              </span>
              <span className="text-lg font-black text-[var(--color-brand-hover)] font-mono">
                R$ {subtotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] leading-tight">
              Taxa de frete calculada por raio (km) e cupons disponíveis no próximo passo.
            </p>

            <button
              onClick={onProceedToCheckout}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] active:scale-98 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
            >
              <span>Ir para o Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
