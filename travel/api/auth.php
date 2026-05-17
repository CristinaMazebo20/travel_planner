<?php
require_once "../config/cors.php";
require_once "../config/database.php";
require_once "../utils/Response.php";

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));
$action = $data->action ?? '';

// ==================== LOGIN ====================
if ($action === 'login') {
    $email = $data->email ?? '';
    $senha = $data->senha ?? '';
    
    $query = "SELECT id, nome, email, tipo FROM utilizadores WHERE email = :email AND senha = :senha";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":senha", $senha);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        Response::success($usuario, "Login realizado com sucesso");
    } else {
        Response::error("Email ou senha inválidos", 401);
    }
    exit();
}

// ==================== REGISTO ====================
if ($action === 'registar') {
    $nome = $data->nome ?? '';
    $email = $data->email ?? '';
    $senha = $data->senha ?? '';
    
    if (empty($nome) || empty($email) || empty($senha)) {
        Response::error("Todos os campos são obrigatórios", 400);
    }
    
    $checkQuery = "SELECT id FROM utilizadores WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(":email", $email);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        Response::error("Email já cadastrado", 409);
    }
    
    $query = "INSERT INTO utilizadores (nome, email, senha, tipo) VALUES (:nome, :email, :senha, 'cliente')";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":nome", $nome);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":senha", $senha);
    
    if ($stmt->execute()) {
        Response::success(null, "Conta criada com sucesso!");
    } else {
        Response::error("Erro ao criar conta", 500);
    }
    exit();
}

// ==================== RECUPERAR SENHA ====================
if ($action === 'recuperar') {
    $email = $data->email ?? '';
    
    $query = "SELECT id FROM utilizadores WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        $token = bin2hex(random_bytes(32));
        $expira = date('Y-m-d H:i:s', strtotime('+1 hour'));
        
        $insertQuery = "INSERT INTO recuperacao_senha (utilizador_id, token, expira_em) VALUES (:user_id, :token, :expira)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(":user_id", $usuario['id']);
        $insertStmt->bindParam(":token", $token);
        $insertStmt->bindParam(":expira", $expira);
        $insertStmt->execute();
        
        Response::success(['token' => $token], "Token de recuperação gerado");
    } else {
        Response::error("Email não encontrado", 404);
    }
    exit();
}

// ==================== VERIFICAR TOKEN ====================
if ($action === 'verificar_token') {
    $token = $data->token ?? '';
    
    $query = "SELECT * FROM recuperacao_senha WHERE token = :token AND usado = 0 AND expira_em > NOW()";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":token", $token);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        Response::success(null, "Token válido");
    } else {
        Response::error("Token inválido ou expirado", 400);
    }
    exit();
}

// ==================== REDEFINIR SENHA ====================
if ($action === 'redefinir') {
    $token = $data->token ?? '';
    $novaSenha = $data->novaSenha ?? '';
    
    $query = "SELECT utilizador_id FROM recuperacao_senha WHERE token = :token AND usado = 0 AND expira_em > NOW()";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":token", $token);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $recuperacao = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $updateQuery = "UPDATE utilizadores SET senha = :senha WHERE id = :user_id";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(":senha", $novaSenha);
        $updateStmt->bindParam(":user_id", $recuperacao['utilizador_id']);
        $updateStmt->execute();
        
        $updateToken = "UPDATE recuperacao_senha SET usado = 1 WHERE token = :token";
        $updateTokenStmt = $db->prepare($updateToken);
        $updateTokenStmt->bindParam(":token", $token);
        $updateTokenStmt->execute();
        
        Response::success(null, "Senha redefinida com sucesso!");
    } else {
        Response::error("Token inválido ou expirado", 400);
    }
    exit();
}

Response::error("Ação não reconhecida", 400);
?>