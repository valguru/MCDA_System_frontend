import {
    Box,
    Typography,
    IconButton,
    Tabs,
    Tab,
    Button,
    Stack,
    Paper,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamApi } from '../../../services/api';
import { Team as TeamType } from '../../../types/Team';

export const Team = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [team, setTeam] = useState<TeamType | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);

    // Моковые вопросы на время
    const mockActiveQuestions = [
        { id: 1, title: 'Вопрос временный', description: 'Описание временного вопроса' }
    ];
    const mockResolvedQuestions: any[] = [];

    useEffect(() => {
        if (!id) return;

        teamApi.getTeamById(+id)
            .then(res => {
                setTeam(res.data);
                setLoading(false);
            })
            .catch(err => {
                if (err.response?.status === 403 || err.response?.status === 404) {
                    navigate('/404');
                } else {
                    console.error('Ошибка загрузки команды', err);
                }
            });
    }, [id]);

    if (loading) {
        return <CircularProgress sx={{ mt: 4 }} />;
    }

    if (!team) return null;

    // Используем моковые вопросы
    const questions = tab === 0 ? mockActiveQuestions : mockResolvedQuestions;

    return (
        <Box sx={{ display: 'flex', gap: 4 }}>
            <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5">{team.name}</Typography>
                    <Tooltip title="Редактировать команду">
                        <IconButton color="primary" size="small">
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {team.description && (
                    <Typography color="text.secondary" mb={3}>
                        {team.description}
                    </Typography>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #e0e0e0',
                        mb: 2,
                    }}
                >
                    <Tabs
                        value={tab}
                        onChange={(_, newValue) => setTab(newValue)}
                        sx={{ minHeight: '40px' }}
                    >
                        <Tab label="Активные вопросы" sx={{ minHeight: '40px' }} />
                        <Tab label="Решенные вопросы" sx={{ minHeight: '40px' }} />
                    </Tabs>

                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        size="small"
                        sx={{ ml: 2 }}
                    >
                        Создать вопрос
                    </Button>
                </Box>

                {questions.length === 0 ? (
                    <Typography color="text.secondary">Вопросов нет.</Typography>
                ) : (
                    <Stack spacing={2}>
                        {questions.map((q) => (
                            <Paper key={q.id} sx={{ p: 2 }}>
                                <Typography variant="subtitle1">{q.title}</Typography>
                                <Typography color="text.secondary">{q.description}</Typography>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Box>

            <Box sx={{ width: 280 }}>
                <Typography variant="h6" mb={2}>
                    Участники
                </Typography>
                <Stack spacing={1}>
                    {[
                        team.createdBy,
                        ...team.members.filter(m => m.id !== team.createdBy.id),
                    ].map((m) => {
                        const isCreator = m.id === team.createdBy.id;
                        return (
                            <Paper key={m.id} sx={{ p: 1.5, display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: isCreator ? 'bold' : 'normal',
                                            color: isCreator ? 'primary.main' : 'text.primary',
                                        }}
                                    >
                                        {m.name}{m.surname ? ` ${m.surname}` : ''}
                                    </Typography>
                                    {isCreator && (
                                        <Tooltip title="Создатель команды">
                                            <StarIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                        </Tooltip>
                                    )}
                                </Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: '0.8rem', mt: 0.3 }}
                                >
                                    {m.email}
                                </Typography>
                            </Paper>
                        );
                    })}
                </Stack>
            </Box>
        </Box>
    );
};
