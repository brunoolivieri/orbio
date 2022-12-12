import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Grid, FormLabel, Checkbox, FormGroup, FormControlLabel, Divider } from '@mui/material';
// Custom
import { FormValidation } from '../../../../../../utils/FormValidation';
import { useAuthentication } from '../../../../../context/InternalRoutesAuth/AuthenticationContext';
import axios from '../../../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const initialFieldError = { name: false };
const initialFieldErrorMessage = { name: "" };
const initialDisplayAlert = { display: false, type: "", message: "" };

export const UpdateProfile = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();

    const [controlledInput, setControlledInput] = React.useState({ id: props.record.id, name: props.record.name });
    const [fieldError, setFieldError] = React.useState(initialFieldError);
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    // Reducer Dispatch
    function privilegesReducer(actual_state, action) {
        let cloneState = Object.assign({}, actual_state);
        cloneState[action.module][action.privilege] = action.new_value;
        return cloneState;
    }

    // Reducer
    const [privileges, dispatch] = React.useReducer(privilegesReducer, {
        "1": { read: props.record.modules[0].read == 1 ? true : false, write: props.record.modules[0].write == 1 ? true : false },
        "2": { read: props.record.modules[1].read == 1 ? true : false, write: props.record.modules[1].write == 1 ? true : false },
        "3": { read: props.record.modules[2].read == 1 ? true : false, write: props.record.modules[2].write == 1 ? true : false },
        "4": { read: props.record.modules[3].read == 1 ? true : false, write: props.record.modules[3].write == 1 ? true : false },
        "5": { read: props.record.modules[4].read == 1 ? true : false, write: props.record.modules[4].write == 1 ? true : false },
        "6": { read: props.record.modules[5].read == 1 ? true : false, write: props.record.modules[5].write == 1 ? true : false }
    });

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setFieldError(initialFieldError);
        setFieldErrorMessage(initialFieldErrorMessage);
        setDisplayAlert(initialDisplayAlert);
        setLoading(false);
        setOpen(false);
    }

    function handleSubmit() {
        if (formValidation()) {
            setLoading(true);
            requestServer();
        }
    }

    function formValidation() {
        const nameValidate = FormValidation(controlledInput.name, 3, null, null, "nome");

        setFieldError({ name: nameValidate.error });
        setFieldErrorMessage({ name: nameValidate.message });

        return !nameValidate.error;
    }

    function requestServer() {
        axios.patch(`/api/admin-module-profile/${controlledInput.id}`, {
            name: controlledInput.name,
            privileges: privileges
        })
            .then(function (response) {
                successResponse(response);
            })
            .catch(function (error) {
                errorResponse(error.response);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    function successResponse(response) {
        setDisplayAlert({ display: true, type: "success", message: response.data.message });
        setTimeout(() => {
            props.reloadTable((old) => !old);
            setLoading(false);
            handleClose();
        }, 2000);
    }

    function errorResponse(response) {
        setDisplayAlert({ display: true, type: "error", message: response.data.message });

        let request_errors = {
            name: { error: false, message: null }
        }

        for (let prop in response.data.errors) {
            request_errors[prop] = {
                error: true,
                message: response.data.errors[prop][0]
            }
        }

        setFieldError({ name: request_errors.name.error });
        setFieldErrorMessage({ name: request_errors.name.message });
    }

    function handleInputChange(event) {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Tooltip title="Editar">
                <IconButton disabled={!AuthData.data.user_powers["1"].profile_powers.write == 1} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["1"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>ATUALIZAÇÃO DE PERFIL</DialogTitle>
                <Divider />

                <DialogContent>

                    <Grid container spacing={1}>

                        <Grid item xs={2}>
                            <TextField
                                margin="dense"
                                value={controlledInput.id}
                                name="id"
                                label="ID"
                                fullWidth
                                variant="outlined"
                                sx={{ mb: 2 }}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={10}>
                            <TextField
                                margin="dense"
                                value={controlledInput.name}
                                name="name"
                                label="Nome"
                                fullWidth
                                variant="outlined"
                                onChange={handleInputChange}
                                helperText={fieldErrorMessage.name}
                                error={fieldError.name}
                            />
                        </Grid>

                    </Grid>

                    <Grid container sx={{ mt: 2 }} spacing={1} alignItems="left">
                        <Grid item>
                            <FormLabel component="legend">Admin</FormLabel>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={privileges["1"].read} onChange={(event) => { dispatch({ module: "1", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                <FormControlLabel control={<Checkbox checked={privileges["1"].write} onChange={(event) => { dispatch({ module: "1", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                            </FormGroup>
                        </Grid>

                        <Grid item>
                            <FormLabel component="legend">Planos</FormLabel>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={privileges["2"].read} onChange={(event) => { dispatch({ module: "2", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                <FormControlLabel control={<Checkbox checked={privileges["2"].write} onChange={(event) => { dispatch({ module: "2", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                            </FormGroup>
                        </Grid>

                        <Grid item>
                            <FormLabel component="legend">Ordens</FormLabel>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={privileges["3"].read} onChange={(event) => { dispatch({ module: "3", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                <FormControlLabel control={<Checkbox checked={privileges["3"].write} onChange={(event) => { dispatch({ module: "3", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                            </FormGroup>
                        </Grid>

                        <Grid item>
                            <FormLabel component="legend">Relatórios</FormLabel>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={privileges["4"].read} onChange={(event) => { dispatch({ module: "4", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                <FormControlLabel control={<Checkbox checked={privileges["4"].write} onChange={(event) => { dispatch({ module: "4", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                            </FormGroup>
                        </Grid>

                        <Grid item>
                            <FormLabel component="legend">Incidentes</FormLabel>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={privileges["5"].read} onChange={(event) => { dispatch({ module: "5", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                <FormControlLabel control={<Checkbox checked={privileges["5"].write} onChange={(event) => { dispatch({ module: "5", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                            </FormGroup>
                        </Grid>

                        <Grid item>
                            <FormLabel component="legend">Equipamentos</FormLabel>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={privileges["6"].read} onChange={(event) => { dispatch({ module: "6", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                <FormControlLabel control={<Checkbox checked={privileges["6"].write} onChange={(event) => { dispatch({ module: "6", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                            </FormGroup>
                        </Grid>
                    </Grid>

                </DialogContent>

                {(!loading && displayAlert.display) &&
                    <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                }

                {loading && <LinearProgress />}

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" disabled={loading} variant="contained" onClick={handleSubmit}>Confirmar</Button>
                </DialogActions>

            </Dialog>
        </>
    );
});