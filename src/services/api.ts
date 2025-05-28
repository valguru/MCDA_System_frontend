import axios from 'axios';
import {CreateQuestionPayload, QuestionStatus} from "../types/Question";

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
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
        api.post('/auth/login', {email, password}),
    register: (
        email: string,
        password: string,
        name: string,
        surname?: string,
        position?: string
    ) =>
        api.post('/auth/register', {
            email,
            password,
            name,
            surname,
            position,
        }),
};


export const userApi = {
    getCurrentUser: () =>
        api.get('/user')
};

export const teamApi = {
    getMyTeams: () =>
        api.get('/teams'),
    getTeamById: (teamId: number) =>
        api.get(`/teams/${teamId}`),
    createTeam: (data: { name: string; description?: string, emails: string[] }) =>
        api.post('/teams/create', data),
    getSentInvites: () =>
        api.get('/invitations/sent'),
    getReceivedInvites: () =>
        api.get('/invitations/received'),
    respondToInvite: (id: number, accepted: boolean) =>
        api.post(`/invitations/${id}/respond`, null, {
            params: {accepted}
        })
};

export const questionApi = {
    getQuestionsByTeam: (teamId: number, status: QuestionStatus) =>
        api.get(`/teams/${teamId}/questions?status=${status}`),
    createQuestion: (teamId: number, data: CreateQuestionPayload) =>
        api.post(`/teams/${teamId}/questions/create`, data),
    getQuestionById: (teamId: number, questionId: number) =>
        api.get(`/teams/${teamId}/questions/${questionId}`),
    activateQuestion: (teamId: number, questionId: number) =>
        api.patch(`/teams/${teamId}/questions/${questionId}/activate`),
    getParticipants: (teamId: number, questionId: number) =>
        api.get(`/teams/${teamId}/questions/${questionId}/participants`)
};

export default api;
