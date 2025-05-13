// RegisterPage.tsx
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { RegisterForm } from '../components/auth/RegisterForm';
import { authApi } from '../services/api';

export const RegisterPage = () => {
    const navigate = useNavigate();

    const handleRegister = async (email: string, password: string, name: string) => {
        try {
            await authApi.register(email, password, name);
            alert('Регистрация успешна! Теперь войдите.');
            navigate('/login');
        } catch (error) {
            alert('Ошибка регистрации');
            console.error(error);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3 }}>
            <RegisterForm onRegister={handleRegister} />
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                Уже есть аккаунт? <Link to="/login">Войдите</Link>
            </Typography>
        </Box>
    );
};
