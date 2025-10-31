<?php
/**
 * Chatbot API
 */

// Include CORS config FIRST (handles OPTIONS preflight)
include_once '../config/cors.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get chat history
        if(isset($_GET['user_id'])) {
            getChatHistory($db, $_GET['user_id'], $_GET['unit_id'] ?? null);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if(isset($data->action) && $data->action === 'send') {
            handleChatMessage($db, $data);
        } else {
            saveChatMessage($db, $data);
        }
        break;
        
    case 'DELETE':
        if(isset($_GET['user_id'])) {
            clearChatHistory($db, $_GET['user_id']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}

function getChatHistory($db, $user_id, $unit_id = null) {
    if($unit_id) {
        $query = "SELECT * FROM chat_messages WHERE user_id = :user_id AND unit_id = :unit_id ORDER BY created_at ASC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':unit_id', $unit_id);
    } else {
        $query = "SELECT * FROM chat_messages WHERE user_id = :user_id ORDER BY created_at ASC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
    }
    
    $stmt->execute();
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $formatted = array();
    foreach($messages as $msg) {
        $formatted[] = array(
            'id' => $msg['id'],
            'type' => $msg['message_type'],
            'content' => $msg['message'],
            'timestamp' => $msg['created_at']
        );
    }
    
    http_response_code(200);
    echo json_encode($formatted);
}

function handleChatMessage($db, $data) {
    // Save user message
    $query = "INSERT INTO chat_messages (user_id, unit_id, message, message_type) 
              VALUES (:user_id, :unit_id, :message, 'user')";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $data->user_id);
    $stmt->bindParam(':unit_id', $data->unit_id);
    $stmt->bindParam(':message', $data->message);
    $stmt->execute();
    
    // Get unit context if available
    $unit_info = null;
    if (isset($data->unit_id) && $data->unit_id) {
        $query = "SELECT u.*, s.name as subject_name, sem.name as semester_name 
                  FROM units u
                  LEFT JOIN subjects s ON u.subject_id = s.id
                  LEFT JOIN semesters sem ON s.semester_id = sem.id
                  WHERE u.id = :unit_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':unit_id', $data->unit_id);
        $stmt->execute();
        $unit_info = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // Generate bot response using Groq AI
    $bot_response = generateBotResponse($data->message, $unit_info);
    
    // Save bot message
    $query = "INSERT INTO chat_messages (user_id, unit_id, message, message_type) 
              VALUES (:user_id, :unit_id, :message, 'bot')";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $data->user_id);
    $stmt->bindParam(':unit_id', $data->unit_id);
    $stmt->bindParam(':message', $bot_response);
    $stmt->execute();
    
    http_response_code(200);
    echo json_encode(array(
        "message" => "Message sent successfully",
        "bot_response" => $bot_response
    ));
}

function generateBotResponse($message, $unit_info = null) {
    // Use Groq AI API for intelligent responses
    // IMPORTANT: do NOT hardcode API keys in source. Read from environment variables.
    // Set GROQ_API_KEY in your server environment or in a local .env file (not committed).
    $groq_api_key = getenv('GROQ_API_KEY') ?: '';
    $groq_url = "https://api.groq.com/openai/v1/chat/completions";

    if (empty($groq_api_key)) {
        error_log("Groq API key not set in environment (GROQ_API_KEY)");
        // Fallback to non-AI response when no key is present
        return getFallbackResponse($message);
    }
    
    // Prepare context about the current unit/subject
    $context_info = "";
    if ($unit_info) {
        $context_info = "The user is currently studying: " . json_encode($unit_info) . "\n\n";
    }
    
    // Prepare the system prompt
    $system_prompt = "You are an intelligent academic learning assistant for ClassHub, a smart academic organizer. 
You help students with their coursework, assignments, and study-related questions.

Your role:
- Answer questions about academic subjects (Web Development, Database Design, JavaScript, Cloud Computing, etc.)
- Explain complex concepts in simple terms
- Provide study tips and learning strategies
- Help with assignments and projects
- Suggest resources and practice exercises
- Be encouraging and supportive

IMPORTANT RULES:
- ONLY answer study-related and academic questions
- DO NOT answer questions about: politics, personal advice unrelated to studies, entertainment, sports, or general chat
- If asked a non-academic question, politely redirect to study topics
- Keep responses concise (2-3 paragraphs maximum)
- Use examples when explaining concepts
- Be encouraging and motivational

Current context: The student is using an academic organizer with subjects across multiple semesters, including marks tracking, timetables, quizzes, and discussion forums.";

    $user_content = $context_info . "Student's question: " . $message;
    
    // Prepare the request data
    $request_data = array(
        "model" => "llama-3.3-70b-versatile",
        "messages" => array(
            array(
                "role" => "system",
                "content" => $system_prompt
            ),
            array(
                "role" => "user",
                "content" => $user_content
            )
        ),
        "temperature" => 0.7,
        "max_tokens" => 800,
        "top_p" => 0.9
    );
    
    // Initialize cURL
    $ch = curl_init($groq_url);
    
    curl_setopt_array($ch, array(
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => array(
            "Content-Type: application/json",
            "Authorization: Bearer " . $groq_api_key
        ),
        CURLOPT_POSTFIELDS => json_encode($request_data),
        CURLOPT_TIMEOUT => 30
    ));
    
    // Execute request
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);
    
    // Handle response
    if ($response === false) {
        error_log("Groq API cURL Error: $curl_error");
        return getFallbackResponse($message);
    }
    
    if ($http_code !== 200) {
        error_log("Groq API HTTP Error: $http_code - Response: $response");
        return getFallbackResponse($message);
    }
    
    $response_data = json_decode($response, true);
    
    // Log the full response for debugging
    error_log("Groq API Response: " . print_r($response_data, true));
    
    if (isset($response_data['choices'][0]['message']['content'])) {
        $ai_response = $response_data['choices'][0]['message']['content'];
        error_log("AI Response generated successfully: " . substr($ai_response, 0, 100) . "...");
        return $ai_response;
    }
    
    // Log if response format is unexpected
    error_log("Groq API returned unexpected format: " . json_encode($response_data));
    return getFallbackResponse($message);
}

function getFallbackResponse($message) {
    $lower = strtolower($message);
    
    $responses = array(
        'hello' => "Hello! I'm ClassHub AI, your learning assistant. Ask me anything about your courses!",
        'help' => "I can help you with:\n• Explaining academic concepts\n• Study tips and strategies\n• Assignment guidance\n• Subject-specific questions\n• Exam preparation\n\nWhat would you like to learn?",
        'javascript' => "JavaScript is a versatile programming language. Key concepts include variables, functions, closures, async/await, and the event loop. What specific aspect would you like to explore?",
        'database' => "Databases store and retrieve data efficiently. Key concepts include normalization, indexes, queries, and relationships. Would you like to learn about any specific aspect?",
        'web' => "Web development involves frontend (HTML, CSS, JS) and backend technologies. The frontend handles user interface, while the backend manages data and server logic.",
        'study' => "Here are some effective study tips:\n• Break content into smaller chunks\n• Practice regularly with hands-on projects\n• Explain concepts to others\n• Use active recall and spaced repetition\n• Take regular breaks (Pomodoro technique)\n• Review your notes within 24 hours",
        'concept' => "To understand a concept better, try breaking it down into smaller parts. What specific concept are you struggling with?",
        'default' => "I'm here to help with your studies! Could you provide more details about your question so I can give you a better answer?"
    );
    
    foreach($responses as $key => $response) {
        if(strpos($lower, $key) !== false) {
            return $response;
        }
    }
    
    return $responses['default'];
}

function saveChatMessage($db, $data) {
    $query = "INSERT INTO chat_messages (user_id, unit_id, message, message_type) 
              VALUES (:user_id, :unit_id, :message, :message_type)";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':user_id', $data->user_id);
    $stmt->bindParam(':unit_id', $data->unit_id);
    $stmt->bindParam(':message', $data->message);
    $stmt->bindParam(':message_type', $data->message_type);
    
    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Message saved successfully", "id" => $db->lastInsertId()));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to save message"));
    }
}

function clearChatHistory($db, $user_id) {
    $query = "DELETE FROM chat_messages WHERE user_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $user_id);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Chat history cleared successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to clear chat history"));
    }
}
?>
