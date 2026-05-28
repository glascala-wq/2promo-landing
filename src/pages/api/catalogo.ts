// API route: POST /api/catalogo
// Riceve email → aggiunge a lista 14 Brevo + invia template 30 con link PDF

export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env ?? import.meta.env;
  const BREVO_API_KEY = env.BREVO_API_KEY;
  const BREVO_LIST_ID_CATALOGO = parseInt(env.BREVO_LIST_ID_CATALOGO ?? '14', 10);

  if (!BREVO_API_KEY) {
    return new Response(JSON.stringify({ error: 'Missing BREVO_API_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let email: string | null = null;
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    try {
      const formData = await request.formData();
      email = (formData.get('email') as string | null)?.trim() ?? null;
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid form data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    // JSON fallback
    try {
      const body = await request.json() as { email?: string };
      email = body.email?.trim() ?? null;
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Email non valida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 1. Crea/aggiorna contatto Brevo → lista catalogo
  const contactResp = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      email,
      listIds: [BREVO_LIST_ID_CATALOGO],
      updateEnabled: true,
      attributes: { FONTE: '2promo-catalogo' },
    }),
  });

  if (!contactResp.ok) {
    const errText = await contactResp.text();
    console.error('Brevo contact error:', contactResp.status, errText);
  }

  // 2. Invia email transazionale con template 30 (link PDF catalogo)
  const emailResp = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      to: [{ email }],
      templateId: 30,
      params: {
        CATALOGO_URL: 'https://view.publitas.com/2promo/catalogo-2024/page/1',
      },
    }),
  });

  if (!emailResp.ok) {
    const errText = await emailResp.text();
    console.error('Brevo email error:', emailResp.status, errText);
    return new Response(JSON.stringify({ error: 'Errore invio email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
