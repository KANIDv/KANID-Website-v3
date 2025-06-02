<?php
require 'vendor/autoload.php';
use Resend\Resend;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $api_key = "re_NMeH8GZr_7gfjjfTyn35JbgsuMs1LKrQQ";

    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = nl2br(htmlspecialchars($_POST['message']));

    try {
        $resend = Resend::client($api_key);

        $res = $resend->emails->send([
            'from' => 'kontakt@kanid.de',
            'to' => ['info@kanid.de'],
            'subject' => "Neue Nachricht von der Website: $subject",
            'html' => "
                <p><strong>Name:</strong> $name</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Nachricht:</strong><br>$message</p>
            ",
        ]);

        // Send confirmation email to the sender
        $params_to_sender = [
            'from' => 'KANID Kontaktformular <kontakt@kanid.de>',
            'to' => [$email], // User's email
            'subject' => 'Bestätigung Ihrer Kontaktanfrage bei KANID',
            'html' => "<p>Hallo " . htmlspecialchars($name) . ",</p>" .
                      "<p>vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage bezüglich '" . htmlspecialchars($subject) . "' erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>" .
                      "<p>Zur Erinnerung, Ihre Nachricht war:</p>" .
                      "<p>" . nl2br(htmlspecialchars($message)) . "</p>" . // Ensure message is displayed correctly
                      "<p>Mit freundlichen Grüßen,</p>" .
                      "<p>Ihr KANID-Team</p>"
        ];
        $resend->emails->send($params_to_sender); // Send the confirmation email

        header('Content-Type: application/json');
        echo json_encode(['status' => 'ok', 'response' => $res]); // $res here is from the first email, consider if this is an issue. For now, it's as per original logic.

    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}
?>
