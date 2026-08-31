<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Método no permitido. Usa POST']);
  exit;
}

$raw = file_get_contents('php://input');
$in = json_decode($raw ?: '', true);
if (!is_array($in)) {
  $in = $_POST;
}

$id = trim((string)($in['id'] ?? ''));
$estado = trim((string)($in['estado'] ?? ''));

if ($id === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Falta el id de la cita']);
  exit;
}

$allowed = ['Enviado', 'Confirmado', 'Cancelado'];
if (!in_array($estado, $allowed, true)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Estado inválido']);
  exit;
}

$dataFile = __DIR__ . '/../js/citas.json';

if (!file_exists($dataFile)) {
  http_response_code(404);
  echo json_encode(['ok' => false, 'error' => 'No existe citas.json']);
  exit;
}

$content = file_get_contents($dataFile);
$data = json_decode($content ?: '', true);

if (!is_array($data) || !isset($data['events']) || !is_array($data['events'])) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Formato inválido en citas.json']);
  exit;
}

$updated = false;

foreach ($data['events'] as &$event) {
  if (($event['id'] ?? '') !== $id) {
    continue;
  }

  $event['estado'] = $estado;
  $updated = true;
  break;
}
unset($event);

if (!$updated) {
  http_response_code(404);
  echo json_encode(['ok' => false, 'error' => 'No se encontró la cita']);
  exit;
}

$json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
if ($json === false) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'No se pudo serializar el JSON']);
  exit;
}

if (file_put_contents($dataFile, $json) === false) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'No se pudo guardar el cambio de estado']);
  exit;
}

echo json_encode(['ok' => true, 'estado' => $estado]);