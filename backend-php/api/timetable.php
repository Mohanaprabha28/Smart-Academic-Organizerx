<?php
/**
 * Timetable API
 */

include_once '../config/database.php';
include_once '../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['day'])) {
            getTimetableByDay($db, $_GET['day']);
        } else {
            getFullTimetable($db);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        createTimetableEntry($db, $data);
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        updateTimetableEntry($db, $data);
        break;
        
    case 'DELETE':
        if(isset($_GET['id'])) {
            deleteTimetableEntry($db, $_GET['id']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}

function getFullTimetable($db) {
    $query = "SELECT t.*, 
              s.name as subject_name,
              u.name as instructor_name
              FROM timetable t
              LEFT JOIN subjects s ON t.subject_id = s.id
              LEFT JOIN users u ON t.instructor_id = u.id
              ORDER BY 
              FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
              t.start_time";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $entries = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Group by day
    $timetable = array();
    $days = array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
    
    foreach($days as $day) {
        $timetable[] = array(
            'day' => $day,
            'schedule' => array()
        );
    }
    
    foreach($entries as $entry) {
        $day_index = array_search($entry['day_of_week'], $days);
        if($day_index !== false) {
            $timetable[$day_index]['schedule'][] = array(
                'id' => $entry['id'],
                'time' => date('g:i A', strtotime($entry['start_time'])) . ' - ' . date('g:i A', strtotime($entry['end_time'])),
                'subject' => $entry['subject_name'],
                'room' => $entry['room'],
                'instructor' => $entry['instructor_name'],
                'color' => $entry['color_class']
            );
        }
    }
    
    http_response_code(200);
    echo json_encode($timetable);
}

function getTimetableByDay($db, $day) {
    $query = "SELECT t.*, 
              s.name as subject_name,
              u.name as instructor_name
              FROM timetable t
              LEFT JOIN subjects s ON t.subject_id = s.id
              LEFT JOIN users u ON t.instructor_id = u.id
              WHERE t.day_of_week = :day
              ORDER BY t.start_time";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':day', $day);
    $stmt->execute();
    
    $entries = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $schedule = array();
    foreach($entries as $entry) {
        $schedule[] = array(
            'id' => $entry['id'],
            'time' => date('g:i A', strtotime($entry['start_time'])) . ' - ' . date('g:i A', strtotime($entry['end_time'])),
            'subject' => $entry['subject_name'],
            'room' => $entry['room'],
            'instructor' => $entry['instructor_name'],
            'color' => $entry['color_class']
        );
    }
    
    http_response_code(200);
    echo json_encode(array('day' => $day, 'schedule' => $schedule));
}

function createTimetableEntry($db, $data) {
    $query = "INSERT INTO timetable (subject_id, instructor_id, day_of_week, start_time, end_time, room, color_class) 
              VALUES (:subject_id, :instructor_id, :day_of_week, :start_time, :end_time, :room, :color_class)";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':subject_id', $data->subject_id);
    $stmt->bindParam(':instructor_id', $data->instructor_id);
    $stmt->bindParam(':day_of_week', $data->day_of_week);
    $stmt->bindParam(':start_time', $data->start_time);
    $stmt->bindParam(':end_time', $data->end_time);
    $stmt->bindParam(':room', $data->room);
    $stmt->bindParam(':color_class', $data->color_class);
    
    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Timetable entry created successfully", "id" => $db->lastInsertId()));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to create timetable entry"));
    }
}

function updateTimetableEntry($db, $data) {
    $query = "UPDATE timetable SET 
              subject_id = :subject_id,
              instructor_id = :instructor_id,
              day_of_week = :day_of_week,
              start_time = :start_time,
              end_time = :end_time,
              room = :room,
              color_class = :color_class
              WHERE id = :id";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':id', $data->id);
    $stmt->bindParam(':subject_id', $data->subject_id);
    $stmt->bindParam(':instructor_id', $data->instructor_id);
    $stmt->bindParam(':day_of_week', $data->day_of_week);
    $stmt->bindParam(':start_time', $data->start_time);
    $stmt->bindParam(':end_time', $data->end_time);
    $stmt->bindParam(':room', $data->room);
    $stmt->bindParam(':color_class', $data->color_class);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Timetable entry updated successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to update timetable entry"));
    }
}

function deleteTimetableEntry($db, $id) {
    $query = "DELETE FROM timetable WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Timetable entry deleted successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to delete timetable entry"));
    }
}
?>
