// API-Handler für das KANID Kontaktformular
// Verarbeitet eingehende Anfragen und sendet E-Mails via Resend API

const { Resend } = require('resend');

// API-Schlüssel
const RESEND_API_KEY = "re_NMeH8GZr_7gfjjfTyn35JbgsuMs1LKrQQ";

// Handler-Funktion für HTTP-Anfragen
module.exports = async function(req, res) {
  try {
    // Debug-Information speichern
    console.log('===== KONTAKTFORMULAR API START =====');
    console.log('Request-Methode:', req.method);
    
    // CORS-Header für alle Anfragen setzen
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    
    // Für OPTIONS-Anfragen (CORS preflight) sofort antworten und beenden
    if (req.method === 'OPTIONS') {
      res.setHeader('Content-Type', 'text/plain');
      res.status(200).end();
      return;
    }
    
    // Content-Type für alle anderen Antworten setzen
    res.setHeader('Content-Type', 'application/json');

    // Test-Endpoint für einfache Überprüfung
    if (req.url === '/api/kontakt/test') {
      return res.status(200).json({ message: 'API funktioniert!' });
    }

    // Nur POST-Anfragen erlauben
    if (req.method !== 'POST') {
      console.log('Methode nicht erlaubt:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('POST-Anfrage empfangen');
    console.log('Body-Typ:', typeof req.body);
    
    // Validierung des Request-Body
    if (!req.body) {
      console.log('Leerer Request-Body');
      return res.status(400).json({ error: 'Leerer Request-Body' });
    }
    
    // Formulardaten extrahieren
    let name, email, subject, message;
    
    try {
      // Body-Parsing-Logik
      if (typeof req.body === 'string') {
        console.log('Versuche JSON zu parsen...');
        try {
          const parsedBody = JSON.parse(req.body);
          name = parsedBody.name;
          email = parsedBody.email;
          subject = parsedBody.subject || 'Kontaktanfrage';
          message = parsedBody.message;
        } catch (jsonError) {
          console.error('JSON-Parsing-Fehler:', jsonError);
          return res.status(400).json({ 
            error: 'Ungültiges JSON Format', 
            details: jsonError.message 
          });
        }
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
      return res.status(400).json({ 
        error: 'Ungültiges Format', 
        details: parseError.message 
      });
    }
    
    // Validierung
    if (!name || !email || !message) {
      console.log('Validierungsfehler: Fehlende Felder');
      return res.status(400).json({ 
        error: 'Fehlende Pflichtfelder', 
        missing: { name: !name, email: !email, message: !message } 
      });
    }
    
    // E-Mail senden mit Resend
    try {
      console.log('Initialisiere Resend mit API-Key');
      const resend = new Resend(RESEND_API_KEY);

      console.log('Sende E-Mails...');
      
      // 1. E-Mail an info@kanid.de
      const emailToAdmin = {
        from: 'KANID Kontaktformular <kontakt@kanid.de>',
        to: ['info@kanid.de'],
        subject: `Kontaktanfrage: ${subject}`,
        html: `<p><b>Name:</b> ${name}</p><p><b>E-Mail:</b> ${email}</p><p><b>Nachricht:</b> ${message}</p>`
      };
      
      // 2. Bestätigungs-E-Mail an den Absender
      const emailToSender = {
        from: 'KANID Kontaktformular <kontakt@kanid.de>',
        to: [email],
        subject: 'Bestätigung Ihrer Kontaktanfrage',
        html: `
          <p>Hallo ${name},</p>
          <p>vielen Dank für Ihre Nachricht an KANID. Wir haben Ihre Anfrage erhalten und werden uns in Kürze mit Ihnen in Verbindung setzen.</p>
          <p><b>Betreff:</b> ${subject}</p>
          <p><b>Ihre Nachricht:</b></p>
          <p>${message}</p>
          <p>Mit freundlichen Grüßen,</p>
          <p>Ihr KANID-Team</p>
        `
      };
      
      // Beide E-Mails senden (verwende Promise.all für parallele Anfragen)
      const [adminEmailResult, senderEmailResult] = await Promise.all([
        resend.emails.send(emailToAdmin),
        resend.emails.send(emailToSender)
      ]);
      
      console.log('E-Mails erfolgreich gesendet');
      
      // Erfolgreiche Antwort zurückgeben
      return res.status(200).json({ 
        success: true, 
        message: 'Nachrichten gesendet',
        adminEmailId: adminEmailResult.id,
        senderEmailId: senderEmailResult.id
      });
    } catch (emailError) {
      console.error('Fehler beim E-Mail-Versand:', emailError);
      
      // Spezifischere Fehlermeldung für Benutzer
      return res.status(500).json({ 
        error: 'E-Mail konnte nicht gesendet werden',
        message: 'Bei der Verarbeitung Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt unter info@kanid.de.'
      });
    }
  } catch (error) {
    // Allgemeine Fehlerbehandlung
    console.error('Allgemeiner Fehler:', error);
    
    return res.status(500).json({ 
      error: 'Serverfehler',
      message: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
    });
  } finally {
    console.log('===== KONTAKTFORMULAR API ENDE =====');
  }
}; 