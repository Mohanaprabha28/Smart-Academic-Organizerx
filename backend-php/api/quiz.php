<?php
/**
 * Quiz API
 */

include_once '../config/database.php';
include_once '../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id']) && isset($_GET['type']) && $_GET['type'] === 'quiz') {
            getQuizWithQuestions($db, $_GET['id']);
        } else if(isset($_GET['subject_id'])) {
            getQuizzesBySubject($db, $_GET['subject_id']);
        } else if(isset($_GET['student_id']) && isset($_GET['type']) && $_GET['type'] === 'attempts') {
            getStudentAttempts($db, $_GET['student_id']);
        } else {
            getAllQuizzes($db);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if(isset($data->action)) {
            if($data->action === 'submit') {
                submitQuizAttempt($db, $data);
            } else if($data->action === 'create_question') {
                createQuestion($db, $data);
            }
        } else {
            createQuiz($db, $data);
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        updateQuiz($db, $data);
        break;
        
    case 'DELETE':
        if(isset($_GET['id'])) {
            if(isset($_GET['type']) && $_GET['type'] === 'question') {
                deleteQuestion($db, $_GET['id']);
            } else {
                deleteQuiz($db, $_GET['id']);
            }
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}

function getAllQuizzes($db) {
    $query = "SELECT q.*, 
              s.name as subject_name,
              u.name as unit_name
              FROM quizzes q
              LEFT JOIN subjects s ON q.subject_id = s.id
              LEFT JOIN units u ON q.unit_id = u.id
              ORDER BY q.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($quizzes);
}

function getQuizzesBySubject($db, $subject_id) {
    $query = "SELECT q.*, 
              u.name as unit_name
              FROM quizzes q
              LEFT JOIN units u ON q.unit_id = u.id
              WHERE q.subject_id = :subject_id
              ORDER BY q.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':subject_id', $subject_id);
    $stmt->execute();
    
    $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($quizzes);
}

function getQuizWithQuestions($db, $quiz_id) {
    // Get quiz details
    $query = "SELECT q.*, 
              s.name as subject_name,
              u.name as unit_name
              FROM quizzes q
              LEFT JOIN subjects s ON q.subject_id = s.id
              LEFT JOIN units u ON q.unit_id = u.id
              WHERE q.id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $quiz_id);
    $stmt->execute();
    
    $quiz = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if(!$quiz) {
        http_response_code(404);
        echo json_encode(array("message" => "Quiz not found"));
        return;
    }
    
    // Get questions
    $query = "SELECT * FROM quiz_questions WHERE quiz_id = :quiz_id ORDER BY question_order";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':quiz_id', $quiz_id);
    $stmt->execute();
    
    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format questions
    $formatted_questions = array();
    foreach($questions as $q) {
        $formatted_questions[] = array(
            'id' => $q['id'],
            'question' => $q['question'],
            'options' => array($q['option_a'], $q['option_b'], $q['option_c'], $q['option_d']),
            'correct' => $q['correct_option']
        );
    }
    
    $quiz['questions'] = $formatted_questions;
    
    http_response_code(200);
    echo json_encode($quiz);
}

function getStudentAttempts($db, $student_id) {
    $query = "SELECT qa.*, 
              q.title as quiz_title,
              s.name as subject_name
              FROM quiz_attempts qa
              LEFT JOIN quizzes q ON qa.quiz_id = q.id
              LEFT JOIN subjects s ON q.subject_id = s.id
              WHERE qa.student_id = :student_id
              ORDER BY qa.completed_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':student_id', $student_id);
    $stmt->execute();
    
    $attempts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($attempts);
}

function createQuiz($db, $data) {
    $query = "INSERT INTO quizzes (subject_id, unit_id, title, description, time_limit, total_questions) 
              VALUES (:subject_id, :unit_id, :title, :description, :time_limit, :total_questions)";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':subject_id', $data->subject_id);
    $stmt->bindParam(':unit_id', $data->unit_id);
    $stmt->bindParam(':title', $data->title);
    $stmt->bindParam(':description', $data->description);
    $stmt->bindParam(':time_limit', $data->time_limit);
    $stmt->bindParam(':total_questions', $data->total_questions);
    
    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Quiz created successfully", "id" => $db->lastInsertId()));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to create quiz"));
    }
}

