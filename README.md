# Gorilla's Lanches - Cardápio Digital PWA & Automação WhatsApp 2026

Cardápio Digital PWA completo para hamburguerias e sanduicheiras, desenvolvido com React, TypeScript, Tailwind CSS, cálculo inteligente de taxa de entrega por raio/KM, gerador dinâmico de PIX padrão BACEN (EMV BR Code), ferramenta de adicionais com seletores (+ / -) e envio direto do pedido formatado para o WhatsApp do restaurante.

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
* Node.js v18 ou superior instalado
* npm ou yarn

### 2. Instalação das Dependências
```bash
npm install
```

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse no seu navegador: `http://localhost:3000`

### 4. Compilar para Produção
```bash
npm run build
```
Os arquivos otimizados para produção serão gerados na pasta `dist/`.

---

## 📱 Dados e Contato Oficial
* **Restaurante:** Gorilla's Lanches
* **Slogan:** Mais Sabor, Mais Qualidade, Mais Você!
* **Telefone / Atendimento WhatsApp:** (68) 99227-7408
* **Endereço:** Rua Santo André, 199 - Rio Branco, AC
* **Horário de Atendimento:** Terça a Domingo, das 18:00 às 22:00 (Fechado às Segundas)

---

## 🛠️ Tecnologias Utilizadas
* **React 19 & TypeScript:** Interface rápida e tipagem robusta
* **Tailwind CSS v4:** Design responsivo móvel em preto profundo (`#09090b`) e dourado (`#f59e0b`)
* **PWA (Progressive Web App):** Carregamento instantâneo em qualquer celular sem necessidade de instalação via loja
* **BACEN EMV BR Code:** Geração de código PIX Copia e Cola com algoritmo CRC16-CCITT
* **Impressão ESC/POS 80mm:** Layout de comanda para impressora térmica da cozinha
* **JSZip:** Exportador de projeto em arquivo ZIP com 1 clique
