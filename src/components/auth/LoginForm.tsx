import {useState} from 'react';
import {TextField, Button, Box, Typography, Snackbar, Alert} from '@mui/material';

interface LoginFormProps {
    onLogin: (email: string, password: string) => void;
}

export const LoginForm = ({onLogin}: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: boolean; password?: boolean }>({});
    const [showError, setShowError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            email: !email.trim(),
            password: !password.trim(),
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(Boolean);
        if (hasErrors) {
            setShowError(true);
            return;
        }

        onLogin(email, password);
    };

    const getHelperText = (field: keyof typeof errors) => (
        <span style={{color: errors[field] ? 'red' : '#888'}}>
            Обязательно
        </span>
    );

    return (
        <>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h5" gutterBottom>Вход в систему</Typography>

                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="dense"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    helperText={getHelperText('email')}
                />

                <TextField
                    label="Пароль"
                    type="password"
                    fullWidth
                    margin="dense"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    helperText={getHelperText('password')}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{mt: 2, mb: 1}}
                >
                    Войти
                </Button>
            </Box>

            <Snackbar
                open={showError}
                autoHideDuration={4000}
                onClose={() => setShowError(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={() => setShowError(false)} severity="error" sx={{width: '100%'}}>
                    Пожалуйста, заполните все обязательные поля.
                </Alert>
            </Snackbar>
        </>
    );
};
