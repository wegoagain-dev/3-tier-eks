// Check if running inside Kubernetes cluster
const isKubernetes = process.env.KUBERNETES_SERVICE_HOST !== undefined;
// Check if accessing via localhost
const isLocalhost = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1';
// Use /api when in Kubernetes, otherwise use localhost for local dev
const API_URL = isKubernetes ? '/api' : 'http://localhost:8000/api';

export default API_URL;
