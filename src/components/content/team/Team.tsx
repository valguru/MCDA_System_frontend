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
    CircularProgress, Snackbar, Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {teamApi, questionApi} from '../../../services/api';
import {Team as TeamType} from '../../../types/Team';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {QuestionStatus} from "../../../types/Question";

export const Team = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [team, setTeam] = useState<TeamType | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const [questions, setQuestions] = useState<any[]>([]);
    const [showAccessDenied, setShowAccessDenied] = useState(false);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        teamApi.getTeamById(+id)
            .then(res => {
                setTeam(res.data);
                setLoading(false);
            })
            .catch(err => {
                if (err.response?.status === 403 || err.response?.status === 404) {
                    setShowAccessDenied(true);
                    setTimeout(() => navigate('/dashboard/teams'), 3000);
                } else {
                    console.error('Ошибка загрузки команды', err);
                }
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        let status: QuestionStatus;
        if (tab === 0) status = 'ACTIVE';
        else if (tab === 1) status = 'RESOLVED';
        else status = 'DRAFT';

        questionApi.getQuestionsByTeam(+id, status)
            .then(res => {
                setQuestions(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Ошибка загрузки вопросов', err);
                setQuestions([]);
                setLoading(false);
            });
    }, [id, tab]);

    if (loading) {
        return <CircularProgress sx={{mt: 4}}/>;
    }

    if (!team) {
        return (
            <>
                <Snackbar
                    open={showAccessDenied}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                >
                    <Alert severity="error" sx={{width: '100%'}}>
                        У вас нет доступа к этой команде
                    </Alert>
                </Snackbar>
            </>
        );
    }

    return (
        <Box sx={{display: 'flex', gap: 4}}>
            <Box sx={{flex: 1}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2}}>
                    <Typography variant="h5">{team.name}</Typography>
                    <Tooltip title="Редактировать команду">
                        <IconButton color="primary" size="small">
                            <EditIcon/>
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
                        sx={{minHeight: '40px'}}
                    >
                        <Tab label="Активные вопросы" sx={{minHeight: '40px'}}/>
                        <Tab label="Решенные вопросы" sx={{minHeight: '40px'}}/>
                        <Tab label="Черновики" sx={{minHeight: '40px'}}/>
                    </Tabs>

                    <Button
                        variant="outlined"
                        startIcon={<AddIcon/>}
                        size="small"
                        sx={{ml: 2}}
                        onClick={() => navigate(`/dashboard/teams/${id}/question/create`)}
                    >
                        Создать вопрос
                    </Button>
                </Box>

                {questions.length === 0 ? (
                    <Typography color="text.secondary">Вопросов нет.</Typography>
                ) : (
                    <Stack spacing={2}>
                        {questions.map((q) => (
                            <Paper
                                key={q.id}
                                sx={{p: 2, cursor: 'pointer', '&:hover': {backgroundColor: 'action.hover'},}}
                                onDoubleClick={() => navigate(`/dashboard/teams/${id}/question/${q.id}`)}
                            >
                                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Box>
                                        <Typography variant="subtitle1">{q.title}</Typography>
                                        <Typography color="text.secondary" sx={{mb: 0.5}}>
                                            {q.description}
                                        </Typography>
                                        {q.createdBy && (
                                            <Typography variant="body2" color="text.secondary"
                                                        sx={{fontSize: '0.75rem'}}>
                                                Автор: {q.createdBy.name}{q.createdBy.surname ? ` ${q.createdBy.surname}` : ''}
                                            </Typography>
                                        )}
                                    </Box>
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/dashboard/teams/${id}/question/${q.id}`);
                                        }}
                                    >
                                        <ArrowForwardIcon/>
                                    </IconButton>
                                </Box>
                            </Paper>
                        ))}

                    </Stack>
                )}
            </Box>

            <Box sx={{width: 280}}>
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
                            <Paper key={m.id} sx={{p: 1.5, display: 'flex', flexDirection: 'column'}}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
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
                                            <StarIcon sx={{fontSize: 18, color: 'primary.main'}}/>
                                        </Tooltip>
                                    )}
                                </Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{fontSize: '0.8rem', mt: 0.3}}
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
