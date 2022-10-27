// React
import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
// Custom
import axios from '../../../../../services/AxiosApi';
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';

const initialDisplatAlert = { display: false, type: "", message: "" };

export const DeleteDroneFormulary = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();
    const [controlledInput] = React.useState({ id: props.record.id });
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const htmlImage = React.useRef();

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setDisplayAlert(initialDisplatAlert);
        setLoading(false);
        setOpen(false);
    }

    function handleDroneDeleteSubmit(event) {
        event.preventDefault();
        setLoading(true);
        requestServerOperation();
    }

    function requestServerOperation() {
        axios.delete(`/api/equipments-module-drone/${controlledInput.id}`)
            .then(function (response) {
                setLoading(false);
                successResponse(response);
            })
            .catch(function (error) {
                setLoading(false);
                errorResponse(error.response);
            });
    }

    function successResponse(response) {
        setDisplayAlert({ display: true, type: "success", message: response.data.message });
        setTimeout(() => {
            props.record_setter(null);
            props.reload_table();
            setLoading(false);
            handleClose();
        }, 2000);
    }

    function errorResponse(response) {
        setDisplayAlert({ display: true, type: "error", message: response.data.message });
    }

    // ============================================================================== STRUCTURES - MUI ============================================================================== //

    return (
        <>
            <Tooltip title="Editar">
                <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["6"].profile_powers.write == 1 ? false : true}>
                    <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["6"].profile_powers.write == 1 ? "#00713A" : "#808991"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>DELEÇÃO | ID: {props.record.id}</DialogTitle>

                <Box component="form" noValidate onSubmit={handleDroneDeleteSubmit} >
                    <DialogContent>

                        <TextField
                            type="text"
                            margin="dense"
                            label="ID do drone"
                            fullWidth
                            variant="outlined"
                            required
                            id="id"
                            name="id"
                            defaultValue={props.record.id}
                            InputProps={{
                                readOnly: true
                            }}
                        />

                        <TextField
                            type="text"
                            margin="dense"
                            label="Nome"
                            fullWidth
                            variant="outlined"
                            required
                            id="name"
                            name="name"
                            defaultValue={props.record.name}
                            InputProps={{
                                readOnly: true
                            }}
                        />

                        <TextField
                            type="text"
                            margin="dense"
                            label="Fabricante"
                            fullWidth
                            variant="outlined"
                            required
                            id="manufacturer"
                            name="manufacturer"
                            defaultValue={props.record.manufacturer}
                            InputProps={{
                                readOnly: true
                            }}
                        />

                        <TextField
                            type="text"
                            margin="dense"
                            label="Modelo"
                            fullWidth
                            variant="outlined"
                            required
                            id="model"
                            name="model"
                            defaultValue={props.record.model}
                            InputProps={{
                                readOnly: true
                            }}
                        />

                        <TextField
                            type="text"
                            margin="dense"
                            label="Número do registro"
                            fullWidth
                            variant="outlined"
                            required
                            id="record_number"
                            name="record_number"
                            defaultValue={props.record.record_number}
                            InputProps={{
                                readOnly: true
                            }}
                        />

                        <TextField
                            type="text"
                            margin="dense"
                            label="Número Serial"
                            fullWidth
                            variant="outlined"
                            required
                            id="serial_number"
                            name="serial_number"
                            defaultValue={props.record.serial_number}
                            InputProps={{
                                readOnly: true
                            }}
                        />

                        <TextField
                            type="text"
                            margin="dense"
                            label="Peso (KG)"
                            fullWidth
                            variant="outlined"
                            required
                            id="weight"
                            name="weight"
                            defaultValue={props.record.weight}
                            InputProps={{
                                readOnly: true
                            }}
                        />

                        <Box sx={{ mt: 2 }}>
                            <img ref={htmlImage} style={{ borderRadius: 10, width: "190px" }} src={props.record.image_url}></img>
                        </Box>

                    </DialogContent>

                    {(!loading && displayAlert.display) &&
                        <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                    }

                    {loading && <LinearProgress />}

                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" disabled={loading} variant="contained">Confirmar deleção</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
});