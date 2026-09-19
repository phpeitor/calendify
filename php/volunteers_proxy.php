<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/env.php';

$apiKey = (string)($_ENV['VOLUNTEERS_API_KEY'] ?? '');
$apiUrl = (string)($_ENV['VOLUNTEERS_API_URL'] ?? 'http://127.0.0.1/wiesse-law/.redesign/api/volunteers.php');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Metodo no permitido. Usa GET']);
  exit;
}

if ($apiKey === '') {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'VOLUNTEERS_API_KEY no configurado']);
  exit;
}

$since = trim((string)($_GET['since'] ?? ''));
$until = trim((string)($_GET['until'] ?? ''));
$limit = (int)($_GET['limit'] ?? 100);

if ($since === '' || $until === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Los parametros since y until son requeridos']);
  exit;
}

if (!preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/', $since) ||
    !preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/', $until)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Formato de fecha invalido. Usa ISO 8601']);
  exit;
}

$limit = max(1, min($limit, 500));
$url = $apiUrl . '?' . http_build_query([
  'since' => $since,
  'until' => $until,
  'limit' => $limit
]);

$body = false;
$httpCode = 0;
$requestError = null;

if (function_exists('curl_init')) {
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_HTTPHEADER => ['X-API-Key: ' . $apiKey]
  ]);
  $body = curl_exec($ch);
  $requestError = curl_error($ch) ?: null;
  $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
} else {
  $context = stream_context_create([
    'http' => [
      'method' => 'GET',
      'header' => "X-API-Key: {$apiKey}\r\n",
      'timeout' => 20
    ]
  ]);
  $body = @file_get_contents($url, false, $context);
  $requestError = $body === false ? (error_get_last()['message'] ?? 'No se pudo conectar al endpoint') : null;
  if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $match)) {
    $httpCode = (int)$match[1];
  }
}

if ($body === false || $body === '') {
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'No se pudo consultar volunteers.php', 'detail' => $requestError]);
  exit;
}

$decoded = json_decode((string)$body, true);
if ($decoded === null && json_last_error() !== JSON_ERROR_NONE) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'Respuesta invalida del endpoint de voluntarios']);
  exit;
}

http_response_code($httpCode >= 400 ? 502 : 200);
echo json_encode([
  'ok' => $httpCode < 400,
  'status' => $httpCode,
  'data' => $decoded
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
