import * as React from 'react';
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tooltip, Alert } from '@mui/material';
// Fonts awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Axios
import { useAuthentication } from '../../../../../context/InternalRoutesAuth/AuthenticationContext';

const initialDisplayAlert = { display: false, type: "", message: "" };

export function FlightPlanGeneration(props) {

    const { AuthData } = useAuthentication();
    const [open, setOpen] = React.useState(false);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
        setDisplayAlert(initialDisplayAlert);
    }

    window.addEventListener("message", (event) => {

        if (event.origin === 'http://localhost:8000' && event.data.type === 'flight_plan_creation') {
            setDisplayAlert({ display: true, type: "error", message: event.data.message });
            setTimeout(() => {
                props.reloadTable((old) => !old);
                handleClose();
            }, 2000);
        }

    }, false);

    return (
        <>
            <Tooltip title="Novo plano">
                <IconButton onClick={handleOpen}>
                    <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["4"].profile_powers.write == 1 ? "#00713A" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen
            >
                <DialogTitle>
                    CRIAÇÃO DE PLANO DE VOO
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <div id="modal-content" style={{ height: "100%" }}>
                        <iframe
                            id="iframe-content"
                            src="http://localhost:8000/internal/map"
                            style={{ width: "100%", height: "100%" }}
                        ></iframe>
                    </div>
                </DialogContent>

                {displayAlert.display &&
                    <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                }

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </>
    );

}