# KANID UG Website

Website und Kontaktformular der KANID UG. Diese Website verwendet IONOS Deploy Now für das Hosting und Resend für die E-Mail-Funktionalität des Kontaktformulars.

## Funktionen

- Responsive Design für alle Geräte
- Moderne, benutzerfreundliche Benutzeroberfläche
- Kontaktformular mit E-Mail-Integration über Resend
- Serverless API mit IONOS Deploy Now

## Technischer Überblick

Die Website ist statisch mit HTML, CSS und JavaScript aufgebaut. Das Kontaktformular nutzt eine Serverless-Funktion, die mit IONOS Deploy Now bereitgestellt wird und E-Mails über den Resend-Dienst versendet.

### Verzeichnisstruktur

- `html/` - Statische HTML-Dateien der Website
- `css/` - Stylesheets
- `js/` - JavaScript-Dateien
- `img/` - Bilder und Grafiken
- `api/` - Serverless-Funktionen für das Kontaktformular
- `public/` - Statische Assets für die API-Dokumentation

## Einrichtung des Kontaktformulars mit Resend und IONOS Deploy Now

Um das Kontaktformular mit Resend und IONOS Deploy Now einzurichten, folgen Sie diesen Schritten:

### 1. Resend-Konto einrichten

Folgen Sie den Anweisungen in der Datei [RESEND-SETUP.md](RESEND-SETUP.md), um:
- Ein Resend-Konto zu erstellen
- Ihre Domain zu verifizieren
- Einen API-Schlüssel zu generieren

### 2. IONOS Deploy Now Konfiguration

1. Melden Sie sich bei Ihrem IONOS Deploy Now-Konto an
2. Erstellen Sie ein neues Projekt und verbinden Sie es mit Ihrem Git-Repository
3. Navigieren Sie zu den Projekteinstellungen
4. Fügen Sie im Bereich "Umgebungsvariablen" die folgende Variable hinzu:
   - Name: `RESEND_API_KEY`
   - Wert: `Ihr_Resend_API_Schlüssel`
   
### 3. Deployment konfigurieren

Die Konfiguration für IONOS Deploy Now ist bereits in der `.ionos.yaml`-Datei enthalten:

```yaml
distFolder: .
deploy:
  buildCmd: npm ci
  fromDist: true

apiRoutes:
  - path: /api
    directory: api
    handler: kontakt.js
    runtime: node
```

### 4. Deployment starten

1. Pushen Sie Ihre Änderungen in das verbundene Git-Repository
2. IONOS Deploy Now erkennt die Änderungen und startet automatisch ein neues Deployment
3. Die API-Route `/api/kontakt` wird automatisch konfiguriert

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
   npm install
   ```

3. Erstellen Sie eine `.env`-Datei basierend auf `.env.example` für lokale Tests
4. Verwenden Sie einen lokalen Server zum Testen der statischen Dateien

## Fehlersuche

Wenn das Kontaktformular nicht funktioniert:

1. Überprüfen Sie die Einrichtung von Resend:
   - Ist der API-Schlüssel korrekt?
   - Ist die Domain verifiziert?

2. Überprüfen Sie die IONOS Deploy Now-Einstellungen:
   - Ist die Umgebungsvariable korrekt konfiguriert?
   - Wurden die API-Routen korrekt bereitgestellt?

3. Überprüfen Sie die Browser-Konsole auf JavaScript-Fehler

Für weitere Informationen siehe die [Resend-Dokumentation](https://resend.com/docs) und die [IONOS Deploy Now-Dokumentation](https://docs.ionos.space/). 