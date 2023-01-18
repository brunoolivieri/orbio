import * as React from 'react';
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tooltip } from '@mui/material';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

export const LogImageConfig = React.memo((props) => {

    React.useEffect(() => {
        //console.log(props.log)
    });

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (!props.is_valid) {
        return (
            <IconButton>
                <FontAwesomeIcon icon={faImage} color={"#E0E0E0"} size="sm" />
            </IconButton>
        )
    }

    return (
        <>
            <Tooltip title="Gerar imagem">
                <IconButton onClick={handleOpen}>
                    <FontAwesomeIcon icon={faImage} color={"#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    IMAGEM DO LOG
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <div id="modal-content" style={{ height: "500px" }}>
                        <iframe
                            id="iframe-content"
                            src="http://localhost:8000/internal/map-modal"
                            style={{ width: "100%", height: "100%" }}
                        ></iframe>
                    </div>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleClose} variant="contained">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});
