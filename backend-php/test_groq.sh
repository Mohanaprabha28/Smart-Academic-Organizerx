#!/bin/bash

# Test Groq AI Chatbot Integration

echo "🧪 Testing Groq AI Chatbot Integration"
echo "======================================"
echo ""

# Start PHP server in background
echo "Starting PHP server..."
cd /home/ramji/Documents/g
php -S localhost:8000 > /dev/null 2>&1 &
SERVER_PID=$!
echo "✓ Server started (PID: $SERVER_PID)"
sleep 3

echo ""
echo "📚 Test 1: Academic Question (JavaScript Closures)"
echo "---------------------------------------------------"
curl -X POST http://localhost:8000/backend-php/api/chatbot.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send",
    "user_id": 1,
    "unit_id": 2,
    "message": "Explain JavaScript closures in simple terms"
  }' 2>/dev/null | jq -r '.bot_response' | head -10

echo ""
echo ""
echo "📚 Test 2: Study Tips Question"
echo "--------------------------------"
curl -X POST http://localhost:8000/backend-php/api/chatbot.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send",
    "user_id": 1,
    "unit_id": 2,
    "message": "What are the best study techniques for programming?"
  }' 2>/dev/null | jq -r '.bot_response' | head -10

echo ""
echo ""
echo "📚 Test 3: Non-Academic Question (Should be Redirected)"
echo "--------------------------------------------------------"
curl -X POST http://localhost:8000/backend-php/api/chatbot.php \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send",
    "user_id": 1,
    "unit_id": 2,
    "message": "What is your favorite movie?"
  }' 2>/dev/null | jq -r '.bot_response'

echo ""
echo ""
echo "✅ Tests completed!"
echo ""
echo "Stopping server..."
kill $SERVER_PID 2>/dev/null
echo "✓ Server stopped"
