import axios from 'axios';

// Create axios instance with default config
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for logging
instance.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
instance.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  error => {
    console.error('API Response Error:', error.response || error);
    return Promise.reject(error);
  }
);

export function setUserIdHeader(userId) {
  if (userId) {
    console.log(`Setting user ID header to: ${userId}`);
    instance.defaults.headers['x-user-id'] = userId;
  } else {
    console.log('Removing user ID header');
    delete instance.defaults.headers['x-user-id'];
  }
}

export default {
  // Grade weights
  getWeights: (courseId) =>
    instance.get(`/courses/${courseId}/weights`)
      .then(r => r.data)
      .catch(error => {
        console.error(`Error fetching weights for course ${courseId}:`, error);
        throw error;
      }),
      
  updateWeights: (courseId, updates) =>
    instance.put(`/courses/${courseId}/weights`, { updates })
      .then(r => r.data)
      .catch(error => {
        console.error(`Error updating weights for course ${courseId}:`, error);
        throw error;
      }),

  // Credits
  getCredits: (userId) =>
    instance.get(`/users/${userId}/credits`)
      .then(r => r.data)
      .catch(error => {
        console.error(`Error fetching credits for user ${userId}:`, error);
        throw error;
      }),
};
