import * as React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Divider, IconButton } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

export function ModalImage(props) {

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <IconButton onClick={handleOpen}>
                <InsertPhotoIcon />
            </IconButton>
            <Dialog
                open={open}
                fullWidth
                fullScreen
            >
                <DialogContent style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={props.image_url} style={{ width: 'auto', height: '100%' }} />
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleClose} variant="contained">Fechar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}