<?php
require_once "../config/cors.php";
require_once "../config/database.php";
require_once "../utils/Response.php";

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// GET - Listar viagens
if ($method === 'GET') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $utilizador_id = isset($_GET['utilizador_id']) ? $_GET['utilizador_id'] : null;
    
    if ($id) {
        $stmt = $db->prepare("SELECT v.*, d.nome as destino_nome, d.pais, d.imagem as destino_imagem 
                              FROM viagens v 
                              JOIN destinos d ON v.destino_id = d.id 
                              WHERE v.id = :id");
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        $viagem = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($viagem) {
            Response::success($viagem);
        } else {
            Response::notFound("Viagem não encontrada");
        }
    } else {
        $sql = "SELECT v.*, d.nome as destino_nome, d.pais, d.imagem as destino_imagem 
                FROM viagens v 
                JOIN destinos d ON v.destino_id = d.id";
        
        if ($utilizador_id) {
            $sql .= " WHERE v.utilizador_id = :utilizador_id";
        }
        $sql .= " ORDER BY v.id DESC";
        
        $stmt = $db->prepare($sql);
        if ($utilizador_id) {
            $stmt->bindParam(":utilizador_id", $utilizador_id);
        }
        $stmt->execute();
        $viagens = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Garantir que retorna array mesmo que vazio
        Response::success($viagens);
    }
    exit();
}

// POST - Criar viagem
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    $utilizador_id = $data->utilizador_id ?? 0;
    $destino_id = $data->destino_id ?? 0;
    $titulo = $data->titulo ?? '';
    $data_inicio = $data->data_inicio ?? '';
    $data_fim = $data->data_fim ?? '';
    $orcamento = $data->orcamento ?? 0;
    $status = $data->status ?? 'planejando';
    $forma_pagamento = $data->forma_pagamento ?? '';
    $valor_pago = $data->valor_pago ?? 0;
    $parcelas = $data->parcelas ?? 1;
    
    $stmt = $db->prepare("INSERT INTO viagens (utilizador_id, destino_id, titulo, data_inicio, data_fim, orcamento, status, forma_pagamento, valor_pago, parcelas) 
                          VALUES (:user_id, :destino_id, :titulo, :data_inicio, :data_fim, :orcamento, :status, :forma_pagamento, :valor_pago, :parcelas)");
    $stmt->bindParam(":user_id", $utilizador_id);
    $stmt->bindParam(":destino_id", $destino_id);
    $stmt->bindParam(":titulo", $titulo);
    $stmt->bindParam(":data_inicio", $data_inicio);
    $stmt->bindParam(":data_fim", $data_fim);
    $stmt->bindParam(":orcamento", $orcamento);
    $stmt->bindParam(":status", $status);
    $stmt->bindParam(":forma_pagamento", $forma_pagamento);
    $stmt->bindParam(":valor_pago", $valor_pago);
    $stmt->bindParam(":parcelas", $parcelas);
    
    if ($stmt->execute()) {
        $viagem_id = $db->lastInsertId();
        Response::success(['id' => $viagem_id], "Viagem criada com sucesso");
    } else {
        Response::error("Erro ao criar viagem");
    }
    exit();
}

// Outros métodos...
?>