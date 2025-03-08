import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 30000, // 30 seconds (blockchain operations may take time)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Check if it's a token validation error
      if (error.response.data.error === 'Authentication failed') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (uid) => api.post('/signup', { uid }),
  login: (uid) => api.post('/login', { uid }),
  setKey: (key) => api.post('/set-key', { key }),
  blockchainLogin: (key) => api.post('/blockchain-login', { key }),
  blockchainLogout: () => api.post('/blockchain-logout'),
  checkBlockchainStatus: () => api.get('/check-key')
};

// Documents API
export const documentsAPI = {
  getDocuments: () => api.get('/documents/user-documents'),
  uploadDocument: (formData) => api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  downloadDocument: (cid) => api.get(`/documents/download/${cid}`, {
    responseType: 'blob'
  }),
  grantAccess: (userAddress) => api.post('/documents/grant-access', { userAddress }),
  revokeAccess: (userAddress) => api.post('/documents/revoke-access', { userAddress })
};

export default {
  auth: authAPI,
  documents: documentsAPI
};