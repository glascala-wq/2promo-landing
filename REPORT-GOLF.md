# Report: Verticale Golf (`/golf`)

Branch `golf` su `glascala-wq/2promo-landing`. Sviluppato in autonomia secondo `PROJECTS/2promo/verticale-golf/cc-brief-golf.md`, approvato da Giovanni il 21 luglio 2026, con due correzioni di rotta date da Giovanni in sessione lo stesso giorno (vedi "Round 2" più sotto).

## Cosa c'è

- `/golf`: landing long-scroll con hero, trust marquee (riuso client esistenti), 3 kit, struttura+grafica, come funziona e promessa consegna, catalogo completo, rinnovo stagione, FAQ, form richiesta
- `/golf/kit-gara`, `/golf/kit-circolo`, `/golf/kit-green`: pagine di dettaglio kit con Product JSON-LD (senza prezzo, per non pubblicare uno schema con placeholder)
- `/golf/grazie`: thank-you dedicata, tag conversione golf separato (Google Ads condizionato a env var, GA4 sempre attivo)
- `src/pages/api/lead-golf.ts`: Brevo (lista dedicata) più notifica email interna e redirect, stesso pattern anti-spam (honeypot, timestamp, Turnstile) di `/api/lead.ts`
- `src/data/golf-kits.ts`: fonte unica dei 3 kit, usata sia dalla griglia su `/golf` sia dalle pagine di dettaglio
- Componenti nuovi in `src/components/golf/` (Hero, Kits, StrutturaGrafica, ComeFunziona, CatalogoCompleto, Rinnovo, ContactForm, ProductSchema). Nessun componente esistente del sito modificato, tutti riusati as-is (BaseLayout, Navbar, Footer, CookieBanner, Trust, Faq, Breadcrumbs)

## Brevo

- Lista "2promo - Lead Golf" creata via API: ID 21 (stesso folder delle altre liste lead, folder 3)
- Attributi nuovi creati: `DATA_GARA` (text), `KIT` (text), `RINNOVO` (text). Riusati `NOME`, `AZIENDA`, `TELEFONO`, `MESSAGGIO`, `SOURCE` già esistenti
- Verificato end-to-end: creazione contatto di test con tutti gli attributi popolati correttamente (poi eliminato). La notifica email transazionale (`/v3/smtp/email`) riusa esattamente lo stesso payload ed endpoint già in produzione su `/api/lead.ts`, non testata con un invio reale per non intasare `info@2promo.it` con dati di prova. Consiglio un submit reale di verifica dal form live dopo il deploy.

## Round 2 (stessa giornata, correzioni dirette di Giovanni)

Dopo la prima consegna, Giovanni ha chiesto tre correzioni, applicate tutte:

1. **Niente em-dash, mai, su nessun progetto salvo istruzione esplicita.** Ho ripulito ogni em-dash che avevo scritto: copy visibile, meta title, commenti nel codice, i due file di documentazione interna. Salvata anche una memoria permanente su questa preferenza per non ripeterla in futuro.
2. **I kit sono un'idea, non un listino.** Ho tolto ogni claim di prezzo pubblico/fisso (hero, sezione kit, pagine di dettaglio, meta description) e sostituito il prezzo con un pulsante "Richiedi il prezzo" che porta al form. Lo schema.org Product continua a non pubblicare il campo `price`, coerente con questa scelta.
3. **Usare le foto Ultima Displays con lo stesso standard già in uso per le foto prodotto Midocean sul resto del sito**, dove la grafica demo del fornitore (nomi finti, modelli) è accettabile e il vincolo reale è non mostrare il nome o il logo veri del fornitore né i nomi commerciali proprietari elencati nel brief (Formulate, Modulate, Illumigo, Illuminova, Embrace+, FastFrame, Vector). Con questo standard più realistico ho aggiunto 5 foto prodotto nuove, anonimizzate allo stesso modo (scaricate, ridimensionate, convertite in webp, rinominate, mai in hotlink):
   - Fondali premiazione e media wall (catalogo completo)
   - Banchetti segreteria (catalogo completo)
   - Segnaletica percorso (catalogo completo)
   - Gonfiabili (catalogo completo)
   - Roll up e totem come immagine di apertura sulle card Kit Gara Sponsor e Kit Circolo

   Resta senza foto solo "Tovaglie e bandiere istituzionali": è un prodotto del fornitore tessile golf (Canepa & Campi), non di Ultima Displays, e non ho voluto usare una foto di bandiere pubblicitarie generiche perché mostrerebbe un prodotto diverso da quello che il cliente riceve davvero. Dettaglio completo di cosa è stato scelto e cosa scartato in `PROJECTS/2promo/verticale-golf/mapping-prodotti.md` (interno, fuori dal repo pubblico).

## Lighthouse (build di produzione, locale)

