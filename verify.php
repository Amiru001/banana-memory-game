<?php
require "config.php";

$token = $_GET["token"] ?? "";

if ($token === "") {
    die("Invalid verification link.");
}

$sql = "SELECT id FROM users WHERE verification_token = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Verification failed. Invalid or expired token.");
}

$updateSql = "UPDATE users SET is_verified = 1, verification_token = NULL WHERE verification_token = ?";
$stmt = $conn->prepare($updateSql);
$stmt->bind_param("s", $token);

if ($stmt->execute()) {
    echo "Email verified successfully. You can now log in.";
} else {
    echo "Verification failed.";
}

$conn->close();
?>