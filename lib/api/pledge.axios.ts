import axios from 'axios';

export const pledgeInstance = axios.create({
  baseURL: process.env.PLEDGE_API_BASE_URL,
  headers: { Authorization: `Bearer ${process.env.PLEDGE_API_KEY}` },
  timeout: 10000,
});
