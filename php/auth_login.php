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
$password = (string)($input['password'] ?? '');
$validUser = (string)getenv('USUARIO_LOGIN');
$validPass = (string)getenv('PASSWORD_LOGIN');

if ($validUser === '' || $validPass === '') {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Credenciales no configuradas']);
  exit;
}

if (!hash_equals($validUser, $usuario) || !hash_equals($validPass, $password)) {
  http_response_code(401);
  echo json_encode(['ok' => false, 'error' => 'Credenciales incorrectas']);
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
