import {
    Box,
    Button,
    Paper,
    Snackbar,
    Tab,
    Tabs,
    Typography,
    Stack,
    Alert
} from '@mui/material';
import {useEffect, useState} from 'react';
import {teamApi} from '../../../services/api';
import {Invitation} from '../../../types/Invitation';

export const Invitations = () => {
    const [tab, setTab] = useState(0);
    const [sentInvites, setSentInvites] = useState<Invitation[]>([]);
    const [receivedInvites, setReceivedInvites] = useState<Invitation[]>([]);
    const [toast, setToast] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
        open: false,
        message: '',
        type: 'success',
    });

    useEffect(() => {
        loadInvitations();
    }, []);

    const loadInvitations = async () => {
        try {
            const [sentRes, receivedRes] = await Promise.all([
                teamApi.getSentInvites(),
                teamApi.getReceivedInvites()
            ]);
            setSentInvites(sentRes.data);
            setReceivedInvites(receivedRes.data);
        } catch (err) {
            console.error('Ошибка загрузки приглашений', err);
        }
    };

    const handleResponseToInvite = async (id: number, accepted: boolean) => {
        try {
            await teamApi.respondToInvite(id, accepted);
            setToast({
                open: true,
                message: accepted ? 'Вы присоединились к команде!' : 'Приглашение отклонено.',
                type: 'success'
            });
            loadInvitations();
        } catch (err) {
            setToast({
                open: true,
                message: accepted ? 'Ошибка при принятии приглашения' : 'Ошибка при отклонении приглашения',
                type: 'error'
            });
        }
    };


    return (
        <Box>
            <Typography variant="h5" mb={3}>
                Приглашения
            </Typography>

            <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={{
                mb: 3,
                borderBottom: 1,
                borderColor: 'divider'
            }}>
                <Tab label="Полученные"/>
                <Tab label="Отправленные"/>
            </Tabs>

            {tab === 0 && (
                receivedInvites.length === 0 ? (
                    <Typography color="text.secondary">Нет полученных приглашений.</Typography>
                ) : (
                    <Stack spacing={2}>
                        {receivedInvites.map(invite => (
                            <Paper key={invite.id} sx={{p: 2}}>
                                <Typography><strong>Команда:</strong> {invite.teamName}</Typography>
                                <Typography><strong>От кого:</strong> {invite.senderName}</Typography>
                                <Box sx={{mt: 2, display: 'flex', gap: 2}}>
                                    <Button color="success" variant="contained" onClick={() => handleResponseToInvite(invite.id, true)}>
                                        Принять
                                    </Button>
                                    <Button color="error" variant="outlined" onClick={() => handleResponseToInvite(invite.id, false)}>
                                        Отклонить
                                    </Button>
                                </Box>
                            </Paper>
                        ))}
                    </Stack>
                )
            )}

            {tab === 1 && (
                sentInvites.length === 0 ? (
                    <Typography color="text.secondary">Нет отправленных приглашений.</Typography>
                ) : (
                    <Stack spacing={2}>
                        {sentInvites.map(invite => (
                            <Paper key={invite.id} sx={{p: 2}}>
                                <Typography><strong>Команда:</strong> {invite.teamName}</Typography>
                                <Typography><strong>Кому:</strong> {invite.email}</Typography>
                                <Typography sx={{mt: 1}}>
                                    <strong>Статус:</strong> {
                                    invite.status === 'PENDING' ? 'Ожидание' :
                                        invite.status === 'ACCEPTED' ? 'Принято' :
                                            'Отклонено'
                                }
                                </Typography>
                            </Paper>
                        ))}
                    </Stack>
                )
            )}

            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast({...toast, open: false})}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert severity={toast.type} variant="filled" sx={{width: '100%'}}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
