# Report: Verticale Golf (`/golf`)

Branch `golf` su `glascala-wq/2promo-landing`. Sviluppato in autonomia secondo `PROJECTS/2promo/verticale-golf/cc-brief-golf.md`, approvato da Giovanni il 21 luglio 2026, con correzioni di rotta date da Giovanni in sessione lo stesso giorno e il giorno dopo (vedi "Round 2", "Round 3", "Round 4", "Round 5", "Round 6", "Round 7", "Round 8", "Round 9" più sotto).

## Cosa c'è (stato attuale, dopo Round 9)

- `/golf`: landing long-scroll con hero, trust marquee (riuso client esistenti), sezione "Componi il tuo kit" (13 prodotti selezionabili), struttura+grafica, come funziona e promessa consegna, rinnovo stagione, FAQ, form richiesta
- `/golf/grazie`: thank-you dedicata, tag conversione golf separato (Google Ads condizionato a env var, GA4 sempre attivo)
- `src/pages/api/lead-golf.ts`: Brevo (lista dedicata) più notifica email interna e redirect, stesso pattern anti-spam (honeypot, timestamp, Turnstile) di `/api/lead.ts`
- `src/data/golf-products.ts`: fonte unica dei 13 prodotti del selettore
- Componenti in `src/components/golf/` (Hero, ComponiKit, StrutturaGrafica, ComeFunziona, Rinnovo, ContactForm). Nessun componente esistente del sito modificato, tutti riusati as-is (BaseLayout, Navbar, Footer, CookieBanner, Trust, Faq, Breadcrumbs)

Non esistono più: le 3 pagine di dettaglio kit, il componente kit a 3 card, il catalogo completo separato, le icone SVG del Round 3. Vedi "Round 4" per il perché.

## Brevo

- Lista "2promo - Lead Golf" creata via API: ID 21 (stesso folder delle altre liste lead, folder 3)
- Attributi nuovi creati: `DATA_GARA` (text), `RINNOVO` (text). Riusati `NOME`, `AZIENDA`, `TELEFONO`, `MESSAGGIO`, `SOURCE` già esistenti. L'attributo `KIT` creato nel Round 1 non è più popolato dal form (i 3 kit fissi non esistono più): i prodotti scelti in "Componi il tuo kit" finiscono nel campo `MESSAGGIO`, non serve un attributo dedicato.
- Verificato end-to-end: creazione contatto di test con tutti gli attributi popolati correttamente (poi eliminato). La notifica email transazionale (`/v3/smtp/email`) riusa esattamente lo stesso payload ed endpoint già in produzione su `/api/lead.ts`, non testata con un invio reale per non intasare `info@2promo.it` con dati di prova. Consiglio un submit reale di verifica dal form live dopo il deploy.

## Round 2 (21 luglio, correzioni dirette di Giovanni)

Dopo la prima consegna, Giovanni ha chiesto tre correzioni, applicate tutte:

1. **Niente em-dash, mai, su nessun progetto salvo istruzione esplicita.** Ripulito ogni em-dash scritto: copy visibile, meta title, commenti nel codice, documentazione interna. Salvata anche una memoria permanente su questa preferenza.
2. **I kit sono un'idea, non un listino.** Tolto ogni claim di prezzo pubblico/fisso, sostituito con un pulsante "Richiedi il prezzo".
3. **Foto Ultima Displays con lo stesso standard già in uso per le foto Midocean** sul resto del sito (grafica demo del fornitore accettabile, vietati solo nome/logo reali del fornitore e i nomi commerciali proprietari del brief).

## Round 3 (21 luglio, "con le immagini puoi fare di meglio")

Giovanni ha chiesto un risultato migliore sulle immagini (AI o foto Ultima modificate) e più cura nell'impaginazione. Individuate solo 3 foto Ultima davvero pulite (fondali, gazebo, gonfiabili), trattate in duotone navy/cream. Per gli altri slot, disegnate 6 icone SVG originali.

## Round 4 (22 luglio, "togliamo i kit, componi il tuo kit" e "bruttissime le icone")

Due richieste dirette di Giovanni il giorno dopo, entrambe applicate:

