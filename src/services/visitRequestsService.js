/**
 * visitRequestsService.js — Visit Request API client
 * Backend: /api/v1/visit-requests/*
 */

import { apiClient } from './apiClient';

function unwrap(response) {
  if (response && typeof response === 'object' && 'data' in response && 'success' in response) {
    return response.data;
  }
  return response;
}

export const visitRequestsService = {
  /**
   * Create a visit request (Parent)
   * @param {Object} payload
   */
  async create(payload) {
    const response = await apiClient.post('/visit-requests', payload);
    return unwrap(response);
  },

  /**
   * List visit requests with filters
   * Parent sees own; Orphanage sees their orphanage; Admin sees all
   */
  async getAll(params = {}) {
    const cleanParams = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const response = await apiClient.get('/visit-requests', cleanParams);
    return unwrap(response);
  },

  /**
   * Get single visit request by ID
   */
  async getById(id) {
    const response = await apiClient.get(`/visit-requests/${id}`);
    return unwrap(response);
  },

  /**
   * Get dashboard stats for orphanage/admin manage page
   */
  async getStats(params = {}) {
    const response = await apiClient.get('/visit-requests/stats', params);
    return unwrap(response);
  },

  /**
   * Get my requests (parent shortcut)
   */
  async getMyRequests(params = {}) {
    const response = await apiClient.get('/visit-requests/my-requests', params);
    return unwrap(response);
  },

  /**
   * Get today's scheduled visits
   */
  async getTodayVisits() {
    const response = await apiClient.get('/visit-requests/today');
    return unwrap(response);
  },

  /**
   * Approve a visit request (Orphanage / Admin)
   */
  async approve(id, data = {}) {
    const response = await apiClient.patch(`/visit-requests/${id}/approve`, data);
    return unwrap(response);
  },

  /**
   * Reject a visit request
   */
  async reject(id, { reason, comments } = {}) {
    const response = await apiClient.patch(`/visit-requests/${id}/reject`, {
      reason,
      comments,
    });
    return unwrap(response);
  },

  /**
   * Reschedule a visit request
   */
  async reschedule(id, { newDate, newTime, reason, notifyParent } = {}) {
    const response = await apiClient.patch(`/visit-requests/${id}/reschedule`, {
      newDate,
      newTime,
      reason,
      notifyParent,
    });
    return unwrap(response);
  },

  /**
   * Request additional documents from parent
   */
  async requestDocuments(id, documentsData) {
    const response = await apiClient.patch(`/visit-requests/${id}/request-documents`, documentsData);
    return unwrap(response);
  },

  /**
   * Cancel a visit request (Parent or Admin)
   */
  async cancel(id, reason) {
    const response = await apiClient.patch(`/visit-requests/${id}/cancel`, { reason });
    return unwrap(response);
  },

  /**
   * Mark visit as completed
   */
  async complete(id, feedbackData) {
    const response = await apiClient.patch(`/visit-requests/${id}/complete`, feedbackData);
    return unwrap(response);
  },
};
