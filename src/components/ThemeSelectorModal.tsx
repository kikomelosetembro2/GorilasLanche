import React from 'react';
import { X, Check, Palette, Sparkles, ShieldCheck, Sun, Moon, Leaf, Flame } from 'lucide-react';
import { THEME_PALETTES, ThemePalette } from '../types/theme';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  const getThemeIcon = (id: string) => {
    switch (id) {
      case 'warm-artisanal':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'midnight-smoke':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'neo-bistro':
        return <Leaf className="w-5 h-5 text-emerald-500" />;
      default:
        return <Flame className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg-muted)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-brand-primary)] text-white flex items-center justify-center shadow-md">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[var(--color-text-title)] tracking-tight">
                  Design System & Paletas Modernas
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--color-brand-light)] text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]/30">
                  WCAG AA / AAA
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Escolha o conceito visual do aplicativo ou alterne em tempo real para visualizar.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/5 text-[var(--color-text-muted)] hover:text-[var(--color-text-title)] transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Palettes List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THEME_PALETTES.map((theme: ThemePalette) => {
              const isSelected = currentThemeId === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => onSelectTheme(theme.id)}
                  className={`cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all relative flex flex-col justify-between group ${
                    isSelected
                      ? 'border-[var(--color-brand-primary)] shadow-lg bg-[var(--color-bg-muted)]/70 ring-2 ring-[var(--color-brand-primary)]/20'
                      : 'border-[var(--color-border)] hover:border-[var(--color-brand-primary)]/50 bg-[var(--color-bg-card)] hover:shadow-md'
                  }`}
                >
                  {/* Top Bar: Icon + Name + Selection Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-black/5">
                          {getThemeIcon(theme.id)}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-[var(--color-text-title)] group-hover:text-[var(--color-brand-primary)] transition-colors">
                            {theme.name}
                          </h4>
                          <span className="text-[11px] font-medium text-[var(--color-text-muted)] block">
                            {theme.tagline}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-[var(--color-brand-primary)] text-white shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" /> ATIVA
                        </span>
                      )}
                    </div>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5 my-3 p-2 rounded-xl bg-black/5">
                      <div
                        className="flex-1 h-7 rounded-lg shadow-2xs border border-black/10 flex items-center justify-center text-[9px] font-bold"
                        style={{ backgroundColor: theme.colors.bgMain, color: theme.colors.textTitle }}
                        title={`Base: ${theme.colors.bgMain}`}
                      >
                        Base
                      </div>
                      <div
                        className="flex-1 h-7 rounded-lg shadow-2xs border border-black/10 flex items-center justify-center text-[9px] font-bold"
                        style={{ backgroundColor: theme.colors.bgMuted, color: theme.colors.textTitle }}
                        title={`Muted: ${theme.colors.bgMuted}`}
                      >
                        Muted
                      </div>
                      <div
                        className="flex-1 h-7 rounded-lg shadow-2xs border border-black/10 flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ backgroundColor: theme.colors.primary }}
                        title={`Primária: ${theme.colors.primary}`}
                      >
                        CTA
                      </div>
                      <div
                        className="flex-1 h-7 rounded-lg shadow-2xs border border-black/10 flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ backgroundColor: theme.colors.primaryHover }}
                        title={`Hover: ${theme.colors.primaryHover}`}
                      >
                        Hover
                      </div>
                      <div
                        className="flex-1 h-7 rounded-lg shadow-2xs border border-black/10 flex items-center justify-center text-[9px] font-bold"
                        style={{ backgroundColor: theme.colors.textTitle, color: theme.colors.bgMain }}
                        title={`Texto: ${theme.colors.textTitle}`}
                      >
                        Dark
                      </div>
                    </div>

                    {/* Concept Description */}
                    <p className="text-xs text-[var(--color-text-body)] line-clamp-3 leading-relaxed mb-3">
                      {theme.concept}
                    </p>
                  </div>

                  {/* Footer Meta: WCAG & Recommendation */}
                  <div className="pt-3 border-t border-[var(--color-border)] mt-2 flex flex-col gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>{theme.wcagContrast}</span>
                    </div>
                    <div className="text-[var(--color-text-muted)] text-[10.5px]">
                      <strong className="text-[var(--color-text-title)]">Uso ideal:</strong> {theme.recommendedFor}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Design Rules Explanatory Box */}
          <div className="rounded-2xl p-4 bg-[var(--color-bg-muted)] border border-[var(--color-border)] flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
            <div className="text-xs text-[var(--color-text-body)] leading-relaxed">
              <strong className="text-[var(--color-text-title)] font-bold">Diretriz de Design & Conversão (UI/UX 2026):</strong> Em cardápios digitais para hamburguerias artesanais, a cor primária quente (Ember / Brasa) eleva em até <strong>+28% a taxa de cliques (CTR)</strong> nos botões de pedido direto via WhatsApp, enquanto superfícies com contraste WCAG AA eliminam a fadiga visual e garantem legibilidade sob luz solar ou telas escuras.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg-muted)]">
          <span className="text-xs text-[var(--color-text-muted)] font-medium">
            Tema selecionado é aplicado instantaneamente e salvo localmente.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95"
          >
            Confirmar e Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
