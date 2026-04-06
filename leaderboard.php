<?php
header("Content-Type: application/json");
require "config.php";

$sql = "SELECT username, best_score, best_moves
        FROM users
        WHERE is_verified = 1 AND best_score > 0
        ORDER BY best_score DESC, best_moves ASC, username ASC
        LIMIT 10";

$result = $conn->query($sql);

$leaders = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $leaders[] = [
            "username" => $row["username"],
            "best_score" => (int)$row["best_score"],
            "best_moves" => $row["best_moves"] !== null ? (int)$row["best_moves"] : null
        ];
    }
}

echo json_encode([
    "success" => true,
    "leaders" => $leaders
]);

$conn->close();
?>