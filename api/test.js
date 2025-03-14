// Einfacher Test-API-Endpunkt
module.exports = async function(req, res) {
  console.log('Test-API aufgerufen');
  
  // CORS-Header setzen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  // OPTIONS-Anfragen für CORS Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Einfache Erfolgsantwort zurückgeben
  return res.status(200).json({
    success: true,
    message: 'API-Test erfolgreich',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'nicht definiert',
    nodeVersion: process.version
  });
}; 