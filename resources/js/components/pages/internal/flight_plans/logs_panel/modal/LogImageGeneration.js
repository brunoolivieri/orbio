import * as React from 'react';
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tooltip } from '@mui/material';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';

export const LogImageGeneration = React.memo((props) => {

    const [open, setOpen] = React.useState(false);
    const [logImg, setLogImg] = React.useState(null);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setLogImg(null);
    }

    function handleSaveIframeImage() {

        //console.log(props.logs)
        //console.log(props.actual_log)

        props.setLogs((selectedLogs) => {

            return selectedLogs.map((selected_log) => {

                if (selected_log.original_name == props.actual_log.original_name) {
                    return {
                        ...selected_log,
                        image: logImg
                    }
                } else {
                    return selected_log;
                }
            });

        });

        handleClose();
    }

    // Listen for a response from the iframe
    window.addEventListener("message", (event) => {

        if (event.data.type === 'iframe-response') {
            setLogImg(event.data.canvas);
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
                    IMAGEM DO LOG
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <div id="modal-content" style={{ height: "100%" }}>
                        <iframe
                            id="iframe-content"
                            onLoad={(e) => e.target.contentWindow.postMessage({ type: 'log-creation-request', log: props.actual_log }, "http://localhost:8000")}
                            src="http://localhost:8000/internal/map-modal"
                            style={{ width: "100%", height: "100%" }}
                        ></iframe>
                    </div>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSaveIframeImage} variant="contained" disabled={logImg == null}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});
