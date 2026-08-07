import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Toma la API key desde las variables de entorno para evitar fuga de credenciales
const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const prerender = false; // Forzar ejecución Serverless/SSR

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const fullName = data.get('fullName') as string;
    const email = data.get('email') as string;
    const company = data.get('company') as string;

    if (!email || !fullName) {
      return new Response(JSON.stringify({ error: 'Faltan datos obligatorios' }), { status: 400 });
    }

    // 1. Enviar el correo con la guía AL CLIENTE
    await resend.emails.send({
      from: 'SysArmor Tech <onboarding@resend.dev>',
      to: email,
      subject: 'Tu Guía Técnica: Migración a Windows Server 2025 - SysArmor Tech',
      html: `
        <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: auto; padding: 20px;">
          <h2 style="color: #0f172a;">¡Hola ${fullName}!</h2>
          <p>Gracias por solicitar la guía técnica de <strong>SysArmor Tech</strong>.</p>
          <p>Puedes descargar el PDF y la batería de scripts desde el siguiente enlace:</p>
          <div style="margin: 25px 0;">
            <a href="https://sysarmortech.com/docs/guia-migracion-dc-windows-server-2025.pdf" 
               style="background-color: #D4AF37; color: #020617; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
               Descargar Guía PDF
            </a>
          </div>
          <p style="font-size: 13px; color: #64748b;">Si no puedes hacer clic en el botón, copia y pega esta URL en tu navegador:<br>
          https://sysarmortech.com/docs/guia-migracion-dc-windows-server-2025.pdf</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="font-size: 12px; color: #94a3b8;">Alfredo Arévalo | Infrastructure & Systems Engineer | SysArmor Tech</p>
        </div>
      `,
    });

    // 2. Enviar la NOTIFICACIÓN A TI (a tu correo registrado en Resend)
    await resend.emails.send({
      from: 'Notificaciones SysArmor <onboarding@resend.dev>',
      to: 'arevaloalfredo69@gmail.com',
      subject: `Nuevo Lead Capturado: ${fullName}`,
      html: `
        <h3>Nuevo prospecto ha solicitado la guía</h3>
        <ul>
          <li><strong>Nombre:</strong> ${fullName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Empresa:</strong> ${company || 'No especificada'}</li>
        </ul>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Resend API Error:", error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
};