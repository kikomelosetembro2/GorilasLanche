import React, { useState } from 'react';
import {
  Layers,
  Smartphone,
  Printer,
  Terminal,
  ExternalLink,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle,
} from 'lucide-react';

export const ArchitectureGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'pwa' | 'whatsapp' | 'smart' | 'stacks' | 'roadmap'>('pwa');

  return (
    <div className="max-w-6xl mx-auto pb-24 bg-[#FFFFFF]">
      {/* Top Banner Header - Fundo #FFFFFF com Acentos #7A3E1D e #F59E0B */}
      <div className="mb-8 rounded-3xl bg-[#FFFFFF] border border-stone-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F5EBE1] text-[#7A3E1D] text-xs font-semibold mb-3 border border-orange-200/60">
          <Terminal className="w-4 h-4 text-[#7A3E1D]" />
          <span>Manual de Engenharia de Software & Automação 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
          Arquitetura Completa de Cardápio Digital & Vendas WhatsApp
        </h1>
        <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-3xl leading-relaxed">
          Guia técnico passo a passo para hamburguerias: do catálogo web PWA ao checkout com cálculo automático de taxa por raio (km), PIX dinâmico, impressão térmica automática ESC/POS e disparo estruturado no WhatsApp.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 border-b border-stone-200 mb-8 text-nowrap">
        {[
          { id: 'pwa', label: '1. Arquitetura PWA & Catálogo', icon: '📱' },
          { id: 'whatsapp', label: '2. Conexão WhatsApp API', icon: '⚡' },
          { id: 'smart', label: '3. Impressão Térmica & PIX', icon: '🧾' },
          { id: 'stacks', label: '4. Comparativo de Stacks', icon: '🛠️' },
          { id: 'roadmap', label: '5. Plano de Ação', icon: '🚀' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeSection === tab.id
                ? 'bg-[#7A3E1D] text-white shadow-xs font-semibold'
                : 'bg-stone-50 text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SECTION 1: ARQUITETURA PWA */}
      {activeSection === 'pwa' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#7A3E1D]" /> Por que PWA é a Melhor Escolha para a Gorilla&apos;s
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              O modelo Progressive Web App (PWA) combina a leveza da web com os poderes de um app nativo. O cliente não precisa baixar nada na Google Play Store nem na App Store:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80">
                <span className="text-2xl mb-2 block">⚡</span>
                <h4 className="font-semibold text-sm text-stone-900 mb-1">Acesso Imediato</h4>
                <p className="text-xs text-stone-600">
                  Carregamento instantâneo via QR Code na mesa ou link na bio do Instagram sem barreiras de download.
                </p>
              </div>

              <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80">
                <span className="text-2xl mb-2 block">📲</span>
                <h4 className="font-semibold text-sm text-stone-900 mb-1">Instalável na Home</h4>
                <p className="text-xs text-stone-600">
                  O cliente pode tocar em &quot;Adicionar à tela de início&quot; e ter o ícone do Gorilla&apos;s no celular.
                </p>
              </div>

              <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80">
                <span className="text-2xl mb-2 block">🛵</span>
                <h4 className="font-semibold text-sm text-stone-900 mb-1">Frete por Raio (km)</h4>
                <p className="text-xs text-stone-600">
                  Cálculo automático de taxa por raio de distância com faixas personalizadas da Rua Santo André, 199.
                </p>
              </div>
            </div>

            <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wide pt-4">
              Algoritmo de Cálculo de Frete por Raio (km):
            </h4>
            <div className="relative bg-stone-900 p-4 rounded-xl font-mono text-xs text-orange-300 overflow-x-auto shadow-xs">
              <pre>{`// Cálculo oficial por Raio Haversine (Rio Branco, AC)
export function calculateDeliveryFeeByRadius(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Raio da Terra em KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distanceKm = Math.round((R * c * 1.28) * 10) / 10;

  // Faixas personalizadas:
  // Faixa 1 (até 2.0 km): R$ 5,00
  // Faixa 2 (2.1 a 4.0 km): R$ 7,00
  // Faixa 3 (4.1 a 7.0 km): R$ 10,00
  // Faixa 4 (7.1 a 10.0 km): R$ 14,00
  // Faixa 5 (10.1 a 15.0 km): R$ 18,00
  return findDeliveryTier(distanceKm);
}`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CONEXÃO COM WHATSAPP */}
      {activeSection === 'whatsapp' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#7A3E1D]" /> Integração com WhatsApp +55 68 8102-1682
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              O cliente finaliza o pedido e o botão abre o aplicativo oficial do WhatsApp no celular dele com a mensagem perfeitamente diagramada. O próprio cliente aperta &quot;Enviar&quot; para o número <strong>+55 68 8102-1682</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-stone-50/70 p-5 rounded-xl border border-stone-200">
                <span className="text-xs font-mono font-semibold text-[#7A3E1D] uppercase block mb-1">
                  Abordagem 1: Link Direto wa.me (Ativa)
                </span>
                <h4 className="text-base font-bold text-stone-900 mb-1.5">Zero Custo & 100% à Prova de Bloqueios</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Sem mensalidades de API, sem risco de banimento da Meta e o número do cliente fica salvo diretamente na agenda do WhatsApp da lanchonete.
                </p>
                <div className="mt-3 p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 font-medium space-y-0.5">
                  <p>✓ Sem taxas recorrentes</p>
                  <p>✓ 100% operacional hoje</p>
                  <p>✓ Notificação direta ao caixa</p>
                </div>
              </div>

              <div className="bg-stone-50/70 p-5 rounded-xl border border-stone-200">
                <span className="text-xs font-mono font-semibold text-[#7A3E1D] uppercase block mb-1">
                  Abordagem 2: Webhooks Automatizados
                </span>
                <h4 className="text-base font-bold text-stone-900 mb-1.5">Automação com Evolution API</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Conexão via WebSocket para disparar avisos de &quot;Saiu para entrega&quot; em 1 clique e integração com robôs de atendimento.
                </p>
                <div className="mt-3 p-2.5 bg-[#F5EBE1] rounded-lg border border-orange-200 text-xs text-orange-950 font-medium space-y-0.5">
                  <p>✓ Confirmação automática</p>
                  <p>✓ Alerta ao motoboy</p>
                  <p>✓ Histórico de pedidos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: RECURSOS EXCLUSIVOS */}
      {activeSection === 'smart' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
              <Printer className="w-5 h-5 text-[#7A3E1D]" /> Impressão Automática na Cozinha (ESC/POS 80mm)
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              A comanda sai na impressora térmica da chapa (Epson, Elgin, Bematech ou térmicas USB/Bluetooth) formatada com itens, adicionais riscados, observações e dados do frete por raio.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200">
                <h4 className="font-semibold text-stone-900 text-xs uppercase mb-1">PrintNode (Nuvem)</h4>
                <p className="text-xs text-stone-600">
                  Dispara comando REST para o computador do caixa e imprime em 2 segundos.
                </p>
              </div>
              <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200">
                <h4 className="font-semibold text-stone-900 text-xs uppercase mb-1">RawBT (Android)</h4>
                <p className="text-xs text-stone-600">
                  Conecta impressora térmica Bluetooth direto ao celular da lanchonete.
                </p>
              </div>
              <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200">
                <h4 className="font-semibold text-stone-900 text-xs uppercase mb-1">Porta 9100 TCP</h4>
                <p className="text-xs text-stone-600">
                  Impressoras Ethernet/Wi-Fi na rede local da lanchonete.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: COMPARATIVO DE STACKS */}
      {activeSection === 'stacks' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900">
              Comparativo de Stacks: Mercado vs No-Code vs Gorilla&apos;s
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-stone-200">
                <thead>
                  <tr className="bg-[#F5EBE1] text-stone-900 font-semibold border-b border-stone-200">
                    <th className="p-3">Opção</th>
                    <th className="p-3">Ferramentas</th>
                    <th className="p-3">Custo / Mês</th>
                    <th className="p-3">Vantagens</th>
                    <th className="p-3">Desvantagens</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-700">
                  <tr className="bg-white">
                    <td className="p-3 font-semibold text-stone-900">1. Plataformas Prontas (iFood / Anota AI)</td>
                    <td className="p-3">SaaS Fechado</td>
                    <td className="p-3 font-mono text-[#EF4444] font-medium">R$ 150 a R$ 400 + 12% a 27%</td>
                    <td className="p-3 text-emerald-800">Pronto de início</td>
                    <td className="p-3 text-[#EF4444]">Altas comissões que corroem o lucro</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 font-semibold text-stone-900">2. No-Code (Glide / Bubble)</td>
                    <td className="p-3">Glide + Make</td>
                    <td className="p-3 font-mono text-stone-900">R$ 120 a R$ 250 / mês</td>
                    <td className="p-3 text-emerald-800">Fácil ajuste</td>
                    <td className="p-3 text-[#EF4444]">Lentidão nos horários de pico</td>
                  </tr>
                  <tr className="bg-[#F5EBE1]/60 font-semibold text-stone-900">
                    <td className="p-3 text-[#7A3E1D]">★ 3. Arquitetura Gorilla&apos;s PWA (Esta App)</td>
                    <td className="p-3">React 19 + PWA + WhatsApp wa.me</td>
                    <td className="p-3 font-mono text-emerald-700">R$ 0 de comissão!</td>
                    <td className="p-3 text-emerald-800">Zero comissões, velocidade instantânea, código 100% seu</td>
                    <td className="p-3 text-stone-500">Nenhuma</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: ROADMAP */}
      {activeSection === 'roadmap' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900">
              Checklist de Lançamento e Vendas Imediatas
            </h3>

            <div className="space-y-3">
              <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200 flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#7A3E1D] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-semibold text-sm text-stone-900">Etapa 1: Cardápio PWA Online</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Cardápio ativo com todos os 31 lanches do Gorilla&apos;s, cálculo de frete por raio (km) e direcionamento oficial para <code>+55 68 8102-1682</code>.
                  </p>
                </div>
              </div>

              <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200 flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#7A3E1D] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-semibold text-sm text-stone-900">Etapa 2: Divulgação aos Clientes</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Coloque o link público na bio do Instagram e divulgue o QR Code nas embalagens e mesas da Rua Santo André, 199.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
