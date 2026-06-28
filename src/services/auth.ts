import { API_BASE_URL } from './api';
import apiFetch from './fetcher';
import { setStoredToken } from './token';

export interface AuthUser {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
}

export async function login(email: string, password: string) {
  const res = await apiFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const payload = await res.json().catch(() => ({ message: res.statusText }));

  if (!res.ok) {
    throw new Error(payload.message || payload.error || 'Login failed');
  }

  if (payload?.token) setStoredToken(payload.token);
  return payload as { token: string; user: AuthUser };
}

export async function signup(payload: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}) {
  const res = await apiFetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({ message: res.statusText }));

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Sign up failed');
  }

  if (data?.token) setStoredToken(data.token);
  return data as { token: string; user: AuthUser };
}

/** @deprecated use login() */
export async function adminLogin(email: string, password: string) {
  return login(email, password);
}

export async function getCurrentUser(): Promise<{ user: AuthUser | null }> {
  const res = await apiFetch(`${API_BASE_URL}/auth/me`);
  if (!res.ok) return { user: null };
  return res.json();
}

export async function logout() {
  try {
    await apiFetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
  } catch {
    // still clear local token
  }
  setStoredToken(null);
}

/** @deprecated use logout() */
export async function adminLogout() {
  return logout();
}
