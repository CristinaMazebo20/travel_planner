<?php
require_once "../config/cors.php";
require_once "../config/database.php";
require_once "../utils/Response.php";

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// GET - Listar destinos
if ($method === 'GET') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $pais = isset($_GET['pais']) ? $_GET['pais'] : null;
    
    if ($id) {
        $stmt = $db->prepare("SELECT id, nome, pais, cidade, descricao, imagem, preco, avaliacao, atracoes, melhor_epoca as melhorEpoca, lat, lng, popularidade FROM destinos WHERE id = :id");
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        $destino = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($destino) {
            // Converter atracoes de string para array
            if ($destino['atracoes']) {
                $destino['atracoes'] = explode(',', $destino['atracoes']);
            } else {
                $destino['atracoes'] = [];
            }
            Response::success($destino);
        } else {
            Response::notFound("Destino não encontrado");
        }
    } else {
        $sql = "SELECT id, nome, pais, cidade, descricao, imagem, preco, avaliacao, popularidade FROM destinos WHERE 1=1";
        if ($pais) {
            $sql .= " AND pais = :pais";
        }
        $sql .= " ORDER BY popularidade DESC";
        
        $stmt = $db->prepare($sql);
        if ($pais) {
            $stmt->bindParam(":pais", $pais);
        }
        $stmt->execute();
        $destinos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::success($destinos);
    }
    exit();
}

// POST - Criar destino (Admin)
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    $stmt = $db->prepare("INSERT INTO destinos (nome, pais, cidade, descricao, imagem, preco, avaliacao, atracoes, melhor_epoca, lat, lng) 
                          VALUES (:nome, :pais, :cidade, :descricao, :imagem, :preco, :avaliacao, :atracoes, :melhorEpoca, :lat, :lng)");
    $stmt->bindParam(":nome", $data->nome);
    $stmt->bindParam(":pais", $data->pais);
    $stmt->bindParam(":cidade", $data->cidade);
    $stmt->bindParam(":descricao", $data->descricao);
    $stmt->bindParam(":imagem", $data->imagem);
    $stmt->bindParam(":preco", $data->preco);
    $stmt->bindParam(":avaliacao", $data->avaliacao);
    
    // Converter array de atracoes para string
    $atracoes = isset($data->atracoes) ? (is_array($data->atracoes) ? implode(',', $data->atracoes) : $data->atracoes) : '';
    $stmt->bindParam(":atracoes", $atracoes);
    
    $stmt->bindParam(":melhorEpoca", $data->melhorEpoca);
    $stmt->bindParam(":lat", $data->lat);
    $stmt->bindParam(":lng", $data->lng);
    
    if ($stmt->execute()) {
        Response::success(['id' => $db->lastInsertId()], "Destino criado com sucesso");
    } else {
        Response::error("Erro ao criar destino");
    }
    exit();
}

// PUT - Atualizar destino (Admin)
if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    $atracoes = isset($data->atracoes) ? (is_array($data->atracoes) ? implode(',', $data->atracoes) : $data->atracoes) : '';
    
    $stmt = $db->prepare("UPDATE destinos SET 
                          nome = :nome, 
                          pais = :pais, 
                          cidade = :cidade, 
                          descricao = :descricao, 
                          imagem = :imagem,
                          preco = :preco,
                          avaliacao = :avaliacao,
                          atracoes = :atracoes,
                          melhor_epoca = :melhorEpoca,
                          lat = :lat,
                          lng = :lng
                          WHERE id = :id");
    $stmt->bindParam(":nome", $data->nome);
    $stmt->bindParam(":pais", $data->pais);
    $stmt->bindParam(":cidade", $data->cidade);
    $stmt->bindParam(":descricao", $data->descricao);
    $stmt->bindParam(":imagem", $data->imagem);
    $stmt->bindParam(":preco", $data->preco);
    $stmt->bindParam(":avaliacao", $data->avaliacao);
    $stmt->bindParam(":atracoes", $atracoes);
    $stmt->bindParam(":melhorEpoca", $data->melhorEpoca);
    $stmt->bindParam(":lat", $data->lat);
    $stmt->bindParam(":lng", $data->lng);
    $stmt->bindParam(":id", $data->id);
    
    if ($stmt->execute()) {
        Response::success(null, "Destino atualizado com sucesso");
    } else {
        Response::error("Erro ao atualizar destino");
    }
    exit();
}

// DELETE - Remover destino (Admin)
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    $stmt = $db->prepare("DELETE FROM destinos WHERE id = :id");
    $stmt->bindParam(":id", $id);
    
    if ($stmt->execute()) {
        Response::success(null, "Destino removido com sucesso");
    } else {
        Response::error("Erro ao remover destino");
    }
    exit();
}

Response::error("Método não permitido", 405);
?>