import { apiClient } from './apiClient';

// Helper: unwrap the TransformInterceptor envelope
// Backend always wraps responses as: { success, statusCode, data: <payload>, timestamp }
// We extract .data so callers receive the actual payload directly.
function unwrap(response) {
  if (response && typeof response === 'object' && 'data' in response && 'success' in response) {
    return response.data;
  }
  return response;
}

export const childrenService = {
  /**
   * Get all children with filters and pagination
   * @returns {Promise<{ data: Array, pagination: Object, summary: Object }>}
   */
  async getAll(params = {}) {
    const cleanParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const response = await apiClient.get('/children', cleanParams);
    return unwrap(response);
  },

  /**
   * Get child profile by ID
   * @param {string} id
   * @returns {Promise<Object>} Child profile data
   */
  async getById(id) {
    const response = await apiClient.get(`/children/${id}`);
    return unwrap(response);
  },

  /**
   * Get recently registered children
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getRecent(limit = 5) {
    const response = await apiClient.get('/children/recent', { limit });
    return unwrap(response);
  },

  /**
   * Register a new child
   * @param {Object} childData
   * @param {File} photoFile
   * @returns {Promise<Object>} Created child response
   */
  async create(childData, photoFile) {
    const formData = new FormData();

    Object.entries(childData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    if (photoFile) {
      formData.append('photo', photoFile);
    }

    const response = await apiClient.post('/children', formData);
    return unwrap(response);
  },

  /**
   * Update child information
   * @param {string} id
   * @param {Object} updates
   * @returns {Promise<void>}
   */
  async update(id, updates) {
    const response = await apiClient.patch(`/children/${id}`, updates);
    return unwrap(response);
  },

  /**
   * Delete a child record (soft delete)
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    const response = await apiClient.delete(`/children/${id}`);
    return unwrap(response);
  },

  /**
   * Download medical file for a child
   * @param {string} id
   * @returns {Promise<Blob>}
   */
  async downloadMedicalFile(id) {
    const token = apiClient.getAuthToken();
    const response = await fetch(`${apiClient.baseURL}/children/${id}/medical-file`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download medical file');
    }

    return response.blob();
  },
};
