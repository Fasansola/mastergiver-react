import axios from 'axios';

export const instance = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
  timeout: 10000,
});
