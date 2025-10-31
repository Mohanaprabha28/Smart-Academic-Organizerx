# Smart Academic Organizer - PHP Backend

Backend API for the ClassHub Academic Organizer application built with PHP and MySQL.

## 📋 Database Information

- **Database Name**: `smartacademicorganizer`
- **Username**: `root`
- **Password**: `Ramji@2311`
- **Host**: `localhost`

## 🗄️ Database Structure

### Tables:
1. **users** - Student and instructor accounts
2. **semesters** - Academic semesters
3. **subjects** - Courses/subjects per semester
4. **units** - Course units/modules
5. **assessments** - Student marks and grades
6. **timetable** - Class schedule
7. **discussion_posts** - Forum discussions
8. **discussion_comments** - Discussion comments
9. **post_upvotes** - Track post upvotes
10. **chat_messages** - Chatbot conversations
11. **quizzes** - Quiz information
12. **quiz_questions** - Quiz questions and answers
13. **quiz_attempts** - Student quiz submissions
14. **quiz_answers** - Individual quiz answers

## 🚀 Setup Instructions

### 1. Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server (or PHP built-in server)

### 2. Database Setup

#### Option A: Automatic Setup
1. Start your web server
2. Navigate to: `http://localhost:8000/backend-php/setup.php`
3. The script will automatically:
   - Create the database
   - Create all tables
   - Load sample data

#### Option B: Manual Setup
```bash
# Connect to MySQL
mysql -u root -p

# Enter password: Ramji@2311

# Create database
CREATE DATABASE smartacademicorganizer;
USE smartacademicorganizer;

# Run schema
source /path/to/backend-php/database/schema.sql;

# Load sample data
source /path/to/backend-php/database/seed.sql;
```

### 3. Start PHP Server

```bash
# From the project root directory
cd /home/ramji/Documents/g

# Start PHP built-in server
php -S localhost:8000
```

The API will be available at: `http://localhost:8000/backend-php/`

### 4. Test the API

Visit `http://localhost:8000/backend-php/` to see API documentation and available endpoints.

## 📡 API Endpoints

### Users API (`/api/users.php`)
- `GET` - Get all users or specific user
  - `?id=1` - Get user by ID
  - `?role=student` - Get users by role
- `POST` - Create new user or login
  - Login: `{"action": "login", "email": "...", "password": "..."}`
- `PUT` - Update user
- `DELETE ?id=1` - Delete user

### Semesters API (`/api/semesters.php`)
- `GET` - Get all semesters
  - `?id=1` - Get semester with subjects and units
- `POST` - Create semester
- `PUT` - Update semester
- `DELETE ?id=1` - Delete semester

### Subjects API (`/api/subjects.php`)
- `GET` - Get all subjects
  - `?id=1` - Get specific subject
  - `?semester_id=1` - Get subjects by semester
- `POST` - Create subject
- `PUT` - Update subject
- `DELETE ?id=1` - Delete subject

### Marks API (`/api/marks.php`)
- `GET` - Get assessments
  - `?student_id=1` - Get student marks (grouped by subject)
  - `?id=1` - Get specific assessment
- `POST` - Create assessment
- `PUT` - Update assessment
- `DELETE ?id=1` - Delete assessment

### Timetable API (`/api/timetable.php`)
- `GET` - Get full timetable (grouped by day)
  - `?day=Monday` - Get timetable for specific day
- `POST` - Create timetable entry
- `PUT` - Update timetable entry
- `DELETE ?id=1` - Delete timetable entry

### Discussions API (`/api/discussions.php`)
- `GET` - Get discussions
  - `?id=1` - Get discussion with comments
  - `?unit_id=1` - Get discussions by unit
- `POST` - Create discussion
  - Upvote: `{"action": "upvote", "post_id": 1, "user_id": 1}`
  - Comment: `{"action": "comment", "post_id": 1, "user_id": 1, "content": "..."}`
- `PUT` - Update discussion
- `DELETE ?id=1` - Delete discussion
- `DELETE ?id=1&type=comment` - Delete comment

