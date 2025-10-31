<?php
/**
 * Smart Academic Organizer API
 * Main Entry Point
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// API Information
$api_info = array(
    "name" => "Smart Academic Organizer API",
    "version" => "1.0.0",
    "description" => "Backend API for ClassHub Academic Organizer",
    "database" => "smartacademicorganizer",
    "endpoints" => array(
        "users" => array(
            "path" => "/api/users.php",
            "methods" => array("GET", "POST", "PUT", "DELETE"),
            "description" => "User management and authentication"
        ),
        "semesters" => array(
            "path" => "/api/semesters.php",
            "methods" => array("GET", "POST", "PUT", "DELETE"),
            "description" => "Semester management with subjects and units"
        ),
        "subjects" => array(
            "path" => "/api/subjects.php",
            "methods" => array("GET", "POST", "PUT", "DELETE"),
            "description" => "Subject management"
        ),
        "marks" => array(
            "path" => "/api/marks.php",
            "methods" => array("GET", "POST", "PUT", "DELETE"),
            "description" => "Student marks and assessments"
        ),
        "timetable" => array(
            "path" => "/api/timetable.php",
            "methods" => array("GET", "POST", "PUT", "DELETE"),
            "description" => "Class timetable and schedule"
        ),
        "discussions" => array(
            "path" => "/api/discussions.php",
            "methods" => array("GET", "POST", "PUT", "DELETE"),
            "description" => "Discussion forum posts and comments"
        ),
        "chatbot" => array(
            "path" => "/api/chatbot.php",
            "methods" => array("GET", "POST", "DELETE"),
            "description" => "AI chatbot messaging"
        ),
        "quiz" => array(
            "path" => "/api/quiz.php",
            "methods" => array("GET", "POST", "PUT", "DELETE"),
            "description" => "Quiz management and submissions"
        )
    ),
    "setup" => array(
        "database_setup" => "Run setup.php to create database and tables",
        "sample_data" => "Run seed.sql to populate with sample data"
    )
);

http_response_code(200);
echo json_encode($api_info, JSON_PRETTY_PRINT);
?>
