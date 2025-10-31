<?php
/**
 * Subjects API - Handle subject management
 */

include_once '../config/database.php';
include_once '../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            getSubject($db, $_GET['id']);
        } else if(isset($_GET['semester_id'])) {
            getSubjectsBySemester($db, $_GET['semester_id']);
        } else {
            getAllSubjects($db);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        createSubject($db, $data);
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        updateSubject($db, $data);
        break;
        
    case 'DELETE':
        if(isset($_GET['id'])) {
            deleteSubject($db, $_GET['id']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}

function getAllSubjects($db) {
    $query = "SELECT s.*, sem.name as semester_name FROM subjects s
              LEFT JOIN semesters sem ON s.semester_id = sem.id
              ORDER BY sem.name, s.name";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($subjects);
}

function getSubject($db, $id) {
    $query = "SELECT s.*, sem.name as semester_name FROM subjects s
              LEFT JOIN semesters sem ON s.semester_id = sem.id
              WHERE s.id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    $subject = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if($subject) {
        http_response_code(200);
        echo json_encode($subject);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Subject not found"));
    }
}

function getSubjectsBySemester($db, $semester_id) {
    $query = "SELECT * FROM subjects WHERE semester_id = :semester_id ORDER BY name";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':semester_id', $semester_id);
    $stmt->execute();
    
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($subjects);
}

function createSubject($db, $data) {
    $query = "INSERT INTO subjects (semester_id, name, code, description) VALUES (:semester_id, :name, :code, :description)";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':semester_id', $data->semester_id);
    $stmt->bindParam(':name', $data->name);
    $stmt->bindParam(':code', $data->code);
    $stmt->bindParam(':description', $data->description);
    
    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Subject created successfully", "id" => $db->lastInsertId()));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to create subject"));
    }
}

function updateSubject($db, $data) {
    $query = "UPDATE subjects SET semester_id = :semester_id, name = :name, code = :code, description = :description WHERE id = :id";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':id', $data->id);
    $stmt->bindParam(':semester_id', $data->semester_id);
    $stmt->bindParam(':name', $data->name);
    $stmt->bindParam(':code', $data->code);
    $stmt->bindParam(':description', $data->description);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Subject updated successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to update subject"));
    }
}

function deleteSubject($db, $id) {
    $query = "DELETE FROM subjects WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Subject deleted successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to delete subject"));
    }
}
?>
