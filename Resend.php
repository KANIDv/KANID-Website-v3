<?php
require 'vendor/autoload.php';
require __DIR__ . '/../secure-config/resend.php';
use Resend\Resend;

// Rate limiting und Spam-Schutz
session_start();

// Einfacher Honeypot-Schutz
if (!empty($_POST['website'])) {
    http_response_code(200);
    exit;
}

// Time-trap: Mindestzeit zwischen Anfragen (5 Sekunden)
if (isset($_SESSION['last_submission']) && (time() - $_SESSION['last_submission']) < 5) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Bitte warten Sie einen Moment, bevor Sie eine weitere Nachricht senden.']);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // API-Key aus sicherer Konfigurationsdatei außerhalb des Webroots
    $api_key = defined('RESEND_API_KEY') ? RESEND_API_KEY : null;
    if (!$api_key) {
        error_log('RESEND_API_KEY fehlt oder Konfigurationsdatei nicht gefunden.');
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'E-Mail-Service momentan nicht verfügbar.']);
        exit;
    }

    // Eingabevalidierung
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $subject = trim($_POST['subject'] ?? '');
    $message = trim($_POST['message'] ?? '');

    // Validierung
    $errors = [];
    
    if (empty($name) || strlen($name) < 2 || strlen($name) > 100) {
        $errors[] = 'Name muss zwischen 2 und 100 Zeichen lang sein.';
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    }
    
    if (empty($subject) || strlen($subject) < 3 || strlen($subject) > 200) {
        $errors[] = 'Betreff muss zwischen 3 und 200 Zeichen lang sein.';
    }
    
    if (empty($message) || strlen($message) < 10 || strlen($message) > 2000) {
        $errors[] = 'Nachricht muss zwischen 10 und 2000 Zeichen lang sein.';
    }

    if (!empty($errors)) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => implode(' ', $errors)]);
        exit;
    }

    // XSS-Schutz
    $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $subject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
    $message = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

    try {
        $resend = Resend::client($api_key);

        // E-Mail an KANID senden
        $res = $resend->emails->send([
            'from' => 'kontakt@kanid.de',
            'to' => ['info@kanid.de'],
            'subject' => "Neue Nachricht von der Website: $subject",
            'html' => "
                <h2>Neue Kontaktanfrage von der Website</h2>
                <p><strong>Name:</strong> $name</p>
                <p><strong>E-Mail:</strong> $email</p>
                <p><strong>Betreff:</strong> $subject</p>
                <p><strong>Nachricht:</strong></p>
                <div style='background: #f5f5f5; padding: 15px; border-left: 4px solid #1b6ba4; margin: 10px 0;'>
                    $message
                </div>
                <hr>
                <p><small>Gesendet am: " . date('d.m.Y H:i:s') . " Uhr</small></p>
            ",
        ]);

        // Bestätigungs-E-Mail an den Absender senden
        $confirmation_params = [
            'from' => 'KANID Kontaktformular <kontakt@kanid.de>',
            'to' => [$email],
            'subject' => 'Bestätigung Ihrer Kontaktanfrage bei KANID',
            'html' => "
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                    <h2 style='color: #1b6ba4;'>Vielen Dank für Ihre Nachricht!</h2>
                    <p>Hallo $name,</p>
                    <p>wir haben Ihre Anfrage bezüglich <strong>$subject</strong> erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>
                    
                    <div style='background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                        <h3 style='margin-top: 0; color: #495057;'>Ihre Nachricht:</h3>
                        <p style='margin-bottom: 0;'>$message</p>
                    </div>
                    
                    <p>Mit freundlichen Grüßen,<br>
                    <strong>Ihr KANID-Team</strong></p>
                    
                    <hr style='border: none; border-top: 1px solid #dee2e6; margin: 20px 0;'>
                    <p style='font-size: 12px; color: #6c757d;'>
                        KANID UG (haftungsbeschränkt)<br>
                        Heinrich-Hertz-Str. 11<br>
                        70794 Filderstadt<br>
                        Deutschland
                    </p>
                </div>
            "
        ];
        
        $resend->emails->send($confirmation_params);

        // Erfolg: Zeitstempel setzen
        $_SESSION['last_submission'] = time();

        // Logging (nur technische Details, keine personenbezogenen Daten)
        error_log("Kontaktformular erfolgreich gesendet - Betreff: $subject, Zeit: " . date('Y-m-d H:i:s'));

        header('Content-Type: application/json');
        echo json_encode(['status' => 'ok', 'message' => 'Nachricht erfolgreich gesendet']);

    } catch (Exception $e) {
        // Logging des Fehlers (ohne personenbezogene Daten)
        error_log("Kontaktformular Fehler: " . $e->getMessage() . " - Zeit: " . date('Y-m-d H:i:s'));
        
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Beim Senden der Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.']);
    }
} else {
    // Nur POST-Requests erlauben
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Nur POST-Requests sind erlaubt.']);
}
?>
