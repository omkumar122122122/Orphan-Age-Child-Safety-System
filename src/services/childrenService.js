import { apiClient } from './apiClient';

export const childrenService = {
  /**
   * Get all children with filters and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.search - Search query
   * @param {string} params.orphanageId - Filter by orphanage
   * @param {string} params.risk - Filter by risk level
   * @param {string} params.status - Filter by status
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} - { data, pagination, summary }
   */
  async getAll(params = {}) {
    const cleanParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    return apiClient.get('/children', cleanParams);
  },

  /**
   * Get child profile by ID
   * @param {string} id - Child ID
   * @returns {Promise<Object>} - Child profile data
   */
  async getById(id) {
    return apiClient.get(`/children/${id}`);
  },

  /**
   * Get recently registered children
   * @param {number} limit - Number of children to return
   * @returns {Promise<Array>} - Array of child objects
   */
  async getRecent(limit = 5) {
    return apiClient.get('/children/recent', { limit });
  },

  /**
   * Register a new child
   * @param {Object} childData - Child data
   * @param {File} photoFile - Child photo file
   * @returns {Promise<Object>} - Created child response
   */
  async create(childData, photoFile) {
    const formData = new FormData();

    // Append all child data fields
    Object.entries(childData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    // Append photo if provided
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    return apiClient.post('/children', formData);
  },

  /**
   * Update child information
   * @param {string} id - Child ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<void>}
   */
  async update(id, updates) {
    return apiClient.patch(`/children/${id}`, updates);
  },

  /**
   * Delete a child record (soft delete)
   * @param {string} id - Child ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    return apiClient.delete(`/children/${id}`);
  },

  /**
   * Download medical file for a child
   * @param {string} id - Child ID
   * @returns {Promise<Blob>} - File blob
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
