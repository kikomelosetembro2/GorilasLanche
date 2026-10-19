import React, { useState, useMemo } from 'react';
import {
  Search,
  Flame,
  Plus,
  HelpCircle,
  MessageCircle,
  Sparkles,
  MapPin,
  ArrowRight,
  Bike,
} from 'lucide-react';
import { MenuItem } from '../types';

interface MenuCatalogProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onOpenDeliveryCalculator?: () => void;
}

const CATEGORIES = [
  { id: 'todos', label: 'Todos os Lanches', icon: '🍔' },
  { id: 'promocao', label: 'Super Combos & Ofertas', icon: '🔥' },
  { id: 'artesanais', label: 'Smash & Artesanais', icon: '🥩' },
  { id: 'frango', label: 'Frango & Filé Especial', icon: '🍗' },
  { id: 'porcoes', label: 'Porções & Batatas', icon: '🍟' },
  { id: 'bebidas', label: 'Bebidas & Açaí Gelado', icon: '🥤' },
];

export const MenuCatalog: React.FC<MenuCatalogProps> = ({
  items,
  onSelectItem,
  onOpenDeliveryCalculator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedCategory === 'todos') return matchesSearch;
      return item.category === selectedCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="w-full pb-24 text-[var(--color-text-title)]">
      {/* Promo & Combo Hero Ribbon */}
      <section className="mb-6 rounded-3xl bg-gradient-to-br from-[var(--color-banner-from)] via-[var(--color-banner-from)] to-[var(--color-banner-to)] p-5 sm:p-7 shadow-lg relative overflow-hidden text-white border border-[var(--color-border)]">
        <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none text-9xl select-none">
          🦍
        </div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-white border border-white/20 text-xs font-black uppercase tracking-wider mb-2.5 shadow-sm">
              <Flame className="w-4 h-4 fill-amber-300 text-amber-300" /> Promoções & Cardápio Oficial
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-xs">
              Lanches Artesanais & Combos Especiais
            </h2>
            <p className="text-white/90 font-medium text-xs sm:text-sm mt-2 leading-relaxed">
              Monte seu lanche com adicionais na chapa, retire o que não gostar e envie seu pedido com cálculo automático de frete por raio (km) direto no WhatsApp!
            </p>

            {/* Quick Delivery Radius CTA Button */}
            {onOpenDeliveryCalculator && (
              <button
                type="button"
                onClick={onOpenDeliveryCalculator}
                className="mt-3.5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/50 hover:bg-black/70 text-white font-black text-xs uppercase tracking-wide shadow-sm active:scale-95 transition-all border border-white/20"
              >
                <Bike className="w-4 h-4 text-amber-300" />
                <span>Simular Frete por Raio (km)</span>
              </button>
            )}
          </div>

          {/* BOTÃO WHATSAPP ULTRA DESTACADO */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <a
              href="https://wa.me/5568992277408?text=Ol%C3%A1%20Gorilla%27s%20Lanches%21%20Gostaria%20de%20fazer%20um%20pedido."
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between sm:justify-start gap-3.5 px-5 py-4 rounded-2xl bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-muted)] text-[var(--color-text-title)] font-black shadow-lg border border-white/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
              title="Pedir direto no WhatsApp (68) 99227-7408"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
                <MessageCircle className="w-6 h-6 fill-white" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] uppercase font-black tracking-wider text-[var(--color-brand-hover)]">
                  👉 Peça pelo WhatsApp Agora
                </span>
                <span className="font-mono text-base sm:text-lg font-black text-[var(--color-text-title)]">
                  (68) 99227-7408
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--color-brand-primary)] stroke-[3] group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="hidden xl:flex items-center gap-2.5 bg-black/40 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-left shadow-md">
              <MapPin className="w-6 h-6 text-amber-300 shrink-0 stroke-[2.5]" />
              <div className="text-xs">
                <p className="font-bold text-white">Rua Santo André, 199</p>
                <p className="text-[11px] font-medium text-white/80">18:00 às 22:00 (Ter a Dom)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Category & Search Navigation */}
      <div className="sticky top-[108px] sm:top-[120px] z-30 bg-[var(--color-bg-card)]/95 backdrop-blur-md pt-2 pb-3 -mx-4 px-4 border-b border-[var(--color-border)] mb-6 transition-colors duration-200">
        {/* Search Input Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-brand-primary)] stroke-[2.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por X-Bagunça, X-Tudo, Filé, Batata, Açaí, Refri..."
            className="w-full bg-[var(--color-bg-card)] text-[var(--color-text-title)] font-semibold placeholder-[var(--color-text-muted)] text-sm rounded-2xl pl-11 pr-10 py-3 border border-[var(--color-border)] shadow-xs focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-white bg-[var(--color-brand-hover)] rounded-full w-6 h-6 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Scrollable Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-nowrap">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-[var(--color-brand-primary)] text-white shadow-md scale-[1.02]'
                    : 'bg-[var(--color-bg-muted)] text-[var(--color-text-title)] hover:opacity-90 border border-[var(--color-border)]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid - Responsive Cards */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-bg-muted)] rounded-3xl border border-[var(--color-border)] p-8 shadow-xs">
          <HelpCircle className="w-12 h-12 text-[var(--color-brand-primary)] mx-auto mb-3" />
          <h3 className="text-xl font-black text-[var(--color-text-title)] mb-1">Nenhum item encontrado</h3>
          <p className="text-xs font-medium text-[var(--color-text-muted)] max-w-sm mx-auto">
            Não encontramos nenhum produto correspondente a &quot;{searchQuery}&quot;. Tente outro termo ou limpe os filtros.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('todos');
            }}
            className="mt-4 px-5 py-2.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-white font-bold text-xs uppercase shadow-xs transition-all active:scale-95"
          >
            Limpar Busca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            return (
              <article
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group relative bg-[var(--color-bg-card)] rounded-3xl p-5 border border-[var(--color-border)] hover:border-[var(--color-brand-primary)] transition-all duration-200 cursor-pointer shadow-xs hover:shadow-lg flex flex-col justify-between active:scale-[0.99]"
              >
                {/* Header with Title and Promo Badge */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-black text-[var(--color-text-title)] uppercase tracking-tight group-hover:text-[var(--color-brand-primary)] transition-colors">
                      {item.name}
                    </h3>
                    {item.badge && (
                      <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--color-brand-primary)] text-white shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Description / Ingredients */}
                  <p className="text-xs font-normal text-[var(--color-text-body)] leading-relaxed line-clamp-3 mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Footer with Price and Customize/Add CTA */}
                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between gap-2 mt-auto">
                  <div>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-wider">
                      {item.sizes ? 'A partir de' : 'Preço'}
                    </span>
                    <div className="inline-block px-2.5 py-0.5 rounded-lg bg-[var(--color-bg-muted)] text-[var(--color-brand-hover)] font-black text-base font-mono border border-[var(--color-border)]">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>

                  {/* Botão de Pedido Destacado na Cor Primária */}
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-white font-black text-xs uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
