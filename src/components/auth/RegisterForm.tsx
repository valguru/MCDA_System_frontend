import {useState} from 'react';
import {TextField, Button, Box, Typography, Snackbar, Alert} from '@mui/material';

interface RegisterFormProps {
    onRegister: (email: string, password: string, name: string, surname?: string, position?: string) => void;
}

export const RegisterForm = ({onRegister}: RegisterFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [position, setPosition] = useState('');

    const [errors, setErrors] = useState<{ name?: boolean; email?: boolean; password?: boolean }>({});
    const [showError, setShowError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            name: !name.trim(),
            email: !email.trim(),
            password: !password.trim(),
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(Boolean);
        if (hasErrors) {
            setShowError(true);
            return;
        }

        onRegister(email, password, name, surname, position);
    };

    const getHelperText = (field: keyof typeof errors) => (
        <span style={{color: errors[field] ? 'red' : '#888'}}>
            Обязательно
        </span>
    );

    return (
        <>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h5" gutterBottom>Регистрация</Typography>

                <TextField
                    label="Имя"
                    fullWidth
                    margin="dense"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                    helperText={getHelperText('name')}
                />

                <TextField
                    label="Фамилия"
                    fullWidth
                    margin="dense"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    helperText=" "
                />

                <TextField
                    label="Должность"
                    fullWidth
                    margin="dense"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    helperText=" "
                />

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
                    Зарегистрироваться
                </Button>
            </Box>

            <Snackbar
                open={showError}
                autoHideDuration={3000}
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
