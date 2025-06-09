import {
    Box,
    Typography,
    Menu,
    MenuItem,
    IconButton,
    Button,
    Paper,
    Select,
    MenuItem as MuiMenuItem,
    Stack,
    Snackbar,
    Alert,
    Divider,
    Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StarIcon from '@mui/icons-material/Star';
import {useParams, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {questionApi, ratingApi} from '../../../services/api';
import {Question} from '../../../types/Question';
import {scaleTypeLabels, optimizationLabels} from '../../../types/Question';
import {useCurrentUser} from '../../../hooks/useCurrentUser';
import {Expert, ParticipantsResponse} from '../../../types/Expert';
import {RatingAnswer, RatingCreateRequest, ratingOptionsByScale} from "../../../types/Rating";

export const QuestionPreview = () => {
    const {teamId, questionId} = useParams();
    const navigate = useNavigate();
    const {user} = useCurrentUser();

    const [question, setQuestion] = useState<Question | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [answers, setAnswers] = useState<Record<number, Record<string, string>>>({});
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [respondedExperts, setRespondedExperts] = useState<Expert[]>([]);
    const [pendingExperts, setPendingExperts] = useState<Expert[]>([]);
    const [hasResponded, setHasResponded] = useState<boolean>(false);

    useEffect(() => {
        if (questionId) {
            questionApi.getQuestionById(+questionId)
                .then(res => {
                    const q: Question = res.data;
                    setQuestion(q);
                    getAnswers(q)
                    const initialAnswers: Record<number, Record<string, string>> = {};
                    q.alternatives.forEach((_, altIndex) => {
                        initialAnswers[altIndex] = {};
                        q.criteria.forEach(criterion => {
                            initialAnswers[altIndex][criterion.name] = '';
                        });
                    });
                    setAnswers(initialAnswers);
                })
                .catch(err => {
                    const message = err?.response?.data?.message || 'Произошла ошибка';
                    setErrorMessage(message);
                    setShowError(true);
                    setTimeout(() => {
                        navigate(`/dashboard/teams`);
                    }, 3000);
                });

            questionApi.getParticipants(+questionId)
                .then(res => {
                    const data = res.data as ParticipantsResponse;
                    setRespondedExperts(data.responded || []);
                    setPendingExperts(data.pending || []);
                })
                .catch((err) => {
                    setErrorMessage('Не удалось загрузить участников');
                    setShowError(true);
                });
        }
    }, [questionId, navigate]);

    const getAnswers = (q: Question) => {
        ratingApi.getRatingsByQuestion(+q.id)
            .then(res => {
                const existingRatings = res.data as RatingAnswer[];

                const filledAnswers: Record<number, Record<string, string>> = {};
                q.alternatives.forEach((alt, altIndex) => {
                    filledAnswers[altIndex] = {};
                    q.criteria.forEach(criterion => {
                        const rating = existingRatings.find(r =>
                            r.alternativeId === alt.id && r.criteriaId === criterion.id
                        );
                        filledAnswers[altIndex][criterion.name] = rating?.value || '';
                    });
                });
                setAnswers(filledAnswers);
                setHasResponded(!!existingRatings.length)
            })
    }

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleAnswerChange = (altIndex: number, criterionName: string, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [altIndex]: {
                ...prev[altIndex],
                [criterionName]: value,
            }
        }));
    };

    const handleActivateQuestion = () => {
        questionApi.activateQuestion(+questionId!)
            .then(res => {
                const msg = res.data?.message || 'Вопрос активирован';
                setSuccessMessage(msg);
                setShowSuccess(true);
                setQuestion(prev => prev ? {...prev, status: 'ACTIVE'} : prev);
            })
            .catch(err => {
                const msg = err?.response?.data?.message || 'Не удалось активировать вопрос';
                setErrorMessage(msg);
                setShowError(true);
            });
    };

    const handleSubmitAnswers = () => {
        if (!question || !questionId) return;

        const ratings: RatingAnswer[] = question.alternatives.flatMap((alt) =>
            question.criteria.map((criterion) => ({
                alternativeId: alt.id,
                criteriaId: criterion.id!,
                value: answers[question.alternatives.indexOf(alt)]?.[criterion.name] ?? '',
            }))
        );

        const hasEmpty = ratings.some(r => !r.value);
        if (hasEmpty) {
            setErrorMessage('Пожалуйста, заполните все оценки перед отправкой');
            setShowError(true);
            return;
        }

        const payload: RatingCreateRequest = {
            questionId: +questionId,
            answers: ratings,
        };

        ratingApi.submitRatings(payload)
            .then(res => {
                setSuccessMessage(res.data?.message || 'Ответ отправлен');
                setShowSuccess(true);
                setRespondedExperts(prev => [...prev, user!]);
                setPendingExperts(prev => prev.filter(e => e.email !== user?.email));
                setHasResponded(true)
            })
            .catch(err => {
                const msg = err?.response?.data?.message || 'Ошибка при отправке ответа';
                setErrorMessage(msg);
                setShowError(true);
            });
    };

    const handleFinishPoll = async () => {
        try {
            if (!questionId) return;

            questionApi.markAwaitingDecisionQuestion(Number(questionId))
                .then(res => {
                    setSuccessMessage('Опрос успешно завершён');
                    setShowSuccess(true);
                    navigate(`/dashboard/teams/${teamId}/question/${questionId}/view`)
                });

        } catch (error) {
            setErrorMessage('Не удалось завершить опрос');
            setShowError(true);
        }
    };

    if (!question) {
        return (
            <Snackbar
                open={showError}
                autoHideDuration={3000}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                onClose={() => setShowError(false)}
            >
                <Alert severity="error" sx={{width: '100%'}}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        );
    }

    const isAuthor = user?.email === question?.createdBy.email;
    const isDraft = question?.status === 'DRAFT';
    const isActive = question?.status === 'ACTIVE';

    return (
        <Box sx={{display: 'flex', gap: 4}}>
            <Box sx={{flex: 3}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                    <Typography variant="h5">{question.title}</Typography>

                    <Stack direction="row" spacing={1}>
                        {isDraft && (
                            <Button variant="contained" size="small" onClick={handleActivateQuestion}>
                                Запустить опрос
                            </Button>
                        )}
                        {isActive && (
                            <>
                                <Tooltip title={hasResponded ? 'Вы уже отправили ответ' : ''}>
                                    <span>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            disabled={hasResponded}
                                            onClick={handleSubmitAnswers}
                                        >
                                            Отправить ответ
                                        </Button>
                                    </span>
                                </Tooltip>
                                {isAuthor && (
                                    <span>
                                        <Button variant="outlined" size="small" onClick={handleFinishPoll}>
                                            Завершить опрос
                                        </Button>
                                    </span>
                                )}
                            </>
                        )}
                        {isAuthor && (
                            <IconButton onClick={handleMenuOpen}>
                                <MoreVertIcon/>
                            </IconButton>
                        )}
                    </Stack>

                    {isAuthor && (
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            {isDraft && (
                                <MenuItem onClick={() => { /* TODO: редактировать */
                                }}>Редактировать</MenuItem>
                            )}
                            <MenuItem onClick={() => { /* TODO: удалить */
                            }}>Удалить</MenuItem>
                        </Menu>
                    )}
                </Box>

                {question.description && (
                    <Typography color="text.secondary">{question.description}</Typography>
                )}

                <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 3}}>
                    {question.alternatives.map((alt, altIndex) => (
                        <Paper key={alt.id} sx={{p: 2, opacity: isDraft ? 0.6 : 1}} elevation={isDraft ? 1 : 3}>
                            <Typography variant="subtitle1" gutterBottom>
                                Вариант {altIndex + 1}: {alt.value}
                            </Typography>

                            {question.criteria.map((criterion) => (
                                <Box key={criterion.id} sx={{mb: 2}}>
                                    <Typography variant="body2" fontWeight="bold" sx={{mb: 1}}>
                                        {criterion.name}
                                    </Typography>
                                    <Select
                                        size="small"
                                        displayEmpty
                                        fullWidth
                                        disabled={isDraft || hasResponded}
                                        value={answers[altIndex]?.[criterion.name] || ''}
                                        onChange={e => handleAnswerChange(altIndex, criterion.name, e.target.value)}
                                        renderValue={(selected) =>
                                            selected || `${scaleTypeLabels[criterion.scaleType]} / ${optimizationLabels[criterion.optimization]}`
                                        }
                                    >
                                        {ratingOptionsByScale[criterion.scaleType].map((option) => (
                                            <MuiMenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MuiMenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            ))}
                        </Paper>
                    ))}
                </Box>
            </Box>

            <Box sx={{flex: 1}}>
                <Typography variant="h6" gutterBottom>Участники</Typography>

                <Box sx={{mb: 3}}>
                    <Typography variant="subtitle2" gutterBottom>Отправили ответы</Typography>
                    <Divider sx={{mb: 2}}/>
                    <Stack spacing={1}>
                        {respondedExperts.length ? respondedExperts.map((e) => {
                            const isCreator = e.email === question.createdBy.email;
                            return (
                                <Paper key={e.email} elevation={2} sx={{p: 1.5, borderRadius: 2}}>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: isCreator ? 'bold' : 'normal',
                                                color: isCreator ? 'primary.main' : 'text.primary',
                                            }}
                                        >
                                            {e.name} {e.surname ?? ''}
                                        </Typography>
                                        {isCreator && (
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
                    <Typography variant="subtitle2" gutterBottom>Ожидание ответа</Typography>
                    <Divider sx={{mb: 2}}/>
                    <Stack spacing={1}>
                        {pendingExperts.length ? pendingExperts.map((e) => {
                            const isCreator = e.email === question.createdBy.email;
                            return (
                                <Paper key={e.email} elevation={1} sx={{p: 1.5, borderRadius: 2}}>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: isCreator ? 'bold' : 'normal',
                                                color: isCreator ? 'primary.main' : 'text.primary',
                                            }}
                                        >
                                            {e.name} {e.surname ?? ''}
                                        </Typography>
                                        {isCreator && (
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


            {showSuccess && (
                <Snackbar
                    open={showSuccess}
                    autoHideDuration={3000}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                    onClose={() => setShowSuccess(false)}
                >
                    <Alert severity="success" sx={{width: '100%'}}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            )}

            {showError && (
                <Snackbar
                    open={showError}
                    autoHideDuration={3000}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                    onClose={() => setShowError(false)}
                >
                    <Alert severity="error" sx={{width: '100%'}}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};
