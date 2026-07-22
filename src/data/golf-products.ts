// Catalogo prodotti del verticale golf: fonte unica per la sezione "Componi il tuo kit".
// Ogni prodotto ha una foto reale (anonimizzata dal catalogo fornitore, trattata in duotone
// navy/cream) dove disponibile, altrimenti una card tipografica piena (stesso trattamento
// già in uso in Categories.astro sul resto del sito: blocco colore + testo, nessuna icona).
// Dettaglio di ogni scelta in verticale-golf/mapping-prodotti.md (file interno).
export interface GolfProduct {
  slug: string;
  name: string;
  description: string;
  type: 'photo' | 'block';
  image?: string;
  blockBg?: string;
  blockText?: string;
}

export const GOLF_PRODUCTS: GolfProduct[] = [
  {
    slug: 'bandiere-gara',
    name: 'Bandiere gara sponsor',
    description: 'Personalizzate con il logo dello sponsor, sul percorso.',
    type: 'block',
    blockBg: 'bg-orange',
    blockText: 'text-navy',
  },
  {
    slug: 'bandiere-circolo',
    name: 'Bandiere circolo',
    description: "Con l'immagine del club, per tutta la stagione.",
    type: 'block',
    blockBg: 'bg-navy',
    blockText: 'text-cream',
  },
  {
    slug: 'bandiere-green',
    name: 'Bandiere campo (18 buche)',
    description: 'Set completo per il ricambio stagionale.',
    type: 'block',
    blockBg: 'bg-ink',
    blockText: 'text-cream',
  },
  {
    slug: 'tee-marker',
    name: 'Tee marker personalizzati',
    description: 'Con il logo sponsor o del circolo su ogni buca.',
    type: 'block',
    blockBg: 'bg-orange-pale',
    blockText: 'text-ink',
  },
  {
    slug: 'banner',
    name: 'Banner personalizzati',
    description: 'Per la premiazione o il percorso di gara.',
    type: 'block',
    blockBg: 'bg-orange',
    blockText: 'text-navy',
  },
  {
    slug: 'tovaglia',
    name: 'Tovaglia premiazioni',
    description: 'Per il tavolo della cerimonia finale.',
    type: 'block',
    blockBg: 'bg-navy',
    blockText: 'text-cream',
  },
  {
    slug: 'bandiere-istituzionali',
    name: 'Bandiere istituzionali',
    description: 'Circolo, FIG, sponsor, sempre esposte in ordine.',
    type: 'block',
    blockBg: 'bg-ink',
    blockText: 'text-cream',
  },
  {
    slug: 'fondale',
    name: 'Fondale premiazione e media wall',
    description: 'Per le foto ufficiali della premiazione.',
    type: 'photo',
    image: '/golf/products/fondale-premiazione.webp',
  },
  {
    slug: 'gazebo',
    name: 'Gazebo hospitality',
    description: 'Per sponsor, segreteria o area accoglienza.',
    type: 'photo',
    image: '/golf/products/gazebo-hospitality.webp',
  },
  {
    slug: 'totem',
    name: 'Totem ingresso',
    description: "Con l'identità del circolo all'entrata del campo.",
    type: 'block',
    blockBg: 'bg-orange-pale',
    blockText: 'text-ink',
  },
  {
    slug: 'banchetto',
    name: 'Banchetto segreteria',
    description: 'Per l\'accredito e la gestione gara.',
    type: 'block',
    blockBg: 'bg-orange',
    blockText: 'text-navy',
  },
  {
    slug: 'rollup',
    name: 'Roll up premiazione',
    description: 'Sfondo per foto e consegna premi.',
    type: 'block',
    blockBg: 'bg-navy',
    blockText: 'text-cream',
  },
  {
    slug: 'segnaletica',
    name: 'Segnaletica percorso',
    description: 'Per orientare giocatori e pubblico sul campo.',
    type: 'photo',
    image: '/golf/products/segnaletica-percorso.webp',
  },
  {
    slug: 'gonfiabile',
    name: 'Gonfiabile arco',
    description: "Per l'ingresso della gara, alto impatto visivo.",
    type: 'photo',
    image: '/golf/products/gonfiabile-arco.webp',
  },
];

export const getGolfProduct = (slug: string): GolfProduct | undefined =>
  GOLF_PRODUCTS.find((p) => p.slug === slug);
