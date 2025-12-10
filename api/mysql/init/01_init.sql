-- データベースとユーザー作成
CREATE DATABASE IF NOT EXISTS amazon_fraud_alert CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'api_user'@'%' IDENTIFIED BY 'api_password';
GRANT ALL PRIVILEGES ON amazon_fraud_alert.* TO 'api_user'@'%';
FLUSH PRIVILEGES;

USE amazon_fraud_alert;

-- ASINテーブル
CREATE TABLE IF NOT EXISTS asins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asin VARCHAR(10) NOT NULL UNIQUE COMMENT 'Amazon ASIN番号',
    creator_name VARCHAR(255) NOT NULL COMMENT '著作者名',
    creator_source VARCHAR(500) COMMENT '著作者の発信元URL等',
    user_identifier VARCHAR(255) NOT NULL COMMENT 'ユーザー識別子（IPアドレス等）',
    description TEXT COMMENT 'メモ',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_asin (asin),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
