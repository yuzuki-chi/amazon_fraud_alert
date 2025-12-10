<?php

require_once __DIR__ . '/../models/Asin.php';

class AsinController
{
    private Asin $asinModel;

    public function __construct(PDO $db)
    {
        $this->asinModel = new Asin($db);
    }

    /**
     * ASINから新規作成
     * @method POST
     * @url /api/asin/create
     */
    public function create(): void
    {
        $data = $this->getRequestBody();

        // バリデーション
        $errors = $this->validateCreateRequest($data);
        if (!empty($errors)) {
            $this->sendResponse(400, [
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $errors
            ]);
            return;
        }

        // ASINを大文字に正規化
        $asin = strtoupper($data['asin']);

        // ユーザー識別子を取得（送信されたものか、IPアドレスを使用）
        $userIdentifier = $data['user_identifier'] ?? $this->getUserIdentifier();

        try {
            // 既存チェック
            if ($this->asinModel->exists($asin)) {
                $this->sendResponse(409, [
                    'success' => false,
                    'message' => 'ASIN already exists'
                ]);
                return;
            }

            $result = $this->asinModel->create([
                'asin' => $asin,
                'creator_name' => $data['creator_name'],
                'creator_source' => $data['creator_source'] ?? null,
                'user_identifier' => $userIdentifier,
                'description' => $data['description'] ?? null,
            ]);

            $this->sendResponse(201, [
                'success' => true,
                'message' => 'ASIN created successfully',
                'data' => $result
            ]);
        } catch (Exception $e) {
            $this->sendResponse(500, [
                'success' => false,
                'message' => 'Failed to create ASIN',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * ASINから取得
     * @method GET
     * @url /api/asin/{asin_id}
     */
    public function get(string $asinId): void
    {
        if (empty($asinId)) {
            $this->sendResponse(400, [
                'success' => false,
                'message' => 'ASIN ID is required'
            ]);
            return;
        }

        try {
            $result = $this->asinModel->getByAsin($asinId);

            if ($result === null) {
                $this->sendResponse(404, [
                    'success' => false,
                    'message' => 'ASIN not found'
                ]);
                return;
            }

            $this->sendResponse(200, [
                'success' => true,
                'data' => $result
            ]);
        } catch (Exception $e) {
            $this->sendResponse(500, [
                'success' => false,
                'message' => 'Failed to retrieve ASIN',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * ASINから削除
     * @method DELETE
     * @url /api/asin/{asin_id}
     */
    public function delete(string $asinId): void
    {
        if (empty($asinId)) {
            $this->sendResponse(400, [
                'success' => false,
                'message' => 'ASIN ID is required'
            ]);
            return;
        }

        try {
            // 存在確認
            if (!$this->asinModel->exists($asinId)) {
                $this->sendResponse(404, [
                    'success' => false,
                    'message' => 'ASIN not found'
                ]);
                return;
            }

            $deleted = $this->asinModel->deleteByAsin($asinId);

            if ($deleted) {
                $this->sendResponse(200, [
                    'success' => true,
                    'message' => 'ASIN deleted successfully'
                ]);
            } else {
                $this->sendResponse(500, [
                    'success' => false,
                    'message' => 'Failed to delete ASIN'
                ]);
            }
        } catch (Exception $e) {
            $this->sendResponse(500, [
                'success' => false,
                'message' => 'Failed to delete ASIN',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * リクエストボディを取得
     */
    private function getRequestBody(): array
    {
        $data = $_POST;
        return $data ?? [];
    }

    /**
     * 作成リクエストのバリデーション
     */
    private function validateCreateRequest(array $data): array
    {
        $errors = [];

        if (empty($data['asin'])) {
            $errors['asin'] = 'ASIN is required';
        } elseif (!preg_match('/^[A-Za-z0-9]{10}$/', $data['asin'])) {
            $errors['asin'] = 'ASIN must be 10 alphanumeric characters';
        }

        if (empty($data['creator_name'])) {
            $errors['creator_name'] = 'Creator name is required';
        }

        return $errors;
    }

    /**
     * ユーザー識別子を取得
     */
    private function getUserIdentifier(): string
    {
        // X-Forwarded-For ヘッダーがあればそれを使用（プロキシ経由の場合）
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            return trim($ips[0]);
        }

        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }

    /**
     * JSONレスポンスを送信
     */
    private function sendResponse(int $statusCode, array $data): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
}
