import { apiClient } from './apiClient';

/**
 * Login with email and password
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} { user, tokens }
 */
export async function login(credentials) {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
}

/**
 * Register new user
 * @param {Object} userData - Registration data
 * @returns {Promise<Object>}
 */
export async function register(userData) {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
}

/**
 * Logout current session
 * @returns {Promise<Object>}
 */
export async function logout() {
  const response = await apiClient.post('/auth/logout');
  return response.data;
}

/**
 * Refresh access token
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export async function refreshTokens(refreshToken) {
  const response = await apiClient.post('/auth/refresh', { refreshToken });
  return response.data;
}

/**
 * Get current user profile
 * @returns {Promise<Object>}
 */
export async function getMe() {
  const response = await apiClient.get('/auth/me');
  return response.data;
}

/**
 * Request password reset
 * @param {string} email
 * @returns {Promise<Object>}
 */
export async function forgotPassword(email) {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
}

/**
 * Reset password with token
 * @param {Object} data - { token, newPassword, confirmPassword }
 * @returns {Promise<Object>}
 */
export async function resetPassword(data) {
  const response = await apiClient.post('/auth/reset-password', data);
  return response.data;
}

/**
 * Change password (authenticated)
 * @param {Object} data - { currentPassword, newPassword, confirmPassword }
 * @returns {Promise<Object>}
 */
export async function changePassword(data) {
  const response = await apiClient.patch('/auth/change-password', data);
  return response.data;
}
