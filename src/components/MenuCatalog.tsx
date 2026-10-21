import React, { useState, useMemo, useRef } from 'react';
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
  X,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import { MenuItem } from '../types';
import { RESTAURANT_INFO } from '../data/menuData';

interface MenuCatalogProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onOpenDeliveryCalculator?: () => void;
}

const CATEGORIES = [
  { id: 'todos', label: 'Todos os Lanches', icon: '🍔' },
  { id: 'combos', label: 'Super Combos & Ofertas', icon: '🔥' },
  { id: 'sanduiches', label: 'Smash & Artesanais', icon: '🥩' },
  { id: 'porcoes', label: 'Porções & Batatas', icon: '🍟' },
  { id: 'acai', label: 'Açaí Gelado', icon: '🍧' },
  { id: 'bebidas', label: 'Refrigerantes & Sucos', icon: '🥤' },
];

const POPULAR_QUICK_SEARCHES = [
  { label: 'X-Bagunça', query: 'X-Bagunça', icon: '🔥' },
  { label: 'X-Tudo', query: 'X-Tudo', icon: '🍔' },
  { label: 'Combo 01', query: 'Combo 01', icon: '⭐' },
  { label: 'Filé Especial', query: 'Filé', icon: '🥩' },
  { label: 'Bacon', query: 'Bacon', icon: '🥓' },
  { label: 'Batata', query: 'Batata', icon: '🍟' },
  { label: 'Açaí', query: 'Açaí', icon: '🍧' },
];

