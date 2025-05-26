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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { questionApi } from '../../../services/api';
import { Question } from '../../../types/Question';
import { scaleTypeLabels, optimizationLabels } from '../../../types/Question';

export const QuestionPreview = () => {
    const { questionId, teamId } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState<Question | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [answers, setAnswers] = useState<Record<number, Record<string, string>>>({});
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (questionId && teamId) {
            questionApi.getQuestionById(+teamId, +questionId)
                .then(res => {
                    const q: Question = res.data;
                    setQuestion(q);

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
        }
    }, [teamId, questionId, navigate]);

    if (showError) {
        return (
            <Snackbar
                open={showError}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="error" sx={{ width: '100%' }} >
                    {errorMessage}
                </Alert>
            </Snackbar>
        );
    }

    if (!question) return null;

    const isDraft = question.status === 'DRAFT';
    const isActive = question.status === 'ACTIVE';

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

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">{question.title}</Typography>

                <Stack direction="row" spacing={1}>
                    {isDraft && (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {/* TODO: запустить опрос */}}
                        >
                            Запустить опрос
                        </Button>
                    )}
                    {isActive && (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {/* TODO: отправить ответ */}}
                        >
                            Отправить ответ
                        </Button>
                    )}
                    <IconButton onClick={handleMenuOpen}>
                        <MoreVertIcon />
                    </IconButton>
                </Stack>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => {/* TODO: редактировать */}}>Редактировать</MenuItem>
                    <MenuItem onClick={() => {/* TODO: удалить */}}>Удалить</MenuItem>
                </Menu>
            </Box>

            {question.description && (
                <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                    {question.description}
                </Typography>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {question.alternatives.map((alt, altIndex) => (
                    <Paper
                        key={altIndex}
                        sx={{ p: 2, opacity: isDraft ? 0.6 : 1 }}
                        elevation={isDraft ? 1 : 3}
                    >
                        <Typography variant="subtitle1" gutterBottom>
                            Вариант {altIndex + 1}: {alt}
                        </Typography>

                        {question.criteria.map((criterion) => (
                            <Box key={criterion.name} sx={{ mb: 2 }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                                    {criterion.name}
                                </Typography>
                                <Select
                                    size="small"
                                    displayEmpty
                                    fullWidth
                                    disabled={isDraft}
                                    value={answers[altIndex]?.[criterion.name] || ''}
                                    onChange={e =>
                                        handleAnswerChange(altIndex, criterion.name, e.target.value)
                                    }
                                    renderValue={(selected) =>
                                        selected || `${scaleTypeLabels[criterion.scaleType]} / ${optimizationLabels[criterion.optimization]}`
                                    }
                                >
                                    {[1, 2, 3, 4, 5].map(val => (
                                        <MuiMenuItem key={val} value={String(val)}>
                                            {val}
                                        </MuiMenuItem>
                                    ))}
                                </Select>
                            </Box>
                        ))}
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};
