import { getStoredToken } from './token';

const API_BASE_URL = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api').replace(/\/$/, '');

export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  const token = getStoredToken();

  // Normalize headers
  const headers: Record<string, string> = {};
  if (init && init.headers) {
    const h = init.headers as Record<string, string>;
    Object.assign(headers, h);
  }

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const opts: RequestInit = {
    ...init,
    credentials: 'include',
    headers,
  };

  // Resolve URL:
  let url: RequestInfo = input;
  if (typeof input === 'string') {
    // If input already includes API_BASE_URL, leave it alone
    if (input.startsWith(API_BASE_URL)) {
      url = input;
    } else if (input.startsWith('/')) {
      // Prepend API_BASE_URL for relative paths
      url = `${API_BASE_URL}${input}`;
    } else {
      url = input;
    }
  }

  return fetch(url, opts);
}

export default apiFetch;
