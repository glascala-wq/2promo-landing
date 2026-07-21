// Dati dei 3 kit del verticale golf: fonte unica per /golf e le pagine di dettaglio.
// I kit sono un'idea di composizione, non ancora un listino definitivo: niente prezzo
// pubblicato, il prezzo si chiede via form (vedi ctaLabel).
export interface GolfKit {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  includes: string[];
  image?: string;
  metaTitle: string;
  metaDescription: string;
}

export const CTA_RICHIEDI_PREZZO = 'Richiedi il prezzo';

export const GOLF_KITS: GolfKit[] = [
  {
    slug: 'kit-gara',
    name: 'Kit Gara Sponsor',
    eyebrow: 'per lo sponsor',
    tagline: 'Il kit che lo sponsor prenota con una telefonata.',
    description:
      "L'allestimento completo per intestare una gara al proprio brand: bandiere sul percorso, banner e il roll up per la premiazione. Grafica inclusa, consegna confermata prima della gara.",
    includes: [
      '18 bandiere gara personalizzate con il logo sponsor',
      '2 banner',
      'Tee marker personalizzati ([TBD-QTY-TEEMARKER] pezzi)',
      '1 roll up per la premiazione',
    ],
    image: '/golf/products/rollup-premiazione.webp',
    metaTitle: 'Kit Gara Sponsor: Bandiere e Allestimento Gara Golf | 2promo',
    metaDescription:
      'Kit Gara Sponsor: 18 bandiere gara logate, 2 banner, tee marker e roll up premiazione. Grafica inclusa, consegna confermata prima della gara.',
  },
  {
    slug: 'kit-circolo',
    name: 'Kit Circolo',
    eyebrow: 'per il circolo',
    tagline: "L'identità del club, dal cancello alla buca 18.",
    description:
      "Il pacchetto per chi vuole vestire il campo con l'immagine del circolo: bandiere personalizzate, tovaglia per le premiazioni e totem all'ingresso.",
    includes: [
      'Bandiere personalizzate del club ([TBD-QTY] pezzi)',
      'Tovaglia premiazioni',
      'Totem ingresso',
    ],
    image: '/golf/products/totem-ingresso.webp',
    metaTitle: 'Kit Circolo: Bandiere e Allestimento Golf Club | 2promo',
    metaDescription:
      'Kit Circolo: bandiere personalizzate del club, tovaglia premiazioni, totem ingresso. Grafica inclusa, consegna confermata.',
  },
  {
    slug: 'kit-green',
    name: 'Kit Green',
    eyebrow: 'ricambio stagionale',
    tagline: "Il campo pronto all'apertura, senza pensarci.",
    description:
      'Il ricambio stagionale per riaprire il campo con le bandiere in ordine: set completo per le 18 buche più il materiale tessile di ricambio.',
    includes: [
      'Set bandiere campo (18 buche)',
      'Materiale tessile di ricambio',
    ],
    metaTitle: 'Kit Green: Bandiere Campo Golf 18 Buche | 2promo',
    metaDescription:
      'Kit Green: set bandiere campo per le 18 buche e materiale tessile di ricambio per il rinnovo stagionale. Consegna confermata.',
  },
];

export const getGolfKit = (slug: string): GolfKit | undefined =>
  GOLF_KITS.find((k) => k.slug === slug);
