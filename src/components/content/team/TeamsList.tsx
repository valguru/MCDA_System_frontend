import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { teamApi } from '../../../services/api';
import { ErrorDialog } from '../../common/ErrorDialog';
import { Team } from '../../../types/Team';

export const TeamsList = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        teamApi.getMyTeams()
            .then(res => setTeams(res.data))
            .catch(() => {
                setError('Не удалось загрузить список команд');
                setDialogOpen(true);
            });
    }, []);

    const handleGoToTeam = (teamId: number) => {
        navigate(`/dashboard/teams/${teamId}`);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Мои команды</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/dashboard/teams/create')}
                >
                    Создать
                </Button>
            </Box>

            {teams.length === 0 ? (
                <Typography color="text.secondary">У вас пока нет команд.</Typography>
            ) : (
                <Stack spacing={2}>
                    {teams.map((team) => (
                        <Paper
                            key={team.id}
                            sx={{
                                p: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: 'action.hover' },
                            }}
                            onDoubleClick={() => handleGoToTeam(team.id)}
                        >
                            <Box>
                                <Typography variant="h6">{team.name}</Typography>
                                <Typography variant="body2">
                                    Создатель: {team.createdBy.name}
                                </Typography>
                                <Typography variant="body2">
                                    Участники: {team.members.map(m => m.name).join(', ')}
                                </Typography>
                            </Box>
                            <IconButton
                                color="primary"
                                onClick={() => handleGoToTeam(team.id)}
                                aria-label="Перейти к команде"
                            >
                                <ArrowForwardIcon />
                            </IconButton>
                        </Paper>
                    ))}
                </Stack>
            )}

            <ErrorDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                message={error ?? ''}
            />
        </Box>
    );
};
