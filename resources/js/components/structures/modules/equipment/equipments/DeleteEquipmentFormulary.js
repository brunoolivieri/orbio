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

export const DeleteEquipmentFormulary = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();
    const [controlledInput] = React.useState({ id: props.record.id });
    const [loading, setLoading] = React.useState(false);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
    const [open, setOpen] = React.useState(false);

    // ============================================================================== FUNCTIONS ============================================================================== //

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setDisplayAlert({ display: false, type: "", message: "" });
        setLoading(false);
        setOpen(false);
    }

    const handleEquipmentDeleteSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        requestServerOperation();
    }

    const requestServerOperation = () => {
        axios.delete(`/api/equipments-module-equipment/${controlledInput.id}}`)
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
            props.reload_table();
            setLoading(false);
            handleClose();
        }, 2000);
    }

    const errorResponse = (response) => {
        setDisplayAlert({ display: true, type: "error", message: response.data.message });
    }

    // ============================================================================== STRUCTURES - MUI ============================================================================== //

    return (
        <>
            <Tooltip title="Editar">
                <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["6"].profile_powers.read == 1 ? false : true}>
                    <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["6"].profile_powers.read == 1 ? "#00713A" : "#808991"} size="sm" />
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

                <Box component="form" noValidate onSubmit={handleEquipmentDeleteSubmit} >

                    <DialogContent>

                        <TextField
                            type="text"
                            margin="dense"
                            label="ID do equipamento"
                            fullWidth
                            variant="outlined"
                            required
                            id="id"
                            name="id"
                            defaultValue={props.record.id}
                            InputProps={{
                                readOnly: true,
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
                                readOnly: true,
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
                                readOnly: true,
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
                                readOnly: true,
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
                                readOnly: true,
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
                                readOnly: true,
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
                                readOnly: true,
                            }}
                        />

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
    )
});