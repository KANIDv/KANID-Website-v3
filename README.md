# KANID UG Website

Website und Kontaktformular der KANID UG. Diese Website verwendet PHP 8.3+ mit IONOS Hosting und Resend für die E-Mail-Funktionalität des Kontaktformulars.

## Funktionen

- Responsive Design für alle Geräte
- Moderne, benutzerfreundliche Benutzeroberfläche
- Kontaktformular mit E-Mail-Integration über Resend PHP
- PHP 8.3+ Backend mit IONOS Hosting
- Umfassender Spam-Schutz (Honeypot, Rate Limiting)

## Technischer Überblick

Die Website ist statisch mit HTML, CSS und JavaScript aufgebaut. Das Kontaktformular nutzt PHP 8.3+ mit der Resend PHP-Bibliothek für den E-Mail-Versand.

### Verzeichnisstruktur

- `*.html` - Statische HTML-Dateien der Website
- `assets/` - CSS, JavaScript und Bilder 
  - `css/` - Stylesheets
  - `js/` - JavaScript-Dateien
  - `img/` - Bilder und Grafiken
- `Resend.php` - PHP-Backend für das Kontaktformular
- `composer.json` - PHP-Abhängigkeiten

## Systemanforderungen

- **PHP**: 8.1+ (empfohlen: 8.3)
- **Composer**: 2.x
- **Webserver**: Apache mit mod_rewrite (IONOS kompatibel)

## Einrichtung des Kontaktformulars mit Resend und IONOS

### 1. Resend-Konto einrichten

Folgen Sie den Anweisungen in der Datei [RESEND-SETUP.md](RESEND-SETUP.md), um:
- Ein Resend-Konto zu erstellen
- Ihre Domain zu verifizieren
- Einen API-Schlüssel zu generieren

### 2. API-Schlüssel konfigurieren

Der API-Schlüssel wird über Umgebungsvariablen konfiguriert:

**Für IONOS Hosting:**
1. Loggen Sie sich in das IONOS Control Panel ein
2. Gehen Sie zu "Webhosting" → Ihr Paket → "Umgebungsvariablen"
3. Fügen Sie `RESEND_API_KEY` mit Ihrem API-Schlüssel hinzu

**Für lokale Entwicklung:**
1. Kopieren Sie `env.example` zu `.env`
2. Tragen Sie Ihren API-Schlüssel ein: `RESEND_API_KEY=re_ihr_schlüssel_hier`

### 3. Abhängigkeiten installieren

```bash
composer install --no-dev --prefer-dist --no-interaction
```

### 4. Deployment konfigurieren

Die Konfiguration für IONOS ist bereits in der `.htaccess` enthalten:
- PHP 8.1+ wird automatisch aktiviert
- Alle notwendigen Rewrite-Regeln sind konfiguriert
- Sicherheitseinstellungen sind aktiviert

### 5. Testen des Kontaktformulars

1. Navigieren Sie zur Live-Website
2. Füllen Sie das Kontaktformular aus und senden Sie es
3. Überprüfen Sie, ob Sie eine Bestätigungs-E-Mail erhalten und die Nachricht an die Admin-E-Mail zugestellt wird

## Lokale Entwicklung

Für die lokale Entwicklung:

1. Klonen Sie das Repository:
   ```bash
   git clone https://github.com/ihr-benutzername/kanid-website.git
   cd kanid-website
   ```

2. Installieren Sie die Abhängigkeiten:
   ```bash
   composer install
   ```

3. Konfigurieren Sie die Umgebungsvariablen:
   ```bash
   cp env.example .env
   # Bearbeiten Sie .env und tragen Sie Ihren API-Schlüssel ein
   ```

4. Verwenden Sie einen lokalen PHP-Server:
   ```bash
   php -S localhost:8000
   ```

## CI/CD Pipeline

Die Website verwendet GitHub Actions für automatisches Testing und Deployment:

- **PHP 8.3** wird für alle Tests verwendet
- **Composer-Abhängigkeiten** werden automatisch validiert
- **Sicherheitsprüfungen** werden durchgeführt
- **Automatisches Deployment** zu IONOS nach erfolgreichen Tests

## Sicherheitsfeatures

Das Kontaktformular enthält mehrere Sicherheitsmaßnahmen:

- **Honeypot-Feld**: Verstecktes Feld zur Spam-Erkennung
- **Rate Limiting**: Maximal 1 Anfrage alle 5 Sekunden
- **Eingabevalidierung**: Umfassende Validierung aller Felder
- **XSS-Schutz**: Alle Eingaben werden bereinigt
- **Umgebungsvariablen**: API-Schlüssel werden sicher gespeichert

## Fehlersuche

Wenn das Kontaktformular nicht funktioniert:

1. **Überprüfen Sie die PHP-Version**:
   ```bash
   php -v
   # Sollte 8.1+ sein
   ```

2. **Überprüfen Sie Composer**:
   ```bash
   composer install --no-dev --prefer-dist --no-interaction
   # Sollte ohne Fehler durchlaufen
   ```

3. **Überprüfen Sie die Resend-Einrichtung**:
   - Ist der API-Schlüssel korrekt gesetzt?
   - Ist die Domain verifiziert?

4. **Überprüfen Sie die IONOS-Einstellungen**:
   - Ist PHP 8.1+ aktiviert?
   - Sind alle Dateien korrekt hochgeladen?

5. **Überprüfen Sie die Logs**:
   - PHP-Fehlerlog
   - Browser-Konsole auf JavaScript-Fehler

## Wichtige Hinweise

- **Adresse**: Heinrich-Hertz-Str. 11, 70794 Filderstadt
- **Geschäftszeiten**: Mo-Fr 9:00-17:00 Uhr
- **API-Schlüssel**: Niemals im Code hardcoden, immer über Umgebungsvariablen
- **Sicherheit**: Alle personenbezogenen Daten werden nur für den E-Mail-Versand verwendet

Für weitere Informationen siehe die [Resend-Dokumentation](https://resend.com/docs) und die [IONOS-Hosting-Dokumentation](https://www.ionos.de/hilfe/).