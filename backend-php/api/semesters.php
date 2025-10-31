<?php
/**
 * Semesters API - Handle semester management
 */

include_once '../config/database.php';
include_once '../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get all semesters with subjects and units
        if(isset($_GET['id'])) {
            getSemesterWithDetails($db, $_GET['id']);
        } else {
            getAllSemesters($db);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        createSemester($db, $data);
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        updateSemester($db, $data);
        break;
        
    case 'DELETE':
        if(isset($_GET['id'])) {
            deleteSemester($db, $_GET['id']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}

function getAllSemesters($db) {
    $query = "SELECT s.*, 
              COUNT(DISTINCT sub.id) as subject_count
              FROM semesters s
              LEFT JOIN subjects sub ON s.id = sub.semester_id
              GROUP BY s.id
              ORDER BY s.name";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $semesters = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($semesters);
}

function getSemesterWithDetails($db, $id) {
    // Get semester
    $query = "SELECT * FROM semesters WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    $semester = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if(!$semester) {
        http_response_code(404);
        echo json_encode(array("message" => "Semester not found"));
        return;
    }
    
    // Get subjects with units
    $query = "SELECT s.*, 
              (SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                      'id', u.id,
                      'name', u.name,
                      'unit_number', u.unit_number,
                      'description', u.description
                  )
              )
              FROM units u WHERE u.subject_id = s.id
              ORDER BY u.unit_number) as units
              FROM subjects s
              WHERE s.semester_id = :semester_id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':semester_id', $id);
    $stmt->execute();
    
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Parse JSON units
    foreach($subjects as &$subject) {
        $subject['units'] = json_decode($subject['units'], true) ?? [];
    }
    
    $semester['subjects'] = $subjects;
    
    http_response_code(200);
    echo json_encode($semester);
}

function createSemester($db, $data) {
    $query = "INSERT INTO semesters (name, start_date, end_date, is_active) VALUES (:name, :start_date, :end_date, :is_active)";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':name', $data->name);
    $stmt->bindParam(':start_date', $data->start_date);
    $stmt->bindParam(':end_date', $data->end_date);
    $stmt->bindParam(':is_active', $data->is_active);
    
    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Semester created successfully", "id" => $db->lastInsertId()));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to create semester"));
    }
}

function updateSemester($db, $data) {
    $query = "UPDATE semesters SET name = :name, start_date = :start_date, end_date = :end_date, is_active = :is_active WHERE id = :id";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':id', $data->id);
    $stmt->bindParam(':name', $data->name);
    $stmt->bindParam(':start_date', $data->start_date);
    $stmt->bindParam(':end_date', $data->end_date);
    $stmt->bindParam(':is_active', $data->is_active);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Semester updated successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to update semester"));
    }
}

function deleteSemester($db, $id) {
    $query = "DELETE FROM semesters WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Semester deleted successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to delete semester"));
    }
}
?>
