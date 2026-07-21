# TBD Registry: Verticale Golf

Elenco completo di ogni placeholder `[TBD-*]` introdotto per il verticale `/golf`. Nessuno di questi valori è stato inventato: vanno riempiti da Giovanni/Cowork in un passaggio unico, poi rimossi da questo registro.

## Prezzi

I kit sono ancora un'idea di composizione, non un listino definitivo (indicazione di Giovanni, 21/07): niente prezzo pubblicato sul sito. Ogni kit mostra un pulsante "Richiedi il prezzo" al posto del prezzo, sia nella griglia su `/golf` sia nella pagina di dettaglio. Nessun placeholder di prezzo da riempire finché non si decide di pubblicare un listino.

## Quantità

| Placeholder | Dove | Cosa serve |
|---|---|---|
| `[TBD-QTY-TEEMARKER]` | `src/data/golf-kits.ts` (kit Gara Sponsor, campo `includes`) | Numero di tee marker inclusi nel Kit Gara Sponsor |
| `[TBD-QTY]` | `src/data/golf-kits.ts` (kit Circolo, campo `includes`) | Numero di bandiere personalizzate incluse nel Kit Circolo |

## Tempi di produzione e riordino

| Placeholder | Dove | Cosa serve |
|---|---|---|
| `[TBD-GG-BUFFER]` | `src/components/golf/GolfComeFunziona.astro` (box "la promessa"), `src/pages/golf/index.astro` (prima FAQ) | Giorni lavorativi minimi di anticipo garantiti tra data di consegna e data gara, nella formula di promessa consegna approvata (brief §5) |
| `[TBD-GG-RIORDINO]` | `src/pages/golf/index.astro` (FAQ sul riordino grafica) | Tempi di riordino grafica su formati già in archivio (modello struttura+grafica) |

## Tracking

| Placeholder | Dove | Cosa serve |
|---|---|---|
| `[TBD-ADS-CONVERSION-LABEL]` | `src/pages/golf/grazie.astro` (commento e variabile `GOLF_ADS_CONVERSION_LABEL`) | Label della conversione Google Ads dedicata al verticale golf. Non bloccante: finché la env var `PUBLIC_GOLF_ADS_CONVERSION_LABEL` resta vuota, il codice non spara l'evento conversione (niente placeholder letterale inviato a Google Ads), parte solo l'evento GA4 `generate_lead`. Da valorizzare su Cloudflare Pages quando la campagna Ads golf viene creata. |

## Foto prodotto ancora mancanti

La maggior parte delle foto necessarie sono state trovate sul catalogo Ultima Displays e sono già in uso (dettaglio in `PROJECTS/2promo/verticale-golf/mapping-prodotti.md`, file interno). Resta un solo gruppo scoperto: il tessile golf vero e proprio (bandiere gara, bandiere circolo, bandiere green, tee marker, tovaglie), fornito da Canepa & Campi, per cui non esiste ancora una foto disponibile online.

| Item | Dove | Nota |
|---|---|---|
| `[TBD-FOTO]` Tovaglie e bandiere istituzionali | `src/components/golf/GolfCatalogoCompleto.astro` (ultimo item dell'array `items`) | Prodotto Canepa & Campi, non Ultima Displays: non sostituire con una foto di bandiere pubblicitarie generiche, sarebbe un prodotto visivamente diverso |
| `[TBD-FOTO]` Bandiere gara, bandiere circolo, bandiere green, tee marker | Non presenti come card fotografiche in nessuna pagina | Da fotografare quando arriva un campione fisico, o recuperare da area riservata fornitore Canepa & Campi |

## Come procedere

1. Cercare e sostituire ogni placeholder in questo file con il valore reale.
2. Aggiornare `src/data/golf-kits.ts` nei punti indicati.
3. Aggiungere le foto mancanti in `public/golf/products/` seguendo le regole in `verticale-golf/mapping-prodotti.md`, poi sostituire `image: null` con il path nel file indicato.
4. Cancellare le righe di questo registro via via che vengono risolte.
