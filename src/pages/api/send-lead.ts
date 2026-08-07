import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { nombre, correo, empresa, aceptaOfertas } = data;

    // Validación estricta del formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombre || !correo || !emailRegex.test(correo)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'El nombre es obligatorio y el correo electrónico debe tener un formato válido.' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // URL de tu Apps Script de Google Sheets
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyqT4YjJRXV0z-Gv18ps9cEp8WN-FX0lvA7hhqSQ69l0clUQsdBpYEhAw7GxukEAbjc/exec';

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, empresa, aceptaOfertas }),
    });

    if (!response.ok) {
      throw new Error('Error al conectar con Google Sheets');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Lead registrado exitosamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};