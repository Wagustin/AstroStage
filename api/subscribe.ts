import { Resend } from 'resend';

export default async function handler(req: any, res: any) {
  // Solo permitimos el método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Solo POST.' });
  }

  const apiKey = process.env['RESEND_API_KEY'];
  if (!apiKey) {
    return res.status(500).json({ error: 'Falta configurar RESEND_API_KEY en Vercel.' });
  }
  const resend = new Resend(apiKey);

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Correo inválido o faltante.' });
  }

  // Sanitizar el correo electrónico para prevenir inyección HTML
  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  const safeEmail = escapeHtml(email);

  try {
    // Usar URL base fija y segura para evitar inyección de Host Header
    const logoUrl = `https://astrostage.online/assets/logo-email-square.jpeg`;

    const { data, error } = await resend.emails.send({
      from: 'AstroStage <sales-team@astrostage.online>',
      to: email,
      subject: '¡Bienvenido al futuro! Ya estás en la lista de AstroStage 🚀',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000;">
          <div style="font-family: 'Inter', Helvetica, sans-serif; padding: 40px 20px; background-color: #030014; color: #ffffff; text-align: center; border-radius: 12px; max-width: 600px; margin: 0 auto;">
            <img src="${logoUrl}" alt="AstroStage Logo" style="width: 150px; border-radius: 8px; border: 2px solid #00ffff; margin-bottom: 24px; box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);" />
            
            <h2 style="color: #00ffff; font-family: 'Outfit', Helvetica, sans-serif; font-size: 24px; margin-bottom: 16px; letter-spacing: 1px; font-weight: 800; text-transform: uppercase;">¡Gracias por unirte al proyecto!</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #b3b3b3; text-align: left;">
              Hola, pionero. Hemos registrado tu correo <strong>${safeEmail}</strong> exitosamente en nuestra lista de espera exclusiva.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #b3b3b3; text-align: left;">
              En <strong>AstroStage</strong>, estamos rompiendo las barreras de la realidad. Nuestro equipo se encuentra en fase de desarrollo intensivo, trabajando día y noche para traerte la experiencia de conciertos inmersivos más alucinante del mercado, combinando tecnología de Realidad Virtual (VR) y Realidad Aumentada (AR).
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #b3b3b3; text-align: left;">
              Te prepararemos para sentir la música y vivir los eventos como si estuvieras en primera fila, sin importar en qué parte del universo te encuentres.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #b3b3b3; text-align: left;">
              Mantente atento a tu bandeja de entrada. Serás de las primeras personas en recibir noticias, actualizaciones de desarrollo y, por supuesto, tu invitación VIP cuando abramos nuestras puertas a la Beta cerrada.
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(0, 255, 255, 0.2);">
              <p style="font-size: 14px; color: #888;">Nos vemos en la primera fila ✨,</p>
              <p style="font-family: 'Outfit', Helvetica, sans-serif; font-size: 16px; color: #00ffff; font-weight: bold; margin-top: 5px;">El equipo de AstroStage</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error enviando correo con Resend:', error);
      return res.status(400).json({ error: 'Error al procesar la solicitud de suscripción.' });
    }

    return res.status(200).json({ message: 'Suscripción exitosa, correo enviado.', data });
  } catch (error: any) {
    console.error('Error interno del servidor en endpoint de suscripción:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