| Pagina | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/golf/` | 98 | 96 | 96 | 69* |
| `/golf/kit-gara/` | 100 | 96 | 96 | 69* |

Target brief: Performance ≥90, A11y ≥95, entrambi raggiunti. Ricontrollato dopo le modifiche del Round 2 (nuove immagini, markup kit card): punteggi invariati.

\* SEO 69 è interamente dovuto al `noindex` intenzionale (richiesto dal brief §8, "robots noindex iniziale fino a review"): Lighthouse penalizza qualunque pagina non indicizzabile. Il punteggio sale a piena scala quando si rimuove `noindex` per il lancio pubblico.

Per confronto, la home page attualmente live (`/`, stesso codice base, non toccata) misura Performance 85, A11y 96, BP 96: `/golf` è a parità o meglio delle pagine esistenti, non introduce regressioni.

### Nota tecnica performance
La prima versione di `/golf` misurava Performance 87: l'LCP (il testo H1 dell'hero) aspettava il caricamento di GSAP da CDN prima di diventare visibile (stesso pattern `data-reveal` usato sitewide). Ho rimosso `data-reveal` dai soli elementi hero above-the-fold in `GolfHero.astro` (nessun file condiviso toccato), Performance è salita a 98/100. Non ho toccato il pattern sulle altre pagine del sito.

## Deviazioni dal brief (decisioni prese in autonomia)

1. **UrgencyBar omessa su tutte le pagine `/golf`.** Il componente esistente contiene claim generici del catalogo standard ("30.000+ articoli", "spedizione rapida") non pertinenti al pubblico B2B formale del golf (circoli, sponsor). Non modificato, solo non incluso in queste pagine.
2. **Sticky CTA mobile** (dentro `BaseLayout.astro`, non modificabile senza toccare un file condiviso) punta ancora a WhatsApp generico e a `/preventivo`, non al form golf. Accettabile perché comunque porta a un canale di contatto reale. Segnalo per eventuale intervento futuro se si decide di generalizzare `BaseLayout` con uno slot configurabile.
3. **Trust marquee riusa i loghi clienti generali di 2promo** (Red Bull, Binance, eccetera), non loghi golf-specifici: nessun cliente golf noto disponibile oggi. Coerente con l'istruzione esplicita del brief ("loghi da mockup.html, i CLIENTI si mostrano con orgoglio").
4. **MEPA presentato come testo, non come badge o logo**: nessun asset MEPA disponibile nel repo, non ho inventato un logo.
5. **`astro.config.mjs` modificato** (file condiviso): aggiunta una riga al filtro sitemap esistente per escludere `/golf` finché resta `noindex`. Modifica additiva di una riga, non tocca il comportamento delle altre pagine.
6. **Console error Turnstile in Lighthouse** ("Error 110200") è dovuto al sitekey registrato per il dominio `2promo.it`, non per `localhost`: non si presenta in produzione sul dominio reale. Non ho un secondo sitekey di test da usare in locale.
7. **Color-contrast** (2 elementi segnalati da Lighthouse: telefono nel footer, bottone WhatsApp nello sticky CTA) sono in `Footer.astro` e `BaseLayout.astro`, componenti condivisi non toccati: stesso problema misurato identico sulla home page live, quindi non è una regressione introdotta dal verticale golf.
8. **Dev server locale**: la porta 4321 (config esistente) era occupata da un'altra sessione. Ho aggiunto una configurazione `golf-dev` in `PROJECTS/2promo/.claude/launch.json` (fuori dal repo pubblico) sulla porta 4326, senza toccare la config esistente.

## Deliverable

1. Branch `golf`, nessun merge su `main`
2. Deploy preview CF Pages: https://golf.2promo-landing.pages.dev/golf (alias branch `golf`, progetto esistente `2promo-landing`)
3. Form end-to-end verificato (contatto Brevo creato ed eliminato in test, redirect e anti-spam verificati via curl)
4. `TBD-REGISTRY.md`
5. Questo report
6. Lighthouse ≥90/≥95 raggiunto

## Deploy preview

- URL: https://golf.2promo-landing.pages.dev/golf
- Pagine: `/golf`, `/golf/kit-gara`, `/golf/kit-circolo`, `/golf/kit-green`, `/golf/grazie`
- Deploy manuale via `wrangler pages deploy` sul branch `golf` (il progetto CF Pages esistente non aveva ancora un trigger automatico attivo su branch diversi da `main` al momento del push; verificare in dashboard se si vuole abilitare il deploy automatico per push futuri su questo branch)

## Prossimi passi (per Cowork/Giovanni)

- Riempire `TBD-REGISTRY.md` (quantità, buffer giorni, label conversione Ads)
- Decidere se e quando pubblicare un prezzo reale per i 3 kit (oggi: "Richiedi il prezzo")
- Foto tessile golf (bandiere, tee marker, tovaglie): recuperarle da Canepa & Campi o con un servizio fotografico proprio
- Creare la conversione Google Ads golf e valorizzare `PUBLIC_GOLF_ADS_CONVERSION_LABEL` su Cloudflare Pages
- Rimuovere `noindex` quando il verticale è pronto per il lancio pubblico
- Review copy (nessun placeholder di copy lasciato, solo dati numerici e foto tessile)
