const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('branch');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// Auth
export const authApi = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email, name) => request('/auth/register', { method: 'POST', body: JSON.stringify({ email, name }) }),
  setPassword: (token, password) => request('/auth/set-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
  getBranches: () => request('/auth/branches'),
};

// Processes
export const processApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/processes?${qs}`);
  },
  getById: (id) => request(`/processes/${id}`, {}),
  getCategories: () => request('/processes/categories'),
  triggerSync: () => request('/sync', { method: 'POST' }),
};

// Chat - returns EventSource-like interface
export function sendChatMessage(message, sessionId) {
  return fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ message, sessionId }),
  });
}

export const chatApi = {
  getSessions: () => request('/chat/sessions'),
  getMessages: (sessionId) => request(`/chat/sessions/${sessionId}/messages`),
};

// Tests (legacy AI-generated)
export const testApi = {
  generate: (processId) => request(`/tests/generate/${processId}`, { method: 'POST' }),
  getQuestions: (processId) => request(`/tests/questions/${processId}`),
  submit: (processId, answers) => request(`/tests/submit/${processId}`, { method: 'POST', body: JSON.stringify({ answers }) }),
  getAttempts: (processId) => request(`/tests/attempts/${processId}`),
  getLeaderboard: (processId) => request(`/tests/leaderboard/${processId}`),
  getGlobalLeaderboard: () => request('/tests/leaderboard'),
};

// Assessment Bank (pillar/module-based)
export const assessmentApi = {
  getPillars: () => request('/assessments/pillars'),
  getPillarDetail: (pillarId) => request(`/assessments/pillars/${pillarId}`),
  startTest: (pillarId, moduleId) => request(`/assessments/start/${pillarId}/${moduleId}`, { method: 'POST' }),
  submitTest: (pillarId, moduleId, answers, sessionId) =>
    request(`/assessments/submit/${pillarId}/${moduleId}`, {
      method: 'POST',
      body: JSON.stringify({ answers, sessionId }),
    }),
  getLeaderboard: (pillarId) => request(`/assessments/leaderboard/${pillarId}`),
  getGlobalLeaderboard: () => request('/assessments/leaderboard'),
  getScenarios: () => request('/assessments/scenarios'),
};
