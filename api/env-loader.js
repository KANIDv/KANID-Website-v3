// Umgebungsvariablenloader für die API-Routen
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Funktion zum Laden der Umgebungsvariablen
function loadEnv() {
  try {
    // Pfad zur .env-Datei
    const envPath = path.resolve(process.cwd(), '.env');
    
    // Prüfen, ob die Datei existiert
    if (fs.existsSync(envPath)) {
      console.log('Lade Umgebungsvariablen aus .env-Datei');
      const result = dotenv.config({ path: envPath });
      
      if (result.error) {
        console.error('Fehler beim Laden der .env-Datei:', result.error);
      } else {
        console.log('Umgebungsvariablen erfolgreich geladen');
      }
    } else {
      console.log('.env-Datei nicht gefunden, verwende Systemumgebungsvariablen');
    }
    
    // Debug-Ausgabe der geladenen Umgebungsvariablen (ohne sensible Daten anzuzeigen)
    const envKeys = Object.keys(process.env).filter(key => 
      !key.includes('SECRET') && !key.includes('KEY') && !key.includes('TOKEN')
    );
    console.log(`Verfügbare Umgebungsvariablen: ${envKeys.join(', ')}`);
    console.log(`RESEND_API_KEY ist ${process.env.RESEND_API_KEY ? 'vorhanden' : 'nicht vorhanden'}`);
    
  } catch (error) {
    console.error('Fehler beim Initialisieren der Umgebungsvariablen:', error);
  }
}

// Umgebungsvariablen beim Import dieses Moduls laden
loadEnv();

module.exports = { loadEnv };