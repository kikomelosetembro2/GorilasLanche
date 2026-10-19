import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const zip = new JSZip();

function addFilesRecursively(currentPath, zipFolder) {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentPath, entry.name);
    const relPath = path.relative(rootDir, fullPath);

    // Skip node_modules, .git, dist, public/zip itself
    if (
      entry.name === 'node_modules' ||
      entry.name === '.git' ||
      entry.name === 'dist' ||
      entry.name.endsWith('.zip') ||
      entry.name === '.aistudio'
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      const subFolder = zipFolder.folder(entry.name);
      addFilesRecursively(fullPath, subFolder);
    } else {
      const fileData = fs.readFileSync(fullPath);
      zipFolder.file(entry.name, fileData);
    }
  }
}

console.log('Criando arquivo ZIP do projeto Gorilla\'s Lanches...');
addFilesRecursively(rootDir, zip);

const zipOutputPath = path.join(publicDir, 'gorillas-lanches-cardapio-completo.zip');

zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } })
  .then((content) => {
    fs.writeFileSync(zipOutputPath, content);
    const sizeMb = (content.length / (1024 * 1024)).toFixed(2);
    console.log(`Sucesso! Arquivo gerado em: ${zipOutputPath} (${sizeMb} MB)`);
  })
  .catch((err) => {
    console.error('Erro ao gerar zip:', err);
    process.exit(1);
  });
