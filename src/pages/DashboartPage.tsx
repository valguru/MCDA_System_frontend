// pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }
        console.log(token)

        axios.get('http://localhost:8080/api/protected', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => setMessage(res.data))
            .catch(() => {
                alert('Сессия истекла');
                navigate('/login');
            });
    }, []);

    return (
        <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h4">Добро пожаловать!</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>{message}</Typography>
        </Box>
    );
};
