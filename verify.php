<?php
require "config.php";

$token = $_GET["token"] ?? "";

if ($token === "") {
    header("Location: index.html?verified=invalid");
    exit;
}

$sql = "SELECT id FROM users WHERE verification_token = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header("Location: index.html?verified=invalid");
    exit;
}

$updateSql = "UPDATE users 
              SET is_verified = 1, verification_token = NULL 
              WHERE verification_token = ?";
$stmt = $conn->prepare($updateSql);
$stmt->bind_param("s", $token);

if ($stmt->execute()) {
    header("Location: index.html?verified=success");
    exit;
} else {
    header("Location: index.html?verified=error");
    exit;
}

$conn->close();
?>