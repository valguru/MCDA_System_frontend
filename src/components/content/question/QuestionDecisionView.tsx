import React, {useEffect, useState} from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider, Stack, Tooltip, Snackbar, Alert,
} from '@mui/material';
import {useParams, useNavigate} from 'react-router-dom';
import {ratingApi, questionApi} from '../../../services/api';
import {Alternative, Question} from '../../../types/Question';
import {RankedAlternative, TopsisResult} from '../../../types/Rating';

import {Expert} from '../../../types/Expert';
import StarIcon from "@mui/icons-material/Star";
import {useCurrentUser} from "../../../hooks/useCurrentUser";

export const QuestionDecisionView = () => {
    const navigate = useNavigate();
    const {questionId} = useParams<{ questionId: string }>();
    const [question, setQuestion] = useState<Question | null>(null);
    const [ranked, setRanked] = useState<RankedAlternative[]>([]);
    const [respondedExperts, setRespondedExperts] = useState<Expert[]>([]);
    const [pendingExperts, setPendingExperts] = useState<Expert[]>([]);
    const [selectedAltId, setSelectedAltId] = useState<number | null>(null);
    const [finalDecisionId, setFinalDecisionId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const {user} = useCurrentUser();

    const [error, setError] = useState<string | null>(null);
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const isCreator = user?.email === question?.createdBy.email

    useEffect(() => {
        if (!questionId) return;

        const loadData = async () => {
            try {
                const [questionRes, topsisRes, participantsRes] = await Promise.all([
                    questionApi.getQuestionById(Number(questionId)),
                    ratingApi.getTopsisRanking(Number(questionId)),
                    questionApi.getParticipants(Number(questionId)),
                ]);

                setQuestion(questionRes.data);
                setRanked(topsisRes.data.rankedAlternatives);
                // setParticipants(participantsRes.data);
                setRespondedExperts(participantsRes.data.responded || []);
                setPendingExperts(participantsRes.data.pending || []);

                if (questionRes.data.status === 'RESOLVED') {
                    // предполагаем, что в вопросе уже есть инфа о принятом решении
                    const resolvedAltId = questionRes?.data?.selectedAlternative?.id ?? null;
                    setFinalDecisionId(resolvedAltId);
                }
            } catch (error) {
                setError('Не удалось загрузить данные. Возврат на страницу команд...');
                setShowErrorSnackbar(true);
                setTimeout(() => navigate('/dashboard/teams'), 3000);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [questionId]);

    const handleDecision = () => {
        if (!selectedAltId) {
            setSnackbarMessage('Выберите вариант решения');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        questionApi
            .resolveQuestion(+questionId!, selectedAltId)
            .then(() => {
                setFinalDecisionId(selectedAltId);
                setQuestion((prev) =>
                    prev ? {...prev, status: 'RESOLVED'} : prev
                );
                setSnackbarMessage('Вопрос успешно решён');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            })
            .catch((e) => {
                setSnackbarMessage('Не удалось завершить вопрос');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    if (error) {
        return (
            <Snackbar
                open={showErrorSnackbar}
                autoHideDuration={3000}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                onClose={() => setShowErrorSnackbar(false)}
            >
                <Alert severity="error" sx={{width: '100%'}}>
                    {error}
                </Alert>
            </Snackbar>
        );
    }

    if (loading || !question) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Box sx={{display: 'flex', gap: 4}}>
            <Box sx={{flex: 3}}>
                {/* Заголовок и описание */}
                <Box sx={{mb: 3}}>
                    <Typography variant="h4" gutterBottom>
                        {question.title}
                    </Typography>
                    <Typography variant="body1">{question.description}</Typography>
                </Box>

                {/* Блок ранжирования */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Ранжирование альтернатив методом TOPSIS
                        </Typography>
                        <List>
                            {ranked.map((r) => (
                                <ListItem key={r.alternative.id}>
                                    <ListItemText
                                        primary={`${r.rank}. ${r.alternative.value}`}
                                        secondary={`Приоритет: ${r.weight.toFixed(3)}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>

                {/* Блок принятия решения (только для создателя) */}
                {question.status === 'AWAITING_DECISION' && isCreator && (
                    <Card sx={{mt: 3}}>
                        <CardContent>
                            <Box border={1} borderColor="primary.light" borderRadius={2} p={2}>
                                <Typography variant="h6" gutterBottom>
                                    Варианты решения
                                </Typography>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        value={selectedAltId?.toString() || ''}
                                        onChange={(e) => setSelectedAltId(Number(e.target.value))}
                                    >
                                        {ranked.map((r) => (
                                            <FormControlLabel
                                                key={r.alternative.id}
                                                value={r.alternative.id.toString()}
                                                control={<Radio/>}
                                                label={r.alternative.value}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleDecision}
                                    >
                                        Принять решение
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Принятое решение (для всех, если вопрос решён) */}
                {question.status === 'RESOLVED' && finalDecisionId !== null && (
                    <Paper
                        elevation={2}
                        sx={{p: 2, backgroundColor: '#e6f4ea', border: '1px solid #66bb6a', mt: 3}}
                    >
                        <Typography variant="h6" color="success.dark">
                            Принятое решение:
                        </Typography>
                        <Typography
                            variant="body1"
                            fontWeight="medium"
                            mt={1}
                            color="success.main"
                        >
                            {
                                ranked.find((r) => r.alternative.id === finalDecisionId)
                                    ?.alternative.value
                            }
                        </Typography>
                    </Paper>
                )}
            </Box>

            {/* Участники */}
            <Box sx={{flex: 1}}>
                <Typography variant="h6" gutterBottom>Участники</Typography>

                <Box sx={{mb: 3}}>
                    <Typography variant="subtitle2" gutterBottom>Отправили ответы</Typography>
                    <Divider sx={{mb: 2}}/>
                    <Stack spacing={1}>
                        {respondedExperts.length ? respondedExperts.map((e) => {
                            const isCreatorQuestion = e.email === question.createdBy.email;
                            return (
                                <Paper key={e.email} elevation={2} sx={{p: 1.5, borderRadius: 2}}>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: isCreatorQuestion ? 'bold' : 'normal',
                                                color: isCreatorQuestion ? 'primary.main' : 'text.primary',
                                            }}
                                        >
                                            {e.name} {e.surname ?? ''}
                                        </Typography>
                                        {isCreatorQuestion && (
                                            <Tooltip title="Автор вопроса">
                                                <StarIcon sx={{fontSize: 18, color: 'primary.main'}}/>
                                            </Tooltip>
                                        )}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {e.email}
                                    </Typography>
                                </Paper>
                            );
                        }) : (
                            <Typography color="text.secondary">Нет данных</Typography>
                        )}
                    </Stack>
                </Box>

                <Box>
                    <Typography variant="subtitle2" gutterBottom>Не ответили</Typography>
                    <Divider sx={{mb: 2}}/>
                    <Stack spacing={1}>
                        {pendingExperts.length ? pendingExperts.map((e) => {
                            const isCreatorQuestion = e.email === question.createdBy.email;
                            return (
                                <Paper key={e.email} elevation={1} sx={{p: 1.5, borderRadius: 2}}>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: isCreatorQuestion ? 'bold' : 'normal',
                                                color: isCreatorQuestion ? 'primary.main' : 'text.primary',
                                            }}
                                        >
                                            {e.name} {e.surname ?? ''}
                                        </Typography>
                                        {isCreatorQuestion && (
                                            <Tooltip title="Автор вопроса">
                                                <StarIcon sx={{fontSize: 18, color: 'primary.main'}}/>
                                            </Tooltip>
                                        )}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {e.email}
                                    </Typography>
                                </Paper>
                            );
                        }) : (
                            <Typography color="text.secondary">Нет данных</Typography>
                        )}
                    </Stack>
                </Box>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert severity={snackbarSeverity} sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}