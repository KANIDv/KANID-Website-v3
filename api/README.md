# KANID UG Kontaktformular API

Dieses Verzeichnis enthält die Serverless-Funktion für das Kontaktformular der KANID UG Website.

## Übersicht

Die API verwendet [Resend](https://resend.com), um E-Mails zu senden, wenn Besucher das Kontaktformular auf der Website ausfüllen. Die Implementierung ist als Serverless-Funktion gestaltet, die mit IONOS Deploy Now kompatibel ist.

## Technische Details

### API-Endpunkt

- **URL:** `/api/kontakt`
- **Methode:** POST
- **CORS:** Aktiviert für alle Ursprünge

### Anforderungsformat

```json
{
  "name": "Beispiel Name",
  "email": "beispiel@email.de",
  "subject": "Betreffzeile",
  "message": "Beispielnachricht mit Zeilenumbrüchen\nund weiterer Text."
}
```

### Antwortvarianten

#### Erfolg (200 OK)

```json
{
  "message": "Nachricht erfolgreich gesendet",
  "adminEmailId": "email-id-1234",
  "userEmailId": "email-id-5678"
}
```

#### Fehler (400, 405, 500)

```json
{
  "message": "Fehlermeldung, die erklärt, was passiert ist"
}
```

## E-Mail-Konfiguration

Die API sendet zwei E-Mails:

1. Eine Benachrichtigung an den KANID UG Administrator mit Details der Anfrage
2. Eine Bestätigungs-E-Mail an den Besucher, der das Formular ausgefüllt hat

## API-Schlüssel Konfiguration

Die API verwendet einen Resend API-Schlüssel, der direkt im Code konfiguriert ist:

```javascript
// In der Datei api/kontakt.js
const RESEND_API_KEY = "re_123456YourActualKeyHere";  // WICHTIG: Ersetzen Sie dies mit Ihrem echten API-Key
```

Um den API-Schlüssel zu ändern, bearbeiten Sie die Datei `api/kontakt.js` und aktualisieren Sie den Wert entsprechend.

## Einrichtung in IONOS Deploy Now

1. Stellen Sie sicher, dass die Node.js-Version in der `.ionos.yaml` auf mindestens 18 eingestellt ist:
   ```yaml
   apiRoutes:
     - path: /api/kontakt
       directory: api
       handler: kontakt.js
       runtime: node:18
   ```

2. Folgen Sie der Anleitung in der RESEND-SETUP.md-Datei, um den API-Schlüssel zu erstellen und im Code zu konfigurieren.

## Lokale Entwicklung

Um die API lokal zu testen:

1. Stellen Sie sicher, dass der API-Schlüssel in der Datei `api/kontakt.js` korrekt eingetragen ist
2. Führen Sie einen lokalen Entwicklungsserver aus, der Serverless-Funktionen unterstützt