1. **Via i 3 kit fissi, dentro un selettore "componi il tuo kit".** Rimossi `GolfKits.astro`, le 3 pagine di dettaglio kit (`/golf/kit-gara`, `/golf/kit-circolo`, `/golf/kit-green`), `GolfProductSchema.astro` e `golf-kits.ts`. Al loro posto, `GolfComponiKit.astro` più `golf-products.ts`: un catalogo aperto di 14 prodotti, ciascuno selezionabile con un click (non un carrello, nessun pagamento qui, regola brief §0.4). La selezione pre-compila in automatico il campo messaggio del form di richiesta con l'elenco scelto ("Prodotti selezionati: ..."), poi l'utente scrive e invia normalmente. Il campo "kit" a tendina nel form è stato rimosso insieme all'attributo Brevo `KIT` (non più popolato).

   La sezione "Catalogo completo" del Round 2/3 è stata assorbita in questo stesso selettore (non ha più senso avere due griglie prodotto separate): tutti i 6 item che c'erano sono ora dentro i 14 di "Componi il tuo kit".

2. **Via le icone, ritenute bruttissime.** Rimosso `GolfIcon.astro` e ogni suo uso. Nessun tool di generazione immagini fotorealistiche è disponibile in questa sessione (verificato: gli strumenti Canva collegati generano poster/documenti/presentazioni completi, non singole foto prodotto isolate). Lavorato quindi su due fronti:
   - **Ricerca foto più sistematica**: estratti tutti gli URL prodotto dalla sitemap XML di ultimadisplays.it e controllata l'immagine `og:image` di ogni pagina prodotto (più veloce e più ampia della navigazione a menu del Round 2/3). Trovata una foto pulita in più: un separatore da fila neutro, riassegnato a "Segnaletica percorso". Controllato anche il sito pubblico del fornitore tessile golf (Canepa & Campi): nessuna sezione prodotti golf, e le uniche foto di bandiere disponibili mostrano marchi reali di terzi (Ferrari, UniCredit, Audi, ERGO), scartate perché è un problema diverso e più serio della semplice grafica demo del fornitore display (marchi registrati reali, non demo fittizie).
   - **Card tipografiche per tutto il resto**: stesso trattamento già in uso e già collaudato in `Categories.astro` sul resto del sito (blocco di colore pieno più nome prodotto in Archivo Black, nessuna illustrazione). Applicato ai 10 prodotti senza foto disponibile, con colori alternati (arancio, navy, ink, arancio pallido) per dare ritmo alla griglia.

   Risultato: 4 prodotti con foto reale (fondale, gazebo, gonfiabile, segnaletica, tutte in duotone), 10 con card tipografica pulita. Durante la verifica Lighthouse ho anche trovato e corretto due problemi nuovi introdotti da questo lavoro: testo crema su sfondo arancio nelle card tipografiche (contrasto insufficiente, corretto in blu navy) e un bug nel trattamento duotone sulle PNG con trasparenza (l'area trasparente diventava nera invece che chiara, corretto con un flatten su sfondo bianco prima della conversione).

Dettaglio di ogni foto scelta e scartata in `PROJECTS/2promo/verticale-golf/mapping-prodotti.md` (interno, fuori dal repo pubblico).

## Round 5 (22 luglio, "togliamo tee marker personalizzati")

Giovanni ha chiesto di togliere "Tee marker personalizzati" dal catalogo del selettore. Rimosso l'item da `golf-products.ts`: il selettore passa da 14 a 13 prodotti (4 con foto reale, invariati; 9 con card tipografica, non più 10). Nessun altro file di codice toccato: la card era `type: 'block'`, nessuna foto o asset dedicato da rimuovere. Aggiornati i riferimenti in `TBD-REGISTRY.md` e in `PROJECTS/2promo/verticale-golf/mapping-prodotti.md` (interno).

## Round 6 (22 luglio, foto reali per totem e roll up)

Giovanni ha chiesto materiale fotografico migliore da Ultima Displays, utilizzabile anche oltre al verticale golf. Eseguito un audit sistematico dell'intero catalogo fornitore (232 prodotti, non solo golf): estratti tutti gli URL dal sitemap, ogni immagine scaricata e giudicata visivamente da un agente, poi **ririverificata da zero da un secondo agente indipendente** con istruzione esplicita di cercare attivamente problemi mancati al primo giro. Il secondo giro ha scartato 9 immagini che il primo aveva approvato per errore (tra cui 4 foto di tessuto con un logo di certificazione reale, OEKO-TEX, non notato in modo coerente al primo giro): lezione operativa, un solo giro di giudizio automatico su materiale fornitore non è sufficiente, serve sempre una riverifica indipendente prima di considerare un'immagine sicura. Risultato: 49 immagini confermate su tutto il catalogo, catalogate in `PROJECTS/2promo/materiale-ultimadisplays.md` (interno, per riuso su tutto il sito, non solo golf).

Di queste, due erano foto pulite di prodotti già esistenti nel selettore golf: un totem a cornice snap (per "Totem ingresso", SKU immagine `IP01`) e un roll up banner (per "Roll up premiazione", SKU immagine `UB146-850`). Seguendo l'indicazione esplicita di Giovanni di non aggiungere prodotti fuori contesto solo perché la foto era disponibile ("mettiamo prodotti con un senso"), usate **solo** queste due, entrambe già pertinenti al contesto gara/circolo: nessun nuovo item aggiunto al selettore. Il download diretto da ultimadisplays.it era bloccato da una protezione anti-bot del sito (verosimilmente innescata dal volume dell'audit); le due immagini sono state estratte via browser (canvas, non uno strumento di scraping).

