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
$prevWord = $_POST['prev_word'];
$sql = 'SELECT * FROM collection WHERE word = "' . $prevWord . '"';
$result = mysqli_query($conn, $sql);
if ($result->num_rows > 0) {
    if ($row = $result->fetch_assoc()) {
        $id = $row['id'];
        $sql = 'SELECT * FROM `mapping` WHERE `word` = "' . $word . '" AND `collection_id` = ' . $id . ' GROUP BY word';
        $result = mysqli_query($conn, $sql);
        if ($result->num_rows > 0) {
            if ($row = $result->fetch_assoc()) {
                $id = $row['id'];
                $sql = 'UPDATE mapping SET count = count + 1 where id = ' . $id;
                mysqli_query($conn, $sql);
            }
            else {
                $sql = 'INSERT INTO collection (word) VALUES ("' . $word . '")';
                mysqli_query($conn, $sql);
                $sql = 'INSERT INTO mapping (collection_id, word) VALUES (' . $id . ', "' . $word . '")';
                mysqli_query($conn, $sql);
            }
        }
        else {
            $sql = 'INSERT INTO collection (word) VALUES ("' . $word . '")';
            mysqli_query($conn, $sql);
            $sql = 'INSERT INTO mapping (collection_id, word) VALUES (' . $id . ', "' . $word . '")';
            mysqli_query($conn, $sql);
        }
        $sql = 'SELECT mapping.* FROM mapping INNER JOIN collection ON mapping.collection_id = collection.id WHERE collection.word = "' . $word . '" GROUP BY word';
        $result = mysqli_query($conn, $sql);
        $data = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $data[] = $row['word'];
            }
            echo json_encode($data);
        } else {
            echo json_encode([]);
        }
        $conn->close();
    } else {
        echo json_encode([]);
    }
}