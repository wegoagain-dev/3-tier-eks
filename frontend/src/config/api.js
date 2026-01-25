// Check if running inside Kubernetes cluster
const isKubernetes = process.env.KUBERNETES_SERVICE_HOST !== undefined;
// Use /api when in Kubernetes, otherwise use localhost for local dev
const API_URL = isKubernetes ? '/api' : 'http://localhost:8000/api';

export default API_URL;
