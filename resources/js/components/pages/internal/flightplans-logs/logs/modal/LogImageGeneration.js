import * as React from 'react';
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tooltip } from '@mui/material';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';

export const LogImageGeneration = React.memo((props) => {

    const [open, setOpen] = React.useState(false);
    const [image, setImage] = React.useState(null);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setImage(null);
    }

    function handleSaveIframeImage() {

        props.setLogs((logs) => {

            return logs.map((log) => {

                if (String(log.filename) === String(props.actual_log.filename)) {
                    return {
                        ...log,
                        ["image"]: image
                    }
                }

                return log;
            });

        });

        handleClose();
    }

    // Listen for a response from the iframe
    window.addEventListener("message", (event) => {
        if (event.data.type === 'iframe-response' && (event.origin === window.location.origin)) {
            setImage(event.data.canvas);
        }
    }, false);

    return (
        <>
            <Tooltip title="Gerar imagem">
                <IconButton onClick={handleOpen}>
                    <PhotoSizeSelectActualIcon color={props.actual_log.image ? "success" : "disabled"} fontSize="medium" />
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen
            >
                <DialogTitle>
                    GERAÇÃO DE IMAGEM
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <div id="modal-content" style={{ height: "100%" }}>
                        <iframe
                            id="iframe-content"
                            onLoad={(e) => e.target.contentWindow.postMessage({ type: 'log-creation-request', log: props.actual_log }, `${window.location.origin}`)}
                            src={`${window.location.origin}/map-modal`}
                            style={{ width: "100%", height: "100%" }}
                        ></iframe>
                    </div>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSaveIframeImage} variant="contained" disabled={image === null}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});
