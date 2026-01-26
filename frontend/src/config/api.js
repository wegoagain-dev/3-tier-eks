// Use REACT_APP_API_URL if set, otherwise default to /api for production
// For local development, set REACT_APP_API_URL=http://localhost:8000/api
const API_URL = process.env.REACT_APP_API_URL || '/api';

export default API_URL;
