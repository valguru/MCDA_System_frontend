import { useEffect} from 'react';
import { Box} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { SideMenu } from '../components/layout/SideMenu';

const HEADER_HEIGHT = 64;

export const DashboardPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <AppHeader />

            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <SideMenu />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        mt: `${HEADER_HEIGHT}px`,
                        p: 3,
                        bgcolor: '#f9f9f9',
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};
