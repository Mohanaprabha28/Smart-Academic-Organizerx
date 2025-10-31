-- Sample Data for Smart Academic Organizer
USE smartacademicorganizer;

-- Insert Sample Users
INSERT INTO users (name, email, password, role, avatar) VALUES
('John Doe', 'john@example.com', '$2y$10$YourHashedPasswordHere', 'student', '👨‍🎓'),
('Sarah Smith', 'sarah@example.com', '$2y$10$YourHashedPasswordHere', 'student', '👩‍🎓'),
('Emma Wilson', 'emma@example.com', '$2y$10$YourHashedPasswordHere', 'student', '👩‍🎓'),
('Mike Johnson', 'mike@example.com', '$2y$10$YourHashedPasswordHere', 'student', '👨‍🏫'),
('Alex Chen', 'alex@example.com', '$2y$10$YourHashedPasswordHere', 'student', '👨‍🎓'),
('Dr. John', 'dr.john@example.com', '$2y$10$YourHashedPasswordHere', 'instructor', '👨‍🏫'),
('Prof. Sarah', 'prof.sarah@example.com', '$2y$10$YourHashedPasswordHere', 'instructor', '👩‍🏫'),
('Dr. Mike', 'dr.mike@example.com', '$2y$10$YourHashedPasswordHere', 'instructor', '👨‍🏫'),
('Dr. Emma', 'dr.emma@example.com', '$2y$10$YourHashedPasswordHere', 'instructor', '👩‍🏫'),
('Prof. Alex', 'prof.alex@example.com', '$2y$10$YourHashedPasswordHere', 'instructor', '👨‍🏫');

-- Insert Semesters
INSERT INTO semesters (name, start_date, end_date, is_active) VALUES
('Semester 1', '2024-08-01', '2024-12-31', true),
('Semester 2', '2025-01-01', '2025-05-31', false);

-- Insert Subjects for Semester 1
INSERT INTO subjects (semester_id, name, code, description) VALUES
(1, 'Web Development', 'WD101', 'Introduction to HTML, CSS, JavaScript and React'),
(1, 'Database Design', 'DB101', 'Relational database design and SQL'),
(1, 'Data Structures', 'DS101', 'Fundamental data structures and algorithms');

-- Insert Subjects for Semester 2
INSERT INTO subjects (semester_id, name, code, description) VALUES
(2, 'Advanced JavaScript', 'JS201', 'Advanced JavaScript concepts and patterns'),
(2, 'Cloud Computing', 'CC201', 'Cloud platforms and deployment strategies');

-- Insert Units for Web Development
INSERT INTO units (subject_id, name, unit_number, description) VALUES
(1, 'Unit 1: HTML & CSS Basics', 1, 'Introduction to HTML tags and CSS styling'),
(1, 'Unit 2: JavaScript Fundamentals', 2, 'Variables, functions, and DOM manipulation'),
(1, 'Unit 3: React Basics', 3, 'Components, props, and state management');

-- Insert Units for Database Design
INSERT INTO units (subject_id, name, unit_number, description) VALUES
(2, 'Unit 1: SQL Basics', 1, 'SELECT, INSERT, UPDATE, DELETE operations'),
(2, 'Unit 2: Database Normalization', 2, 'Normal forms and database design principles'),
(2, 'Unit 3: Advanced Queries', 3, 'Joins, subqueries, and optimization');

-- Insert Units for Data Structures
INSERT INTO units (subject_id, name, unit_number, description) VALUES
(3, 'Unit 1: Arrays and Linked Lists', 1, 'Basic data structures'),
(3, 'Unit 2: Stacks and Queues', 2, 'LIFO and FIFO structures'),
(3, 'Unit 3: Trees and Graphs', 3, 'Hierarchical data structures');

-- Insert Units for Advanced JavaScript
INSERT INTO units (subject_id, name, unit_number, description) VALUES
(4, 'Unit 1: Async/Await', 1, 'Asynchronous programming patterns'),
(4, 'Unit 2: Promises & Callbacks', 2, 'Handling asynchronous operations'),
(4, 'Unit 3: Event Loop', 3, 'Understanding JavaScript runtime');

-- Insert Units for Cloud Computing
INSERT INTO units (subject_id, name, unit_number, description) VALUES
(5, 'Unit 1: AWS Basics', 1, 'Introduction to Amazon Web Services'),
(5, 'Unit 2: Lambda Functions', 2, 'Serverless computing'),
(5, 'Unit 3: Deployment', 3, 'Deploying applications to cloud');

