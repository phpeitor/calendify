<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

session_start();

$expiresAt = (int)($_SESSION['calendify_expires_at'] ?? 0);
$authenticated = !empty($_SESSION['calendify_auth']) && $expiresAt > time();

if (!$authenticated) {
  $_SESSION = [];
  if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
  }
  session_destroy();
}

echo json_encode([
  'ok' => true,
  'authenticated' => $authenticated,
  'expiresAt' => $authenticated ? $expiresAt : null,
  'user' => $authenticated ? ($_SESSION['calendify_user'] ?? '') : null
]);