### Chatbot API (`/api/chatbot.php`)
- `GET ?user_id=1&unit_id=1` - Get chat history
- `POST` - Send message
  - `{"action": "send", "user_id": 1, "unit_id": 1, "message": "..."}`
- `DELETE ?user_id=1` - Clear chat history

### Quiz API (`/api/quiz.php`)
- `GET` - Get quizzes
  - `?id=1&type=quiz` - Get quiz with questions
  - `?subject_id=1` - Get quizzes by subject
  - `?student_id=1&type=attempts` - Get student attempts
- `POST` - Create quiz
  - Submit quiz: `{"action": "submit", "quiz_id": 1, "student_id": 1, "answers": {...}, "time_taken": 450}`
  - Create question: `{"action": "create_question", ...}`
- `PUT` - Update quiz
- `DELETE ?id=1` - Delete quiz
- `DELETE ?id=1&type=question` - Delete question

## 🔧 Configuration

### Database Configuration
Edit `config/database.php` to change database credentials:
```php
private $host = "localhost";
private $db_name = "smartacademicorganizer";
private $username = "root";
private $password = "Ramji@2311";
```

### CORS Configuration
Edit `config/cors.php` to allow different origins:
```php
header("Access-Control-Allow-Origin: http://localhost:3000");
```

## 📝 Sample Data

The setup includes sample data:
- 10 users (5 students, 5 instructors)
- 2 semesters
- 5 subjects
- 15 units
- 12 assessments
- 9 timetable entries
- 3 discussion posts with comments
- 1 quiz with 5 questions
- Sample quiz attempt

### Default Test User
- **Email**: john@example.com
- **Password**: (use hashed password or create new user)
- **Role**: student

## 🔌 Frontend Integration

### Example: Fetch Marks for Student
```javascript
// In your Next.js component
const fetchMarks = async (studentId) => {
  const response = await fetch(
    `http://localhost:8000/backend-php/api/marks.php?student_id=${studentId}`
  );
  const data = await response.json();
  return data;
};
```

### Example: Create Discussion Post
```javascript
const createPost = async (postData) => {
  const response = await fetch(
    'http://localhost:8000/backend-php/api/discussions.php',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    }
  );
  return await response.json();
};
```

## 📂 Project Structure

```
backend-php/
├── api/
│   ├── users.php          # User management
│   ├── semesters.php      # Semester management
│   ├── subjects.php       # Subject management
│   ├── marks.php          # Marks/assessments
│   ├── timetable.php      # Timetable/schedule
│   ├── discussions.php    # Discussion forum
│   ├── chatbot.php        # AI chatbot
│   └── quiz.php           # Quiz management
├── config/
│   ├── database.php       # Database connection
│   └── cors.php           # CORS configuration
├── database/
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Sample data
├── .htaccess              # Apache configuration
├── index.php              # API info page
├── setup.php              # Database setup script
└── README.md              # This file
```

## 🛠️ Troubleshooting

### Connection Error
- Verify MySQL is running: `sudo systemctl status mysql`
- Check credentials in `config/database.php`
- Ensure database exists: `SHOW DATABASES;`

### CORS Issues
- Update allowed origin in `config/cors.php`
- Check browser console for CORS errors
- Ensure Apache mod_headers is enabled

### Permission Denied
- Check file permissions: `chmod -R 755 backend-php`
- Verify MySQL user has proper privileges

## 📄 License

This project is part of the ClassHub Academic Organizer system.

## 👨‍💻 Developer Notes

- All API responses are in JSON format
- Timestamps are in MySQL TIMESTAMP format
- Passwords are hashed using bcrypt
- Foreign keys ensure referential integrity
- Soft delete not implemented (uses CASCADE)

## 🔐 Security Notes

⚠️ **Important**: This is a development setup. For production:
1. Change database password
2. Implement proper authentication (JWT/sessions)
3. Add input validation and sanitization
4. Use prepared statements (already implemented)
5. Enable HTTPS
6. Restrict CORS to specific domains
7. Add rate limiting
8. Implement proper error logging
