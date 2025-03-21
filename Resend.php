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

        header('Content-Type: application/json');
        echo json_encode(['status' => 'ok', 'response' => $res]);

    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}
?>
