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

// Interceptor to unwrap standard response envelope
api.interceptors.response.use(
    (response) => {
        if (response.data && response.data.success === true && 'data' in response.data) {
            return {
                ...response,
                data: response.data.data,
            };
        }
        return response;
    },
    (error) => {
        if (error.response?.data?.success === false && error.response.data.error) {
            const serverError = error.response.data.error;
            const message = serverError.message || 'An unexpected error occurred';
            return Promise.reject(new Error(message));
        }
        return Promise.reject(error);
    }
);

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});
