import { AppBar, Toolbar, Typography, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const AppHeader = () => {
    const navigate = useNavigate();

    return (
        <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Система поддержки принятия решений в Agile-командах
                </Typography>

                <Tooltip title="Профиль">
                    <IconButton color="inherit" onClick={() => navigate('/dashboard/profile')}>
                        <AccountCircleIcon />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
};
