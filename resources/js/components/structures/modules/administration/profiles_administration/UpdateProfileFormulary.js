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
// Custom
import { FormValidation } from '../../../../../utils/FormValidation';
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import AxiosApi from '../../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export const UpdateProfileFormulary = React.memo(({ ...props }) => {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const { AuthData } = useAuthentication();

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = React.useState({ profile_name: false }); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = React.useState({ profile_name: null }); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = React.useState(false);

    const privilegesReducer = (actual_state, action) => {

        let cloneState = Object.assign({}, actual_state);
        cloneState[action.module][action.privilege] = action.new_value;
        return cloneState;

    };

    // Reducer
    const [privileges, dispatch] = React.useReducer(privilegesReducer, {
        "1": { read: props.record.modules["1"].profile_powers.ler === 1 ? true : false, write: props.record.modules["1"].profile_powers.write === 1 ? true : false },
        "2": { read: props.record.modules["2"].profile_powers.ler === 1 ? true : false, write: props.record.modules["2"].profile_powers.write === 1 ? true : false },
        "3": { read: props.record.modules["3"].profile_powers.ler === 1 ? true : false, write: props.record.modules["3"].profile_powers.write === 1 ? true : false },
        "4": { read: props.record.modules["4"].profile_powers.ler === 1 ? true : false, write: props.record.modules["4"].profile_powers.write === 1 ? true : false },
        "5": { read: props.record.modules["5"].profile_powers.ler === 1 ? true : false, write: props.record.modules["5"].profile_powers.write === 1 ? true : false },
        "6": { read: props.record.modules["6"].profile_powers.ler === 1 ? true : false, write: props.record.modules["6"].profile_powers.write === 1 ? true : false }
    });

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setErrorDetected({ profile_name: false });
        setErrorMessage({ profile_name: null });
        setDisplayAlert({ display: false, type: "", message: "" });
        setDisabledButton(false);
        setOpen(false);
    }

    /*
    * Rotina 1
    */
    function handleSubmitOperation(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        setDisabledButton(true);

        if (submitedDataValidate(data)) {

            requestServerOperation(data);

        }

    }

    /*
    * Rotina 2
    */
    function submitedDataValidate(formData) {

        const nameValidate = FormValidation(formData.get("profile_name"), 3, null, null, null);

        setErrorDetected({ profile_name: nameValidate.error });
        setErrorMessage({ profile_name: nameValidate.message });

        if (nameValidate.error === true) {

            return false;

        } else {

            return true;

        }

    }

    /*
    * Rotina 3
    */
    const requestServerOperation = (data) => {

        AxiosApi.patch(`/api/admin-module-profile/${data.get("profile_id")}`, {
            profile_name: data.get("profile_name"),
            profile_modules_relationship: privileges
        })
            .then(function () {

                successServerResponseTreatment();

            })
            .catch(function (error) {

                errorServerResponseTreatment(error.response.data);

            });

    }

    /*
    * Rotina 4A
    */
    const successServerResponseTreatment = () => {

        setDisplayAlert({ display: true, type: "success", message: "Operação realizada com sucesso!" });

        setTimeout(() => {

            // Deselecionar registro na tabela
            props.record_setter(null);
            // Outros
            props.reload_table();
            setDisabledButton(false);
            handleClose();

        }, 2000);

    }

    /*
    * Rotina 4B
    */
    const errorServerResponseTreatment = (response_data) => {

        setDisabledButton(false);

        let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
        setDisplayAlert({ display: true, type: "error", message: error_message });

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let input_errors = {
            profile_name: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
        for (let prop in response_data.errors) {

            input_errors[prop] = {
                error: true,
                message: response_data.errors[prop][0]
            }

        }

        setErrorDetected({ profile_name: input_errors.profile_name.error });
        setErrorMessage({ profile_name: input_errors.profile_name.message });

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

                    <Box component="form" noValidate onSubmit={handleSubmitOperation} >

                        <DialogContent>

                            <TextField
                                margin="dense"
                                defaultValue={props.record.profile_id}
                                id="profile_id"
                                name="profile_id"
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
                                id="profile_name"
                                name="profile_name"
                                label="Nome do perfil"
                                fullWidth
                                variant="outlined"
                                helperText={errorMessage.profile_name}
                                error={errorDetected.profile_name}
                            />

                        </DialogContent>

                        <Grid container sx={{ ml: 2, mb: 3 }} spacing={1} alignItems="left">

                            <Grid item>
                                <FormLabel component="legend">Admin</FormLabel>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked={privileges["1"].read} onChange={(event) => { dispatch({ module: "1", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                    <FormControlLabel control={<Checkbox defaultChecked={privileges["1"].write} onChange={(event) => { dispatch({ module: "1", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                                </FormGroup>
                            </Grid>

                            <Grid item>
                                <FormLabel component="legend">Planos</FormLabel>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked={privileges["2"].read} onChange={(event) => { dispatch({ module: "2", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                    <FormControlLabel control={<Checkbox defaultChecked={privileges["2"].write} onChange={(event) => { dispatch({ module: "2", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                                </FormGroup>
                            </Grid>

                            <Grid item>
                                <FormLabel component="legend">Ordens</FormLabel>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked={privileges["3"].read} onChange={(event) => { dispatch({ module: "3", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                    <FormControlLabel control={<Checkbox defaultChecked={privileges["3"].write} onChange={(event) => { dispatch({ module: "3", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                                </FormGroup>
                            </Grid>

                            <Grid item>
                                <FormLabel component="legend">Relatórios</FormLabel>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked={privileges["4"].read} onChange={(event) => { dispatch({ module: "4", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                    <FormControlLabel control={<Checkbox defaultChecked={privileges["4"].write} onChange={(event) => { dispatch({ module: "4", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                                </FormGroup>
                            </Grid>

                            <Grid item>
                                <FormLabel component="legend">Incidentes</FormLabel>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked={privileges["5"].read} onChange={(event) => { dispatch({ module: "5", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                    <FormControlLabel control={<Checkbox defaultChecked={privileges["5"].write} onChange={(event) => { dispatch({ module: "5", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                                </FormGroup>
                            </Grid>

                            <Grid item>
                                <FormLabel component="legend">Equipamentos</FormLabel>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked={privileges["6"].read} onChange={(event) => { dispatch({ module: "6", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                    <FormControlLabel control={<Checkbox defaultChecked={privileges["6"].write} onChange={(event) => { dispatch({ module: "6", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                                </FormGroup>
                            </Grid>

                        </Grid>

                        {displayAlert.display &&
                            <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                        }

                        <DialogActions>
                            <Button onClick={handleClose}>Cancelar</Button>
                            <Button type="submit" disabled={disabledButton} variant="contained">Confirmar atualização</Button>
                        </DialogActions>

                    </Box>

                </Dialog>
            }
        </>
    );
});