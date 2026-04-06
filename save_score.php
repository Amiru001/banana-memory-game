<?php
session_start();
header("Content-Type: application/json");

require "config.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "User not logged in."
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "No data received."
    ]);
    exit;
}

$newScore = (int)($data["score"] ?? 0);
$newMoves = isset($data["moves"]) ? (int)$data["moves"] : null;
$userId = (int)$_SESSION["user_id"];

$sql = "SELECT best_score, best_moves FROM users WHERE id = ?";
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
$currentBestScore = (int)$user["best_score"];
$currentBestMoves = $user["best_moves"] !== null ? (int)$user["best_moves"] : null;

$shouldUpdate = false;

if ($newScore > $currentBestScore) {
    $shouldUpdate = true;
} elseif ($newScore === $currentBestScore && $newMoves !== null) {
    if ($currentBestMoves === null || $newMoves < $currentBestMoves) {
        $shouldUpdate = true;
    }
}

if ($shouldUpdate) {
    $updateSql = "UPDATE users SET best_score = ?, best_moves = ? WHERE id = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("iii", $newScore, $newMoves, $userId);
    $updateStmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Best result updated.",
        "best_score" => $newScore,
        "best_moves" => $newMoves
    ]);
} else {
    echo json_encode([
        "success" => true,
        "message" => "Best result not changed.",
        "best_score" => $currentBestScore,
        "best_moves" => $currentBestMoves
    ]);
}

$conn->close();
?>