<?php
/**
 * Users API - Handle user authentication and management
 */

include_once '../config/database.php';
include_once '../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

// Parse the request
$uri_parts = explode('/', trim(parse_url($request_uri, PHP_URL_PATH), '/'));

switch($method) {
    case 'GET':
        // Get all users or specific user
        if(isset($_GET['id'])) {
            getUser($db, $_GET['id']);
        } else if(isset($_GET['role'])) {
            getUsersByRole($db, $_GET['role']);
        } else {
            getAllUsers($db);
        }
        break;
        
    case 'POST':
        // Create new user or login
        $data = json_decode(file_get_contents("php://input"));
        if(isset($data->action) && $data->action === 'login') {
            loginUser($db, $data);
        } else {
            createUser($db, $data);
        }
        break;
        
    case 'PUT':
        // Update user
        $data = json_decode(file_get_contents("php://input"));
        updateUser($db, $data);
        break;
        
    case 'DELETE':
        // Delete user
        if(isset($_GET['id'])) {
            deleteUser($db, $_GET['id']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}

// Function implementations
function getAllUsers($db) {
    $query = "SELECT id, name, email, role, avatar, created_at FROM users ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($users);
}

function getUser($db, $id) {
    $query = "SELECT id, name, email, role, avatar, created_at FROM users WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if($user) {
        http_response_code(200);
        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "User not found"));
    }
}

function getUsersByRole($db, $role) {
    $query = "SELECT id, name, email, role, avatar, created_at FROM users WHERE role = :role";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':role', $role);
    $stmt->execute();
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($users);
}

function createUser($db, $data) {
    $query = "INSERT INTO users (name, email, password, role, avatar) VALUES (:name, :email, :password, :role, :avatar)";
    $stmt = $db->prepare($query);
    
    $hashed_password = password_hash($data->password, PASSWORD_BCRYPT);
    
    $stmt->bindParam(':name', $data->name);
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':password', $hashed_password);
    $stmt->bindParam(':role', $data->role);
    $stmt->bindParam(':avatar', $data->avatar);
    
    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "User created successfully", "id" => $db->lastInsertId()));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to create user"));
    }
}

function loginUser($db, $data) {
    $query = "SELECT id, name, email, password, role, avatar FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if($user && password_verify($data->password, $user['password'])) {
        unset($user['password']);
        http_response_code(200);
        echo json_encode(array("message" => "Login successful", "user" => $user));
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Invalid credentials"));
    }
}

function updateUser($db, $data) {
    $query = "UPDATE users SET name = :name, email = :email, avatar = :avatar WHERE id = :id";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':id', $data->id);
    $stmt->bindParam(':name', $data->name);
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':avatar', $data->avatar);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "User updated successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to update user"));
    }
}

function deleteUser($db, $id) {
    $query = "DELETE FROM users WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "User deleted successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to delete user"));
    }
}
?>
