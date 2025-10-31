<?php
/**
 * Direct Groq API Test Script
 * This tests the Groq API connection directly
 */

$groq_api_key = "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";
$groq_url = "https://api.groq.com/openai/v1/chat/completions";

echo "Testing Groq API Connection...\n\n";

// Prepare the request data
$request_data = array(
    "model" => "llama-3.3-70b-versatile",
    "messages" => array(
        array(
            "role" => "system",
            "content" => "You are a helpful academic assistant."
        ),
        array(
            "role" => "user",
            "content" => "Explain JavaScript closures in 2 sentences."
        )
    ),
    "temperature" => 0.7,
    "max_tokens" => 800
);

echo "Request Data:\n";
echo json_encode($request_data, JSON_PRETTY_PRINT) . "\n\n";

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
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => true
));

// Execute request
echo "Calling Groq API...\n";
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

echo "\n=== RESPONSE ===\n";
echo "HTTP Code: $http_code\n";

if ($response === false) {
    echo "cURL Error: $curl_error\n";
    exit(1);
}

echo "Response Body:\n";
echo $response . "\n\n";

$response_data = json_decode($response, true);

if (isset($response_data['choices'][0]['message']['content'])) {
    echo "=== AI RESPONSE ===\n";
    echo $response_data['choices'][0]['message']['content'] . "\n";
    echo "\n✅ SUCCESS! Groq API is working!\n";
} else {
    echo "❌ ERROR: Unexpected response format\n";
    echo "Response Data:\n";
    print_r($response_data);
}
?>
