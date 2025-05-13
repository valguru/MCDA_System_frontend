// LoginPage.tsx
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { LoginForm } from '../components/auth/LoginForm';
import { authApi } from '../services/api';

export const LoginPage = () => {
    const navigate = useNavigate();

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await authApi.login(email, password);
            const token = response.data.token;

            localStorage.setItem('token', token); // сохраняем токен

            navigate('/dashboard'); // редирект на защищённую страницу
        } catch (error) {
            alert('Ошибка авторизации');
            console.error(error);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3 }}>
            <LoginForm onLogin={handleLogin} />
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
            </Typography>
        </Box>
    );
};
