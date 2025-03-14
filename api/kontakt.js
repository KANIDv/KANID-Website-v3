// API-Handler für das KANID Kontaktformular
// Verarbeitet eingehende Anfragen und sendet E-Mails via Resend API

const { Resend } = require('resend');

// API-Schlüssel
const RESEND_API_KEY = "re_NMeH8GZr_7gfjjfTyn35JbgsuMs1LKrQQ";

// Handler-Funktion für HTTP-Anfragen
module.exports = async function(req, res) {
  // Debug-Information speichern
  console.log('===== KONTAKTFORMULAR API START =====');
  console.log('Request-Methode:', req.method);
  console.log('Request-Headers:', JSON.stringify(req.headers));
  
  // CORS-Header
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Für OPTIONS-Anfragen (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Test-Endpoint für einfache Überprüfung
  if (req.url === '/api/kontakt/test') {
    return res.status(200).json({ message: 'API funktioniert!' });
  }

  // Nur POST-Anfragen erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('POST-Anfrage empfangen');
    console.log('Body-Typ:', typeof req.body);
    
    if (req.body) {
      console.log('Body-Inhalt:', typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
    }
    
    // Formulardaten extrahieren
    let name, email, subject, message;
    
    try {
      // Body-Parsing-Logik
      if (typeof req.body === 'string') {
        console.log('Versuche JSON zu parsen...');
        const parsedBody = JSON.parse(req.body);
        name = parsedBody.name;
        email = parsedBody.email;
        subject = parsedBody.subject || 'Kontaktanfrage';
        message = parsedBody.message;
      } else {
        console.log('Body ist bereits geparst');
        name = req.body.name;
        email = req.body.email;
        subject = req.body.subject || 'Kontaktanfrage';
        message = req.body.message;
      }
      
      console.log('Extrahierte Daten:', { name, email, subject });
    } catch (parseError) {
      console.error('Parsing-Fehler:', parseError);
      return res.status(400).json({ error: 'Ungültiges Format', details: parseError.message });
    }
    
    // Validierung
    if (!name || !email || !message) {
      console.log('Validierungsfehler: Fehlende Felder');
      return res.status(400).json({ error: 'Fehlende Pflichtfelder', missing: { name: !name, email: !email, message: !message } });
    }
    
    // Versuch E-Mail zu senden
    try {
      console.log('Initialisiere Resend mit Key-Anfang:', RESEND_API_KEY.substring(0, 10) + '...');
      const resend = new Resend(RESEND_API_KEY);

      console.log('Sende E-Mail...');
      
      // Email mit vereinfachter Konfiguration
      const emailData = {
        from: 'kontakt@kanid.de',
        to: 'info@kanid.de',
        subject: `Kontaktanfrage: ${subject}`,
        html: `<p><b>Name:</b> ${name}</p><p><b>E-Mail:</b> ${email}</p><p><b>Nachricht:</b> ${message}</p>`
      };
      
      console.log('E-Mail-Konfiguration:', JSON.stringify(emailData));
      
      const data = await resend.emails.send(emailData);
      
      console.log('E-Mail gesendet, Antwort:', JSON.stringify(data));
      
      return res.status(200).json({ 
        success: true, 
        message: 'Nachricht gesendet',
        id: data.id
      });
    } catch (emailError) {
      console.error('Fehler beim E-Mail-Versand:', emailError);
      console.error('Fehlerdetails:', emailError.stack);
      
      return res.status(500).json({ 
        error: 'E-Mail konnte nicht gesendet werden',
        details: emailError.message,
        name: emailError.name,
        code: emailError.code || 'unknown'
      });
    }
    
  } catch (error) {
    // Allgemeine Fehlerbehandlung
    console.error('Allgemeiner Fehler:', error);
    console.error('Fehlerdetails:', error.stack);
    
    return res.status(500).json({ 
      error: 'Serverfehler',
      message: 'Ein unerwarteter Fehler ist aufgetreten',
      details: error.message
    });
  } finally {
    console.log('===== KONTAKTFORMULAR API ENDE =====');
  }
}; 