import {
    Box, Button, Chip, Paper, Stack, TextField, Typography, Snackbar, Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { teamApi } from '../../../services/api';

type FormData = {
    name: string;
    description?: string;
};

export const CreateTeam = () => {
    const navigate = useNavigate();
    const { handleSubmit, register, formState: { errors } } = useForm<FormData>();
    const [inputEmail, setInputEmail] = useState('');
    const [emailList, setEmailList] = useState<string[]>([]);
    const [emailError, setEmailError] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);

    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleAddEmail = () => {
        const trimmed = inputEmail.trim();
        if (!trimmed) return;

        if (!isValidEmail(trimmed)) {
            setEmailError('Некорректный email');
            return;
        }

        if (emailList.includes(trimmed)) {
            setEmailError('Email уже добавлен');
            return;
        }

        setEmailList([...emailList, trimmed]);
        setInputEmail('');
        setEmailError('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAddEmail();
        }
    };

    const handleDelete = (email: string) => {
        setEmailList(emailList.filter(e => e !== email));
    };

    const onSubmit = async (data: FormData) => {
        if (emailList.length === 0) {
            setShowSnackbar(true);
            return;
        }

        try {
            await teamApi.createTeam({
                name: data.name,
                description: data.description || '',
                emails: emailList,
            });
            navigate('/dashboard');
        } catch (err) {
            console.error('Ошибка при создании команды', err);
        }
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                Создание команды
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    <Box>
                        <TextField
                            label="Название команды"
                            {...register('name', { required: true })}
                            error={!!errors.name}
                            fullWidth
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color: errors.name ? 'error.main' : 'text.secondary',
                                mt: 0.5,
                                ml: 0.5,
                            }}
                        >
                            Обязательно
                        </Typography>
                    </Box>

                    <TextField
                        label="Описание"
                        {...register('description', { maxLength: 500 })}
                        multiline
                        rows={4}
                        fullWidth
                        inputProps={{ maxLength: 500 }}
                        helperText="Максимум 500 символов"
                    />

                    <TextField
                        label="Добавить участника (email)"
                        value={inputEmail}
                        onChange={(e) => {
                            setInputEmail(e.target.value);
                            setEmailError('');
                        }}
                        onKeyDown={handleKeyDown}
                        error={!!emailError}
                        helperText={emailError || 'Нажмите Enter или пробел для добавления'}
                        fullWidth
                    />

                    {emailList.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {emailList.map(email => (
                                <Chip
                                    key={email}
                                    label={email}
                                    onDelete={() => handleDelete(email)}
                                />
                            ))}
                        </Box>
                    )}

                    <Button variant="contained" type="submit">
                        Создать команду
                    </Button>
                </Stack>
            </form>

            <Snackbar
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="error" onClose={() => setShowSnackbar(false)}>
                    Добавьте хотя бы одного участника
                </Alert>
            </Snackbar>
        </Paper>
    );
};
