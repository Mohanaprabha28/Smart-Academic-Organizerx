<?php
/**
 * Database Setup Script
 * Creates database and all tables
 */

echo "<!DOCTYPE html>
<html>
<head>
    <title>Smart Academic Organizer - Setup</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: green; padding: 10px; background: #d4edda; border: 1px solid #c3e6cb; margin: 10px 0; }
        .error { color: red; padding: 10px; background: #f8d7da; border: 1px solid #f5c6cb; margin: 10px 0; }
        .info { color: blue; padding: 10px; background: #d1ecf1; border: 1px solid #bee5eb; margin: 10px 0; }
        h1 { color: #333; }
        pre { background: #f4f4f4; padding: 10px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>Smart Academic Organizer - Database Setup</h1>";

$host = "localhost";
$username = "root";
$password = "Ramji@2311";
$db_name = "smartacademicorganizer";

try {
    // Connect to MySQL server
    echo "<div class='info'>Connecting to MySQL server...</div>";
    $conn = new PDO("mysql:host=$host", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<div class='success'>✓ Connected to MySQL server successfully!</div>";
    
    // Create database
    echo "<div class='info'>Creating database '$db_name'...</div>";
    $conn->exec("CREATE DATABASE IF NOT EXISTS $db_name");
    echo "<div class='success'>✓ Database '$db_name' created successfully!</div>";
    
    // Use the database
    $conn->exec("USE $db_name");
    
    // Read and execute schema.sql
    echo "<div class='info'>Creating tables...</div>";
    $schema_file = __DIR__ . '/database/schema.sql';
    
    if(file_exists($schema_file)) {
        $sql = file_get_contents($schema_file);
        
        // Split SQL statements
        $statements = array_filter(array_map('trim', explode(';', $sql)));
        
        $table_count = 0;
        foreach($statements as $statement) {
            if(!empty($statement) && stripos($statement, 'CREATE TABLE') !== false) {
                $conn->exec($statement);
                $table_count++;
                
                // Extract table name
                preg_match('/CREATE TABLE.*?`?(\w+)`?\s*\(/i', $statement, $matches);
                if(isset($matches[1])) {
                    echo "<div class='success'>✓ Created table: {$matches[1]}</div>";
                }
            }
        }
        
        echo "<div class='success'>✓ All tables created successfully! (Total: $table_count tables)</div>";
    } else {
        echo "<div class='error'>✗ Error: schema.sql file not found!</div>";
    }
    
    // Optionally load sample data
    echo "<div class='info'>Loading sample data...</div>";
    $seed_file = __DIR__ . '/database/seed.sql';
    
    if(file_exists($seed_file)) {
        $sql = file_get_contents($seed_file);
        
        // Split SQL statements
        $statements = array_filter(array_map('trim', explode(';', $sql)));
        
        foreach($statements as $statement) {
            if(!empty($statement) && stripos($statement, 'INSERT') !== false) {
                try {
                    $conn->exec($statement);
                } catch(PDOException $e) {
                    // Continue even if some inserts fail (e.g., duplicate entries)
                }
            }
        }
        
        echo "<div class='success'>✓ Sample data loaded successfully!</div>";
    }
    
    echo "<div class='success'><h2>✓ Setup Completed Successfully!</h2></div>";
    echo "<div class='info'>
        <h3>Next Steps:</h3>
        <ol>
            <li>Your database is ready to use</li>
            <li>Start your PHP server (if not already running)</li>
            <li>Update your Next.js frontend to use the API endpoints</li>
            <li>API base URL: http://localhost:8000/backend-php/api/</li>
        </ol>
        <h3>API Endpoints:</h3>
        <ul>
            <li>Users: /api/users.php</li>
            <li>Semesters: /api/semesters.php</li>
            <li>Subjects: /api/subjects.php</li>
            <li>Marks: /api/marks.php</li>
            <li>Timetable: /api/timetable.php</li>
            <li>Discussions: /api/discussions.php</li>
            <li>Chatbot: /api/chatbot.php</li>
            <li>Quiz: /api/quiz.php</li>
        </ul>
    </div>";
    
} catch(PDOException $e) {
    echo "<div class='error'>✗ Error: " . $e->getMessage() . "</div>";
    echo "<div class='info'>
        <h3>Troubleshooting:</h3>
        <ul>
            <li>Make sure MySQL is running</li>
            <li>Verify the credentials in config/database.php</li>
            <li>Check if user 'root' has permission to create databases</li>
        </ul>
    </div>";
}

echo "</body></html>";
?>
