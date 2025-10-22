<?php
declare(strict_types=1);

date_default_timezone_set('America/Lima');

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Método no permitido. Usa POST']);
  exit;
}

$DATA_PATH = __DIR__ . '/../js/citas.json';

function getv(array $arr, string $k, string $def=''): string {
  return isset($arr[$k]) ? trim((string)$arr[$k]) : $def;
}

function isoTrim(string $s): string {
  if ($s === '') return $s;
  $s = str_replace(' ', 'T', $s);
  $s = rtrim($s, 'Z');
  if (strlen($s) >= 16) return substr($s, 0, 16);
  return $s;
}

function toEpoch(string $iso): int {
  return strtotime($iso . ':00'); 
}

function overlaps(string $aStart, string $aEnd, string $bStart, string $bEnd): bool {
  $as = toEpoch($aStart); $ae = toEpoch($aEnd);
  $bs = toEpoch($bStart); $be = toEpoch($bEnd);
  if ($as === false || $ae === false || $bs === false || $be === false) return false;
  return max($as, $bs) < min($ae, $be);
}

$raw = file_get_contents('php://input');
$in = json_decode($raw ?? '', true);
if (!is_array($in)) $in = $_POST;

$profesional = getv($in, 'profesional');
$nombre      = getv($in, 'nombre');
$correo      = getv($in, 'correo');
$dni         = getv($in, 'dni');
$fecha_nac   = getv($in, 'fecha_nac');
$telefono    = getv($in, 'telefono');
$direccion   = getv($in, 'direccion');
$comentario  = getv($in, 'comentario');
$fecha_cita  = getv($in, 'fecha_cita');
$startIso = isoTrim(getv($in, 'start'));
$endIso   = isoTrim(getv($in, 'end'));
$horario  = getv($in, 'horario');
if ((!$startIso || !$endIso) && $horario) {
  $parts = explode('|', $horario);
  if (count($parts) === 2) {
    $startIso = isoTrim($parts[0]);
    $endIso   = isoTrim($parts[1]);
  }
}

$errors = [];
if ($profesional === '') $errors[] = 'profesional requerido';
if ($nombre === '')      $errors[] = 'nombre requerido';
if ($fecha_cita === '')  $errors[] = 'fecha_cita requerida';
if ($startIso === '' || $endIso === '') $errors[] = 'horario (start/end) requerido';
if ($startIso && $endIso && toEpoch($endIso) <= toEpoch($startIso)) $errors[] = 'end debe ser mayor a start';

if ($errors) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => implode('; ', $errors)]);
  exit;
}

$dir = dirname($DATA_PATH);
if (!is_dir($dir)) { @mkdir($dir, 0775, true); }
if (!file_exists($DATA_PATH)) {
  file_put_contents($DATA_PATH, json_encode(['events' => []], JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));
}

$fp = fopen($DATA_PATH, 'c+');
if (!$fp) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'No se pudo abrir citas.json']);
  exit;
}
flock($fp, LOCK_EX);
rewind($fp);
$curr = stream_get_contents($fp);
$data = json_decode($curr ?: '', true);
if (!is_array($data) || !isset($data['events']) || !is_array($data['events'])) {
  $data = ['events' => []];
}


$startHHMM = substr($startIso, 11, 5); 

foreach ($data['events'] as $ev) {
  if (($ev['profesional'] ?? '') !== $profesional) continue;
  if (($ev['fecha_cita'] ?? '') !== $fecha_cita)   continue;

  $evStart = (string)($ev['start'] ?? '');
  if ($evStart === '') continue;

  if (strpos($evStart, 'T') !== false || strlen($evStart) > 5) {
    $evStartHHMM = substr($evStart, 11, 5);
  } else {
    $evStartHHMM = substr($evStart, 0, 5);
  }

  if ($evStartHHMM === $startHHMM) {
    flock($fp, LOCK_UN);
    fclose($fp);
    http_response_code(409);
    echo json_encode(['ok' => false, 'error' => 'Ya existe una cita para este profesional a la misma hora']);
    exit;
  }
}

$startHHMM = substr($startIso, 11, 5); 
$endHHMM   = substr($endIso,   11, 5); 

$now = new DateTime('now', new DateTimeZone('America/Lima'));
$createdAt = $now->format('Y-m-d H:i:s');

$cita = [
  'id'          => uniqid('cita_', true),
  'profesional' => $profesional,
  'nombre'      => $nombre,
  'correo'      => $correo,
  'dni'         => $dni,
  'fecha_nac'   => $fecha_nac,
  'telefono'    => $telefono,
  'direccion'   => $direccion,
  'comentario'  => $comentario,
  'fecha_cita'  => $fecha_cita, 
  'start'       => $startHHMM, 
  'end'         => $endHHMM,    
  'createdAt'   => $createdAt
];

$data['events'][] = $cita;

rewind($fp);
ftruncate($fp, 0);
fwrite($fp, json_encode($data, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

echo json_encode(['ok' => true]);