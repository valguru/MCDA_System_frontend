import {
    Box, Button, Chip, Paper, Stack, TextField, Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { teamApi } from '../../../services/api';

type FormData = {
    name: string;
};

export const CreateTeam = () => {
    const navigate = useNavigate();
    const { handleSubmit, register, formState: { errors } } = useForm<FormData>();
    const [inputEmail, setInputEmail] = useState('');
    const [emailList, setEmailList] = useState<string[]>([]);
    const [emailError, setEmailError] = useState('');
    const [emailListError, setEmailListError] = useState(''); // Ошибка для списка участников

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
        setEmailListError(''); // сброс ошибки при добавлении email
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAddEmail();
        }
    };

    const handleDelete = (email: string) => {
        setEmailList(emailList.filter(e => e !== email));
        if (emailList.length - 1 === 0) {
            setEmailListError('Добавьте хотя бы одного участника');
        }
    };

    const onSubmit = async (data: FormData) => {
        if (emailList.length === 0) {
            setEmailListError('Добавьте хотя бы одного участника');
            return;
        }
        try {
            await teamApi.createTeam({
                name: data.name,
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
                    <TextField
                        label="Название команды"
                        {...register('name', { required: 'Введите название команды' })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        fullWidth
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

                    {emailListError && (
                        <Typography color="error" variant="body2">
                            {emailListError}
                        </Typography>
                    )}

                    <Button variant="contained" type="submit">
                        Создать команду
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
};
