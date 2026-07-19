<?php
session_start();

// Set your login credentials here
$correctUser = "admin";
$correctPass = "cs50minecraft";

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $inputUser = $_POST["username"];
    $inputPass = $_POST["password"];

    if ($inputUser === $correctUser && $inputPass === $correctPass) {
        $_SESSION["loggedIn"] = true;
        header("Location: messages.php");
        exit();
    } else {
        $error = "Wrong username or password";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | View Messages</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <div class="logo">MC HUB</div>
        <div class="nav-links" id="navMenu">
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="gallery.html">Gallery</a>
            <a href="contact.html">Contact</a>
        </div>
        <div class="hamburger" id="hamburgerBtn">&#9776;</div>
    </nav>

    <div class="contact-wrap" style="max-width:500px;margin:3rem auto;padding:2rem;">
        <div class="contact-head">
            <h1>Admin Login</h1>
            <p>Enter credentials to read submitted contact messages</p>
        </div>
        <?php if ($error): ?>
            <p style="color:red;text-align:center;"><?= $error ?></p>
        <?php endif; ?>
        <form method="POST">
            <input type="text" name="username" placeholder="Username" required style="margin:8px 0;width:100%;padding:10px;">
            <input type="password" name="password" placeholder="Password" required style="margin:8px 0;width:100%;padding:10px;">
            <button type="submit" class="btn submit-btn" style="width:100%;margin-top:10px;">Sign In</button>
        </form>
    </div>

    <footer>
        <p>&copy; 2026 Minecraft Hub | Minecraft belongs to Mojang Studios</p>
    </footer>

    <script>
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const navMenu = document.getElementById('navMenu');
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('active'));
        });
    </script>
</body>
</html>
