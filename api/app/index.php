<?php

/**
 * Amazon Fraud Alert API
 * 
 * エンドポイント:
 * - POST   /api/asin/create  - ASIN情報を登録
 * - GET    /api/asin/{asin}  - ASIN情報を取得
 * - DELETE /api/asin/{asin}  - ASIN情報を削除
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/controllers/AsinController.php';

// エラーハンドリング
set_exception_handler(function (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error',
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
});

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

$path = parse_url($requestUri, PHP_URL_PATH);

try {
    $database = new Database();
    $db = $database->getConnection();
    $asinController = new AsinController($db);

    if ($path === '/api/asin/create' && $requestMethod === 'POST') {
        $asinController->create();
    } elseif (preg_match('/(?<=\/api\/asin\/).*/', $path, $matches)) {
        // /api/asin/* のみ受け付け
        $asinId = strtoupper($matches[0]); // ASINは大文字に正規化
        
        if ($requestMethod === 'GET') {
            $asinController->get($asinId);
        } elseif ($requestMethod === 'DELETE') {
            $asinController->delete($asinId);
        } else {
            http_response_code(405);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => false,
                'message' => 'Method not allowed'
            ], JSON_UNESCAPED_UNICODE);
        }
    } elseif ($path === '/' || $path === '/api') {
        // ルートパス - API情報を返す
        http_response_code(200);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => true,
            'message' => 'Amazon Fraud Alert API',
            'version' => '1.0.0',
            'endpoints' => [
                'POST /api/asin/create' => 'Register a new ASIN',
                'GET /api/asin/{asin}' => 'Get ASIN information',
                'DELETE /api/asin/{asin}' => 'Delete an ASIN'
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    } else {
        // 404 Not Found
        http_response_code(404);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint not found'
        ], JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error',
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
