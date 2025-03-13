# Resend E-Mail-Dienst Einrichtung

Dieser Leitfaden führt Sie durch die Einrichtung von [Resend](https://resend.com) für das KANID UG Kontaktformular.

## 1. Erstellen Sie ein Resend-Konto

1. Besuchen Sie [resend.com](https://resend.com) und melden Sie sich an
2. Bestätigen Sie Ihre E-Mail-Adresse

## 2. Domain verifizieren

1. Gehen Sie zu [resend.com/domains](https://resend.com/domains)
2. Wählen Sie "Add Domain"
3. Geben Sie Ihre Domain ein (z.B. kanid.de)
4. Folgen Sie den Anweisungen zur Verifizierung:
   - Fügen Sie die bereitgestellten DNS-Records zu Ihrer Domain-Konfiguration hinzu
   - Dies kann je nach DNS-Anbieter 24-48 Stunden dauern

## 3. API-Schlüssel erstellen

1. Gehen Sie zu [resend.com/api-keys](https://resend.com/api-keys)
2. Wählen Sie "Create API Key"
3. Geben Sie einen Namen für den Schlüssel ein (z.B. "KANID Kontaktformular")
4. Kopieren Sie den generierten API-Schlüssel und bewahren Sie ihn sicher auf

## 4. API-Schlüssel in Ihrer Umgebung einrichten

1. Erstellen Sie eine `.env`-Datei im Hauptverzeichnis Ihres Projekts
2. Fügen Sie die folgende Zeile hinzu:
   ```
   RESEND_API_KEY=re_123456789
   ```
   (Ersetzen Sie re_123456789 mit Ihrem tatsächlichen API-Schlüssel)

3. Wenn Sie eine Produktionsumgebung nutzen, fügen Sie die Umgebungsvariable dort hinzu:
   - Gehen Sie zu den Einstellungen Ihres Hosting-Dienstes
   - Fügen Sie die Umgebungsvariable RESEND_API_KEY mit Ihrem API-Schlüssel hinzu
   - Starten Sie Ihr Deployment neu

## 5. Testen der E-Mail-Funktion

1. Nachdem Sie das Projekt eingerichtet haben, können Sie die E-Mail-Funktionalität testen:
   - Füllen Sie das Kontaktformular aus und senden Sie es ab
   - Überprüfen Sie, ob die E-Mail empfangen wurde

## 6. Fehlersuche

Wenn keine E-Mails empfangen werden:

1. Überprüfen Sie die Serverlogs auf Fehler:
   - Überprüfen Sie die Logs Ihres Hosting-Dienstes
   - Suchen Sie nach Fehlermeldungen im Zusammenhang mit Resend

2. Häufige Probleme:
   - API-Schlüssel ist falsch oder nicht richtig eingerichtet
   - Domain ist nicht vollständig verifiziert
   - CORS-Probleme bei der API-Anfrage
   - Netzwerkfehler

3. Resend-Dashboard überprüfen:
   - Gehen Sie zu [resend.com/logs](https://resend.com/logs)
   - Überprüfen Sie, ob E-Mails versendet wurden und was deren Status ist

## 7. Weitere Ressourcen

- [Resend Dokumentation](https://resend.com/docs)
- [Resend API-Referenz](https://resend.com/docs/api-reference)
- [Resend SMTP-Einrichtung](https://resend.com/docs/send-with-smtp) 