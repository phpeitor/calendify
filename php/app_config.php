<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/env.php';

echo json_encode([
  'RECAPTCHA_SITE_KEY' => $_ENV['RECAPTCHA_SITE_KEY'] ?? ''
]);
