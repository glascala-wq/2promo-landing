# TBD Registry: Verticale Golf

Elenco completo di ogni placeholder `[TBD-*]` introdotto per il verticale `/golf`. Nessuno di questi valori è stato inventato: vanno riempiti da Giovanni/Cowork in un passaggio unico, poi rimossi da questo registro.

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

La sezione "Componi il tuo kit" mostra 14 prodotti: 4 con foto reale anonimizzata (fondale, gazebo, gonfiabile, segnaletica, tutte trattate in duotone navy/cream), 10 con una card tipografica piena (nome prodotto su blocco di colore, nessuna foto). Nessuna icona, nessun placeholder "Foto in arrivo".

Il gruppo di prodotti senza foto reale è quasi interamente il tessile golf vero e proprio (bandiere gara, bandiere circolo, bandiere green, bandiere istituzionali, tee marker, tovaglia), fornito da Canepa & Campi, verificato senza foto disponibile online. Anche banner, totem, banchetto e roll up restano a card tipografica: le foto disponibili sul catalogo Ultima Displays mostrano solo modelli o il nome commerciale proprietario vietato "Vector". Dettaglio completo di ogni scelta e di cosa è stato scartato in `PROJECTS/2promo/verticale-golf/mapping-prodotti.md` (file interno).

| Item | Dove | Nota |
|---|---|---|
| `[TBD-FOTO]` Bandiere gara, bandiere circolo, bandiere green, bandiere istituzionali, tee marker, tovaglia | `src/data/golf-products.ts`, card `type: 'block'` | Da fotografare quando arriva un campione fisico, o recuperare da area riservata fornitore Canepa & Campi |
| `[TBD-FOTO]` Banner, totem, banchetto, roll up | `src/data/golf-products.ts`, card `type: 'block'` | Da recuperare da area riservata Ultima Displays (foto senza modello) o con un servizio fotografico proprio |

## Come procedere

1. Cercare e sostituire ogni placeholder in questo file con il valore reale.
2. Quando arriva una foto vera, seguire le regole in `verticale-golf/mapping-prodotti.md`, salvarla in `public/golf/products/`, poi in `src/data/golf-products.ts` cambiare l'item da `type: 'block'` a `type: 'photo'` con il campo `image`.
3. Cancellare le righe di questo registro via via che vengono risolte.
