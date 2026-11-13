import axios from 'axios';
import { config } from '../config/env.js';

export async function queryPythonForensicService(endpoint, fileBuffer, fileName = 'sample.bin', mimeType = 'application/octet-stream') {
  try {
    const FormData = (await import('formdata-node')).FormData; // Or native FormData if supported
  } catch (e) {
    // We can use standard axios with buffer or multipart if needed
  }

  try {
    // Ping health first
    const health = await axios.get(`${config.pythonServiceUrl.replace('/api/v1', '')}/health`, { timeout: 1500 });
    if (health.data?.status !== 'ok') return null;

    // Fast call
    const res = await axios.post(`${config.pythonServiceUrl}${endpoint}`, fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'X-Filename': fileName,
      },
      timeout: 5000,
    });
    return res.data;
  } catch (err) {
    // Python service is optional enhancement
    return null;
  }
}

