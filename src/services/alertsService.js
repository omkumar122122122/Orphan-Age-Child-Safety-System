import { apiClient } from './apiClient';

/**
 * Unwrap helper — the backend returns:
 *   { success: true, data: { data: Alert[], stats: {...} } }
 * After unwrap the caller receives:
 *   { data: Alert[], stats: { total, high, pending } }
 */
const unwrap = (response) => (response?.success ? response.data : response);

export const alertsService = {
  /**
   * GET /alerts
   * Optional query params: { status, severity, type }
   * Returns: { data: Alert[], stats: { total, high, pending } }
   */
  getAll: (params = {}) =>
    apiClient.get('/alerts', params).then(unwrap),

  /**
   * PATCH /alerts/:id/resolve
   * Returns: { success: true, message: string }
   */
  resolve: (id) =>
    apiClient.patch(`/alerts/${id}/resolve`, {}).then(unwrap),
};
