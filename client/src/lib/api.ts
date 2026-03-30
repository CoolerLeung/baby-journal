const BASE = import.meta.env.VITE_API_URL || '';

type ApiResponse<T> = { ok: true; data: T; meta?: any } | { ok: false; error: string };

async function request<T>(path: string, opts: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string>),
  };
  if (token && !path.startsWith('/api/auth/')) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (opts.body && typeof opts.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  try {
    const res = await fetch(`${BASE}${path}`, { ...opts, headers });
    const json = await res.json();
    if (json.ok) return { ok: true, data: json.data, meta: json.meta };
    return { ok: false, error: json.error || 'Request failed' };
  } catch (e: any) {
    return { ok: false, error: e.message || 'Network error' };
  }
}

function setToken(token: string) { localStorage.setItem('token', token); }
function clearToken() { localStorage.removeItem('token'); }
function getToken() { return localStorage.getItem('token'); }

export const authApi = {
  login: (email: string, password: string) =>
    request<any>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: { email?: string; phone?: string; password: string; nickname?: string }) =>
    request<any>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request<any>('/api/auth/me'),
};

export const recordsApi = {
  list: (page = 1, pageSize = 20) =>
    request<any[]>(`/api/records?page=${page}&pageSize=${pageSize}`),
  get: (id: string) => request<any>(`/api/records/${id}`),
  create: (data: { date: string; title: string; memo?: string; mediaType?: string; mediaIds?: string[] }) =>
    request<any>('/api/records', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/api/records/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/records/${id}`, { method: 'DELETE' }),
};

export const uploadApi = {
  upload: async (files: File[], onProgress?: (pct: number) => void) => {
    const token = getToken();
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    if (onProgress) onProgress(50);
    try {
      const res = await fetch(`${BASE}/api/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const json = await res.json();
      if (onProgress) onProgress(100);
      if (json.ok) return { ok: true as const, data: json.data };
      return { ok: false as const, error: json.error };
    } catch (e: any) {
      return { ok: false as const, error: e.message };
    }
  },
};

export { setToken, clearToken, getToken };
