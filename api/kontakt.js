// API-Handler für das KANID Kontaktformular
// Verarbeitet eingehende Anfragen und sendet E-Mails via Resend API

import { Resend } from 'resend';

// Prüft ob der RESEND_API_KEY in der Umgebung vorhanden ist
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Konfiguration
const CONFIG = {
  // Admin-E-Mail, die die Kontaktanfragen erhält
  ADMIN_EMAIL: 'info@kanid.de',
  // Absender-E-Mail (muss von Resend verifiziert sein)
  FROM_EMAIL: 'kontakt@kanid.de',
  // Name des Absenders
  FROM_NAME: 'KANID UG Kontaktformular'
};

// Validiert eine E-Mail-Adresse
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Handler-Funktion für HTTP-Anfragen
export default async function handler(req, res) {
  // CORS-Headers für Anfragen von allen Ursprüngen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Für OPTIONS-Anfragen (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Nur POST-Anfragen erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Nur POST-Methode ist erlaubt' });
  }

  try {
    // Fehlende API-Schlüssel prüfen
    if (!RESEND_API_KEY) {
      console.error('Fehlender Resend API-Schlüssel in der Umgebungskonfiguration');
      return res.status(500).json({ message: 'Konfigurationsfehler auf dem Server. Bitte kontaktieren Sie uns direkt per E-Mail.' });
    }

    // Formulardaten extrahieren
    const { name, email, subject, message } = req.body;

    // Eingabevalidierung
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Alle Felder sind erforderlich' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein' });
    }

    // Resend API initialisieren
    const resend = new Resend(RESEND_API_KEY);

    // E-Mail an den Administrator senden
    const adminEmailData = await resend.emails.send({
      from: `${CONFIG.FROM_NAME} <${CONFIG.FROM_EMAIL}>`,
      to: CONFIG.ADMIN_EMAIL,
      subject: `Neue Kontaktanfrage: ${subject}`,
      html: `
        <h2>Neue Kontaktanfrage von der KANID Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Betreff:</strong> ${subject}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Bestätigungs-E-Mail an den Absender senden
    const userEmailData = await resend.emails.send({
      from: `${CONFIG.FROM_NAME} <${CONFIG.FROM_EMAIL}>`,
      to: email,
      subject: `Ihre Kontaktanfrage an KANID UG`,
      html: `
        <h2>Vielen Dank für Ihre Nachricht!</h2>
        <p>Sehr geehrte(r) ${name},</p>
        <p>vielen Dank für Ihre Kontaktanfrage. Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
        <p><strong>Ihre Nachricht:</strong></p>
        <p><em>${message.replace(/\n/g, '<br>')}</em></p>
        <p>Mit freundlichen Grüßen,<br>Ihr KANID UG Team</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          KANID UG (haftungsbeschränkt)<br>
          Holderäckerstraße 3<br>
          70839 Gerlingen<br>
          Tel: +49 1520 7921611<br>
          E-Mail: info@kanid.de<br>
          Web: <a href="https://kanid.de">kanid.de</a>
        </p>
      `,
    });

    // Erfolgreiche Antwort zurücksenden
    return res.status(200).json({ 
      message: 'Nachricht erfolgreich gesendet',
      adminEmailId: adminEmailData.id,
      userEmailId: userEmailData.id
    });

  } catch (error) {
    // Fehlerbehandlung
    console.error('Fehler beim Verarbeiten der Kontaktanfrage:', error);
    return res.status(500).json({ 
      message: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 