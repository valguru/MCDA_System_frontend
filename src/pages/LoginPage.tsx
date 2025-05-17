import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {Box, Typography, Snackbar, Alert} from '@mui/material';
import {LoginForm} from '../components/auth/LoginForm';
import {authApi} from '../services/api';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [errorOpen, setErrorOpen] = useState(false);

    const handleCloseError = () => {
        setErrorOpen(false);
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await authApi.login(email, password);
            const token = response.data.token;

            localStorage.setItem('token', token);

            navigate('/dashboard/teams');
        } catch (error) {
            setErrorOpen(true);
            console.error(error);
        }
    };

    return (
        <Box sx={{maxWidth: 400, mx: 'auto', mt: 4, p: 3}}>
            <LoginForm onLogin={handleLogin}/>

            <Typography variant="body2" sx={{mt: 2, textAlign: 'center'}}>
                Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
            </Typography>

            <Snackbar
                open={errorOpen}
                autoHideDuration={4000}
                onClose={handleCloseError}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{width: '100%'}}>
                    Ошибка авторизации
                </Alert>
            </Snackbar>
        </Box>
    );
};
