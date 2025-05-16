import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Удаляем токен и редиректим на логин
            localStorage.removeItem('token');
            alert('Сессия истекла');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    register: (email: string, password: string, name: string) =>
        api.post('/auth/register', { email, password, name }),
};

export const userApi = {
    getCurrentUser: () => api.get('/user')
};

export const teamApi = {
    getMyTeams: () => api.get('/teams'),
    createTeam: (data: { name: string; emails: string[] }) =>
        api.post('/teams/create', data),
    getSentInvites: () => api.get('/invitations/sent'),
    getReceivedInvites: () => api.get('/invitations/received'),
    respondToInvite: (id: number, accepted: boolean) =>
        api.post(`/invitations/${id}/respond`, null, {
            params: { accepted }
        })
};

export default api;
