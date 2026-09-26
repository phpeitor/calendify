<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('X-Content-Type-Options: nosniff');

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Metodo no permitido. Usa GET']);
  exit;
}

$allowed = ['citas', 'programacion'];
$file = strtolower(trim((string)($_GET['file'] ?? '')));

if (!in_array($file, $allowed, true)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Archivo no permitido']);
  exit;
}

$path = __DIR__ . '/../data/' . $file . '.json';

if (!is_file($path)) {
  http_response_code(404);
  echo json_encode(['ok' => false, 'error' => 'No existe el recurso solicitado']);
  exit;
}

$content = file_get_contents($path);
$data = json_decode($content ?: '', true);

if (!is_array($data)) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Formato invalido del recurso']);
  exit;
}

$expiresAt = (int)($_SESSION['calendify_expires_at'] ?? 0);
$authenticated = !empty($_SESSION['calendify_auth']) && $expiresAt > time();

if ($file === 'citas' && !$authenticated) {
  $events = isset($data['events']) && is_array($data['events']) ? $data['events'] : [];
  $publicFields = ['profesional', 'fecha_cita', 'start', 'end', 'estado'];

  $data = [
    'events' => array_map(static function (array $event) use ($publicFields): array {
      $safe = [];
      foreach ($publicFields as $field) {
        if (array_key_exists($field, $event)) {
          $safe[$field] = $event[$field];
        }
      }
      return $safe;
    }, array_values(array_filter($events, 'is_array')))
  ];
}

echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
