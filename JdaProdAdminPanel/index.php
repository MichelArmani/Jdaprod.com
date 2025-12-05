<?php
session_start();

// Contraseña del administrador (cambia esto por una más segura)
$correct_password = "1234";

// Verificar si ya está autenticado
if (isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true) {
    header("Location: admin.php");
    exit;
}

// Procesar el formulario
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    
    if ($password === $correct_password) {
        $_SESSION['authenticated'] = true;
        header("Location: admin.php");
        exit;
    } else {
        $error = 'Contraseña incorrecta';
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administrador - J DaProd</title>
    
    <!-- Mismas dependencias que la página principal -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/googleFonts.css">
    <link rel="stylesheet" href="index.php.css">
    
</head>
<body>
    <div class="background-animation"></div>
    
    <div class="login-container">
        <div class="login-card">
            <div class="top-bar-detail"></div>
            
            <div class="login-header">
                <div class="login-logo">
                    <img src="../assets/images/logo.png" alt="J DaProd Logo">
                </div>
                <h1 class="login-title">Panel de Administración</h1>
                <p>Solo debes poner la contraseña una sola vez en cada dispositivo desde el que accedas, el panel de administrador puede recordarte</p>
            </div>

            <?php if ($error): ?>
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i> <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form method="POST" class="login-form">
                <div class="form-group">
                    <label for="password" class="form-label">
                        <i class="fas fa-key"></i> Contraseña de acceso
                    </label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        class="form-input" 
                        placeholder="Introduce la contraseña..." 
                        required
                        autofocus
                    >
                </div>
                
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-sign-in-alt"></i> Acceder al Panel
                </button>
            </form>
        </div>
    </div>
</body>
</html>