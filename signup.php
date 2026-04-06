<?php
header("Content-Type: application/json");
require "config.php";
require "vendor/autoload.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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

if (!$stmt->execute()) {
    echo json_encode([
        "success" => false,
        "message" => "Signup failed."
    ]);
    exit;
}

$verifyLink = "http://localhost/Banana-Memory-Game/verify.php?token=" . $verificationToken;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = "smtp.gmail.com";        
    $mail->SMTPAuth = true;
    $mail->Username = "bananamemorygameproject@gmail.com";   
    $mail->Password = "APP_PASSWORD_HERE";      
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom("bananamemorygameproject@gmail.com", "Banana Memory Game");
    $mail->addAddress($email, $username);

    $mail->isHTML(true);
    $mail->Subject = "Verify your Banana Memory account";
    $mail->Body = "
        <h2>Banana Memory Game</h2>
        <p>Hello {$username},</p>
        <p>Click the button below to verify your account:</p>
        <p>
            <a href='{$verifyLink}' style='display:inline-block;padding:12px 18px;background:#7c3aed;color:#ffffff;text-decoration:none;border-radius:8px;'>
                Verify Account
            </a>
        </p>
        <p>If the button does not work, copy this link:</p>
        <p>{$verifyLink}</p>
    ";

    $mail->send();

    echo json_encode([
        "success" => true,
        "message" => "Signup successful. Verification email sent."
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Account created, but email could not be sent."
    ]);
}

$conn->close();
?>