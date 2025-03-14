// Minimaler API-Test ohne externe Abhängigkeiten
module.exports = async function(req, res) {
  // CORS-Header
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  // Für OPTIONS-Anfragen
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Einfache Antwort
  return res.status(200).json({
    success: true,
    message: 'Minimaler API-Endpunkt funktioniert',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version
  });
}; 