// API route: POST /api/lead
// Riceve form preventivo → crea contatto Brevo + invia email notifica
// Poi redirige a /grazie

export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  // Recupera variabili d'ambiente (CF Pages runtime o .env)
  const env = (locals as any).runtime?.env ?? import.meta.env;
  const BREVO_API_KEY = env.BREVO_API_KEY;
  const BREVO_LIST_ID_PREVENTIVO = parseInt(env.BREVO_LIST_ID_PREVENTIVO ?? '17', 10);
  const BREVO_NOTIFICATION_EMAIL = env.BREVO_NOTIFICATION_EMAIL ?? 'info@2promo.it';

  if (!BREVO_API_KEY) {
    return new Response(JSON.stringify({ error: 'Missing BREVO_API_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Parse form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid form data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const nome = (formData.get('nome') as string | null)?.trim() ?? '';
  const azienda = (formData.get('azienda') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const telefono = (formData.get('telefono') as string | null)?.trim() ?? '';
  const linea = (formData.get('linea') as string | null)?.trim() ?? '';
  const messaggio = (formData.get('messaggio') as string | null)?.trim() ?? '';

  // Validazione base
  if (!nome || !email || !telefono || !messaggio) {
    return new Response(JSON.stringify({ error: 'Campi obbligatori mancanti' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const nomeParts = nome.split(' ');
  const firstName = nomeParts[0] ?? nome;
  const lastName = nomeParts.slice(1).join(' ') || '';

  // 1. Crea/aggiorna contatto Brevo
  const contactPayload: Record<string, unknown> = {
    email,
    firstName,
    lastName,
    attributes: {
      TELEFONO: telefono,
      AZIENDA: azienda || undefined,
      LINEA_INTERESSE: linea || 'non specificato',
      MESSAGGIO: messaggio,
      FONTE: '2promo-landing',
    },
    listIds: [BREVO_LIST_ID_PREVENTIVO],
    updateEnabled: true,
  };

  const brevoContactResp = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify(contactPayload),
  });

  if (!brevoContactResp.ok) {
    const errText = await brevoContactResp.text();
    console.error('Brevo contact error:', brevoContactResp.status, errText);
    // Continua comunque — l'utente non deve sapere dell'errore CRM
  }

  // 2. Invia email di notifica interna
  const notificationPayload = {
    sender: { name: '2promo Landing', email: 'noreply@2promo.it' },
    to: [{ email: BREVO_NOTIFICATION_EMAIL }],
    subject: `[2promo] Nuovo preventivo da ${nome}${azienda ? ` (${azienda})` : ''}`,
    htmlContent: `
      <h2>Nuovo preventivo richiesto</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Azienda:</strong> ${azienda || '—'}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Telefono:</strong> ${telefono}</p>
      <p><strong>Linea:</strong> ${linea || '—'}</p>
      <hr/>
      <p><strong>Messaggio:</strong></p>
      <blockquote style="border-left:3px solid #FE5000;padding-left:12px;color:#555;">${messaggio.replace(/\n/g, '<br>')}</blockquote>
      <hr/>
      <p style="color:#999;font-size:12px;">Inviato da 2promo.it landing page</p>
    `,
  };

  const notifResp = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify(notificationPayload),
  });

  if (!notifResp.ok) {
    const errText = await notifResp.text();
    console.error('Brevo notification error:', notifResp.status, errText);
  }

  // Ridireziona a /grazie
  return new Response(null, {
    status: 302,
    headers: { Location: '/grazie' },
  });
};
