// API-Handler für das KANID Kontaktformular
// Verarbeitet eingehende Anfragen und sendet E-Mails via Resend API

// Umgebungsvariablen laden
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('./env-loader');

import { Resend } from 'resend';

// Verschiedene Möglichkeiten für die Schlüsselquelle prüfen (IONOS Deploy Now, GitHub Actions)
const RESEND_API_KEY = process.env.RESEND_API_KEY || 
                       process.env.GITHUB_ENV_RESEND_API_KEY || 
                       process.env.SECRETS_RESEND_API_KEY;

// Debug-Logging
console.log('Umgebungsvariablen verfügbar:', Object.keys(process.env).filter(key => 
  !key.includes('SECRET') && !key.includes('KEY') && !key.includes('TOKEN')));
console.log('API-Schlüssel vorhanden:', !!RESEND_API_KEY);

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
    console.log('Kontaktformular-Anfrage empfangen');
    
    // Fehlende API-Schlüssel prüfen
    if (!RESEND_API_KEY) {
      console.error('Fehlender Resend API-Schlüssel in der Umgebungskonfiguration');
      console.error('Verfügbare Umgebungsvariablen:', Object.keys(process.env).filter(key => !key.includes('KEY') && !key.includes('SECRET')));
      return res.status(500).json({ message: 'Konfigurationsfehler auf dem Server. Bitte kontaktieren Sie uns direkt per E-Mail.' });
    }

    // Formulardaten extrahieren und validieren
    let { name, email, subject, message } = {};
    
    try {
      // Bei IONOS Deploy Now kann es vorkommen, dass der Body als String vorliegt
      if (typeof req.body === 'string') {
        const parsedBody = JSON.parse(req.body);
        name = parsedBody.name;
        email = parsedBody.email;
        subject = parsedBody.subject;
        message = parsedBody.message;
      } else {
        // Standardfall: Body ist bereits geparst
        ({ name, email, subject, message } = req.body);
      }
    } catch (parseError) {
      console.error('Fehler beim Parsen des Request-Body:', parseError);
      return res.status(400).json({ message: 'Ungültiges Anforderungsformat. Bitte stellen Sie sicher, dass Sie gültiges JSON senden.' });
    }

    // Eingabevalidierung
    if (!name || !email || !subject || !message) {
      console.log('Unvollständige Formulardaten:', { name, email, subject, message: message ? 'vorhanden' : 'fehlt' });
      return res.status(400).json({ message: 'Alle Felder sind erforderlich' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein' });
    }

    console.log('Sende E-Mail mit Resend API');
    
    try {
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

      console.log('Admin-E-Mail gesendet, ID:', adminEmailData?.id);

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

      console.log('Benutzer-E-Mail gesendet, ID:', userEmailData?.id);

      // Erfolgreiche Antwort zurücksenden
      return res.status(200).json({ 
        message: 'Nachricht erfolgreich gesendet',
        adminEmailId: adminEmailData?.id,
        userEmailId: userEmailData?.id
      });
    } catch (emailError) {
      console.error('Fehler beim Senden der E-Mail mit Resend:', emailError);
      throw emailError; // Weitergeben an die äußere Fehlerbehandlung
    }

  } catch (error) {
    // Fehlerbehandlung
    console.error('Fehler beim Verarbeiten der Kontaktanfrage:', error);
    console.error('Fehlerdetails:', error.stack);
    
    if (error.message && error.message.includes('API key')) {
      return res.status(500).json({ 
        message: 'Authentifizierungsproblem mit dem E-Mail-Dienst. Bitte kontaktieren Sie uns direkt per E-Mail an info@kanid.de.',
      });
    }
    
    return res.status(500).json({ 
      message: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 