import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ConvertJsonFromUrl from '../utils/ConvertJson';
import { useSpinner } from '../globals/useSpinner';

interface DialogProps {
    handler: Function,
    cb: Function
}   

export const InputUrlDialog: React.FC<DialogProps> = ({ handler, cb }) => {
    const [insertedUrl, setInsertedUrl] = React.useState('');
    const setSpinner = useSpinner(state => state.setSpinner);
    const handleClose = () => {
        handler(false);
    };

    const handleConfirm = () => {
        handleClose();
        cb(ConvertJsonFromUrl(insertedUrl, setSpinner));
    }

    const handleTextChange = (e: any) => {
        setInsertedUrl(e.target.value);
    }

    return (
        <div>
            <Dialog open={true} onClose={handleClose}>
                <DialogTitle>Inserta una URL</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Puedes insertar la URL de la imagen de la carrera o la URL del JSON de la carrera directamente.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="URL de Rockstar"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleTextChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleConfirm}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
