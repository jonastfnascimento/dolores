import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://n8n.agcinza.com/webhook/',
  headers: { Accept: 'application/json' },
});
