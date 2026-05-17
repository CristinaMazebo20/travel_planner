<?php
require_once "../config/cors.php";
require_once "../config/database.php";
require_once "../utils/Response.php";

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// GET - Listar utilizadores
if ($method === 'GET') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($id) {
        $stmt = $db->prepare("SELECT id, nome, email, tipo, telefone, created_at FROM utilizadores WHERE id = :id");
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($usuario) {
            Response::success($usuario);
        } else {
            Response::notFound("Utilizador não encontrado");
        }
    } else {
        $stmt = $db->query("SELECT id, nome, email, tipo, telefone, created_at FROM utilizadores ORDER BY id");
        Response::success($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    exit();
}

// PUT - Atualizar utilizador (admin pode mudar tipo)
if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    $stmt = $db->prepare("UPDATE utilizadores SET tipo = :tipo WHERE id = :id");
    $stmt->bindParam(":tipo", $data->tipo);
    $stmt->bindParam(":id", $data->id);
    
    if ($stmt->execute()) {
        Response::success(null, "Utilizador atualizado");
    } else {
        Response::error("Erro ao atualizar");
    }
    exit();
}

// DELETE - Remover utilizador
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    // Verificar se é admin
    $checkStmt = $db->prepare("SELECT tipo FROM utilizadores WHERE id = :id");
    $checkStmt->bindParam(":id", $id);
    $checkStmt->execute();
    $usuario = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($usuario && $usuario['tipo'] === 'admin') {
        Response::error("Não é possível excluir um administrador", 403);
        exit();
    }
    
    $stmt = $db->prepare("DELETE FROM utilizadores WHERE id = :id");
    $stmt->bindParam(":id", $id);
    
    if ($stmt->execute()) {
        Response::success(null, "Utilizador removido");
    } else {
        Response::error("Erro ao remover");
    }
    exit();
}

Response::error("Método não permitido", 405);
?>