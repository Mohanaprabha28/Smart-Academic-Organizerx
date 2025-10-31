<?php
/**
 * Discussion Forum API
 */

include_once '../config/database.php';
include_once '../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            getDiscussionWithComments($db, $_GET['id']);
        } else if(isset($_GET['unit_id'])) {
            getDiscussionsByUnit($db, $_GET['unit_id']);
        } else {
            getAllDiscussions($db);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if(isset($data->action)) {
            if($data->action === 'upvote') {
                toggleUpvote($db, $data);
            } else if($data->action === 'comment') {
                addComment($db, $data);
            }
        } else {
            createDiscussion($db, $data);
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        updateDiscussion($db, $data);
        break;
        
    case 'DELETE':
        if(isset($_GET['id'])) {
            if(isset($_GET['type']) && $_GET['type'] === 'comment') {
                deleteComment($db, $_GET['id']);
            } else {
                deleteDiscussion($db, $_GET['id']);
            }
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}

function getAllDiscussions($db) {
    $query = "SELECT dp.*,
              u.name as author,
              u.avatar,
              (SELECT COUNT(*) FROM discussion_comments dc WHERE dc.post_id = dp.id) as comment_count,
              DATE_FORMAT(dp.created_at, '%W, %M %d at %h:%i %p') as formatted_date,
              CASE 
                WHEN TIMESTAMPDIFF(MINUTE, dp.created_at, NOW()) < 60 
                THEN CONCAT(TIMESTAMPDIFF(MINUTE, dp.created_at, NOW()), ' minutes ago')
                WHEN TIMESTAMPDIFF(HOUR, dp.created_at, NOW()) < 24 
                THEN CONCAT(TIMESTAMPDIFF(HOUR, dp.created_at, NOW()), ' hours ago')
                ELSE CONCAT(TIMESTAMPDIFF(DAY, dp.created_at, NOW()), ' days ago')
              END as timestamp
              FROM discussion_posts dp
              LEFT JOIN users u ON dp.user_id = u.id
              ORDER BY dp.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $discussions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($discussions);
}

function getDiscussionsByUnit($db, $unit_id) {
    $query = "SELECT dp.*,
              u.name as author,
              u.avatar,
              (SELECT COUNT(*) FROM discussion_comments dc WHERE dc.post_id = dp.id) as comment_count,
              CASE 
                WHEN TIMESTAMPDIFF(MINUTE, dp.created_at, NOW()) < 60 
                THEN CONCAT(TIMESTAMPDIFF(MINUTE, dp.created_at, NOW()), ' minutes ago')
                WHEN TIMESTAMPDIFF(HOUR, dp.created_at, NOW()) < 24 
                THEN CONCAT(TIMESTAMPDIFF(HOUR, dp.created_at, NOW()), ' hours ago')
                ELSE CONCAT(TIMESTAMPDIFF(DAY, dp.created_at, NOW()), ' days ago')
              END as timestamp
              FROM discussion_posts dp
              LEFT JOIN users u ON dp.user_id = u.id
              WHERE dp.unit_id = :unit_id
              ORDER BY dp.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':unit_id', $unit_id);
    $stmt->execute();
    
    $discussions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($discussions);
}

function getDiscussionWithComments($db, $id) {
    // Get discussion
    $query = "SELECT dp.*,
              u.name as author,
              u.avatar,
              CASE 
                WHEN TIMESTAMPDIFF(MINUTE, dp.created_at, NOW()) < 60 
                THEN CONCAT(TIMESTAMPDIFF(MINUTE, dp.created_at, NOW()), ' minutes ago')
                WHEN TIMESTAMPDIFF(HOUR, dp.created_at, NOW()) < 24 
                THEN CONCAT(TIMESTAMPDIFF(HOUR, dp.created_at, NOW()), ' hours ago')
                ELSE CONCAT(TIMESTAMPDIFF(DAY, dp.created_at, NOW()), ' days ago')
              END as timestamp
              FROM discussion_posts dp
              LEFT JOIN users u ON dp.user_id = u.id
              WHERE dp.id = :id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    $discussion = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if(!$discussion) {
        http_response_code(404);
        echo json_encode(array("message" => "Discussion not found"));
        return;
    }
    
    // Get comments
    $query = "SELECT dc.*,
              u.name as author,
              u.avatar,
              CASE 
                WHEN TIMESTAMPDIFF(MINUTE, dc.created_at, NOW()) < 60 
                THEN CONCAT(TIMESTAMPDIFF(MINUTE, dc.created_at, NOW()), ' minutes ago')
                WHEN TIMESTAMPDIFF(HOUR, dc.created_at, NOW()) < 24 
                THEN CONCAT(TIMESTAMPDIFF(HOUR, dc.created_at, NOW()), ' hours ago')
                ELSE CONCAT(TIMESTAMPDIFF(DAY, dc.created_at, NOW()), ' days ago')
              END as timestamp
              FROM discussion_comments dc
              LEFT JOIN users u ON dc.user_id = u.id
              WHERE dc.post_id = :post_id
              ORDER BY dc.created_at ASC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':post_id', $id);
    $stmt->execute();
    
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $discussion['comments'] = $comments;
    
    http_response_code(200);
    echo json_encode($discussion);
}

