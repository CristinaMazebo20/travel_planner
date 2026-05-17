<?php
class Response {
    public static function json($success, $data = null, $message = null, $code = 200) {
        http_response_code($code);
        echo json_encode([
            'success' => $success,
            'data' => $data,
            'message' => $message
        ]);
        exit();
    }
    
    public static function success($data = null, $message = "Operação realizada com sucesso") {
        self::json(true, $data, $message, 200);
    }
    
    public static function error($message = "Erro na operação", $code = 400) {
        self::json(false, null, $message, $code);
    }
    
    public static function unauthorized($message = "Acesso não autorizado") {
        self::json(false, null, $message, 401);
    }
    
    public static function notFound($message = "Recurso não encontrado") {
        self::json(false, null, $message, 404);
    }
}
?>