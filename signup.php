<?php
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
$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if ($username === "" || $email === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "Username, email, and password are required."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid email address."
    ]);
    exit;
}

$checkSql = "SELECT id FROM users WHERE username = ? OR email = ?";
$stmt = $conn->prepare($checkSql);
$stmt->bind_param("ss", $username, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Username or email already exists."
    ]);
    exit;
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$verificationToken = bin2hex(random_bytes(32));

$insertSql = "INSERT INTO users (username, email, password_hash, is_verified, verification_token, best_score)
              VALUES (?, ?, ?, 0, ?, 0)";
$stmt = $conn->prepare($insertSql);
$stmt->bind_param("ssss", $username, $email, $passwordHash, $verificationToken);

if ($stmt->execute()) {
    $verifyLink = "http://localhost/Banana-Memory-Game/verify.php?token=" . $verificationToken;

    echo json_encode([
        "success" => true,
        "message" => "Signup successful. Verify your account using the link below.",
        "verify_link" => $verifyLink
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Signup failed."
    ]);
}

$conn->close();
?>