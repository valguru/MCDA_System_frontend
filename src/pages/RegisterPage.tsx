import {useNavigate, Link} from 'react-router-dom';
import {
    Box,
    Typography,
    Snackbar,
    Alert
} from '@mui/material';
import {useState} from 'react';
import {RegisterForm} from '../components/auth/RegisterForm';
import {authApi} from '../services/api';

export const RegisterPage = () => {
    const navigate = useNavigate();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleRegister = async (
        email: string,
        password: string,
        name: string,
        surname?: string,
        position?: string
    ) => {
        if (!email || !password || !name) {
            showSnackbar('Пожалуйста, заполните обязательные поля.', 'error');
            return;
        }

        try {
            await authApi.register(email, password, name, surname, position);
            showSnackbar('Регистрация успешна! Теперь войдите.', 'success');
            setTimeout(() => navigate('/login'), 1500); // подождём перед редиректом
        } catch (error) {
            console.error(error);
            showSnackbar('Ошибка регистрации. Попробуйте снова.', 'error');
        }
    };

    return (
        <Box sx={{maxWidth: 400, mx: 'auto', mt: 4, p: 3}}>
            <RegisterForm onRegister={handleRegister}/>
            <Typography variant="body2" sx={{mt: 2, textAlign: 'center'}}>
                Уже есть аккаунт? <Link to="/login">Войдите</Link>
            </Typography>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};
