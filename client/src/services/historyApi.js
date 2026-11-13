import { api } from './api.js';

export async function fetchScanHistory(filter = {}) {
  const params = new URLSearchParams();
  if (filter.mediaType) params.append('mediaType', filter.mediaType);
  if (filter.verdict) params.append('verdict', filter.verdict);
  if (filter.limit) params.append('limit', filter.limit);

  const res = await api.get(`/history?${params.toString()}`);
  return res.data;
}

export async function fetchScanById(id) {
  const res = await api.get(`/history/${id}`);
  return res.data;
}

export async function deleteScanRecord(id) {
  const res = await api.delete(`/history/${id}`);
  return res.data;
}

export function getPdfDownloadUrl(scanId) {
  return `${api.defaults.baseURL}/report/${scanId}/pdf`;
}

export function getJsonDownloadUrl(scanId) {
  return `${api.defaults.baseURL}/report/${scanId}/json`;
}

