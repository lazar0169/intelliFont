<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require_once 'db.php';
// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    echo json_encode([]);
}

$word = $_POST['word'];
//SELECT column_name(s) FROM table_name
$sql = 'SELECT * FROM collection WHERE word LIKE "' . $word . '%"';
$result = mysqli_query($conn, $sql);
$data = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row['word'];
        echo json_encode($data);
    }
} else {
    echo json_encode([]);
}
$conn->close();