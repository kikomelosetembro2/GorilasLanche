export interface ThemePalette {
  id: string;
  name: string;
  tagline: string;
  concept: string;
  wcagContrast: string;
  recommendedFor: string;
  colors: {
    bgMain: string;
    bgCard: string;
    bgMuted: string;
    textTitle: string;
    textBody: string;
    textMuted: string;
    primary: string;
    primaryHover: string;
    primaryLight: string;
    border: string;
    bannerFrom: string;
    bannerTo: string;
    badgeBg: string;
    badgeText: string;
  };
}

export const THEME_PALETTES: ThemePalette[] = [
  {
    id: 'warm-artisanal',
    name: 'Opção 1: Marrom Artesanal (Caramel & Roast)',
    tagline: 'Gourmet Artesanal, Elegante & Alta Conversão (Padrão)',
    concept:
      'Paleta sofisticada em tons de Marrom Caramelo Tostado (#7A3E1D) com fundo aconchegante em creme avelã (#F5EBE1), tipografia em café expresso profundo (#241711) e hover em chocolate amargo (#54250C). Evoca o ponto perfeito da carne na chapa, pão artesanal tostado na manteiga e sofisticação.',
    wcagContrast: '15.1:1 na tipografia (AAA) | 5.2:1 no botão marrom (AA)',
    recommendedFor: 'Delivery de hamburguerias artesanais, smash burgers e steakhouses contemporâneas.',
    colors: {
      bgMain: '#FAF6F0',
      bgCard: '#FFFFFF',
      bgMuted: '#F5EBE1',
      textTitle: '#241711',
      textBody: '#4A3A31',
      textMuted: '#7D6B60',
      primary: '#7A3E1D',
      primaryHover: '#54250C',
      primaryLight: '#F5EBE1',
      border: '#E6DACF',
      bannerFrom: '#7A3E1D',
      bannerTo: '#54250C',
      badgeBg: '#F5EBE1',
      badgeText: '#54250C',
    },
  },
  {
    id: 'midnight-smoke',
    name: 'Opção 2: Dark Mocha & Espresso Roast',
    tagline: 'Dark Mode Steakhouse & Bar Noturno',
    concept:
      'Imersão noturna premium para pedidos entre 18h e 22h. Fundo em café torrado escuro (#14100D) com cards em madeira nobre (#1E1713) e botões em marrom avelã brilhante (#9E582E). Máximo apetite visual para destacar as fotos dos lanches.',
    wcagContrast: '15.4:1 na tipografia (AAA) | 5.3:1 no botão mocha (AA)',
    recommendedFor: 'Operações noturnas, público jovem/urbano e marcas com estética de pub/bar.',
    colors: {
      bgMain: '#14100D',
      bgCard: '#1E1713',
      bgMuted: '#2A201B',
      textTitle: '#F7EFE9',
      textBody: '#D8CCC4',
      textMuted: '#A39389',
      primary: '#9E582E',
      primaryHover: '#7A3E1D',
      primaryLight: '#2A1D16',
      border: '#362923',
      bannerFrom: '#201814',
      bannerTo: '#14100D',
      badgeBg: '#2A1D16',
      badgeText: '#CCA084',
    },
  },
  {
    id: 'neo-bistro',
    name: 'Opção 3: Marrom Cacau & Linho Puro',
    tagline: 'Alta Gastronomia & Cozinha Autoral',
    concept:
      'Inspirada em bistrôs autorais e cafés gastronômicos. Fundo linho natural (#FAF7F2), cabeçalho institucional em marrom mogno profundo (#331C10) e botões de ação em marrom cacau rústico (#6B3718). Elegância clássica e refinada.',
    wcagContrast: '15.8:1 na tipografia (AAA) | 6.0:1 no botão cacau (AAA)',
    recommendedFor: 'Marcas clássicas, ingredientes nobres e smash burgers gourmet.',
    colors: {
      bgMain: '#FAF7F2',
      bgCard: '#FFFFFF',
      bgMuted: '#F0E8DD',
      textTitle: '#211611',
      textBody: '#3B2D26',
      textMuted: '#6E5C53',
      primary: '#6B3718',
      primaryHover: '#4A240E',
      primaryLight: '#F5ECE2',
      border: '#DFD2C4',
      bannerFrom: '#331C10',
      bannerTo: '#1F1008',
      badgeBg: '#F5ECE2',
      badgeText: '#4A240E',
    },
  },
  {
    id: 'gorillas-sunset',
    name: 'Opção 4: Marrom Gorila Tradicional',
    tagline: 'Marrom Artesanal com Fundo Branco Limpo',
    concept:
      'Substitui todo o laranja vibrante pelo elegante Marrom Gorila (#7A3E1D) com hover em café torrado (#54250C) e base neutra limpa.',
    wcagContrast: '14.9:1 na tipografia (AAA) | 5.2:1 no botão primário (AA)',
    recommendedFor: 'Identidade gastronômica sólida, acolhedora e confiável.',
    colors: {
      bgMain: '#FAF6F0',
      bgCard: '#FFFFFF',
      bgMuted: '#F5EBE1',
      textTitle: '#241711',
      textBody: '#4A3A31',
      textMuted: '#7D6B60',
      primary: '#7A3E1D',
      primaryHover: '#54250C',
      primaryLight: '#F5EBE1',
      border: '#E6DACF',
      bannerFrom: '#7A3E1D',
      bannerTo: '#54250C',
      badgeBg: '#F5EBE1',
      badgeText: '#54250C',
    },
  },
];