function createQuestion($db, $data) {
    $query = "INSERT INTO quiz_questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_option, question_order) 
              VALUES (:quiz_id, :question, :option_a, :option_b, :option_c, :option_d, :correct_option, :question_order)";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':quiz_id', $data->quiz_id);
    $stmt->bindParam(':question', $data->question);
    $stmt->bindParam(':option_a', $data->options[0]);
    $stmt->bindParam(':option_b', $data->options[1]);
    $stmt->bindParam(':option_c', $data->options[2]);
    $stmt->bindParam(':option_d', $data->options[3]);
    $stmt->bindParam(':correct_option', $data->correct_option);
    $stmt->bindParam(':question_order', $data->question_order);
    
    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Question created successfully", "id" => $db->lastInsertId()));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to create question"));
    }
}

function submitQuizAttempt($db, $data) {
    // Calculate score
    $score = 0;
    $total_questions = count($data->answers);
    
    foreach($data->answers as $question_id => $selected_option) {
        $query = "SELECT correct_option FROM quiz_questions WHERE id = :question_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':question_id', $question_id);
        $stmt->execute();
        $question = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($question && $question['correct_option'] == $selected_option) {
            $score++;
        }
    }
    
    // Create attempt
    $query = "INSERT INTO quiz_attempts (quiz_id, student_id, score, total_questions, time_taken) 
              VALUES (:quiz_id, :student_id, :score, :total_questions, :time_taken)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':quiz_id', $data->quiz_id);
    $stmt->bindParam(':student_id', $data->student_id);
    $stmt->bindParam(':score', $score);
    $stmt->bindParam(':total_questions', $total_questions);
    $stmt->bindParam(':time_taken', $data->time_taken);
    
    if($stmt->execute()) {
        $attempt_id = $db->lastInsertId();
        
        // Save answers
        foreach($data->answers as $question_id => $selected_option) {
            $query = "SELECT correct_option FROM quiz_questions WHERE id = :question_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':question_id', $question_id);
            $stmt->execute();
            $question = $stmt->fetch(PDO::FETCH_ASSOC);
            
            $is_correct = ($question['correct_option'] == $selected_option) ? 1 : 0;
            
            $query = "INSERT INTO quiz_answers (attempt_id, question_id, selected_option, is_correct) 
                      VALUES (:attempt_id, :question_id, :selected_option, :is_correct)";
            
            $stmt = $db->prepare($query);
            $stmt->bindParam(':attempt_id', $attempt_id);
            $stmt->bindParam(':question_id', $question_id);
            $stmt->bindParam(':selected_option', $selected_option);
            $stmt->bindParam(':is_correct', $is_correct);
            $stmt->execute();
        }
        
        http_response_code(201);
        echo json_encode(array(
            "message" => "Quiz submitted successfully",
            "attempt_id" => $attempt_id,
            "score" => $score,
            "total" => $total_questions,
            "percentage" => round(($score / $total_questions) * 100, 2)
        ));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to submit quiz"));
    }
}

function updateQuiz($db, $data) {
    $query = "UPDATE quizzes SET 
              subject_id = :subject_id,
              unit_id = :unit_id,
              title = :title,
              description = :description,
              time_limit = :time_limit,
              total_questions = :total_questions
              WHERE id = :id";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':id', $data->id);
    $stmt->bindParam(':subject_id', $data->subject_id);
    $stmt->bindParam(':unit_id', $data->unit_id);
    $stmt->bindParam(':title', $data->title);
    $stmt->bindParam(':description', $data->description);
    $stmt->bindParam(':time_limit', $data->time_limit);
    $stmt->bindParam(':total_questions', $data->total_questions);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Quiz updated successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to update quiz"));
    }
}

function deleteQuiz($db, $id) {
    $query = "DELETE FROM quizzes WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Quiz deleted successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to delete quiz"));
    }
}

function deleteQuestion($db, $id) {
    $query = "DELETE FROM quiz_questions WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Question deleted successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to delete question"));
    }
}
?>
