-- Quick test queries to verify database setup

USE smartacademicorganizer;

-- Check all tables
SHOW TABLES;

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'semesters', COUNT(*) FROM semesters
UNION ALL
SELECT 'subjects', COUNT(*) FROM subjects
UNION ALL
SELECT 'units', COUNT(*) FROM units
UNION ALL
SELECT 'assessments', COUNT(*) FROM assessments
UNION ALL
SELECT 'timetable', COUNT(*) FROM timetable
UNION ALL
SELECT 'discussion_posts', COUNT(*) FROM discussion_posts
UNION ALL
SELECT 'discussion_comments', COUNT(*) FROM discussion_comments
UNION ALL
SELECT 'quizzes', COUNT(*) FROM quizzes
UNION ALL
SELECT 'quiz_questions', COUNT(*) FROM quiz_questions;

-- View sample data
SELECT * FROM users LIMIT 5;
SELECT * FROM semesters;
SELECT * FROM subjects;
SELECT * FROM assessments WHERE student_id = 1;
SELECT * FROM timetable WHERE day_of_week = 'Monday';
SELECT * FROM discussion_posts;
