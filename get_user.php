<?php
session_start();
header("Content-Type: application/json");

require "config.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "No active session."
    ]);
    exit;
}

$userId = $_SESSION["user_id"];

$sql = "SELECT id, username, email, best_score FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "User not found."
    ]);
    exit;
}

$user = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "user" => [
        "id" => (int)$user["id"],
        "username" => $user["username"],
        "email" => $user["email"],
        "best_score" => (int)$user["best_score"]
    ]
]);

$conn->close();
?>