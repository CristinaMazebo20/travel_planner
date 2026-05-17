<?php
echo json_encode([
    'api' => 'Travel Planner API',
    'version' => '1.0.0',
    'endpoints' => [
        'auth' => '/api/auth.php',
        'destinos' => '/api/destinos.php',
        'viagens' => '/api/viagens.php',
        'atividades' => '/api/atividades.php',
        'favoritos' => '/api/favoritos.php',
        'clima' => '/api/clima.php'
    ],
    'status' => 'online'
]);
?>