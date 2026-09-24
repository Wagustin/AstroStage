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

  const email = req.body?.email;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
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
      from: 'AstroStage <sales.team@astrostage.online>',
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
        <body style="margin: 0; padding: 0; background-color: #030303; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #030303; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="100%" max-width="560px" border="0" cellspacing="0" cellpadding="0" style="background-color: #09090b; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5); max-width: 560px; width: 100%;">
                  
                  <!-- Header/Logo -->
                  <tr>
                    <td align="center" style="padding: 40px 40px 20px 40px;">
                      <img src="${logoUrl}" alt="AstroStage Logo" style="width: 80px; height: 80px; border-radius: 16px; border: 1px solid rgba(0, 255, 255, 0.3); box-shadow: 0 0 20px rgba(0, 255, 255, 0.15);" />
                    </td>
                  </tr>

                  <!-- Content Body -->
                  <tr>
                    <td style="padding: 0 40px; text-align: center;">
                      <h1 style="font-family: 'Outfit', -apple-system, sans-serif; font-size: 26px; font-weight: 800; line-height: 1.3; color: #ffffff; margin: 0 0 20px 0; letter-spacing: -0.5px;">
                        ¡Bienvenido a la primera fila, pionero!
                      </h1>
                      
                      <p style="font-size: 15px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px 0; text-align: left;">
                        Hola. Hemos registrado tu correo <strong style="color: #ffffff;">${safeEmail}</strong> exitosamente en nuestra lista de espera exclusiva para <strong>AstroStage</strong>.
                      </p>
                      
                      <p style="font-size: 15px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px 0; text-align: left;">
                        Estamos construyendo el futuro del entretenimiento en vivo. Fusionando tecnologías de <strong>Realidad Virtual (VR)</strong> y <strong>Realidad Aumentada (AR)</strong>, estamos listos para llevarte directo al escenario de tus artistas favoritos, sin importar las distancias físicas del universo.
                      </p>

                      <p style="font-size: 15px; line-height: 1.6; color: #a1a1aa; margin: 0 0 32px 0; text-align: left;">
                        Serás de las primeras personas en recibir noticias exclusivas, detrás de cámaras del desarrollo, y por supuesto, tu invitación con acceso prioritario cuando liberemos la beta privada.
                      </p>

                      <!-- Button CTA -->
                      <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 40px;">
                        <tr>
                          <td align="center" style="border-radius: 8px; background-color: #00ffff; box-shadow: 0 0 20px rgba(0, 255, 255, 0.25);">
                            <a href="https://astrostage.online" target="_blank" rel="noopener noreferrer" style="font-family: 'Outfit', -apple-system, sans-serif; font-size: 15px; font-weight: 700; color: #000000; text-decoration: none; display: inline-block; padding: 14px 28px; border-radius: 8px; letter-spacing: 0.5px;">
                              Explorar AstroStage
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #050507; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
                      <p style="font-size: 13px; color: #71717a; margin: 0 0 4px 0;">
                        Estás recibiendo este correo porque te registraste en nuestra lista de espera.
                      </p>
                      <p style="font-family: 'Outfit', -apple-system, sans-serif; font-size: 14px; font-weight: 600; color: #00ffff; margin: 0;">
                        AstroStage &copy; 2026. Todos los derechos reservados.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
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
