<?php
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$msg = $_POST['message'] ?? '';
$entry = "[" . date('Y-m-d H:i:s') . "] Name: $name | Email: $email | Message: $msg\n";
file_put_contents("messages.txt", $entry, FILE_APPEND);
header("Location: login.php");
exit();
?>
