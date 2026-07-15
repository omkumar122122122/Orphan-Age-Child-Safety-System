/**
 * authService.js  —  LOCAL DEMO (no backend required)
 *
 * Simulates login/logout using the hardcoded users in dummyData.
 * To connect a real backend later, replace fakeLogin with an actual
 * API call and return the same { user, tokens } shape.
 */

import { users } from "../data/dummyData";

/** 550 ms simulated network delay */
const delay = (ms = 550) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Login — matches email + password against dummy users.
 * Returns the shape AuthContext expects: { user, tokens }.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: object, tokens: { accessToken: string, refreshToken: string } }>}
 */
export async function login({ email, password }) {
  await delay();

  const found = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!found) {
    const err = new Error("Invalid email or password. Check the demo credentials below.");
    err.status = 401;
    throw err;
  }

  // Strip password before storing
  const { password: _pw, ...safeUser } = found;

  return {
    user:   safeUser,
    tokens: {
      accessToken:  `demo-access-${safeUser.id}-${Date.now()}`,
      refreshToken: `demo-refresh-${safeUser.id}-${Date.now()}`,
    },
  };
}

/** Logout — nothing to do for demo mode */
export async function logout() {
  await delay(100);
  return { success: true };
}

/** Refresh tokens — demo just returns new fake tokens */
export async function refreshTokens(refreshToken) {
  await delay(100);
  return {
    accessToken:  `demo-access-refreshed-${Date.now()}`,
    refreshToken: `demo-refresh-refreshed-${Date.now()}`,
  };
}
