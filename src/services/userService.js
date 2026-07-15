import apiClient from './apiClient';

const BASE_URL = '/users';

/**
 * Get paginated list of users with optional filtering
 */
export async function getUsers({
  page = 1,
  limit = 20,
  role,
  search,
  isActive,
} = {}) {
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (role) params.append('role', role);
  if (search) params.append('search', search);
  if (isActive !== undefined) params.append('isActive', isActive);

  const response = await apiClient.get(`${BASE_URL}?${params.toString()}`);
  return response.data;
}

/**
 * Get user statistics (admin only)
 */
export async function getStats() {
  const response = await apiClient.get(`${BASE_URL}/stats`);
  return response.data;
}

/**
 * Get user by ID
 */
export async function getUserById(userId) {
  const response = await apiClient.get(`${BASE_URL}/${userId}`);
  return response.data;
}

/**
 * Update authenticated user's own profile
 */
export async function updateProfile(data) {
  const response = await apiClient.patch(`${BASE_URL}/me`, data);
  return response.data;
}

/**
 * Update user role (admin only)
 */
export async function updateRole(userId, newRole) {
  const response = await apiClient.patch(`${BASE_URL}/${userId}/role`, {
    role: newRole,
  });
  return response.data;
}

/**
 * Update user status / activate / deactivate (admin only)
 */
export async function updateStatus(userId, isActive) {
  const response = await apiClient.patch(`${BASE_URL}/${userId}/status`, {
    isActive,
  });
  return response.data;
}

/**
 * Soft-delete user (admin only)
 */
export async function deleteUser(userId) {
  const response = await apiClient.delete(`${BASE_URL}/${userId}`);
  return response.data;
}

export default {
  getUsers,
  getStats,
  getUserById,
  updateProfile,
  updateRole,
  updateStatus,
  deleteUser,
};