export const MenuCatalog: React.FC<MenuCatalogProps> = ({
  items,
  onSelectItem,
  onOpenDeliveryCalculator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalization for searching (accent insensitive and lower case)
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const normalizedQuery = normalize(searchQuery.trim());

  // Filter items matching the query in any category
  const allCategoryMatches = useMemo(() => {
    if (!normalizedQuery) return items;
    return items.filter((item) => {
      const nameMatch = normalize(item.name).includes(normalizedQuery);
      const descMatch = normalize(item.description).includes(normalizedQuery);
      const badgeMatch = item.badge ? normalize(item.badge).includes(normalizedQuery) : false;
      return nameMatch || descMatch || badgeMatch;
    });
  }, [items, normalizedQuery]);

  // Filter items in the selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'todos') {
      return allCategoryMatches;
    }
    return allCategoryMatches.filter((item) => item.category === selectedCategory);
  }, [allCategoryMatches, selectedCategory]);

  const handleSelectQuickSearch = (query: string) => {
    setSearchQuery(query);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Safe search highlighting in product names
  const renderHighlightedName = (name: string, query: string) => {
    if (!query.trim()) return name;
    try {
      const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const parts = name.split(regex);
      return parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-[var(--color-bg-muted)] text-[var(--color-brand-primary)] px-1 py-0.5 rounded-md font-black shadow-2xs border border-[var(--color-border)]"
          >
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return name;
    }
  };

  return (
    <div className="w-full pb-24 text-[var(--color-text-title)]">
      {/* ======================================================== */}
      {/* 🔍 BARRA DE BUSCA PRINCIPAL NO TOPO DO CATALOGO         */}
      {/* ======================================================== */}
      <section className="mb-6 bg-[var(--color-bg-card)] rounded-3xl p-4 sm:p-6 border border-[var(--color-border)] shadow-sm transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--color-bg-muted)] text-[var(--color-brand-primary)] border border-[var(--color-border)] mb-1">
              <Search className="w-3 h-3" /> Busca Rápida no Cardápio
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[var(--color-text-title)] tracking-tight">
              O que você gostaria de pedir hoje?
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--color-bg-muted)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
              {filteredItems.length} {filteredItems.length === 1 ? 'item disponível' : 'itens disponíveis'}
            </span>
          </div>
        </div>

        {/* Input Principal com Ícone e Ações */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
            <Search className="w-5 h-5 text-[var(--color-brand-primary)] stroke-[2.5]" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome do lanche, combo, filé, queijo, bacon, batata ou açaí..."
            className="w-full bg-[var(--color-bg-main)] text-[var(--color-text-title)] placeholder-[var(--color-text-muted)] text-sm sm:text-base font-semibold rounded-2xl pl-12 pr-28 py-3.5 sm:py-4 border border-[var(--color-border)] shadow-inner focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/15 outline-none transition-all"
            aria-label="Buscar itens no cardápio pelo nome"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[var(--color-brand-hover)] text-white hover:opacity-90 transition-all active:scale-95 shadow-xs"
                title="Limpar pesquisa"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Limpar</span>
              </button>
            )}
          </div>
        </div>

        {/* Sugestões Rápidas de Busca (Mais Buscados) */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs pt-1">
          <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[var(--color-brand-primary)]" /> Mais Buscados:
          </span>
          {POPULAR_QUICK_SEARCHES.map((item) => {
            const isCurrent = searchQuery.toLowerCase() === item.query.toLowerCase();
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSelectQuickSearch(item.query)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 active:scale-95 ${
                  isCurrent
                    ? 'bg-[var(--color-brand-primary)] text-white shadow-xs'
                    : 'bg-[var(--color-bg-muted)] text-[var(--color-text-title)] hover:opacity-80 border border-[var(--color-border)]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Ativo de Busca */}
        {searchQuery && (
          <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
            <div className="flex items-center gap-1.5">
              <span>Resultados para:</span>
              <strong className="text-[var(--color-text-title)] font-bold bg-[var(--color-bg-muted)] px-2 py-0.5 rounded-md border border-[var(--color-border)]">
                &quot;{searchQuery}&quot;
              </strong>
              <span>({filteredItems.length} encontrados)</span>
            </div>
            <button
              onClick={handleClearSearch}
              className="text-[var(--color-brand-primary)] hover:underline font-bold"
            >
              Ver cardápio completo
            </button>
          </div>
        )}
      </section>

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
              href={`https://wa.me/${RESTAURANT_INFO.whatsappFormatted}?text=${encodeURIComponent("Olá Gorilla's Lanches! Gostaria de fazer um pedido.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between sm:justify-start gap-3.5 px-5 py-4 rounded-2xl bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-muted)] text-[var(--color-text-title)] font-black shadow-lg border border-white/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
              title={`Pedir direto no WhatsApp ${RESTAURANT_INFO.phone}`}
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
                <MessageCircle className="w-6 h-6 fill-white" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] uppercase font-black tracking-wider text-[var(--color-brand-hover)]">
                  👉 Peça pelo WhatsApp Agora
                </span>
                <span className="font-mono text-base sm:text-lg font-black text-[var(--color-text-title)]">
                  {RESTAURANT_INFO.phone}
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

      {/* Sticky Category Navigation */}
      <div className="sticky top-[108px] sm:top-[120px] z-30 bg-[var(--color-bg-card)]/95 backdrop-blur-md pt-2 pb-3 -mx-4 px-4 border-b border-[var(--color-border)] mb-6 transition-colors duration-200">
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

      {/* Smart Alert: Se buscou em uma categoria que não tem nada, mas outras categorias têm */}
      {selectedCategory !== 'todos' && filteredItems.length === 0 && allCategoryMatches.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-[var(--color-bg-muted)] border border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-[var(--color-brand-primary)] shrink-0" />
            <p className="text-xs text-[var(--color-text-body)] font-medium">
              Não encontramos resultados na categoria selecionada, mas existem{' '}
              <strong>{allCategoryMatches.length} itens</strong> correspondentes em outras seções!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedCategory('todos')}
            className="px-3.5 py-1.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-white font-bold text-xs shadow-xs transition-all active:scale-95 shrink-0"
          >
            Ver todos os {allCategoryMatches.length} itens
          </button>
        </div>
      )}

      {/* Product Grid - Responsive Cards */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-bg-muted)] rounded-3xl border border-[var(--color-border)] p-8 shadow-xs">
          <HelpCircle className="w-12 h-12 text-[var(--color-brand-primary)] mx-auto mb-3" />
          <h3 className="text-xl font-black text-[var(--color-text-title)] mb-1">Nenhum item encontrado</h3>
          <p className="text-xs font-medium text-[var(--color-text-muted)] max-w-sm mx-auto">
            Não encontramos nenhum produto correspondente a &quot;{searchQuery}&quot;. Tente buscar por outros termos como X-Tudo, Filé ou Batata.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
              }}
              className="px-5 py-2.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-white font-bold text-xs uppercase shadow-xs transition-all active:scale-95"
            >
              Limpar Busca
            </button>
            <button
              onClick={() => handleSelectQuickSearch('X-Tudo')}
              className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-card)] text-[var(--color-text-title)] hover:opacity-80 border border-[var(--color-border)] font-bold text-xs shadow-xs"
            >
              Ver X-Tudo
            </button>
            <button
              onClick={() => handleSelectQuickSearch('Combo')}
              className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-card)] text-[var(--color-text-title)] hover:opacity-80 border border-[var(--color-border)] font-bold text-xs shadow-xs"
            >
              Ver Combos
            </button>
          </div>
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
                      {renderHighlightedName(item.name, searchQuery)}
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
