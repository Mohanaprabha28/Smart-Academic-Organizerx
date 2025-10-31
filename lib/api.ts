// API Configuration and Utility Functions
// Save this file as: lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Generic API call function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
}

// User API
export const userApi = {
  getAll: () => apiCall('users.php'),
  
  getById: (id: number) => apiCall(`users.php?id=${id}`),
  
  getByRole: (role: string) => apiCall(`users.php?role=${role}`),
  
  create: (userData: any) => apiCall('users.php', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (email: string, password: string) => apiCall('users.php', {
    method: 'POST',
    body: JSON.stringify({ action: 'login', email, password }),
  }),
  
  update: (userData: any) => apiCall('users.php', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  delete: (id: number) => apiCall(`users.php?id=${id}`, {
    method: 'DELETE',
  }),
};

// Semester API
export const semesterApi = {
  getAll: () => apiCall('semesters.php'),
  
  getById: (id: number) => apiCall(`semesters.php?id=${id}`),
  
  create: (semesterData: any) => apiCall('semesters.php', {
    method: 'POST',
    body: JSON.stringify(semesterData),
  }),
  
  update: (semesterData: any) => apiCall('semesters.php', {
    method: 'PUT',
    body: JSON.stringify(semesterData),
  }),
  
  delete: (id: number) => apiCall(`semesters.php?id=${id}`, {
    method: 'DELETE',
  }),
};

// Subject API
export const subjectApi = {
  getAll: () => apiCall('subjects.php'),
  
  getById: (id: number) => apiCall(`subjects.php?id=${id}`),
  
  getBySemester: (semesterId: number) => apiCall(`subjects.php?semester_id=${semesterId}`),
  
  create: (subjectData: any) => apiCall('subjects.php', {
    method: 'POST',
    body: JSON.stringify(subjectData),
  }),
  
  update: (subjectData: any) => apiCall('subjects.php', {
    method: 'PUT',
    body: JSON.stringify(subjectData),
  }),
  
  delete: (id: number) => apiCall(`subjects.php?id=${id}`, {
    method: 'DELETE',
  }),
};

// Marks API
export const marksApi = {
  getAll: () => apiCall('marks.php'),
  
  getByStudent: (studentId: number) => apiCall(`marks.php?student_id=${studentId}`),
  
  getById: (id: number) => apiCall(`marks.php?id=${id}`),
  
  create: (assessmentData: any) => apiCall('marks.php', {
    method: 'POST',
    body: JSON.stringify(assessmentData),
  }),
  
  update: (assessmentData: any) => apiCall('marks.php', {
    method: 'PUT',
    body: JSON.stringify(assessmentData),
  }),
  
  delete: (id: number) => apiCall(`marks.php?id=${id}`, {
    method: 'DELETE',
  }),
};

// Timetable API
export const timetableApi = {
  getAll: () => apiCall('timetable.php'),
  
  getByDay: (day: string) => apiCall(`timetable.php?day=${day}`),
  
  create: (entryData: any) => apiCall('timetable.php', {
    method: 'POST',
    body: JSON.stringify(entryData),
  }),
  
  update: (entryData: any) => apiCall('timetable.php', {
    method: 'PUT',
    body: JSON.stringify(entryData),
  }),
  
  delete: (id: number) => apiCall(`timetable.php?id=${id}`, {
    method: 'DELETE',
  }),
};

// Discussion API
export const discussionApi = {
  getAll: () => apiCall('discussions.php'),
  
  getById: (id: number) => apiCall(`discussions.php?id=${id}`),
  
  getByUnit: (unitId: number) => apiCall(`discussions.php?unit_id=${unitId}`),
  
  create: (postData: any) => apiCall('discussions.php', {
    method: 'POST',
    body: JSON.stringify(postData),
  }),
  
  addComment: (postId: number, userId: number, content: string) => apiCall('discussions.php', {
    method: 'POST',
    body: JSON.stringify({ action: 'comment', post_id: postId, user_id: userId, content }),
  }),
  
  toggleUpvote: (postId: number, userId: number) => apiCall('discussions.php', {
    method: 'POST',
    body: JSON.stringify({ action: 'upvote', post_id: postId, user_id: userId }),
  }),
  
  update: (postData: any) => apiCall('discussions.php', {
    method: 'PUT',
    body: JSON.stringify(postData),
  }),
  
  delete: (id: number) => apiCall(`discussions.php?id=${id}`, {
    method: 'DELETE',
  }),
  
  deleteComment: (id: number) => apiCall(`discussions.php?id=${id}&type=comment`, {
    method: 'DELETE',
  }),
};

// Chatbot API
export const chatbotApi = {
  getHistory: (userId: number, unitId?: number) => {
    const url = unitId 
      ? `chatbot.php?user_id=${userId}&unit_id=${unitId}`
      : `chatbot.php?user_id=${userId}`;
    return apiCall(url);
  },
  
  sendMessage: (userId: number, unitId: number, message: string) => apiCall('chatbot.php', {
    method: 'POST',
    body: JSON.stringify({ action: 'send', user_id: userId, unit_id: unitId, message }),
  }),
  
  clearHistory: (userId: number) => apiCall(`chatbot.php?user_id=${userId}`, {
    method: 'DELETE',
  }),
};

// Quiz API
export const quizApi = {
  getAll: () => apiCall('quiz.php'),
  
  getById: (id: number) => apiCall(`quiz.php?id=${id}&type=quiz`),
  
  getBySubject: (subjectId: number) => apiCall(`quiz.php?subject_id=${subjectId}`),
  
  getStudentAttempts: (studentId: number) => apiCall(`quiz.php?student_id=${studentId}&type=attempts`),
  
  create: (quizData: any) => apiCall('quiz.php', {
    method: 'POST',
    body: JSON.stringify(quizData),
  }),
  
  createQuestion: (questionData: any) => apiCall('quiz.php', {
    method: 'POST',
    body: JSON.stringify({ action: 'create_question', ...questionData }),
  }),
  
  submitAttempt: (quizId: number, studentId: number, answers: any, timeTaken: number) => apiCall('quiz.php', {
    method: 'POST',
    body: JSON.stringify({ 
      action: 'submit', 
      quiz_id: quizId, 
      student_id: studentId, 
      answers, 
      time_taken: timeTaken 
    }),
  }),
  
  update: (quizData: any) => apiCall('quiz.php', {
    method: 'PUT',
    body: JSON.stringify(quizData),
  }),
  
  delete: (id: number) => apiCall(`quiz.php?id=${id}`, {
    method: 'DELETE',
  }),
  
  deleteQuestion: (id: number) => apiCall(`quiz.php?id=${id}&type=question`, {
    method: 'DELETE',
  }),
};

export default {
  userApi,
  semesterApi,
  subjectApi,
  marksApi,
  timetableApi,
  discussionApi,
  chatbotApi,
  quizApi,
};
