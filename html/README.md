# KANID UG Website - Kontaktformular-Einrichtung

Diese Anleitung beschreibt, wie das SMTP-basierte Kontaktformular für die KANID UG Website eingerichtet wird.

## Voraussetzungen

- Webserver mit PHP-Unterstützung (PHP 7.4 oder höher empfohlen)
- Google Mail-Konto für den E-Mail-Versand
- SMTP-Ausgangsport 587 muss vom Server erlaubt sein

## Einrichtung

### 1. Konfiguration der SMTP-Einstellungen

Öffnen Sie die Datei `kontakt-formular.php` und aktualisieren Sie folgende SMTP-Einstellungen:

```php
$smtp_host = 'smtp.gmail.com';              // Sollte für Google Mail unverändert bleiben
$smtp_port = 587;                           // Standard-TLS-Port für Google Mail
$smtp_username = 'deine-email@gmail.com';   // Deine Gmail-Adresse
$smtp_password = 'dein-app-passwort';       // Dein App-Passwort (nicht dein reguläres Passwort!)
$smtp_from = 'deine-email@gmail.com';       // Absender-E-Mail (sollte mit $smtp_username übereinstimmen)
$smtp_name = 'KANID UG Kontaktformular';    // Absender-Name
$smtp_to = 'empfang@kanid.de';              // Empfänger-E-Mail
```

### 2. App-Passwort für Google Mail erstellen

Für die sichere Verwendung von Gmail als SMTP-Server benötigen Sie ein App-Passwort:

1. Besuchen Sie [Google Account Sicherheit](https://myaccount.google.com/security)
2. Stellen Sie sicher, dass die Zwei-Faktor-Authentifizierung aktiviert ist
3. Klicken Sie auf "App-Passwörter"
4. Wählen Sie "Anderes" als App-Typ und geben Sie z.B. "KANID Website" ein
5. Kopieren Sie das generierte Passwort und fügen Sie es als `$smtp_password` in die `kontakt-formular.php` ein

### 3. Testen des Kontaktformulars

Nach dem Hochladen der Dateien auf den Webserver können Sie das Kontaktformular testen:

1. Öffnen Sie die Website und navigieren Sie zum Kontaktformular
2. Füllen Sie alle Felder aus und senden Sie das Formular ab
3. Sie sollten auf die Danke-Seite weitergeleitet werden

### 4. Fehlerbehebung

Bei Problemen mit dem E-Mail-Versand:

1. Überprüfen Sie die Datei `kontakt_log.txt` im Webserver-Verzeichnis für Fehlerdetails
2. Stellen Sie sicher, dass die SMTP-Einstellungen korrekt sind
3. Überprüfen Sie, ob Ihr Webhoster den ausgehenden SMTP-Verkehr auf Port 587 erlaubt
4. Aktivieren Sie vorübergehend den Debug-Modus, indem Sie `$smtp->do_debug = 1;` in der Datei `kontakt-formular.php` setzen

## Dateistruktur

- `index.html` - Hauptseite mit dem Kontaktformular
- `kontakt-formular.php` - PHP-Skript zur Verarbeitung des Formulars
- `vendor/phpmailer.php` - Vereinfachte PHPMailer-Klasse
- `vendor/smtp.php` - SMTP-Klasse für den E-Mail-Versand
- `kontakt_log.txt` - Log-Datei für Debugging (wird automatisch erstellt)

## Sicherheitshinweise

- Halten Sie Ihr PHP und Ihre Bibliotheken stets aktuell
- Verwenden Sie immer ein App-Passwort für SMTP-Authentifizierung, niemals Ihr Haupt-Google-Passwort
- Achten Sie darauf, dass Ihre SMTP-Zugangsdaten nicht öffentlich zugänglich sind 