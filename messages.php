<?php
session_start();
if (!isset($_SESSION["loggedIn"]) || $_SESSION["loggedIn"] !== true) {
    header("Location: login.php");
    exit();
}
$allMessages = file_get_contents("messages.txt");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submitted Contact Messages</title>
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
            <a href="login.php">Admin Login</a>
        </div>
        <div class="hamburger" id="hamburgerBtn">&#9776;</div>
    </nav>

    <div class="contact-wrap" style="max-width:900px;margin:3rem auto;padding:2rem;">
        <div class="contact-head">
            <h1>All Contact Submissions</h1>
            <a href="login.php" style="color:#00aaff;">Log Out</a>
        </div>
        <pre style="white-space:pre-wrap;background:#111;color:#eee;padding:1.5rem;border-radius:8px;line-height:1.6;">
<?= htmlspecialchars($allMessages) ?>
        </pre>
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
