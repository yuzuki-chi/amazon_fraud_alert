<?php

class Asin
{
    private PDO $db;
    private string $table = 'asins';

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * ASINレコードを作成
     */
    public function create(array $data): array
    {
        $sql = "INSERT INTO {$this->table} (asin, creator_name, creator_source, user_identifier, description) 
                VALUES (:asin, :creator_name, :creator_source, :user_identifier, :description)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':asin' => $data['asin'],
            ':creator_name' => $data['creator_name'],
            ':creator_source' => $data['creator_source'] ?? null,
            ':user_identifier' => $data['user_identifier'],
            ':description' => $data['description'] ?? null,
        ]);

        return $this->getByAsin($data['asin']);
    }

    /**
     * ASINで検索
     */
    public function getByAsin(string $asin): ?array
    {
        $sql = "SELECT * FROM {$this->table} WHERE asin = :asin";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':asin' => $asin]);

        $result = $stmt->fetch();
        return $result ?: null;
    }

    /**
     * ASINレコードを削除
     */
    public function deleteByAsin(string $asin): bool
    {
        $sql = "DELETE FROM {$this->table} WHERE asin = :asin";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':asin' => $asin]);

        return $stmt->rowCount() > 0;
    }

    /**
     * ASINが存在するか確認
     */
    public function exists(string $asin): bool
    {
        $sql = "SELECT COUNT(*) FROM {$this->table} WHERE asin = :asin";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':asin' => $asin]);

        return (int)$stmt->fetchColumn() > 0;
    }
}
