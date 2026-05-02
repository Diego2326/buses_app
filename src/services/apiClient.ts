import axios from 'axios';

function normalizeBaseUrl(baseUrl?: string) {
  if (!baseUrl) {
    return 'https://buses-api-322217156017.northamerica-south1.run.app/api/v1';
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