Prima versione: trattate in duotone navy/cream come le 4 foto esistenti. Giovanni ha corretto due cose dopo averle viste: proporzioni sbagliate (il riquadro forzava un ritaglio quadrato con `object-cover`, tagliando il totem, alto e stretto) e niente più bianco e nero sulle foto. Corretto entrambi: il riquadro foto ora usa `object-contain` (mostra il prodotto intero, senza ritagli forzati), e **il duotone è stato tolto da tutte e 6 le foto reali**, non solo le due nuove: anche fondale, gazebo, gonfiabile e segnaletica sono state riscaricate (stesso blocco anti-bot, stessa estrazione via browser) e riconvertite a colore originale. Il duotone non è più lo standard per le foto golf. Il selettore resta a 13 prodotti: ora 6 con foto reale a colori (non più 4 in duotone), 7 con card tipografica (non più 9).

## Round 7 (22 luglio, foto reali per tutti i restanti 7 prodotti)

Giovanni ha chiesto di non usare più le card tipografiche in nessun caso: foto anche se mostrano il nome del prodotto del fornitore o un tema generico, purché rispettino comunque le regole non negoziabili (niente modelli, niente nome/logo fornitore, niente nomi vietati, niente marchi reali di terzi). Assegnata una foto reale a tutti i 7 prodotti rimasti (bandiere gara/circolo/campo/istituzionali, banner, tovaglia, banchetto), pescando dal catalogo esteso di `PROJECTS/2promo/materiale-ultimadisplays.md` più 3 nuove foto di bandiere cercate mirate. Stesso blocco anti-bot del sito fornitore, stessa estrazione via browser (canvas), stesso trattamento a colore originale.

