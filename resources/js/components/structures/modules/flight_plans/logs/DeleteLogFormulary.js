import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, TextField } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
// Custom
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import axios from '../../../../../services/AxiosApi';

const initialDisplatAlert = { display: false, type: "", message: "" };

export const DeleteLogFormulary = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();
    const [controlledInput] = React.useState({ id: props.record.id, name: props.record.name });
    const [open, setOpen] = React.useState(false);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
    const [loading, setLoading] = React.useState(false);

    // ============================================================================== FUNCTIONS ============================================================================== //

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        props.record_setter(null);
        setDisplayAlert({ display: false, type: "", message: "" });
        setOpen(false);
    };

    const handleSubmitOperation = (event) => {
        event.preventDefault();
        requestServerOperation();
    }

    function requestServerOperation() {
        axios.delete(`/api/plans-module-logs/${controlledInput.id}`)
            .then(function (response) {
                setLoading(false);
                successResponse(response);
            })
            .catch(function (error) {
                setLoading(false);
                errorResponse(error.response.data);
            });
    }

    const successResponse = (response) => {
        setDisplayAlert({ display: true, type: "success", message: response.data.message });
        setTimeout(() => {
            props.record_setter(null);
            props.reload_table();
            handleClose();
        }, 2000);
    }

    const errorResponse = (response) => {
        setDisplayAlert({ display: true, type: "error", message: response.data.message });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Tooltip title="Deletar">
                <IconButton disabled={AuthData.data.user_powers["4"].profile_powers.write == 1 ? false : true} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["4"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>DELEÇÃO | RELATÓRIO (ID: {props.record.id})</DialogTitle>
                <Box component="form" noValidate onSubmit={handleSubmitOperation} >
                    <DialogContent>

                        <TextField
                            margin="dense"
                            id="id"
                            name="id"
                            label="ID"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={controlledInput.id}
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                        <TextField
                            margin="dense"
                            label="Log do vôo"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={controlledInput.name}
                            InputProps={{
                                inputProps: { min: 0, max: 1 },
                                readOnly: true
                            }}
                        />

                    </DialogContent>

                    {displayAlert.display &&
                        <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                    }

                    {loading && <LinearProgress />}

                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" disabled={loading}>Confirmar deleção</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
});