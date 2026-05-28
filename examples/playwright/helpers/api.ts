import { type APIRequestContext } from '@playwright/test';

export async function apiGet(
  request: APIRequestContext,
  path: string,
) {
  const response = await request.get(path);
  if (!response.ok()) {
    throw new Error(`GET ${path} failed: ${response.status()} ${response.statusText()}`);
  }
  return response.json();
}

export async function apiPost(
  request: APIRequestContext,
  path: string,
  data: Record<string, unknown>,
) {
  const response = await request.post(path, { data });
  if (!response.ok()) {
    throw new Error(`POST ${path} failed: ${response.status()} ${response.statusText()}`);
  }
  return response.json();
}

export async function apiDelete(
  request: APIRequestContext,
  path: string,
) {
  const response = await request.delete(path);
  if (!response.ok() && response.status() !== 204) {
    throw new Error(`DELETE ${path} failed: ${response.status()} ${response.statusText()}`);
  }
}

export async function createResource(
  request: APIRequestContext,
  path: string,
  data: Record<string, unknown>,
) {
  return apiPost(request, path, data);
}

export async function deleteResource(
  request: APIRequestContext,
  path: string,
  id: string | number,
) {
  return apiDelete(request, `${path}/${id}`);
}