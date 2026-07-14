import { apiClient } from './apiClient';

/**
 * Parents Service
 * Handles all parent-related API calls
 */
class ParentsService {
  /**
   * Create a new parent profile
   * @param {Object} parentData - Parent profile data
   * @returns {Promise<Object>} Created parent profile
   */
  async createParent(parentData) {
    return apiClient.post('/parents', parentData);
  }

  /**
   * Get all parents with filters and pagination
   * @param {Object} params - Query parameters (page, limit, search, verificationStatus, kycStatus, minTrustScore, maxTrustScore)
   * @returns {Promise<Object>} Paginated parents list
   */
  async getAllParents(params = {}) {
    return apiClient.get('/parents', params);
  }

  /**
   * Get parent profile by ID
   * @param {string} id - Parent ID
   * @returns {Promise<Object>} Parent profile
   */
  async getParentById(id) {
    return apiClient.get(`/parents/${id}`);
  }

  /**
   * Update parent profile
   * @param {string} id - Parent ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Success message
   */
  async updateParent(id, updates) {
    return apiClient.patch(`/parents/${id}`, updates);
  }

  /**
   * Delete parent profile (soft delete)
   * @param {string} id - Parent ID
   * @returns {Promise<Object>} Success message
   */
  async deleteParent(id) {
    return apiClient.delete(`/parents/${id}`);
  }

  /**
   * Get parent dashboard data (for logged-in parent)
   * @returns {Promise<Object>} Dashboard data
   */
  async getDashboard() {
    return apiClient.get('/parents/dashboard');
  }

  /**
   * Get parent KYC status (for logged-in parent)
   * @returns {Promise<Object>} KYC status
   */
  async getKycStatus() {
    return apiClient.get('/parents/kyc');
  }

  /**
   * Update parent verification status (Admin only)
   * @param {string} id - Parent ID
   * @param {Object} statusData - { verificationStatus, verificationNotes }
   * @returns {Promise<Object>} Success message
   */
  async updateVerificationStatus(id, statusData) {
    return apiClient.patch(`/parents/${id}/verification-status`, statusData);
  }

  /**
   * Approve parent application (Admin only)
   * @param {string} id - Parent ID
   * @returns {Promise<Object>} Success message
   */
  async approveParent(id) {
    return apiClient.post(`/parents/${id}/approve`);
  }

  /**
   * Reject parent application (Admin only)
   * @param {string} id - Parent ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<Object>} Success message
   */
  async rejectParent(id, reason) {
    return apiClient.post(`/parents/${id}/reject`, { reason });
  }

  /**
   * Get verification queue (Admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Verification queue with stats
   */
  async getVerificationQueue(params = {}) {
    return apiClient.get('/admin/parents/verification/queue', params);
  }

  /**
   * Get full parent verification details (Admin only)
   * @param {string} id - Parent ID
   * @returns {Promise<Object>} Full parent profile with all details
   */
  async getVerificationDetails(id) {
    return apiClient.get(`/admin/parents/${id}/verification-details`);
  }
}

export const parentsService = new ParentsService();
