import axios from 'axios';

// Default gateway presets
export const DEFAULT_GATEWAY_URLS = [
  { label: 'Cloud Run Proxy (HTTPS Same-Origin)', url: '', env: 'Production Cloud Run' },
  { label: 'Cloud Gateway Load Balancer', url: 'http://34.160.86.95', env: 'Global Load Balancer' },
  { label: 'Local Development Server', url: 'http://localhost:8080', env: 'Localhost' }
];

const STORAGE_KEY = 'educloud_gateway_url';

export const getGatewayUrl = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved !== null && saved !== undefined) {
    return saved;
  }
  // Auto-detect production vs localhost
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return '';
  }
  return DEFAULT_GATEWAY_URLS[1].url;
};

export const setGatewayUrl = (url) => {
  const sanitized = url ? url.replace(/\/+$/, '') : '';
  localStorage.setItem(STORAGE_KEY, sanitized);
  return sanitized;
};

// Create dynamic Axios instance
const createApiClient = () => {
  const baseURL = getGatewayUrl();
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
};

// Real-Time Health Check with Latency measurement
export const checkGatewayHealth = async (customUrl = null) => {
  const targetUrl = (customUrl || getGatewayUrl()).replace(/\/+$/, '');
  const startTime = performance.now();
  try {
    const response = await axios.get(`${targetUrl}/actuator/health`, {
      timeout: 5000
    });
    const latency = Math.round(performance.now() - startTime);
    return {
      success: true,
      status: response.status,
      data: response.data,
      latency,
      url: targetUrl
    };
  } catch (error) {
    // Fallback: Check if /api/v1/courses is reachable
    try {
      const fallbackRes = await axios.get(`${targetUrl}/api/v1/courses`, { timeout: 4000 });
      const latency = Math.round(performance.now() - startTime);
      return {
        success: true,
        status: fallbackRes.status,
        data: { status: 'UP' },
        latency,
        url: targetUrl
      };
    } catch (fallbackError) {
      try {
        const userFallback = await axios.get(`${targetUrl}/api/v1/users`, { timeout: 3000 });
        const latency = Math.round(performance.now() - startTime);
        return {
          success: true,
          status: userFallback.status,
          data: { status: 'UP' },
          latency,
          url: targetUrl
        };
      } catch (finalError) {
        const latency = Math.round(performance.now() - startTime);
        return {
          success: false,
          error: error.message || 'Connection failed',
          latency,
          url: targetUrl
        };
      }
    }
  }
};

// User Service APIs
export const userService = {
  getAll: async () => {
    const api = createApiClient();
    const response = await api.get('/api/v1/users');
    return response.data;
  },
  getById: async (id) => {
    const api = createApiClient();
    const response = await api.get(`/api/v1/users/${id}`);
    return response.data;
  },
  create: async (userData) => {
    const api = createApiClient();
    const response = await api.post('/api/v1/users', userData);
    return response.data;
  },
  update: async (id, userData) => {
    const api = createApiClient();
    const response = await api.put(`/api/v1/users/${id}`, userData);
    return response.data;
  },
  delete: async (id) => {
    const api = createApiClient();
    const response = await api.delete(`/api/v1/users/${id}`);
    return response.data;
  }
};

// Course Service APIs
export const courseService = {
  getAll: async () => {
    const api = createApiClient();
    const response = await api.get('/api/v1/courses');
    return response.data;
  },
  getById: async (id) => {
    const api = createApiClient();
    const response = await api.get(`/api/v1/courses/${id}`);
    return response.data;
  },
  create: async (courseData) => {
    const api = createApiClient();
    const response = await api.post('/api/v1/courses', courseData);
    return response.data;
  },
  update: async (id, courseData) => {
    const api = createApiClient();
    const response = await api.put(`/api/v1/courses/${id}`, courseData);
    return response.data;
  },
  delete: async (id) => {
    const api = createApiClient();
    const response = await api.delete(`/api/v1/courses/${id}`);
    return response.data;
  }
};

// Media Service APIs
export const mediaService = {
  upload: async (file, onProgress) => {
    const baseURL = getGatewayUrl();
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${baseURL}/api/v1/media/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      }
    });
    return response.data;
  }
};
