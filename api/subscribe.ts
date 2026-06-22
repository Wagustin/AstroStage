import { Resend } from 'resend';

// Vercel extracts this from Environment Variables in Production/Preview
const resend = new Resend(process.env['RESEND_API_KEY']);

export default async function handler(req: any, res: any) {
  // Solo permitimos el método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Solo POST.' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Correo inválido o faltante.' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'AstroStage <onboarding@resend.dev>', // Resend usa este dominio de prueba hasta que agregues el tuyo
      to: email,
      subject: '¡Bienvenido a la lista de espera de AstroStage! 🚀',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #030014;">
          <h2 style="color: #7f00ff;">¡Gracias por tu apoyo, pionero!</h2>
          <p>Hemos registrado tu correo <strong>${email}</strong> en nuestra lista de espera.</p>
          <p>
            Actualmente, <strong>AstroStage</strong> se encuentra en fase de desarrollo intensivo. 
            Estamos trabajando duro para traerte la mejor experiencia de eventos y conciertos 
            inmersivos en VR/AR, directamente a tus gafas espaciales.
          </p>
          <p>
            Serás de los primeros en enterarte cuando abramos las puertas a la Beta cerrada. 
            Gracias por confiar en el futuro del entretenimiento.
          </p>
          <br>
          <p>Nos vemos en la primera fila,</p>
          <p><strong>El equipo de AstroStage</strong></p>
        </div>
      `,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Suscripción exitosa, correo enviado.', data });
  } catch (error: any) {
    return res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
  }
}
