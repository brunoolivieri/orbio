// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const ModalActions = React.memo(({ ...props }) => {

    const handleClose = () => {
        props.setOpen(false);
    };

    return (
        <Dialog
            open={props.modal_open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{ style: { borderRadius: 15 } }}
        >

            <DialogTitle>{props.title.toUpperCase()}</DialogTitle>

            <DialogContent>

                <DialogContentText id="alert-dialog-description">
                    {props.content_text}
                </DialogContentText>

            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={props.confirmation_event}>Confirmar</Button>
            </DialogActions>
        </Dialog>
    );

});
