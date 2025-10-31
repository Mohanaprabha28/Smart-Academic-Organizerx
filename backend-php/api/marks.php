<?php
/**
 * Marks/Assessments API
 */

include_once '../config/database.php';
include_once '../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['student_id'])) {
            getStudentMarks($db, $_GET['student_id']);
        } else if(isset($_GET['id'])) {
            getAssessment($db, $_GET['id']);
        } else {
            getAllAssessments($db);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        createAssessment($db, $data);
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        updateAssessment($db, $data);
        break;
        
    case 'DELETE':
        if(isset($_GET['id'])) {
            deleteAssessment($db, $_GET['id']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}

function getAllAssessments($db) {
    $query = "SELECT a.*, 
              u.name as student_name,
              s.name as subject_name
              FROM assessments a
              LEFT JOIN users u ON a.student_id = u.id
              LEFT JOIN subjects s ON a.subject_id = s.id
              ORDER BY a.assessment_date DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $assessments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($assessments);
}

function getStudentMarks($db, $student_id) {
    $query = "SELECT a.*, 
              s.name as subject_name,
              s.code as subject_code
              FROM assessments a
              LEFT JOIN subjects s ON a.subject_id = s.id
              WHERE a.student_id = :student_id
              ORDER BY s.name, a.assessment_date DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':student_id', $student_id);
    $stmt->execute();
    
    $marks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Group by subject
    $grouped = array();
    foreach($marks as $mark) {
        $subject_name = $mark['subject_name'];
        if(!isset($grouped[$subject_name])) {
            $grouped[$subject_name] = array();
        }
        $grouped[$subject_name][] = array(
            'assessment' => $mark['assessment_type'],
            'marks' => floatval($mark['marks_obtained']),
            'total' => floatval($mark['total_marks']),
            'percentage' => floatval($mark['percentage']),
            'date' => $mark['assessment_date']
        );
    }
    
    http_response_code(200);
    echo json_encode($grouped);
}

function getAssessment($db, $id) {
    $query = "SELECT a.*, 
              u.name as student_name,
              s.name as subject_name
              FROM assessments a
              LEFT JOIN users u ON a.student_id = u.id
              LEFT JOIN subjects s ON a.subject_id = s.id
              WHERE a.id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    $assessment = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if($assessment) {
        http_response_code(200);
        echo json_encode($assessment);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Assessment not found"));
    }
}

function createAssessment($db, $data) {
    $query = "INSERT INTO assessments (student_id, subject_id, assessment_type, marks_obtained, total_marks, assessment_date) 
              VALUES (:student_id, :subject_id, :assessment_type, :marks_obtained, :total_marks, :assessment_date)";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':student_id', $data->student_id);
    $stmt->bindParam(':subject_id', $data->subject_id);
    $stmt->bindParam(':assessment_type', $data->assessment_type);
    $stmt->bindParam(':marks_obtained', $data->marks_obtained);
    $stmt->bindParam(':total_marks', $data->total_marks);
    $stmt->bindParam(':assessment_date', $data->assessment_date);
    
    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Assessment created successfully", "id" => $db->lastInsertId()));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to create assessment"));
    }
}

function updateAssessment($db, $data) {
    $query = "UPDATE assessments SET 
              student_id = :student_id,
              subject_id = :subject_id,
              assessment_type = :assessment_type,
              marks_obtained = :marks_obtained,
              total_marks = :total_marks,
              assessment_date = :assessment_date
              WHERE id = :id";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':id', $data->id);
    $stmt->bindParam(':student_id', $data->student_id);
    $stmt->bindParam(':subject_id', $data->subject_id);
    $stmt->bindParam(':assessment_type', $data->assessment_type);
    $stmt->bindParam(':marks_obtained', $data->marks_obtained);
    $stmt->bindParam(':total_marks', $data->total_marks);
    $stmt->bindParam(':assessment_date', $data->assessment_date);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Assessment updated successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to update assessment"));
    }
}

function deleteAssessment($db, $id) {
    $query = "DELETE FROM assessments WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Assessment deleted successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to delete assessment"));
    }
}
?>
