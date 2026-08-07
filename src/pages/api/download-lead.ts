import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const fullName = data.get('fullName') as string;
    const email = data.get('email') as string;
    const company = data.get('company') as string;

    // Validar campos obligatorios antes de entregar el archivo
    if (!email || !fullName) {
      return new Response(
        JSON.stringify({ error: 'Nombre y correo corporativo son obligatorios.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Registro en log del servidor para auditoría de leads
    console.log(`[Lead Download] Solicito: ${fullName} | Email: ${email} | Empresa: ${company || 'N/A'}`);

    // Ruta física al archivo PDF en la carpeta public/
    const filePath = path.join(process.cwd(), 'public', 'docs', 'guia-migracion-dc-windows-server-2025.pdf');

    if (!fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({ error: 'El recurso solicitado no está disponible en el servidor.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Retornar el binario forzando la descarga en el navegador
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="guia-migracion-dc-windows-server-2025.pdf"',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error al procesar la descarga del lead:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor al procesar la descarga.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};