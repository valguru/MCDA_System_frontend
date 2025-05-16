import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const SIDEMENU_WIDTH = 200;
const HEADER_HEIGHT = 64;

export const SideMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: 'Мои команды', path: '/dashboard/teams' },
        { label: 'Мои вопросы', path: '/dashboard/questions' },
        { label: 'Приглашения', path: '/dashboard/invitations'}
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: SIDEMENU_WIDTH,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: SIDEMENU_WIDTH,
                    boxSizing: 'border-box',
                    mt: `${HEADER_HEIGHT}px`,
                    height: `calc(100vh - ${HEADER_HEIGHT}px)`,
                },
            }}
        >
            <List>
                {menuItems.map(({ label, path }) => (
                    <ListItemButton
                        key={path}
                        selected={location.pathname.startsWith(path)}
                        onClick={() => navigate(path)}
                    >
                        <ListItemText primary={label} />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
};
