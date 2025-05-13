import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface ErrorDialogProps {
    open: boolean;
    onClose: () => void;
    message: string;
}

export const ErrorDialog = ({ open, onClose, message }: ErrorDialogProps) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Ошибка</DialogTitle>
        <DialogContent>{message}</DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Ок</Button>
        </DialogActions>
    </Dialog>
);
