import * as React from 'react';
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tooltip } from '@mui/material';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

export const LogImageConfig = React.memo((props) => {

    const [open, setOpen] = React.useState(false);
    const [logImg, setLogImg] = React.useState(null);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    function handleSaveIframeImage(e) {

        //console.log('save iframe image');

    }

    // Listen for a response from the iframe
    window.addEventListener("message", (event) => {

        if (event.data.type === 'iframe-response') {
            console.log(event.data.data);
        }

    }, false);

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
                            onLoad={(e) => e.target.contentWindow.postMessage({ type: 'modal-request', log: props.log }, "http://localhost:8000")}
                            src="http://localhost:8000/internal/map-modal"
                            style={{ width: "100%", height: "100%" }}
                        ></iframe>
                    </div>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSaveIframeImage} variant="contained" disabled={!!logImg}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});
