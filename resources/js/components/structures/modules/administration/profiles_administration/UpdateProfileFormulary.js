import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, Grid, FormLabel, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
// Custom
import { FormValidation } from '../../../../../utils/FormValidation';
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import axios from '../../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const initialFieldError = { name: false };
const initialFieldErrorMessage = { name: "" };
const initialDisplayAlert = { display: false, type: "", message: "" };

export const UpdateProfileFormulary = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();
    const [controlledInput, setControlledInput] = React.useState({ id: props.record.profile_id, name: props.record.profile_name });
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
        "1": { read: props.record.profile_modules_relationship["0"].read == 1 ? true : false, write: props.record.profile_modules_relationship["0"].write == 1 ? true : false },
        "2": { read: props.record.profile_modules_relationship["1"].read == 1 ? true : false, write: props.record.profile_modules_relationship["1"].write == 1 ? true : false },
        "3": { read: props.record.profile_modules_relationship["2"].read == 1 ? true : false, write: props.record.profile_modules_relationship["2"].write == 1 ? true : false },
        "4": { read: props.record.profile_modules_relationship["3"].read == 1 ? true : false, write: props.record.profile_modules_relationship["3"].write == 1 ? true : false },
        "5": { read: props.record.profile_modules_relationship["4"].read == 1 ? true : false, write: props.record.profile_modules_relationship["4"].write == 1 ? true : false },
        "6": { read: props.record.profile_modules_relationship["5"].read == 1 ? true : false, write: props.record.profile_modules_relationship["5"].write == 1 ? true : false }
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

    function handleSubmit(event) {
        event.preventDefault();
        if (formValidation()) {
            setLoading(true);
            requestServerOperation();
        }
    }

    function formValidation() {
        const nameValidate = FormValidation(controlledInput.name, 3, null, null, "nome");

        setFieldError({ name: nameValidate.error });
        setFieldErrorMessage({ name: nameValidate.message });

        return !nameValidate.error;
    }

    function requestServerOperation() {
        axios.patch(`/api/admin-module-profile/${controlledInput.id}`, {
            name: controlledInput.name,
            privileges: privileges
        })
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

    const errorResponse = (response) => {
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

    const handleInputChange = (event) => {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Tooltip title="Editar">
                <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["1"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>EDIÇÃO | PERFIL (ID: {props.record.profile_id})</DialogTitle>

                <Box component="form" noValidate onSubmit={handleSubmit} >
                    <DialogContent>

                        <TextField
                            margin="dense"
                            defaultValue={props.record.profile_id}
                            name="id"
                            label="ID do perfil"
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2 }}
                            InputProps={{
                                readOnly: true
                            }}
                        />

                        <TextField
                            margin="dense"
                            defaultValue={props.record.profile_name}
                            name="name"
                            label="Nome do perfil"
                            fullWidth
                            variant="outlined"
                            onChange={handleInputChange}
                            helperText={fieldErrorMessage.name}
                            error={fieldError.name}
                        />

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

                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" disabled={loading} variant="contained">Confirmar</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
});