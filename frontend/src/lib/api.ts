import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Simple interceptor for auth
api.interceptors.request.use((config) => {
    if (ADMIN_PASSWORD) {
        config.headers.Authorization = `Bearer ${ADMIN_PASSWORD}`;
    }
    return config;
});

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});
