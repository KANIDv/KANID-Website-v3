# KANID UG Website

Offizielle Website der KANID UG - Technische Beratung & Konstruktion aus Gerlingen bei Stuttgart.

## Technologie-Stack

- Reines HTML, CSS und JavaScript
- Kontaktformular mit Serverless API (Resend)
- IONOS Deploy Now für Hosting und API-Bereitstellung

## Projektstruktur

- `assets/` - Statische Dateien wie CSS, JS und Bilder
  - `css/` - Stylesheets
  - `js/` - JavaScript-Dateien
  - `img/` - Bilder und Icons
- `html/` - HTML-Dateien für die verschiedenen Seiten
- `api/` - Serverless-Funktionen für das Kontaktformular
- `.htaccess` - Apache-Konfiguration für URL-Rewrites und Caching
- `.ionos.yaml` - Konfigurationsdatei für IONOS Deploy Now

## Lokale Entwicklung

1. Klone das Repository
2. Erstelle eine `.env`-Datei basierend auf `.env.example`
3. Füge deinen Resend API-Schlüssel in die `.env`-Datei ein
4. Starte einen lokalen Webserver (z.B. mit `npx serve`)

## Deployment

Das Projekt wird automatisch über IONOS Deploy Now deployed, wenn Änderungen im Repository gepusht werden.

Die Konfiguration ist in der `.ionos.yaml`-Datei definiert.

### API-Konfiguration

Die API für das Kontaktformular basiert auf der Resend-API für E-Mail-Versand. Die Einrichtung erfordert einen API-Schlüssel, der in den GitHub-Secrets oder in der IONOS-Umgebung konfiguriert sein muss.

```yaml
apiRoutes:
  - path: /api
    directory: api
    handler: kontakt.js
    runtime: node
```

### URL-Struktur

Die Website verwendet folgende URL-Struktur:

- `/` oder `/home` - Startseite
- `/impressum` - Impressum 
- `/datenschutz` - Datenschutzerklärung
- `/agb` - Allgemeine Geschäftsbedingungen
- `/danke` - Danke-Seite nach Kontaktformularversand

Die Weiterleitung wird über die `.htaccess`-Datei konfiguriert.

## Kontaktformular

Das Kontaktformular sendet Daten an die API unter `/api/kontakt`, die die Resend-API verwendet, um:

1. Eine Bestätigungs-E-Mail an den Benutzer zu senden
2. Eine Benachrichtigungs-E-Mail an den Administrator zu senden

Der API-Schlüssel für Resend muss als Umgebungsvariable `RESEND_API_KEY` konfiguriert sein.

## Wartung

Um Änderungen vorzunehmen:

1. Bearbeite die entsprechenden Dateien
2. Teste lokal
3. Pushe die Änderungen zum GitHub-Repository
4. Die Änderungen werden automatisch auf IONOS Deploy Now bereitgestellt

## Kontakt

Bei Fragen wende dich an info@kanid.de