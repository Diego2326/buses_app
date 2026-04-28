import axios from 'axios';

function normalizeBaseUrl(baseUrl?: string) {
  if (!baseUrl) {
    return 'http://localhost:8080/api/v1';
  }

  return baseUrl.replace(/\/+$/, '');
}

export const apiClient = axios.create({
  baseURL: normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL),
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token?: string) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
}
