import { api } from './api.js';

export async function fetchApiKeys() {
  const res = await api.get('/keys');
  return res.data;
}

export async function addApiKey({ provider, key }) {
  const res = await api.post('/keys', { provider, key });
  return res.data;
}

export async function deleteApiKey(provider, id) {
  const res = await api.delete(`/keys/${provider}/${id}`);
  return res.data;
}

export async function resetAllCooldowns() {
  const res = await api.post('/keys/reset-cooldowns');
  return res.data;
}

export async function testApiKey({ provider, key }) {
  const res = await api.post('/keys/test', { provider, key });
  return res.data;
}

