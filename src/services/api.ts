import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Ваш бэкенд URL
});

export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    register: (email: string, password: string, name: string) =>
        api.post('/auth/register', { email, password, name }),
};