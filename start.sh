#!/bin/bash

# Smart Academic Organizer - Quick Start Script
# This script helps you quickly start both backend and frontend

clear
echo "╔════════════════════════════════════════════════════════╗"
echo "║   Smart Academic Organizer - Quick Start              ║"
echo "║   ClassHub Academic Management System                 ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if database exists
echo -e "${BLUE}Checking database...${NC}"
DB_EXISTS=$(mysql -u root -pRamji@2311 -e "SHOW DATABASES LIKE 'smartacademicorganizer';" 2>/dev/null | grep smartacademicorganizer)

if [ -z "$DB_EXISTS" ]; then
    echo -e "${YELLOW}Database not found. Running setup...${NC}"
    ./backend-php/setup.sh
else
    echo -e "${GREEN}✓ Database exists${NC}"
fi
echo ""

# Check if PHP server is already running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 8000 is already in use${NC}"
    echo "   Killing existing process..."
    kill $(lsof -t -i:8000) 2>/dev/null
    sleep 1
fi

# Start PHP server
echo -e "${BLUE}Starting PHP Backend Server...${NC}"
php -S localhost:8000 > /tmp/php-server.log 2>&1 &
PHP_PID=$!
sleep 2

if ps -p $PHP_PID > /dev/null; then
    echo -e "${GREEN}✓ PHP Server running on http://localhost:8000${NC}"
    echo "  PID: $PHP_PID"
else
    echo -e "${YELLOW}⚠️  Failed to start PHP server${NC}"
    exit 1
fi
echo ""

# Test API
echo -e "${BLUE}Testing API endpoints...${NC}"
API_TEST=$(curl -s http://localhost:8000/backend-php/ | grep "Smart Academic Organizer")
if [ -n "$API_TEST" ]; then
    echo -e "${GREEN}✓ API is responding${NC}"
else
    echo -e "${YELLOW}⚠️  API might not be working correctly${NC}"
fi
echo ""

# Check if Next.js is running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Next.js Frontend is already running on http://localhost:3000${NC}"
else
    echo -e "${BLUE}Starting Next.js Frontend...${NC}"
    echo "  Running: pnpm dev"
    pnpm dev > /tmp/nextjs-server.log 2>&1 &
    NEXTJS_PID=$!
    echo "  PID: $NEXTJS_PID"
    echo -e "${YELLOW}  Waiting for Next.js to start (this may take 10-15 seconds)...${NC}"
    sleep 15
    echo -e "${GREEN}✓ Next.js should be running on http://localhost:3000${NC}"
fi
echo ""

# Show status
echo "╔════════════════════════════════════════════════════════╗"
echo "║                    🎉 ALL SYSTEMS GO!                  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Backend API:${NC}"
echo "  • URL: http://localhost:8000/backend-php/"
echo "  • API Endpoints: http://localhost:8000/backend-php/api/"
echo "  • Logs: /tmp/php-server.log"
echo ""
echo -e "${GREEN}Frontend:${NC}"
echo "  • URL: http://localhost:3000"
echo "  • Logs: /tmp/nextjs-server.log"
echo ""
echo -e "${GREEN}Database:${NC}"
echo "  • Name: smartacademicorganizer"
echo "  • Tables: 14 tables with sample data"
echo "  • Access: mysql -u root -pRamji@2311 smartacademicorganizer"
echo ""
echo -e "${GREEN}Features:${NC}"
echo "  • ✓ User authentication"
echo "  • ✓ Marks & assessments tracking"
echo "  • ✓ Class timetable"
echo "  • ✓ Discussion forum"
echo "  • ✓ AI-powered chatbot (Groq Llama3)"
echo "  • ✓ Interactive quizzes"
echo ""
echo -e "${BLUE}Quick Tests:${NC}"
echo "  • API:      curl http://localhost:8000/backend-php/api/users.php"
echo "  • AI Chat:  ./backend-php/test_groq.sh"
echo "  • Marks:    curl http://localhost:8000/backend-php/api/marks.php?student_id=1"
echo ""
echo -e "${YELLOW}To Stop Servers:${NC}"
echo "  • PHP:      kill $PHP_PID"
echo "  • Next.js:  Press Ctrl+C in the terminal running 'pnpm dev'"
echo "  • Or run:   killall php node"
echo ""
echo -e "${GREEN}📚 Documentation:${NC}"
echo "  • Setup Summary:     SETUP_COMPLETE.md"
echo "  • Integration Guide: INTEGRATION_GUIDE.md"
echo "  • Backend Docs:      backend-php/README.md"
echo "  • AI Docs:           backend-php/GROQ_AI_INTEGRATION.md"
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  Ready to use! Open http://localhost:3000 in browser  ║"
echo "╚════════════════════════════════════════════════════════╝"
