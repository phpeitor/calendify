<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/env.php';

$sessionTtl = 60 * 60;
session_set_cookie_params([
  'lifetime' => $sessionTtl,
  'path' => '/',
  'httponly' => true,
  'samesite' => 'Lax'
]);
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Metodo no permitido. Usa POST']);
  exit;
}

$raw = file_get_contents('php://input');
$input = json_decode($raw ?: '', true);
if (!is_array($input)) {
  $input = $_POST;
}

$usuario = trim((string)($input['usuario'] ?? $input['username'] ?? ''));
$password = trim((string)($input['password'] ?? ''));
$recaptchaToken = (string)($input['recaptchaToken'] ?? '');
$validUser = (string)($_ENV['USUARIO_LOGIN'] ?? '');
$validPass = (string)($_ENV['PASSWORD_LOGIN'] ?? '');
$recaptchaSecret = (string)($_ENV['RECAPTCHA_SECRET'] ?? $_ENV['RECAPTCHA_SECRET_KEY'] ?? '');

if ($validUser === '' || $validPass === '') {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Credenciales no configuradas']);
  exit;
}

if ($recaptchaSecret !== '') {
  if ($recaptchaToken === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'No se pudo validar reCAPTCHA']);
    exit;
  }

  $context = stream_context_create([
    'http' => [
      'method' => 'POST',
      'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
      'content' => http_build_query([
        'secret' => $recaptchaSecret,
        'response' => $recaptchaToken,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
      ]),
      'timeout' => 10
    ]
  ]);
  $verification = file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context);
  $verificationData = json_decode($verification ?: '', true);

  if (!is_array($verificationData) || empty($verificationData['success'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'reCAPTCHA invalido ❌']);
    exit;
  }
}

if (!hash_equals($validUser, $usuario) || !hash_equals($validPass, $password)) {
  http_response_code(401);
  echo json_encode(['ok' => false, 'error' => 'Credenciales incorrectas ❗']);
  exit;
}

session_regenerate_id(true);
$_SESSION['calendify_auth'] = true;
$_SESSION['calendify_user'] = $usuario;
$_SESSION['calendify_expires_at'] = time() + $sessionTtl;

echo json_encode([
  'ok' => true,
  'expiresAt' => $_SESSION['calendify_expires_at']
]);
