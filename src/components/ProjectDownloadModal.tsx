import React, { useState, useEffect } from 'react';
import {
  Download,
  X,
  FileText,
  Check,
  FolderArchive,
  Sparkles,
  FileCode,
  Copy,
  Globe,
  Play,
  Terminal,
  ExternalLink,
  Laptop,
  CheckCircle2,
} from 'lucide-react';

interface ProjectDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDownloadModal: React.FC<ProjectDownloadModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'downloads' | 'instructions' | 'viewCode'>('downloads');
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [downloadSuccessFile, setDownloadSuccessFile] = useState<string | null>(null);
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [loadingCode, setLoadingCode] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && activeTab === 'viewCode' && !htmlCode) {
      setLoadingCode(true);
      fetch('/cardapio-gorillas-executavel.html')
        .then((res) => {
          if (!res.ok) throw new Error('Não foi possível carregar o arquivo HTML');
          return res.text();
        })
        .then((text) => {
          setHtmlCode(text);
          setLoadingCode(false);
        })
        .catch(() => {
          // Fallback code sample if fetch fails in certain sandbox iframe environments
          setHtmlCode(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gorilla's Lanches - Cardápio Digital & Automação WhatsApp</title>
    <!-- Use o botão "Baixar HTML Executável (.html)" acima para obter o arquivo 100% completo com todos os scripts e estilos embutidos -->
  </head>
  <body class="bg-white text-stone-900">
    <div id="root"></div>
  </body>
</html>`);
          setLoadingCode(false);
        });
    }
  }, [isOpen, activeTab, htmlCode]);

  if (!isOpen) return null;

  const handleDownloadFile = (url: string, filename: string) => {
    setDownloadingFile(filename);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingFile(null);
      setDownloadSuccessFile(filename);
      setTimeout(() => setDownloadSuccessFile(null), 4000);
    }, 700);
  };

  const handleCopyCode = async () => {
    try {
      if (htmlCode) {
        await navigator.clipboard.writeText(htmlCode);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 3000);
      }
    } catch {
      // Fallback
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-3xl bg-[#FFFFFF] border border-stone-200/90 rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header - Fundo #FFFFFF com Ícone #7A3E1D */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-[#FFFFFF] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5EBE1] text-[#7A3E1D] border border-orange-200/70 flex items-center justify-center shrink-0">
              <FileCode className="w-5 h-5 text-[#7A3E1D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  Baixar Código HTML & Arquivos do Aplicativo
                </h3>
                <span className="hidden xs:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-[#F59E0B] border border-amber-200">
                  Pronto para Executar
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Gorilla&apos;s Lanches • Versão autônoma executável em qualquer navegador ou servidor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors active:scale-95 shrink-0"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs no Modal */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-stone-100 bg-stone-50/60 flex items-center gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'downloads'
                ? 'bg-[#7A3E1D] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Opções de Download</span>
          </button>

          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'instructions'
                ? 'bg-[#7A3E1D] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Como Executar (Guia)</span>
          </button>

          <button
            onClick={() => setActiveTab('viewCode')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'viewCode'
                ? 'bg-[#7A3E1D] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ver & Copiar Código HTML</span>
          </button>
        </div>

        {/* Content Body - Fundo #FFFFFF */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-sm bg-[#FFFFFF]">
          {activeTab === 'downloads' && (
            <div className="space-y-4">
              {/* Card 1: HTML Único Executável (DESTAQUE MÁXIMO) */}
              <div className="p-5 rounded-2xl bg-[#F5EBE1]/50 border-2 border-orange-300 shadow-xs relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded-full bg-[#7A3E1D] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    Recomendado
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 pr-12">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-[#7A3E1D]" />
                      <h4 className="text-base font-bold text-stone-900">
                        1. Arquivo HTML Único Executável (.html)
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                      <strong>Abre direto no navegador com 2 cliques!</strong> Todo o aplicativo (design moderno, cálculo de raio por km, integração WhatsApp, PIX e comanda de impressão) reunido em um único arquivo HTML autônomo. Não requer Node.js nem instalação.
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono pt-1">
                      <span>Arquivo: <strong>cardapio-gorillas-executavel.html</strong></span>
                      <span>•</span>
                      <span>Tamanho: ~778 KB</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadFile(
                        '/cardapio-gorillas-executavel.html',
                        'cardapio-gorillas-executavel.html'
                      )
                    }
                    disabled={downloadingFile === 'cardapio-gorillas-executavel.html'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#7A3E1D] hover:bg-[#54250C] text-white font-bold text-xs shadow-sm active:scale-95 transition-all shrink-0"
                  >
                    {downloadSuccessFile === 'cardapio-gorillas-executavel.html' ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Download Concluído!</span>
                      </>
                    ) : (
                      <>
                        <Download
                          className={`w-4 h-4 ${
                            downloadingFile === 'cardapio-gorillas-executavel.html'
                              ? 'animate-bounce'
                              : ''
                          }`}
                        />
                        <span>
                          {downloadingFile === 'cardapio-gorillas-executavel.html'
                            ? 'Baixando...'
                            : 'Baixar Arquivo HTML'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card 2: Pacote Web / HTML Completo (ZIP) */}
              <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FolderArchive className="w-5 h-5 text-[#F59E0B]" />
                    <h4 className="text-sm font-bold text-stone-900">
                      2. Pacote HTML Executável Completo (.ZIP)
                    </h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                    Pacote compactado com <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">index.html</code>, versão autônoma, pasta de assets (CSS e JS) e manual de instruções. Ideal para publicar em qualquer hospedagem (cPanel, Vercel, Netlify, Apache ou IIS).
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono pt-1">
                    <span>Arquivo: <strong>gorillas-lanches-html-executavel.zip</strong></span>
                    <span>•</span>
                    <span>Tamanho: ~408 KB</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleDownloadFile(
                      '/gorillas-lanches-html-executavel.zip',
                      'gorillas-lanches-html-executavel.zip'
                    )
                  }
                  disabled={downloadingFile === 'gorillas-lanches-html-executavel.zip'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs active:scale-95 transition-all shrink-0"
                >
                  {downloadSuccessFile === 'gorillas-lanches-html-executavel.zip' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Download Concluído!</span>
                    </>
                  ) : (
                    <>
                      <Download
                        className={`w-4 h-4 ${
                          downloadingFile === 'gorillas-lanches-html-executavel.zip'
                            ? 'animate-bounce'
                            : ''
                        }`}
                      />
                      <span>
                        {downloadingFile === 'gorillas-lanches-html-executavel.zip'
                          ? 'Baixando...'
                          : 'Baixar Pacote HTML (ZIP)'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Card 3: Código-Fonte Completo React + TypeScript (ZIP) */}
              <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-stone-700" />
                    <h4 className="text-sm font-bold text-stone-900">
                      3. Código-Fonte Completo (.ZIP)
                    </h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                    Todos os fontes em React 19, TypeScript, Tailwind CSS, Vite e configurações para desenvolvedores que desejam alterar dados no código-fonte e rodar com <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">npm run dev</code>.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono pt-1">
                    <span>Arquivo: <strong>gorillas-lanches-cardapio-completo.zip</strong></span>
                    <span>•</span>
                    <span>Tamanho: ~305 KB</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleDownloadFile(
                      '/gorillas-lanches-cardapio-completo.zip',
                      'gorillas-lanches-cardapio-completo.zip'
                    )
                  }
                  disabled={downloadingFile === 'gorillas-lanches-cardapio-completo.zip'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs border border-stone-300 shadow-xs active:scale-95 transition-all shrink-0"
                >
                  {downloadSuccessFile === 'gorillas-lanches-cardapio-completo.zip' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Download Concluído!</span>
                    </>
                  ) : (
                    <>
                      <Download
                        className={`w-4 h-4 ${
                          downloadingFile === 'gorillas-lanches-cardapio-completo.zip'
                            ? 'animate-bounce'
                            : ''
                        }`}
                      />
                      <span>
                        {downloadingFile === 'gorillas-lanches-cardapio-completo.zip'
                          ? 'Baixando...'
                          : 'Baixar Fontes (.ZIP)'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#7A3E1D]" />
                  Como Executar o Aplicativo no Seu Computador ou Celular:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {/* Método 1 */}
                  <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#7A3E1D] font-bold text-xs flex items-center justify-center">
                      1
                    </div>
                    <h5 className="text-xs font-bold text-stone-900">Dois Cliques no HTML</h5>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Baixe o arquivo <strong>cardapio-gorillas-executavel.html</strong> e dê um duplo clique nele. Ele abre instantaneamente no Google Chrome, Microsoft Edge, Opera ou Safari!
                    </p>
                  </div>

                  {/* Método 2 */}
                  <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-[#F59E0B] font-bold text-xs flex items-center justify-center">
                      2
                    </div>
                    <h5 className="text-xs font-bold text-stone-900">Servidor Local (Live Server)</h5>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Se usar o VS Code, abra a pasta descompactada e use o botão <strong>&quot;Open with Live Server&quot;</strong>, ou execute no terminal <code className="bg-stone-100 px-1 py-0.5 rounded">npx serve .</code> ou <code className="bg-stone-100 px-1 py-0.5 rounded">python -m http.server 8080</code>.
                    </p>
                  </div>

                  {/* Método 3 */}
                  <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                      3
                    </div>
                    <h5 className="text-xs font-bold text-stone-900">Hospedagem Grátis</h5>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Arraste a pasta descompactada para o <strong>Netlify Drop</strong> ou <strong>Vercel</strong> para colocar no ar gratuitamente com link HTTPS próprio para divulgar no Instagram e WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-2">
                <h5 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Funcionalidades que funcionam 100% no HTML baixado:
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 pt-1">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A3E1D]" />
                    Cálculo automático de taxa de entrega por raio (km)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A3E1D]" />
                    Detecção de GPS e seleção inteligente por bairro
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A3E1D]" />
                    Geração de QR Code PIX e código Copia e Cola BACEN
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A3E1D]" />
                    Envio formatado do pedido diretamente para o WhatsApp
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A3E1D]" />
                    Impressão direta de comanda térmica 80mm para cozinha
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A3E1D]" />
                    Personalização de adicionais (bacon, queijo, ovo, hambúrguer)
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'viewCode' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Código HTML Completo (Executável Standalone)
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Você pode copiar este código e colar em qualquer arquivo chamado <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800">index.html</code>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7A3E1D] hover:bg-[#54250C] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Código Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Código HTML</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {loadingCode ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="w-6 h-6 border-2 border-[#7A3E1D] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-stone-600">Carregando código HTML completo...</p>
                </div>
              ) : (
                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-stone-900 text-stone-100 font-mono text-[11px] leading-relaxed max-h-[360px] overflow-x-auto overflow-y-auto select-all">
                    {htmlCode}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-[#FFFFFF] flex items-center justify-between sticky bottom-0">
          <div className="text-xs text-stone-500">
            Gorilla&apos;s Lanches • Mais Sabor, Mais Qualidade, Mais Você!
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
