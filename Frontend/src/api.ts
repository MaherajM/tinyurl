import type { LinkItem, LinkListResponse } from './pages/DashboardPage';

const BASE =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8080';

async function handleResp<T>(res: Response): Promise<T> {
  const text = await res.text();
  const contentType = res.headers.get('content-type') || '';
  const body = contentType.includes('application/json') && text ? JSON.parse(text) : text;
  if (!res.ok) {
    const message = (body && body.error) || (body && body.message) || res.statusText;
    throw new Error(message || 'API error');
  }
  return body as T;
}

export async function getLinks(): Promise<LinkListResponse> {
  const res = await fetch(`${BASE}/api/links`);
  return handleResp<LinkListResponse>(res);
}

export async function createLink(payload: { target: string; code?: string }): Promise<LinkItem> {
  const res = await fetch(`${BASE}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResp<LinkItem>(res);
}

export async function getLink(code: string): Promise<LinkItem> {
  const res = await fetch(`${BASE}/api/links/${code}`);
  return handleResp<LinkItem>(res);
}

export async function deleteLink(code: string): Promise<void> {
  const res = await fetch(`${BASE}/api/links/${code}`, { method: 'DELETE' });
  return handleResp<void>(res);
}

export async function getHealthCheck(): Promise<any> {
  const res = await fetch(`${BASE}/healthz`);
  return handleResp<any>(res);
}

export async function redirectURL(code: string): Promise<void> {
  const res = await fetch(`${BASE}/api/redirect/${code}`, { method: 'GET' });
  return handleResp<void>(res);
}
