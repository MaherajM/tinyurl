import axios from 'axios';
import type { LinkItem, LinkListResponse } from './pages/DashboardPage';

const BASE =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getLinks(): Promise<LinkListResponse> {
  const { data } = await api.get('/api/links');
  return data;
}

export async function createLink(payload: { target: string; code?: string }): Promise<LinkItem> {
  const { data } = await api.post('/api/links', payload);
  return data;
}

export async function getLink(code: string): Promise<LinkItem> {
  const { data } = await api.get(`/api/links/${code}`);
  return data;
}

export async function deleteLink(code: string): Promise<void> {
  await api.delete(`/api/links/${code}`);
}

export async function getHealthCheck(): Promise<any> {
  const { data } = await api.get('/healthz');
  return data;
}

export async function getRedirectTarget(code: string): Promise<string> {
  try {
    const { data, status } = await api.get(`/api/links/redirect/${code}`);

    console.log('Redirect API response:', { status, data });

    if (data.success && data.target) {
      return data.target;
    }

    throw new Error('No target URL found');
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(error.response?.data?.error || 'Link not found');
    }

    throw new Error(error.response?.data?.error || error.message || 'Failed to load redirect URL');
  }
}
