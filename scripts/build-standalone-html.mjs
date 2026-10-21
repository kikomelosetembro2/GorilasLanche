import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (!fs.existsSync(distDir)) {
  console.error('Pasta dist/ não encontrada. Execute npm run build primeiro.');
  process.exit(1);
}

// 1. Ler dist/index.html
const distIndexPath = path.join(distDir, 'index.html');
let distHtml = fs.readFileSync(distIndexPath, 'utf-8');

// 2. Encontrar os arquivos em dist/assets
const assetsDir = path.join(distDir, 'assets');
let cssContent = '';
let jsContent = '';
let cssFileName = '';
let jsFileName = '';

if (fs.existsSync(assetsDir)) {
  const assetsFiles = fs.readdirSync(assetsDir);
  for (const file of assetsFiles) {
    if (file.endsWith('.css')) {
      cssFileName = file;
      cssContent += fs.readFileSync(path.join(assetsDir, file), 'utf-8') + '\n';
    } else if (file.endsWith('.js')) {
      jsFileName = file;
      jsContent += fs.readFileSync(path.join(assetsDir, file), 'utf-8') + '\n';
    }
  }
}

// 3. Montar arquivo HTML Único 100% Autônomo (Inlined)
let standaloneHtml = distHtml;

// Substituir link do CSS pelo conteúdo inline do <style>
const cssLinkRegex = /<link rel="stylesheet"[^>]*href="\/assets\/[^"]*"[^>]*>/gi;
standaloneHtml = standaloneHtml.replace(cssLinkRegex, `<style>\n${cssContent}\n</style>`);

// Substituir script do JS pelo conteúdo inline do <script type="module">
const jsScriptRegex = /<script type="module"[^>]*src="\/assets\/[^"]*"[^>]*><\/script>/gi;
standaloneHtml = standaloneHtml.replace(jsScriptRegex, `<script type="module">\n${jsContent}\n</script>`);

// Salvar cardapio-gorillas-executavel.html em public/ e dist/
const standalonePublicPath = path.join(publicDir, 'cardapio-gorillas-executavel.html');
const standaloneDistPath = path.join(distDir, 'cardapio-gorillas-executavel.html');
fs.writeFileSync(standalonePublicPath, standaloneHtml, 'utf-8');
fs.writeFileSync(standaloneDistPath, standaloneHtml, 'utf-8');

console.log(`✓ HTML Único Executável criado com sucesso: ${standalonePublicPath} (${(standaloneHtml.length / 1024).toFixed(1)} KB)`);

