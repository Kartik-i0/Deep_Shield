import { api } from './api.js';

export async function scanImageFile(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/detect/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return res.data;
}

export async function scanVideoFile(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/detect/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return res.data;
}

export async function scanAudioFile(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/detect/audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return res.data;
}

export async function scanTextContent(text) {
  const res = await api.post('/detect/text', { text });
  return res.data;
}

