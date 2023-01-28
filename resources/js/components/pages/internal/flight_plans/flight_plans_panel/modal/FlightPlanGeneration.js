import * as React from 'react';
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tooltip } from '@mui/material';
// Fonts awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Axios
import { useAuthentication } from '../../../../../context/InternalRoutesAuth/AuthenticationContext';

export function FlightPlanGeneration() {

    const { AuthData } = useAuthentication();
    const [open, setOpen] = React.useState(false);

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleSaveFlightPlan() {
        console.log('save flight plan');
    }

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
                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSaveFlightPlan} variant="contained">
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );

}