function createDiscussion($db, $data) {
    $query = "INSERT INTO discussion_posts (user_id, unit_id, title, content) 
              VALUES (:user_id, :unit_id, :title, :content)";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':user_id', $data->user_id);
    $stmt->bindParam(':unit_id', $data->unit_id);
    $stmt->bindParam(':title', $data->title);
    $stmt->bindParam(':content', $data->content);
    
    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Discussion created successfully", "id" => $db->lastInsertId()));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to create discussion"));
    }
}

function addComment($db, $data) {
    $query = "INSERT INTO discussion_comments (post_id, user_id, content) 
              VALUES (:post_id, :user_id, :content)";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':post_id', $data->post_id);
    $stmt->bindParam(':user_id', $data->user_id);
    $stmt->bindParam(':content', $data->content);
    
    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Comment added successfully", "id" => $db->lastInsertId()));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to add comment"));
    }
}

function toggleUpvote($db, $data) {
    // Check if already upvoted
    $query = "SELECT id FROM post_upvotes WHERE post_id = :post_id AND user_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':post_id', $data->post_id);
    $stmt->bindParam(':user_id', $data->user_id);
    $stmt->execute();
    
    if($stmt->rowCount() > 0) {
        // Remove upvote
        $query = "DELETE FROM post_upvotes WHERE post_id = :post_id AND user_id = :user_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':post_id', $data->post_id);
        $stmt->bindParam(':user_id', $data->user_id);
        $stmt->execute();
        
        $query = "UPDATE discussion_posts SET upvotes = upvotes - 1 WHERE id = :post_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':post_id', $data->post_id);
        $stmt->execute();
        
        echo json_encode(array("message" => "Upvote removed", "upvoted" => false));
    } else {
        // Add upvote
        $query = "INSERT INTO post_upvotes (post_id, user_id) VALUES (:post_id, :user_id)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':post_id', $data->post_id);
        $stmt->bindParam(':user_id', $data->user_id);
        $stmt->execute();
        
        $query = "UPDATE discussion_posts SET upvotes = upvotes + 1 WHERE id = :post_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':post_id', $data->post_id);
        $stmt->execute();
        
        echo json_encode(array("message" => "Upvote added", "upvoted" => true));
    }
    
    http_response_code(200);
}

function updateDiscussion($db, $data) {
    $query = "UPDATE discussion_posts SET title = :title, content = :content WHERE id = :id";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':id', $data->id);
    $stmt->bindParam(':title', $data->title);
    $stmt->bindParam(':content', $data->content);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Discussion updated successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to update discussion"));
    }
}

function deleteDiscussion($db, $id) {
    $query = "DELETE FROM discussion_posts WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Discussion deleted successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to delete discussion"));
    }
}

function deleteComment($db, $id) {
    $query = "DELETE FROM discussion_comments WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Comment deleted successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to delete comment"));
    }
}
?>