// 4. Também criar versão com caminhos relativos de index.html para dist (para rodar em qualquer subpasta ou servidor)
let relativeIndexHtml = distHtml
  .replace(/href="\/assets\//g, 'href="./assets/')
  .replace(/src="\/assets\//g, 'src="./assets/');

const relativeIndexPath = path.join(distDir, 'index.html');
fs.writeFileSync(relativeIndexPath, relativeIndexHtml, 'utf-8');

// 5. Criar arquivo de instruções em texto e em HTML
const instructionsTxt = `====================================================================
GORILLA'S LANCHES - PACOTE HTML EXECUTÁVEL
Cardápio Digital PWA + WhatsApp + Frete por KM + PIX + Comanda Térmica
====================================================================

COMO EXECUTAR O APLICATIVO NO SEU COMPUTADOR OU CELULAR:

OPÇÃO 1: EXECUÇÃO DIRETA (MAIS FÁCIL - SEM INSTALAR NADA)
---------------------------------------------------------
1. Dê dois cliques no arquivo: "cardapio-gorillas-executavel.html"
2. Ele abrirá instantaneamente em seu navegador favorito:
   - Google Chrome
   - Microsoft Edge
   - Mozilla Firefox
   - Safari / Opera
3. Pronto! O cardápio digital, os cálculos de frete por raio (km), 
   o gerador de código PIX com QR Code, o envio formatado para WhatsApp 
   e a impressão de comandas funcionam 100% no seu navegador!

OPÇÃO 2: EXECUTAR COM SERVIDOR WEB LOCAL (RECOMENDADO PARA TESTES)
-----------------------------------------------------------------
No prompt de comando ou terminal, dentro desta pasta:
- Se tiver Python: 
  python -m http.server 8080
  (Depois acesse: http://localhost:8080)

- Se tiver Node.js instalado:
  npx serve .
  (Depois acesse o link informado no terminal)

- No VS Code:
  Instale a extensão "Live Server", clique com botão direito em 
  "index.html" e escolha "Open with Live Server".

OPÇÃO 3: HOSPEDAR GRÁTIS NA INTERNET (EM 2 MINUTOS)
---------------------------------------------------
Você pode colocar este cardápio no ar para seus clientes acessarem 
em qualquer celular:
- Vercel: Arraste esta pasta descompactada para o dashboard da Vercel.
- Netlify: Arraste a pasta para o https://app.netlify.com/drop
- GitHub Pages: Envie os arquivos para um repositório no GitHub.
- cPanel / Hospedagem Própria: Faça upload para a pasta public_html.

====================================================================
Suporte & Configurações da Hamburgueria:
- WhatsApp: +55 68 8102-1682
- Horário: Terça a Domingo das 18h às 22h (Fechado às Segundas)
====================================================================
`;

const instructionsHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instruções - Como Executar o Gorilla's Lanches</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FFF; color: #1c1917; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #F97316; font-size: 1.8rem; margin-bottom: 0.5rem; }
    .badge { background: #fef3c7; color: #b45309; padding: 0.25rem 0.5rem; border-radius: 6px; font-weight: 600; font-size: 0.85rem; }
    .card { background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 12px; padding: 1.25rem; margin: 1.25rem 0; }
    .btn { display: inline-block; background: #F97316; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 0.5rem; }
    .btn:hover { background: #ea580c; }
    code { background: #e7e5e4; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
  </style>
</head>
<body>
  <h1>🦍 Gorilla's Lanches - Como Executar</h1>
  <p><span class="badge">Cardápio Digital PWA + WhatsApp + Frete por KM</span></p>

  <div class="card">
    <h2>1. Execução Imediata (1 Clique)</h2>
    <p>Para abrir o cardápio agora no seu computador ou celular sem configurar nada:</p>
    <a href="cardapio-gorillas-executavel.html" class="btn">Abrir cardapio-gorillas-executavel.html</a>
  </div>

  <div class="card">
    <h2>2. Execução com Servidor Web Local</h2>
    <p>Abra um terminal nesta pasta e execute:</p>
    <p><code>npx serve .</code> ou <code>python -m http.server 8080</code></p>
    <p>Em seguida, acesse no navegador: <a href="http://localhost:8080" target="_blank">http://localhost:8080</a></p>
  </div>

  <div class="card">
    <h2>3. Publicar Grátis na Internet para seus Clientes</h2>
    <p>Arraste estes arquivos para o <strong>Netlify Drop</strong> (netlify.com/drop) ou <strong>Vercel</strong> para ter um link público imediato com HTTPS para enviar no WhatsApp ou colocar no Instagram.</p>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'INSTRUCOES-COMO-EXECUTAR.txt'), instructionsTxt, 'utf-8');
fs.writeFileSync(path.join(distDir, 'COMO-EXECUTAR.html'), instructionsHtml, 'utf-8');

// 6. Criar ZIP exclusivo do pacote HTML executável
const zip = new JSZip();
zip.file('cardapio-gorillas-executavel.html', standaloneHtml);
zip.file('index.html', relativeIndexHtml);
zip.file('INSTRUCOES-COMO-EXECUTAR.txt', instructionsTxt);
zip.file('COMO-EXECUTAR.html', instructionsHtml);

if (fs.existsSync(assetsDir)) {
  const assetsFolder = zip.folder('assets');
  const assetsFiles = fs.readdirSync(assetsDir);
  for (const file of assetsFiles) {
    const data = fs.readFileSync(path.join(assetsDir, file));
    assetsFolder.file(file, data);
  }
}

const htmlZipPath = path.join(publicDir, 'gorillas-lanches-html-executavel.zip');
zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } })
  .then((content) => {
    fs.writeFileSync(htmlZipPath, content);
    console.log(`✓ Pacote ZIP HTML Executável gerado com sucesso: ${htmlZipPath} (${(content.length / 1024).toFixed(1)} KB)`);
  })
  .catch((err) => {
    console.error('Erro ao gerar zip HTML:', err);
  });
