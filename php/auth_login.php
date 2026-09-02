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

function verifyRecaptchaToken(string $secret, string $token): array
{
  $payload = http_build_query([
    'secret' => $secret,
    'response' => $token,
    'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
  ]);

  if (function_exists('curl_init')) {
    $ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
    curl_setopt_array($ch, [
      CURLOPT_POST => true,
      CURLOPT_POSTFIELDS => $payload,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_TIMEOUT => 15,
      CURLOPT_SSL_VERIFYPEER => true,
      CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded']
    ]);

    $body = curl_exec($ch);
    $curlError = curl_error($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($body !== false && $httpCode >= 200 && $httpCode < 300) {
      $data = json_decode($body, true);
      return is_array($data) ? $data : ['success' => false, 'error-codes' => ['invalid-json-response']];
    }

    return [
      'success' => false,
      'error-codes' => ['server-verification-request-failed'],
      'server-error' => $curlError ?: "HTTP {$httpCode}"
    ];
  }

  $context = stream_context_create([
    'http' => [
      'method' => 'POST',
      'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
      'content' => $payload,
      'timeout' => 15
    ]
  ]);
  $body = @file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context);

  if ($body === false) {
    $lastError = error_get_last();
    return [
      'success' => false,
      'error-codes' => ['server-verification-request-failed'],
      'server-error' => $lastError['message'] ?? null
    ];
  }

  $data = json_decode($body, true);
  return is_array($data) ? $data : ['success' => false, 'error-codes' => ['invalid-json-response']];
}

if ($recaptchaSecret !== '') {
  if ($recaptchaToken === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'No se pudo validar reCAPTCHA']);
    exit;
  }

  $verificationData = verifyRecaptchaToken($recaptchaSecret, $recaptchaToken);

  if (!is_array($verificationData) || empty($verificationData['success'])) {
    $codes = [];
    if (is_array($verificationData) && isset($verificationData['error-codes']) && is_array($verificationData['error-codes'])) {
      $codes = $verificationData['error-codes'];
    }

    http_response_code(400);
    echo json_encode([
      'ok' => false,
      'error' => 'reCAPTCHA invalido',
      'recaptchaErrors' => $codes,
      'detail' => is_array($verificationData) ? ($verificationData['server-error'] ?? null) : null,
      'recaptchaHostname' => is_array($verificationData) ? ($verificationData['hostname'] ?? null) : null,
      'recaptchaAction' => is_array($verificationData) ? ($verificationData['action'] ?? null) : null
    ]);
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
