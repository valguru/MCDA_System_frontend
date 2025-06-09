import {
    Box,
    Button,
    IconButton,
    MenuItem,
    Paper,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {teamApi, questionApi} from '../../../services/api';
import {Team} from '../../../types/Team';
import {Criterion, ScaleType, OptimizationDirection} from '../../../types/Question';

const scaleOptions = [
    {label: 'Extended', value: 'LONG'},
    {label: 'Standard', value: 'BASE'},
    {label: 'Compact', value: 'SHORT'},
    {label: 'Numeric', value: 'NUMERIC'},
];

const optimizationOptions = [
    {label: 'MAX', value: 'MAX'},
    {label: 'MIN', value: 'MIN'},
];

const scaleHint = `Тип шкалы\n\nExtended — шкала с наибольшим числом градаций: от "экстремально низкое" до "экстремально высокое".\n\nStandard — стандартная шкала: от "очень низкое" до "очень высокое", без крайних значений.\n\nCompact — укороченная шкала: только "низкое", "среднее" и "высокое".\n\nNumeric — балльная шкала от 0 до 10.`;

const optimizationHint = `Направление оптимизации\n\nmin — чем меньше, тем лучше (например, цена, время).\n\nmax — чем больше, тем лучше (например, надёжность, производительность).`;

export const CreateQuestion = () => {
    const {id: teamId} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [team, setTeam] = useState<Team | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [alternatives, setAlternatives] = useState<string[]>(['']);
    const [criteria, setCriteria] = useState<Criterion[]>([
        {name: '', scaleType: 'BASE', optimization: 'MAX'},
    ]);

    const [errors, setErrors] = useState({
        title: false,
        alternatives: false,
        criteria: false,
    });

    const [showError, setShowError] = useState(false);
    const [showAccessDenied, setShowAccessDenied] = useState(false);
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);


    useEffect(() => {
        teamApi.getTeamById(+teamId!)
            .then((res) => setTeam(res.data))
            .catch((err) => {
                if (err.response?.status === 403) {
                    setShowAccessDenied(true);
                    setTimeout(() => navigate('/dashboard/teams'), 3000); // редиректим через 3 секунды
                } else {
                    console.error('Ошибка при загрузке команды:', err);
                }
            });
    }, [teamId]);


    const addAlternative = () => setAlternatives([...alternatives, '']);
    const removeAlternative = (index: number) =>
        setAlternatives(alternatives.filter((_, i) => i !== index));
    const updateAlternative = (index: number, value: string) =>
        setAlternatives(alternatives.map((alt, i) => (i === index ? value : alt)));

    const addCriterion = () =>
        setCriteria([...criteria, {name: '', scaleType: 'BASE', optimization: 'MAX'}]);
    const removeCriterion = (index: number) =>
        setCriteria(criteria.filter((_, i) => i !== index));
    const updateCriterion = (index: number, key: keyof Criterion, value: string) =>
        setCriteria(criteria.map((c, i) => (i === index ? {...c, [key]: value} : c)));

    const handleSave = async () => {
        const trimmedTitle = title.trim();
        const validAlternatives = alternatives.filter((a) => a.trim() !== '');
        const validCriteria = criteria.filter((c) => c.name.trim() !== '');

        const hasErrors = !trimmedTitle || validAlternatives.length === 0 || validCriteria.length === 0;

        setErrors({
            title: !trimmedTitle,
            alternatives: validAlternatives.length === 0,
            criteria: validCriteria.length === 0,
        });

        if (hasErrors) {
            setShowError(true);
            return;
        }

        try {
            const res = await questionApi.createQuestion({
                teamId: +teamId!,
                title: trimmedTitle,
                description: description.trim() || undefined,
                alternatives: validAlternatives,
                criteria: validCriteria.map((c) => ({
                    name: c.name,
                    scaleType: c.scaleType as ScaleType,
                    optimization: c.optimization as OptimizationDirection,
                })),
            });

            const id = res.data.id;
            setSuccessSnackbarOpen(true);

            setTimeout(() => {
                navigate(`/dashboard/teams/${teamId}/question/${id}`);
            }, 3000);

        } catch (err) {
            console.error('Ошибка при создании вопроса', err);
        }
    };

    if (!team) {
        return (
            <>
                <Snackbar
                    open={showAccessDenied}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                >
                    <Alert severity="error" sx={{width: '100%'}}>
                        Вы не можете добавлять вопросы в эту команду
                    </Alert>
                </Snackbar>
            </>
        );
    }

    return (
        <Box>
            <Typography variant="h5" mb={3}>Создание вопроса</Typography>

            <Paper sx={{p: 3, mb: 4}}>
                <Stack spacing={2}>
                    <TextField size="small" label="Команда" value={team.name} disabled fullWidth
                               helperText='Обязательно'/>
                    <TextField
                        size="small"
                        label="Вопрос"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        error={errors.title}
                        helperText='Обязательно'
                    />
                    <TextField
                        size="small"
                        label="Описание"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        minRows={3}
                    />
                </Stack>
            </Paper>

            <Stack direction={{xs: 'column', md: 'row'}} spacing={4} mb={4}>
                {/* Варианты решений */}
                <Paper sx={{
                    p: 3,
                    flex: 1,
                    border: errors.alternatives ? '1px solid red' : undefined,
                }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6">Варианты решений</Typography>
                        <Tooltip title="Добавить вариант">
                            <IconButton onClick={addAlternative}>
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Stack spacing={1.5}>
                        {alternatives.map((alt, idx) => (
                            <Stack key={idx} direction="row" spacing={1} alignItems="center">
                                <TextField
                                    size="small"
                                    label={`Вариант ${idx + 1}`}
                                    value={alt}
                                    onChange={(e) => updateAlternative(idx, e.target.value)}
                                    fullWidth
                                />
                                <Tooltip title="Удалить вариант">
                                    <IconButton color="error" onClick={() => removeAlternative(idx)}>
                                        <CloseIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        ))}
                    </Stack>
                </Paper>

                {/* Критерии оценки */}
                <Paper sx={{
                    p: 3,
                    flex: 2,
                    border: errors.criteria ? '1px solid red' : undefined,
                }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6">Критерии оценки</Typography>
                        <Tooltip title="Добавить критерий">
                            <IconButton onClick={addCriterion}>
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Table size="small" sx={{
                        borderCollapse: 'separate',
                        '& .MuiTableCell-root': {
                            borderBottom: 'none',
                            px: 0.5,
                            py: 0.8,
                        },
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Название</TableCell>
                                <TableCell>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <span>Шкала</span>
                                        <Tooltip
                                            title={<Typography whiteSpace="pre-line"
                                                               fontSize={12}>{scaleHint}</Typography>}>
                                            <HelpOutlineIcon fontSize="small" sx={{cursor: 'help'}}/>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <span>Оптимизация</span>
                                        <Tooltip
                                            title={<Typography whiteSpace="pre-line"
                                                               fontSize={12}>{optimizationHint}</Typography>}>
                                            <HelpOutlineIcon fontSize="small" sx={{cursor: 'help'}}/>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {criteria.map((c, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            value={c.name}
                                            onChange={(e) => updateCriterion(idx, 'name', e.target.value)}
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            select
                                            value={c.scaleType}
                                            onChange={(e) => updateCriterion(idx, 'scaleType', e.target.value)}
                                            fullWidth
                                        >
                                            {scaleOptions.map(opt => (
                                                <MenuItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            select
                                            value={c.optimization}
                                            onChange={(e) => updateCriterion(idx, 'optimization', e.target.value)}
                                            fullWidth
                                        >
                                            {optimizationOptions.map(opt => (
                                                <MenuItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Удалить критерий">
                                            <IconButton color="error" onClick={() => removeCriterion(idx)}>
                                                <CloseIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Stack>

            <Box sx={{mt: 4}}>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
            </Box>

            <Snackbar
                open={showError}
                autoHideDuration={3000}
                onClose={() => setShowError(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert severity="error" onClose={() => setShowError(false)} sx={{width: '100%'}}>
                    Пожалуйста, заполните все обязательные поля
                </Alert>
            </Snackbar>

            <Snackbar
                open={successSnackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSuccessSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Вопрос успешно создан! Перенаправление...
                </Alert>
            </Snackbar>
        </Box>
    );
};
