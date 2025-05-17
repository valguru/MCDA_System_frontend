import {Avatar, Box, Button, Paper, Typography} from '@mui/material';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {userApi} from '../../../services/api';
import {Expert} from '../../../types/Expert';
import PersonIcon from '@mui/icons-material/AccountCircleOutlined';


export const Profile = () => {
    const [user, setUser] = useState<Expert | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        userApi.getCurrentUser()
            .then(res => setUser(res.data))
            .catch(() => {
                localStorage.removeItem('token');
                navigate('/');
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const avatarSeed = user
        ? user.surname
            ? `${user.name} ${user.surname}`
            : user.name
        : '';

    const avatarUrl = avatarSeed
        ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}`
        : '';

    return (
        <Box>
            <Typography variant="h5" mb={3}>
                Профиль пользователя
            </Typography>

            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    width: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar
                    src={avatarUrl}
                    alt={user?.name}
                    sx={{ width: 100, height: 100, mb: 2 }}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = ''; // сбрасываем src, чтобы показать fallback
                    }}
                >
                    <PersonIcon sx={{ fontSize: 110 }} />
                </Avatar>

                <Typography variant="h6">
                    {user?.name} {user?.surname ?? ''}
                </Typography>

                {user?.position && (
                    <Typography color="text.secondary" align={"center"}>
                        {user.position}
                    </Typography>
                )}

                <Typography color="text.secondary" mb={1} >
                    {user?.email}
                </Typography>

                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleLogout}
                    sx={{mt: 4}}
                    fullWidth
                >
                    Выйти
                </Button>
            </Paper>
        </Box>
    );
};
