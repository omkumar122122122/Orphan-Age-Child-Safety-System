const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('child_safety_token') || sessionStorage.getItem('child_safety_token');
  }

  async request(endpoint, options = {}) {
    const token = this.getAuthToken();
    
    const config = {
      ...options,
      headers: {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, config);

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Format validation error messages from NestJS
        let errorMessage = '';
        if (response.status === 400 && data) {
          // NestJS validation errors come as array of messages
          if (data.statusCode === 400) {
            console.error('API Validation Error:', data);
            if (Array.isArray(data.message)) {
              errorMessage = data.message.join('; ');
            } else if (typeof data.message === 'string') {
              errorMessage = data.message;
            } else {
              errorMessage = 'Validation error - check console for details';
            }
          } else {
            errorMessage = data.message || data.error || `Validation error: ${JSON.stringify(data)}`;
          }
        } else {
          errorMessage = data?.message || data?.error || `HTTP ${response.status}`;
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        error.validation = data?.statusCode === 400 ? data : null;
        throw error;
      }

      return data;
    } catch (error) {
      // Network or parsing error
      if (!error.status) {
        error.message = 'Network error. Please check your connection.';
      }
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
