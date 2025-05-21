<?php
$servername = "127.0.0.1:3306";
$username = "root"; // Usuario predeterminado en MySQL local
$password = "123456789"; // Deja vacío si no has configurado una contraseña
$database = "escuela";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta a la base de datos
$sql = "SELECT id_alumno, nombre FROM escuela.alumnos";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Lista de Usuarios</title>
</head>
<body>
    <h2>Lista de Usuarios</h2>
    <table border="1">
        <tr>
            <th>ID</th>
            <th>Nombre</th>
        </tr>
        <?php
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<tr><td>".$row["id_alumno"]."</td><td>".$row["nombre"]."</td></tr>";
            }
        } else {
            echo "<tr><td colspan='3'>No hay usuarios registrados</td></tr>";
        }
        $conn->close();
        ?>
    </table>
</body>
</html>
