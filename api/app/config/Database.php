<?php

class Database
{
    private ?PDO $connection = null;

    public function getConnection(): PDO
    {
        if ($this->connection === null) {
            $host = getenv('DB_HOST') ?: 'db';
            $dbName = getenv('DB_NAME') ?: 'amazon_fraud_alert';
            $user = getenv('DB_USER') ?: 'api_user';
            $password = getenv('DB_PASSWORD') ?: 'api_password';

            $dsn = "mysql:host={$host};dbname={$dbName};charset=utf8mb4";

            try {
                $this->connection = new PDO($dsn, $user, $password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
            } catch (PDOException $e) {
                throw new Exception("Database connection failed: " . $e->getMessage());
            }
        }

        return $this->connection;
    }
}
