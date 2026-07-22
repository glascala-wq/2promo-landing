// API route: POST /api/lead-golf
// Riceve il form richiesta preventivo del verticale golf: crea contatto Brevo (lista "2promo - Lead Golf")
// e invia email notifica interna, poi redirige a /golf/grazie
// Pattern anti-spam e struttura replicati da src/pages/api/lead.ts (non toccare quel file).

export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env ?? import.meta.env;
  const BREVO_API_KEY = env.BREVO_API_KEY;
  const BREVO_LIST_ID_GOLF = parseInt(env.BREVO_LIST_ID_GOLF ?? '21', 10);
  const BREVO_NOTIFICATION_EMAIL = env.BREVO_NOTIFICATION_EMAIL ?? 'info@2promo.it';
  const TURNSTILE_SECRET_KEY = env.TURNSTILE_SECRET_KEY;

  if (!BREVO_API_KEY) {
    return new Response(JSON.stringify({ error: 'Missing BREVO_API_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid form data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // === ANTI-SPAM, stesso schema a 3 livelli di /api/lead ===

  // L1: Honeypot. Bot riempie il campo trappola, fake success.
  const honeypot = (formData.get('website') as string | null) ?? '';
  if (honeypot.length > 0) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // L3: Time-based. Submit troppo veloce (<3s), fake success.
  const formLoaded = parseInt((formData.get('_form_loaded') as string | null) ?? '0', 10);
  const elapsed = Date.now() - formLoaded;
  if (!formLoaded || elapsed < 3000) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (elapsed > 1000 * 60 * 60 * 24) {
    return new Response(JSON.stringify({ error: 'Sessione scaduta, ricarica la pagina' }), {
      status: 410,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // L2: Cloudflare Turnstile (chiamata esterna, per ultima).
  const turnstileToken = (formData.get('cf-turnstile-response') as string | null) ?? '';
  if (!turnstileToken) {
    return new Response(JSON.stringify({ error: 'Verifica anti-spam richiesta' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (TURNSTILE_SECRET_KEY) {
    const verifyResp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: turnstileToken,
        remoteip: request.headers.get('CF-Connecting-IP') ?? '',
      }),
    });
    const verifyData = (await verifyResp.json()) as { success?: boolean };
    if (!verifyData.success) {
      return new Response(JSON.stringify({ error: 'Verifica anti-spam fallita. Riprova.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    console.error('TURNSTILE_SECRET_KEY mancante: skip verify (configurare env var).');
  }

  // === LEAD PROCESSING ===

  const nome = (formData.get('nome') as string | null)?.trim() ?? '';
  const azienda = (formData.get('azienda') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const telefono = (formData.get('telefono') as string | null)?.trim() ?? '';
  const dataGara = (formData.get('data_gara') as string | null)?.trim() ?? '';
  const messaggio = (formData.get('messaggio') as string | null)?.trim() ?? '';
  const rinnovo = (formData.get('rinnovo') as string | null) === 'si';

  if (!nome || !azienda || !email || !telefono || !dataGara) {
    return new Response(JSON.stringify({ error: 'Campi obbligatori mancanti' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const nomeParts = nome.split(' ');
  const firstName = nomeParts[0] ?? nome;
  const lastName = nomeParts.slice(1).join(' ') || '';

  // 1. Crea/aggiorna contatto Brevo (lista "2promo - Lead Golf")
  const contactPayload: Record<string, unknown> = {
    email,
    firstName,
    lastName,
    attributes: {
      TELEFONO: telefono,
      AZIENDA: azienda,
      DATA_GARA: dataGara,
      RINNOVO: rinnovo ? 'si' : 'no',
      MESSAGGIO: messaggio || undefined,
      SOURCE: 'landing-golf',
    },
    listIds: [BREVO_LIST_ID_GOLF],
    updateEnabled: true,
  };

  const brevoContactResp = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify(contactPayload),
  });

  if (!brevoContactResp.ok) {
    const errText = await brevoContactResp.text();
    console.error('Brevo contact error:', brevoContactResp.status, errText);
    // Continua comunque, l'utente non deve sapere dell'errore CRM
  }

  // 2. Invia email di notifica interna (transazionale, non automazione)
  const notificationPayload = {
    sender: { name: '2promo Golf', email: 'noreply@2promo.it' },
    to: [{ email: BREVO_NOTIFICATION_EMAIL }],
    subject: `[2promo Golf] Nuova richiesta da ${nome} (${azienda})`,
    htmlContent: `
      <h2>Nuova richiesta preventivo, verticale Golf</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Circolo/Azienda:</strong> ${azienda}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Telefono:</strong> ${telefono}</p>
      <p><strong>Data gara:</strong> ${dataGara}</p>
      <p><strong>Rinnovo stagionale:</strong> ${rinnovo ? 'Sì' : 'No'}</p>
      <hr/>
      <p><strong>Messaggio (include i prodotti selezionati in "Componi il tuo kit", se presenti):</strong></p>
      <blockquote style="border-left:3px solid #FE5000;padding-left:12px;color:#555;">${(messaggio || '(nessun messaggio)').replace(/\n/g, '<br>')}</blockquote>
      <hr/>
      <p style="color:#999;font-size:12px;">Inviato dal verticale golf, 2promo.it/golf</p>
    `,
  };

  const notifResp = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify(notificationPayload),
  });

  if (!notifResp.ok) {
    const errText = await notifResp.text();
    console.error('Brevo notification error:', notifResp.status, errText);
  }

  return new Response(null, {
    status: 302,
    headers: { Location: '/golf/grazie' },
  });
};