Due scelte di compromesso, senza prodotto identico disponibile dal fornitore: "Tovaglia premiazioni" mostra un campione macro di tessuto stampato (non un prodotto tovaglia finito); "Banchetto segreteria" mostra un rendering 3D di una copertura da tavolo elasticizzata (non una fotografia reale, ma l'unica immagine disponibile per questo tipo di prodotto). Anche il roll up "Blizzard" (cactus con occhiali da sole), scartato nel Round 3 per tono giocoso, è stato riconsiderato e usato per "Banner personalizzati": nessuna regola violata, solo un tono non più considerato un ostacolo.

**Il selettore "Componi il tuo kit" ha ora 13 prodotti, tutti con foto reale a colori, zero card tipografiche.**

## Round 8 (22 luglio, correzioni di coerenza foto/descrizione)

Giovanni ha rivisto la griglia del Round 7 e segnalato 4 correzioni:

1. **Gazebo hospitality**: foto bianca ("sembra da ospedale") sostituita con una versione colorata ("Steel Tent", verde menta a pois), stessa fonte fornitore.
2. **Tovaglia premiazioni e Banchetto segreteria**: le due foto erano scambiate rispetto al senso dei nomi (il rendering "Gala", una copertura da tavolo, era su "Banchetto" invece che su "Tovaglia"). Corretto lo scambio. Per il nuovo "Banchetto segreteria" servita una foto diversa: **verificata l'intera categoria "Banchetti" del fornitore** (9 prodotti) e confermato che ogni prodotto con stampa a colori riusa una di due foto stock di modelle (le stesse gia scartate nei round precedenti su altri SKU della stessa linea). Nessuna foto banchetto pulita esiste in questo catalogo. Provata anche una ricerca stock esterna generica (tavolo reception/registrazione), ma nessun risultato nello stesso stile "prodotto isolato su sfondo bianco" del resto della griglia. Soluzione temporanea: riusato il campione di tessuto liberato dallo scambio, segnalato come compromesso da migliorare quando disponibile una foto vera.
3. **Bandiere istituzionali**: Ultima Displays non vende bandiere di paese o federazione (solo strutture bandiera personalizzabili). Usata per la prima volta una foto **stock esterna, non dal fornitore golf**: bandiera italiana al vento, da Pexels (licenza gratuita per uso commerciale, nessuna attribuzione richiesta).
4. **Bandiere campo (18 buche)**: la bandierina da buca non è un prodotto Ultima Displays (loro vendono bandiere fieristiche, non attrezzatura da campo golf). Usata una foto stock esterna da Pexels: bandierina gialla in buca, nessuna persona, nessun logo di club reale visibile (due foto scartate prima di questa: una con un giocatore sullo sfondo, una con il logo di un circolo reale sulla bandiera).

Prima volta in questo progetto che si esce dal catalogo Ultima Displays per una foto prodotto: giustificato perche il fornitore semplicemente non vende quei due tipi di prodotto (bandiere nazionali, bandierine da buca), non per scelta di comodo.

## Round 9 (22 luglio, gazebo Zoom Tent e ultimo tentativo banchetto)

Due segnalazioni di Giovanni:

1. **Gazebo hospitality**: richiesta la linea "Zoom Tent" invece di "Steel Tent" (usata nel Round 8). Controllata l'intera categoria Gazebo: le uniche varianti colorate sono "Steel Tent", la linea "Zoom Tent" esiste solo in bianco (foto originale, "sembra da ospedale") o nero. Usata la variante nera "Parete Intera Zoom Tent": soddisfa la richiesta ed evita comunque l'effetto ospedale del bianco.
2. **Banchetto segreteria**: Giovanni ha indicato `ultimadisplays.it/product/reception-luminar/` come possibile foto. Controllato: il prodotto è in realta "Reception **Illuminova** Luminar", parte della linea Illuminova, uno dei nomi commerciali vietati dal brief anche se non visibile nello slug URL; la foto mostra inoltre una terza modella diversa (due gia scartate nel Round 8). Controllata anche l'intera sottocategoria "Banchetti Desk Luminosi" (3 prodotti): nessuna alternativa, tutti o nome vietato o modella. **Confermato in modo definitivo che nessuna foto di banchetto pulita esiste in tutto il catalogo Ultima Displays.** Il compromesso del Round 8 (campione di tessuto) resta l'unica opzione, vedi `TBD-REGISTRY.md`.

## Lighthouse (build di produzione, locale, dopo Round 4)

| Pagina | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/golf/` | 95 | 96 | 96 | 69* |

Target brief: Performance ≥90, A11y ≥95, entrambi raggiunti. Il colore-contrasto introdotto dalle card tipografiche è stato trovato e corretto nello stesso round (vedi sopra); i soli 2 problemi di contrasto residui sono preesistenti in componenti condivisi (`Footer.astro`, `BaseLayout.astro`), non toccati.

\* SEO 69 è interamente dovuto al `noindex` intenzionale (richiesto dal brief §8, "robots noindex iniziale fino a review"): Lighthouse penalizza qualunque pagina non indicizzabile. Il punteggio sale a piena scala quando si rimuove `noindex` per il lancio pubblico.

Per confronto, la home page attualmente live (`/`, stesso codice base, non toccata) misura Performance 85, A11y 96, BP 96: `/golf` è a parità o meglio delle pagine esistenti, non introduce regressioni.

### Nota tecnica performance
La prima versione di `/golf` misurava Performance 87: l'LCP (il testo H1 dell'hero) aspettava il caricamento di GSAP da CDN prima di diventare visibile (stesso pattern `data-reveal` usato sitewide). Rimosso `data-reveal` dai soli elementi hero above-the-fold in `GolfHero.astro` (nessun file condiviso toccato), Performance è salita e resta stabile tra 95 e 100 nei round successivi nonostante il peso aggiuntivo di più foto prodotto (compensato dal lazy loading già in uso).

## Deviazioni dal brief (decisioni prese in autonomia)

1. **UrgencyBar omessa su tutte le pagine `/golf`.** Il componente esistente contiene claim generici del catalogo standard ("30.000+ articoli", "spedizione rapida") non pertinenti al pubblico B2B formale del golf.
2. **Sticky CTA mobile** (dentro `BaseLayout.astro`, non modificabile) punta ancora a WhatsApp generico e a `/preventivo`, non alla sezione golf.
3. **Trust marquee riusa i loghi clienti generali di 2promo**, non loghi golf-specifici: nessun cliente golf noto disponibile oggi. Coerente con l'istruzione esplicita del brief.
4. **MEPA presentato come testo, non come badge o logo**: nessun asset MEPA disponibile nel repo, non inventato un logo.
5. **`astro.config.mjs` modificato** (file condiviso): aggiunta una riga al filtro sitemap esistente per escludere `/golf` finché resta `noindex`. Modifica additiva di una riga.
6. **Console error Turnstile in Lighthouse** ("Error 110200") dovuto al sitekey registrato per il dominio `2promo.it`, non per `localhost`: non si presenta in produzione.
7. **Color-contrast residuo** (telefono nel footer, bottone WhatsApp nello sticky CTA) è in componenti condivisi non toccati: stesso problema misurato identico sulla home page live.
8. **Dev server locale**: la porta 4321 (config esistente) era occupata da un'altra sessione. Aggiunta una configurazione `golf-dev` in `PROJECTS/2promo/.claude/launch.json` (fuori dal repo pubblico) sulla porta 4326.
9. **Sezione "Componi il tuo kit" non è un carrello**: nessun prezzo per prodotto, nessuna quantità, nessun pagamento. È solo un selettore che compila il messaggio del form. Se in futuro serve un vero configuratore con quantità e prezzi, è un lavoro diverso da valutare a parte.

## Deliverable

1. Branch `golf`, nessun merge su `main`
2. Deploy preview CF Pages: https://golf.2promo-landing.pages.dev/golf (alias branch `golf`, progetto esistente `2promo-landing`)
3. Form end-to-end verificato (contatto Brevo creato ed eliminato in test, redirect e anti-spam verificati via curl, selezione prodotti verificata via browser)
4. `TBD-REGISTRY.md`
5. Questo report
6. Lighthouse ≥90/≥95 raggiunto

## Deploy preview

- URL: https://golf.2promo-landing.pages.dev/golf
- Pagine: `/golf`, `/golf/grazie`
- Deploy manuale via `wrangler pages deploy` sul branch `golf` (il progetto CF Pages esistente non aveva un trigger automatico attivo su branch diversi da `main` al momento del primo push; verificare in dashboard se si vuole abilitare il deploy automatico per push futuri su questo branch)

## Prossimi passi (per Cowork/Giovanni)

- Riempire `TBD-REGISTRY.md` (buffer giorni, tempi riordino, label conversione Ads)
- Decidere se e quando pubblicare un prezzo reale
- Foto mancanti (tessile golf, più banner/totem/banchetto/roll up): recuperarle da area riservata fornitore o con un servizio fotografico proprio
- Creare la conversione Google Ads golf e valorizzare `PUBLIC_GOLF_ADS_CONVERSION_LABEL` su Cloudflare Pages
- Rimuovere `noindex` quando il verticale è pronto per il lancio pubblico
- Valutare se "Componi il tuo kit" deve restare un selettore semplice o diventare un vero configuratore con quantità
