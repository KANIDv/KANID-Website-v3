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

## Umgebungsvariablen

Die API benötigt folgende Umgebungsvariable, die in der IONOS Deploy Now Plattform konfiguriert werden muss:

- `RESEND_API_KEY`: Der API-Schlüssel für den Resend-Dienst

## Einrichtung in IONOS Deploy Now

1. Navigieren Sie zu den Einstellungen Ihres IONOS Deploy Now Projekts
2. Gehen Sie zum Bereich "Umgebungsvariablen"
3. Fügen Sie `RESEND_API_KEY` mit Ihrem tatsächlichen Resend API-Schlüssel hinzu
4. Speichern Sie die Einstellungen und starten Sie eine Neubereitstellung

## Lokale Entwicklung

Um die API lokal zu testen:

1. Erstellen Sie eine `.env` Datei basierend auf `.env.example`
2. Fügen Sie Ihren Resend API-Schlüssel in die `.env` Datei ein
3. Verwenden Sie ein Tool wie [ntl dev](https://www.netlify.com/products/dev/) oder einen ähnlichen Serverless-Entwicklungsserver 