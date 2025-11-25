<?php

require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['error' => 'Method not allowed'], 405);
}

$data = read_json_body();
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

$stmt = $pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = :email LIMIT 1');
$stmt->execute([':email' => $email]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    send_json(['error' => 'Invalid credentials'], 401);
}

send_json([
    'id' => (int) $admin['id'],
    'email' => $admin['email'],
]);

