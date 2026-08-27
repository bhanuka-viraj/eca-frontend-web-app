import axios from 'axios';

// Default gateway URLs
export const DEFAULT_GATEWAY_URLS = [
  { label: 'Local API Gateway (Port 8080)', url: 'http://localhost:8080', env: 'Local Dev' },
  { label: 'GCP Cloud Run Gateway', url: 'https://eca-api-gateway-535026634701.us-central1.run.app', env: 'Cloud Run' },
  { label: 'GCP Load Balancer (Static IP)', url: 'http://34.118.224.120:8080', env: 'Production' }
];

const STORAGE_KEY = 'educloud_gateway_url';

export const getGatewayUrl = () => {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_GATEWAY_URLS[0].url;
};

export const setGatewayUrl = (url) => {
  const sanitized = url.replace(/\/+$/, '');
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
    // Fallback: Check if /api/v1/courses or /api/v1/users is reachable
    try {
      const fallbackRes = await axios.get(`${targetUrl}/api/v1/courses`, { timeout: 4000 });
      const latency = Math.round(performance.now() - startTime);
      return {
        success: true,
        status: fallbackRes.status,
        data: { status: 'UP (via Course API route)' },
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
          data: { status: 'UP (via User API route)' },
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

// User Service APIs (Cloud SQL MySQL)
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

// Course Service APIs (MongoDB NoSQL)
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

// Media Service APIs (Google Cloud Storage)
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
