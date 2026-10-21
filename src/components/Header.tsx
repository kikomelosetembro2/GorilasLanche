import React from 'react';
import {
  ShoppingBag,
  MessageCircle,
  MapPin,
  Sparkles,
  Receipt,
  BookOpen,
  Smartphone,
  Globe,
  Clock,
  Flame,
  Palette,
} from 'lucide-react';
import { RestaurantConfig } from '../types';

interface HeaderProps {
  restaurant: RestaurantConfig;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  activeTab: 'catalog' | 'receipt' | 'architecture';
  setActiveTab: (tab: 'catalog' | 'receipt' | 'architecture') => void;
  onOpenShare: () => void;
  onOpenThemes: () => void;
  isCartAnimating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  restaurant,
  cartCount,
  cartTotal,
  onOpenCart,
  activeTab,
  setActiveTab,
  onOpenShare,
  onOpenThemes,
  isCartAnimating = false,
}) => {
  // Check if open now based on real day/time (Terça a Domingo: 18:00 às 22:00 - Fechado às Segundas)
  const now = new Date();
  const day = now.getDay();
  const isMonday = day === 1;
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeInMinutes = hour * 60 + minute;
  const isWithinHours = timeInMinutes >= 18 * 60 && timeInMinutes <= 22 * 60;
  const isOpen = !isMonday && isWithinHours;

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] shadow-xs transition-colors duration-200">
      {/* Top Banner Bar com Gradiente da Paleta */}
      <div className="bg-gradient-to-r from-[var(--color-banner-from)] to-[var(--color-banner-to)] text-white text-xs font-semibold py-2 px-4 shadow-inner transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto text-nowrap gap-4">
          <span className="flex items-center gap-1.5 text-white/95">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Mais Sabor, Mais Qualidade, Mais Você!</span>
            <span className="hidden md:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-medium border border-white/25">
              <Flame className="w-3 h-3 text-amber-300" /> Pedidos 100% integrados com WhatsApp
            </span>
          </span>
          <div className="flex items-center gap-3 text-xs font-medium text-white/90 shrink-0">
            <span className="flex items-center gap-1 text-white/90">
              <Clock className="w-3.5 h-3.5 text-amber-300" /> 18h às 22h (Ter a Dom)
            </span>
            <span className="hidden sm:inline text-white/50">•</span>
            <a
              href={`https://wa.me/${restaurant.whatsappFormatted}?text=${encodeURIComponent("Olá Gorilla's Lanches!")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 font-semibold text-white bg-black/20 px-2.5 py-0.5 rounded-md hover:bg-black/30 transition-colors"
            >
              WhatsApp: {restaurant.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('catalog')}
          >
            <div className="relative">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[var(--color-brand-primary)] p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-[var(--color-bg-card)] rounded-[14px] flex items-center justify-center border border-[var(--color-border)]">
                  <span className="text-2xl sm:text-3xl select-none">🦍</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-[var(--color-text-title)] group-hover:text-[var(--color-brand-primary)] transition-colors">
                  {restaurant.name}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--color-badge-bg)] text-[var(--color-badge-text)] border border-[var(--color-brand-primary)]/30">
                  OFICIAL 2026
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[var(--color-text-muted)] mt-0.5">
                <span className={`inline-flex items-center gap-1 font-semibold ${isOpen ? 'text-emerald-500' : 'text-[var(--color-brand-hover)]'}`}>
                  <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-[var(--color-brand-hover)]'} animate-pulse`} />
                  {isOpen
                    ? 'Aberto Agora (18h às 22h)'
                    : isMonday
                    ? 'Fechado às Segundas'
                    : 'Abre às 18:00'}
                </span>
                <span className="hidden sm:inline opacity-40">•</span>
                <span className="hidden sm:flex items-center gap-1 text-[var(--color-text-body)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-brand-primary)]" /> {restaurant.address}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions: Seletor de Tema, HTML/ZIP, WhatsApp, Link e Carrinho */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* BOTÃO SELETOR DE DESIGN / TEMA */}
            <button
              onClick={onOpenThemes}
              className="flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-[var(--color-bg-muted)] hover:opacity-90 text-[var(--color-text-title)] border border-[var(--color-border)] font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
              title="Personalizar Paleta de Cores e Estilo Visual"
            >
              <Palette className="w-4 h-4 text-[var(--color-brand-primary)]" />
              <span className="hidden sm:inline">Paletas</span>
            </button>

            {/* BOTÃO WHATSAPP OFICIAL */}
            <a
              href={`https://wa.me/${restaurant.whatsappFormatted}?text=${encodeURIComponent("Olá Gorilla's Lanches! Gostaria de fazer um pedido pelo WhatsApp.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
              title="Atendimento WhatsApp Direto"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="text-left leading-tight hidden sm:block">
                <span className="block text-[9px] uppercase tracking-wider font-semibold text-emerald-500">WhatsApp</span>
                <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-300">{restaurant.phone}</span>
              </div>
            </a>

            {/* Public Link Modal */}
            <button
              onClick={onOpenShare}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-[var(--color-bg-muted)] hover:opacity-90 text-[var(--color-text-title)] border border-[var(--color-border)] font-semibold text-xs transition-colors"
              title="Compartilhar Link Público do Cardápio"
            >
              <Globe className="w-4 h-4 text-[var(--color-brand-primary)]" />
              <span>Link Público</span>
            </button>

            {/* Cart Button com Animação Shake/Bounce */}
            <button
              onClick={onOpenCart}
              className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 ${
                isCartAnimating ? 'animate-cart-shake ring-4 ring-[var(--color-brand-primary)]/30' : ''
              }`}
              aria-label="Ver Carrinho"
            >
              <div className="relative">
                <ShoppingBag className={`w-4 h-4 text-white transition-transform ${isCartAnimating ? 'animate-cart-bounce' : ''}`} />
                {cartCount > 0 && (
                  <span
                    className={`absolute -top-2 -right-2.5 w-4 h-4 bg-[var(--color-brand-hover)] border-2 border-[var(--color-bg-card)] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs ${
                      isCartAnimating ? 'animate-badge-pop scale-110' : ''
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="text-left hidden xs:block">
                <span className="block text-[10px] uppercase font-semibold text-white/95 leading-none">
                  {cartCount === 0 ? 'Carrinho' : `${cartCount} itens`}
                </span>
                <span className="text-xs sm:text-sm font-black leading-none text-white font-mono">
                  R$ {cartTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Tabs: Segmented Control com as Cores do Tema */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-3 pt-2.5 border-t border-[var(--color-border)] overflow-x-auto text-nowrap pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'catalog'
                ? 'bg-[var(--color-brand-primary)] text-white shadow-xs'
                : 'bg-[var(--color-bg-muted)] hover:opacity-90 text-[var(--color-text-title)]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Cardápio Digital PWA</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold ${
                activeTab === 'catalog' ? 'bg-white/25 text-white' : 'bg-[var(--color-bg-card)] text-[var(--color-text-title)] border border-[var(--color-border)]'
              }`}
            >
              Cliente
            </span>
          </button>

          <button
            onClick={() => setActiveTab('receipt')}
            className={`flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'receipt'
                ? 'bg-[var(--color-brand-primary)] text-white shadow-xs'
                : 'bg-[var(--color-bg-muted)] hover:opacity-90 text-[var(--color-text-title)]'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Comanda Térmica 80mm & Cozinha</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold ${
                activeTab === 'receipt' ? 'bg-white/25 text-white' : 'bg-[var(--color-bg-card)] text-[var(--color-text-title)] border border-[var(--color-border)]'
              }`}
            >
              PDV
            </span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'architecture'
                ? 'bg-[var(--color-brand-primary)] text-white shadow-xs'
                : 'bg-[var(--color-bg-muted)] hover:opacity-90 text-[var(--color-text-title)]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Manual do Sistema</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold ${
                activeTab === 'architecture' ? 'bg-white/25 text-white' : 'bg-[var(--color-bg-card)] text-[var(--color-text-title)] border border-[var(--color-border)]'
              }`}
            >
              Guia
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
