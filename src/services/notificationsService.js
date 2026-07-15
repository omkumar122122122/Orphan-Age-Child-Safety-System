import apiClient from './apiClient';

const notificationsService = {
  // Get user's notifications with pagination and filters
  getAll: (params) => apiClient.get('/notifications', { params }),

  // Get unread count for badge
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),

  // Get notification by ID
  getById: (id) => apiClient.get(`/notifications/${id}`),

  // Mark single notification as read
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),

  // Mark all notifications as read
  markAllAsRead: () => apiClient.patch('/notifications/read-all'),

  // Delete a notification
  delete: (id) => apiClient.delete(`/notifications/${id}`),

  // Clear all read notifications
  clearRead: () => apiClient.delete('/notifications/clear-read/all'),
};

export default notificationsService;
