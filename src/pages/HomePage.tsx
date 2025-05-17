import { Link } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';

export const HomePage = () => {
    return (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h4" gutterBottom>
                Средство группового принятия решений в Agile-командах
            </Typography>

            <Box sx={{ mt: 4 }}>
                <Button
                    variant="contained"
                    component={Link}
                    to="/login"
                    sx={{ mr: 2 }}
                >
                    Вход
                </Button>

                <Button
                    variant="outlined"
                    component={Link}
                    to="/register"
                >
                    Регистрация
                </Button>
            </Box>
        </Box>
    );
};