-- Insert Sample Assessments for Student 1 (John Doe)
INSERT INTO assessments (student_id, subject_id, assessment_type, marks_obtained, total_marks, assessment_date) VALUES
(1, 1, 'Unit Test 1', 85, 100, '2024-09-15'),
(1, 1, 'Assignment 1', 90, 100, '2024-09-22'),
(1, 1, 'Midterm Exam', 78, 100, '2024-10-05'),
(1, 1, 'Project 1', 92, 100, '2024-10-20'),
(1, 2, 'Unit Test 1', 88, 100, '2024-09-16'),
(1, 2, 'Assignment 1', 95, 100, '2024-09-23'),
(1, 2, 'Midterm Exam', 82, 100, '2024-10-06'),
(1, 2, 'Project 1', 89, 100, '2024-10-21'),
(1, 4, 'Unit Test 1', 80, 100, '2024-09-14'),
(1, 4, 'Assignment 1', 87, 100, '2024-09-21'),
(1, 4, 'Midterm Exam', 91, 100, '2024-10-04'),
(1, 4, 'Project 1', 85, 100, '2024-10-19');

-- Insert Sample Timetable
INSERT INTO timetable (subject_id, instructor_id, day_of_week, start_time, end_time, room, color_class) VALUES
-- Monday
(1, 6, 'Monday', '09:00:00', '10:30:00', 'A-101', 'from-blue-500'),
(2, 7, 'Monday', '11:00:00', '12:30:00', 'B-205', 'from-green-500'),
(3, 8, 'Monday', '13:30:00', '15:00:00', 'C-303', 'from-purple-500'),
-- Tuesday
(4, 9, 'Tuesday', '10:00:00', '11:30:00', 'A-102', 'from-orange-500'),
(5, 10, 'Tuesday', '14:00:00', '15:30:00', 'D-401', 'from-pink-500'),
-- Wednesday
(1, 6, 'Wednesday', '09:00:00', '10:30:00', 'A-101', 'from-blue-500'),
(2, 7, 'Wednesday', '11:00:00', '12:30:00', 'B-205', 'from-green-500'),
-- Thursday
(4, 9, 'Thursday', '10:00:00', '11:30:00', 'A-102', 'from-orange-500'),
-- Friday
(1, 6, 'Friday', '09:00:00', '10:30:00', 'A-101', 'from-blue-500');

-- Insert Sample Discussion Posts
INSERT INTO discussion_posts (user_id, unit_id, title, content, upvotes) VALUES
(1, 2, 'How to implement Redux?', 'I am stuck on implementing Redux in my React application. Can someone explain the workflow?', 12),
(3, 6, 'Query optimization tips', 'What are some best practices for optimizing database queries?', 8),
(5, 13, 'Cloud deployment strategies', 'Should I use containers or serverless for my project?', 15);

-- Insert Sample Discussion Comments
INSERT INTO discussion_comments (post_id, user_id, content, upvotes) VALUES
(1, 2, 'You need to understand actions, reducers, and store. Check the Redux documentation!', 5),
(1, 4, 'Great question! I recommend following the official Redux tutorial first.', 3),
(2, 7, 'Use indexes wisely, avoid N+1 queries, and always analyze execution plans.', 7);

-- Insert Sample Post Upvotes
INSERT INTO post_upvotes (post_id, user_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 1),
(3, 2);

-- Insert Sample Quiz
INSERT INTO quizzes (subject_id, unit_id, title, description, time_limit, total_questions) VALUES
(1, 1, 'Web Development Fundamentals', 'Test your knowledge on HTML, CSS, and JavaScript basics', 600, 5);

-- Insert Sample Quiz Questions
INSERT INTO quiz_questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_option, question_order) VALUES
(1, 'What does HTML stand for?', 'Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 0, 1),
(1, 'Which CSS property is used to change text color?', 'text-color', 'color', 'font-color', 'text-style', 1, 2),
(1, 'What is the correct way to declare a variable in JavaScript?', 'var x = 5;', 'v x = 5;', 'variable x = 5;', 'x := 5;', 0, 3),
(1, 'Which of these is NOT a JavaScript data type?', 'Number', 'String', 'Boolean', 'Character', 3, 4),
(1, 'What does the querySelector method do?', 'Creates a new element', 'Selects the first element matching a selector', 'Returns all elements', 'Removes elements from the DOM', 1, 5);

-- Insert Sample Quiz Attempt
INSERT INTO quiz_attempts (quiz_id, student_id, score, total_questions, time_taken) VALUES
(1, 1, 4, 5, 450);

-- Insert Sample Quiz Answers
INSERT INTO quiz_answers (attempt_id, question_id, selected_option, is_correct) VALUES
(1, 1, 0, true),
(1, 2, 1, true),
(1, 3, 0, true),
(1, 4, 2, false),
(1, 5, 1, true);
