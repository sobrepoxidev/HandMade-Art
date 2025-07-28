'use server';

import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/types-db';

/* Paso 1 : registrar lead */
export async function insertLead(
  name: string,
  email: string,
  phone: string
): Promise<
  | { ok: true; id: string; entries: number }
  | { ok: false; reason: 'duplicate' }
> {
  const { data, error } = await supabase
    .from('leads')
    .insert({ name, email, phone })
    .select('id, entries')
    .single();

  if (!error) {
    return { ok: true, id: data!.id, entries: data!.entries };
  }

  // Detectar violación de clave única (código 23505)
  if (error.code === '23505') {
    return { ok: false, reason: 'duplicate' };
  }

  // para otros errores - propagar
  throw error;
}

export type Social =
  | 'facebook_followed'
  | 'instagram_followed'
  | 'tiktok_followed'
  | 'youtube_followed';

/**
 * Marca la red social como seguida y actualiza el contador `entries`
 */
export async function addFollow(
  id: string,
  social: Social,
  nextEntries: number
) {
  const updates: Partial<Database['leads']> = {
    [social]: true,
    entries: nextEntries
  } as never;

  const { error } = await supabase.from('leads').update(updates).eq('id', id);
  if (error) throw error;
}


export async function sendSummaryMail(
  to: string,
  name: string,
  entries: number,
  followed: Record<Social, boolean>
) {
  const nodemailer = (await import('nodemailer')).default;

  const followedList = Object.entries(followed)
    .filter(([, v]) => v)
    .map(([k]) =>
      k === 'facebook_followed'  ? '<li>Facebook</li>'  :
      k === 'instagram_followed' ? '<li>Instagram</li>' :
      k === 'tiktok_followed'    ? '<li>TikTok</li>'    :
                                   '<li>YouTube</li>'
    )
    .join('');

  /* 👉 Plantilla con fecha y “papelitos” */
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.4">
    <h2 style="color:#db2777;margin:0 0 12px">
      ¡Gracias por registrarte, ${name}!
    </h2>

    <p>
      Ya estás participando para ganar un <strong>Espejo Artesanal</strong> por el Día de la Madre.
      El sorteo se realizará el <strong>jueves&nbsp;14&nbsp;de&nbsp;agosto&nbsp;de&nbsp;2025</strong>.
    </p>

    <p>
      <strong>Participaciones totales:</strong> ${entries}<br/>
      (${entries === 1 ? 'Tienes 1 papelito' : `Tienes ${entries} papelitos`} con tu nombre en la tómbola)
    </p>

    ${
      followedList
        ? `<p><strong>Redes que seguiste:</strong></p><ul>${followedList}</ul>`
        : `<p>Aún puedes seguir nuestras redes para sumar más papelitos y enviarnos tus capturas de pantalla por WhatsApp.</p>
        <a href="https://wa.me/50684237555?text=Hola%2C%20quiero%20registrar%20m%C3%A1s%20participaciones%20para%20el%20sorteo%20del%20D%C3%ADa%20de%20la%20Madre" style="display:inline-block;padding:10px 16px;background:#db2777;color:#fff;border-radius:4px;text-decoration:none;font-weight:bold" target="_blank" rel="noopener noreferrer">Enviar por WhatsApp</a>`
    }

    <p style="margin-top:24px">
      ¡Buena suerte!<br/>— Equipo Handmade Art
    </p>
  </div>`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  await transporter.sendMail({
    from: `"HANDMADE ART" <${process.env.EMAIL_USER}>`,
    to,
    subject: `¡Suerte en nuestro sorteo Día de la Madre, ${name}!`,
    html
  });
}