// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';
import { Grid } from '@mui/material';
import { FormLabel } from '@mui/material';
import { Checkbox } from '@mui/material';
import { FormGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
// Custom
import { FormValidation } from '../../../../../utils/FormValidation';
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import AxiosApi from '../../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export const UpdateProfileFormulary = React.memo((props) => {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    const { AuthData } = useAuthentication();

    const [controlledInput, setControlledInput] = React.useState({ id: props.record.profile_id, name: props.record.profile_name });

    const [fieldError, setFieldError] = React.useState({ name: false });
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ name: "" });

    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

    // Reducer Dispatch
    const privilegesReducer = (actual_state, action) => {

        let cloneState = Object.assign({}, actual_state);
        cloneState[action.module][action.privilege] = action.new_value;
        return cloneState;

    };

    // Reducer
    const [privileges, dispatch] = React.useReducer(privilegesReducer, {
        "1": { read: props.record.profile_modules_relationship["0"].read == 1 ? true : false, write: props.record.profile_modules_relationship["0"].write == 1 ? true : false },
        "2": { read: props.record.profile_modules_relationship["1"].read == 1 ? true : false, write: props.record.profile_modules_relationship["1"].write == 1 ? true : false },
        "3": { read: props.record.profile_modules_relationship["2"].read == 1 ? true : false, write: props.record.profile_modules_relationship["2"].write == 1 ? true : false },
        "4": { read: props.record.profile_modules_relationship["3"].read == 1 ? true : false, write: props.record.profile_modules_relationship["3"].write == 1 ? true : false },
        "5": { read: props.record.profile_modules_relationship["4"].read == 1 ? true : false, write: props.record.profile_modules_relationship["4"].write == 1 ? true : false },
        "6": { read: props.record.profile_modules_relationship["5"].read == 1 ? true : false, write: props.record.profile_modules_relationship["5"].write == 1 ? true : false }
    });

    const [loading, setLoading] = React.useState(false);

    const [open, setOpen] = React.useState(false);

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setFieldError({ name: false });
        setFieldErrorMessage({ name: "" });
        setDisplayAlert({ display: false, type: "", message: "" });
        setLoading(false);
        setOpen(false);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (formularyDataValidate()) {

            setLoading(true);
            requestServerOperation();

        }

    }

    const formularyDataValidate = () => {

        const nameValidate = FormValidation(controlledInput.name, 3, null, null, "nome");

        setFieldError({ name: nameValidate.error });
        setFieldErrorMessage({ name: nameValidate.message });

        return !nameValidate.error;

    }

    const requestServerOperation = () => {

        AxiosApi.patch(`/api/admin-module-profile/${controlledInput.id}`, {
            name: controlledInput.name,
            privileges: privileges
        })
            .then(function (response) {

                setLoading(false);
                successServerResponseTreatment(response);

            })
            .catch(function (error) {

                setLoading(false);
                errorServerResponseTreatment(error.response);

            });

    }

    const successServerResponseTreatment = (response) => {

        setDisplayAlert({ display: true, type: "success", message: response.data.message });

        setTimeout(() => {
            props.record_setter(null);
            props.reload_table();
            setLoading(false);
            handleClose();
        }, 2000);

    }

    const errorServerResponseTreatment = (response) => {

        const error_message = response.data.message ? response.data.message : "Erro do servidor";
        setDisplayAlert({ display: true, type: "error", message: error_message });

        // Erros retornáveis como erros na response
        let request_errors = {
            name: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
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

    // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return (
        <>
            <Tooltip title="Editar">
                <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["1"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
                </IconButton>
            </Tooltip>

            {(props.record != null && open) &&
                <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
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

                        </DialogContent>

                        <Grid container sx={{ ml: 2, mb: 3 }} spacing={1} alignItems="left">

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

                        {(!loading && displayAlert.display) &&
                            <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                        }

                        {loading && <LinearProgress />}

                        <DialogActions>
                            <Button onClick={handleClose}>Cancelar</Button>
                            <Button type="submit" disabled={loading} variant="contained">Confirmar atualização</Button>
                        </DialogActions>

                    </Box>

                </Dialog>
            }
        </>
    );
});