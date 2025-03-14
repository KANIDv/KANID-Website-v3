// API-Handler für das KANID Kontaktformular
// Verarbeitet eingehende Anfragen und sendet E-Mails via Resend API

const { Resend } = require('resend');

// API-Schlüssel direkt im Code (ersetzen Sie diesen durch Ihren tatsächlichen Resend API-Key)
const RESEND_API_KEY = "re_NMeH8GZr_7gfjjfTyn35JbgsuMs1LKrQQ";  // WICHTIG: Ersetzen Sie dies mit Ihrem echten API-Key von Resend

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
module.exports = async function(req, res) {
  // CORS-Header
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Für OPTIONS-Anfragen (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Nur POST-Anfragen erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Anfrage empfangen');
    
    // Formulardaten extrahieren
    let name, email, subject, message;
    
    try {
      // Body-Parsing-Logik
      if (typeof req.body === 'string') {
        const parsedBody = JSON.parse(req.body);
        name = parsedBody.name;
        email = parsedBody.email;
        subject = parsedBody.subject;
        message = parsedBody.message;
      } else {
        ({ name, email, subject, message } = req.body);
      }
    } catch (parseError) {
      console.error('Parsing-Fehler:', parseError);
      return res.status(400).json({ error: 'Ungültiges Format' });
    }
    
    // Validierung
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Alle Felder erforderlich' });
    }
    
    console.log('Sende E-Mail...');
    
    // Resend initialisieren
    const resend = new Resend(RESEND_API_KEY);

    // E-Mail senden
    const data = await resend.emails.send({
      from: 'KANID UG Kontaktformular <kontakt@kanid.de>',
      to: 'info@kanid.de',
      subject: `Neue Anfrage: ${subject}`,
      html: `
        <h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Betreff:</strong> ${subject}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });
    
    console.log('E-Mail gesendet, ID:', data.id);
    
    // Erfolgsantwort
    return res.status(200).json({ 
      success: true, 
      message: 'Nachricht gesendet' 
    });
    
  } catch (error) {
    // Ausführliche Fehlerprotokollierung
    console.error('Fehler:', error);
    console.error('Fehlerdetails:', error.stack);
    
    // Benutzerfreundliche Antwort
    return res.status(500).json({ 
      error: 'Serverfehler', 
      message: 'Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.'
    });
  }
}; 