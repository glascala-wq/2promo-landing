# TBD Registry: Verticale Golf

Elenco completo di ogni placeholder `[TBD-*]` introdotto per il verticale `/golf`. Nessuno di questi valori è stato inventato: vanno riempiti da Giovanni/Cowork in un passaggio unico, poi rimossi da questo registro.

## Lancio pubblico (22/07)

Giovanni ha approvato il lancio: branch `golf` mergiato su `main`, deployato in produzione su `2promo.it/golf`. Tolto il `noindex` dalla pagina principale (`src/pages/golf/index.astro`) e la relativa esclusione dalla sitemap (`astro.config.mjs`): la pagina è ora indicizzabile. `/golf/grazie` resta `noindex` di proposito, stesso pattern della `/grazie` generale del sito (le thank-you page non si indicizzano mai, a prescindere dallo stato del verticale). Nessuna voce aggiunta al menu principale: confermato non necessario "per ora".

## Prezzi

Niente prezzo pubblicato sul sito: il modello è "componi il tuo kit", selezione prodotti più richiesta preventivo via form, con un pulsante "Richiedi il preventivo" al posto del prezzo. Nessun placeholder di prezzo da riempire finché non si decide di pubblicare un listino.

## Tempi di produzione e riordino

| Placeholder | Dove | Cosa serve |
|---|---|---|
| `[TBD-GG-BUFFER]` | `src/components/golf/GolfComeFunziona.astro` (box "la promessa"), `src/pages/golf/index.astro` (prima FAQ) | Giorni lavorativi minimi di anticipo garantiti tra data di consegna e data gara, nella formula di promessa consegna approvata (brief §5) |
| `[TBD-GG-RIORDINO]` | `src/pages/golf/index.astro` (FAQ sul riordino grafica) | Tempi di riordino grafica su formati già in archivio (modello struttura+grafica) |

## Tracking

| Placeholder | Dove | Cosa serve |
|---|---|---|
| `[TBD-ADS-CONVERSION-LABEL]` | `src/pages/golf/grazie.astro` (commento e variabile `GOLF_ADS_CONVERSION_LABEL`) | Label della conversione Google Ads dedicata al verticale golf. Non bloccante: finché la env var `PUBLIC_GOLF_ADS_CONVERSION_LABEL` resta vuota, il codice non spara l'evento conversione (niente placeholder letterale inviato a Google Ads), parte solo l'evento GA4 `generate_lead`. Da valorizzare su Cloudflare Pages quando la campagna Ads golf viene creata. |

## Immagini

La sezione "Componi il tuo kit" mostra 13 prodotti, **tutti con foto reale, nessuna card tipografica**: colore originale (non duotone), nessuna icona, nessun placeholder "Foto in arrivo". Due bandiere (istituzionali, campo) usano foto stock esterne (Pexels) perché il fornitore Ultima Displays non vende quei prodotti. Dettaglio completo di ogni scelta in `PROJECTS/2promo/verticale-golf/mapping-prodotti.md` (file interno).

| Item | Dove | Nota |
|---|---|---|
| `[TBD-FOTO]` Tovaglia premiazioni, Banchetto segreteria | `src/data/golf-products.ts`, immagini `tovaglia.webp` e `banchetto.webp` | Entrambe mostrano render (non foto reali) dei prodotti veri ("Gala" e "Banchetto FastFrame"): puliti e corretti, ma non fotografie. Da sostituire se in futuro arriva una foto reale dei prodotti (campione fisico fotografato in proprio, o area riservata fornitore). Non bloccante. |

## Come procedere

1. Cercare e sostituire ogni placeholder in questo file con il valore reale.
2. Quando arriva una foto vera, seguire le regole in `verticale-golf/mapping-prodotti.md`, salvarla in `public/golf/products/`, poi in `src/data/golf-products.ts` cambiare l'item da `type: 'block'` a `type: 'photo'` con il campo `image`.
3. Cancellare le righe di questo registro via via che vengono risolte.
