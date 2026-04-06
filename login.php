<?php
session_start();
header("Content-Type: application/json");

require "config.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "No data received."
    ]);
    exit;
}

$username = trim($data["username"] ?? "");
$password = trim($data["password"] ?? "");

if ($username === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "Username and password are required."
    ]);
    exit;
}

$sql = "SELECT id, username, email, password_hash, is_verified, best_score 
        FROM users 
        WHERE username = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
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

if (!password_verify($password, $user["password_hash"])) {
    echo json_encode([
        "success" => false,
        "message" => "Incorrect password."
    ]);
    exit;
}

if ((int)$user["is_verified"] !== 1) {
    echo json_encode([
        "success" => false,
        "message" => "Please verify your email before logging in."
    ]);
    exit;
}

$_SESSION["user_id"] = $user["id"];
$_SESSION["username"] = $user["username"];
$_SESSION["email"] = $user["email"];

echo json_encode([
    "success" => true,
    "message" => "Login successful.",
    "user" => [
        "id" => $user["id"],
        "username" => $user["username"],
        "email" => $user["email"],
        "best_score" => (int)$user["best_score"]
    ]
]);

$conn->close();
?>