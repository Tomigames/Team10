import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:5000/api'
});

export function setUserIdHeader(userId) {
  if (userId) instance.defaults.headers['x-user-id'] = userId;
  else delete instance.defaults.headers['x-user-id'];
}

export default {
  // Auth
  login:   (u, p) => instance.post('/auth/login',   { username: u, password: p }).then(r => r.data),
  signup:  (u, p) => instance.post('/auth/signup',  { username: u, password: p }).then(r => r.data),

  // Page 2
  getCourses:     () => instance.get('/courses').then(r => r.data),
  // Page 3
  getCourse:      (courseId) => instance.get(`/courses/${courseId}`).then(r => r.data),
  getWeights:     (courseId) => instance.get(`/courses/${courseId}/weights`).then(r => r.data),
  updateWeights: (courseId, updates) =>
    instance.put(`/courses/${courseId}/weights`, { updates }).then(r => r.data),
};
