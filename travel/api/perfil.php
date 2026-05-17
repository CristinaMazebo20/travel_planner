<?php
require_once "../config/cors.php";
require_once "../config/database.php";
require_once "../utils/Response.php";

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Obter token do usuário (simplificado - na prática usar JWT)
$headers = getallheaders();
$token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

// Por enquanto, usar um ID fixo ou buscar do token
// Para teste, vamos assumir que o ID vem do header ou query
$utilizador_id = isset($_GET['user_id']) ? $_GET['user_id'] : 1;

// GET - Buscar perfil
if ($method === 'GET') {
    $stmt = $db->prepare("SELECT id, nome, email, telefone, created_at FROM utilizadores WHERE id = :id");
    $stmt->bindParam(":id", $utilizador_id);
    $stmt->execute();
    $perfil = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($perfil) {
        Response::success($perfil);
    } else {
        Response::notFound("Perfil não encontrado");
    }
    exit();
}

// PUT - Atualizar perfil
if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    $stmt = $db->prepare("UPDATE utilizadores SET nome = :nome, telefone = :telefone WHERE id = :id");
    $stmt->bindParam(":nome", $data->nome);
    $stmt->bindParam(":telefone", $data->telefone);
    $stmt->bindParam(":id", $utilizador_id);
    
    if ($stmt->execute()) {
        Response::success(null, "Perfil atualizado com sucesso");
    } else {
        Response::error("Erro ao atualizar perfil");
    }
    exit();
}

Response::error("Método não permitido", 405);
?>