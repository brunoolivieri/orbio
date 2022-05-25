// React
import * as React from 'react';
// Material UI
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { Paper } from '@mui/material';
import { Button } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
// Custom
import AxiosApi from "../../../../../services/AxiosApi";
import { FormValidation } from '../../../../../utils/FormValidation';
import { useAuthentication } from "../../../../../components/context/InternalRoutesAuth/AuthenticationContext";
// Libs
import moment from 'moment';
import { useSnackbar } from 'notistack';

export const BasicDataPanel = React.memo((props) => {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const { AuthData } = useAuthentication();

    // States referentes ao formulário
    const [saveNecessary, setSaveNecessary] = React.useState(false);

    // States de validação dos campos
    const [errorDetected, setErrorDetected] = React.useState({ name: false, email: false }); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = React.useState({ name: "", email: "" }); // State para a mensagem do erro - objeto com mensagens para cada campo

    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    function enableSaveButton() {

        setSaveNecessary(true);

    }

    function reloadFormulary() {

        props.reload_setter(!props.reload_state);

    }

    /*
    * Rotina 1
    */
    function handleSubmitBasicDataForm(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        if (formDataValidate(data)) {

            requestServerOperation(data);

        }

    }

    /*
    * Rotina 2 
    */
    function formDataValidate(formData) {

        // Regex para validação
        const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

        const nameValidate = FormValidation(formData.get("name"), 3, null, null, null);
        const emailValidate = FormValidation(formData.get("email"), null, null, emailPattern, "EMAIL");

        setErrorDetected({ name: nameValidate.error, email: emailValidate.error });
        setErrorMessage({ name: nameValidate.message, email: emailValidate.message });

        if (nameValidate.error || emailValidate.error) {

            return false;

        } else {

            return true;

        }

    }

    /*
    * Rotina 3
    */
    function requestServerOperation(data) {

        let request_data = {};

        request_data = {
            email: data.get("email"),
            name: data.get("name")
        };

        AxiosApi.patch(`/api/update-basic-data/${AuthData.data.id}`, request_data)
            .then(function (response) {

                serverSuccessResponseTreatment(response);

            })
            .catch(function (error) {

                serverErrorResponseTreatment(error.response.data);

            });

    }

    /*
    * Rotina 4A 
    */
    function serverSuccessResponseTreatment() {

        handleOpenSnackbar("Dados atualizados com sucesso!", "success");

        props.reload_setter(!props.reload_state);

    }

    /*
   * Rotina 4B
   */
    function serverErrorResponseTreatment(response_data) {

        let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
        handleOpenSnackbar(error_message, "error");

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let input_errors = {
            name: { error: false, message: null },
            email: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
        for (let prop in response_data.errors) {

            input_errors[prop] = {
                error: true,
                message: response_data.errors[prop][0]
            }

        }

        setErrorDetected({
            name: input_errors.name.error,
            email: input_errors.email.error
        });

        setErrorMessage({
            name: input_errors.name.message,
            email: input_errors.email.message
        });

    }

    function handleOpenSnackbar(text, variant) {

        enqueueSnackbar(text, { variant });

    }

    // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return (
        <>
            <Grid container spacing={1} alignItems="center">

                <Grid item>
                    <Tooltip title="Carregar">
                        <IconButton onClick={reloadFormulary}>
                            <FontAwesomeIcon icon={faArrowsRotate} size="sm" color={'#007937'} />
                        </IconButton>
                    </Tooltip>
                </Grid>

            </Grid>

            <Box component="form" noValidate onSubmit={handleSubmitBasicDataForm} sx={{ mt: 2 }} >
                <Paper sx={{ marginTop: 4, padding: '0px 18px 18px 18px', borderRadius: '0px 15px 15px 15px' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="name"
                                name="name"
                                label="Nome completo"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.name}
                                helperText={errorMessage.name}
                                error={errorDetected.name}
                                onChange={enableSaveButton}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="email"
                                name="email"
                                label="Email"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.email}
                                helperText={errorMessage.email}
                                error={errorDetected.email}
                                onChange={enableSaveButton}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                label="Perfil de usuário"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.profile}
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                label="Data do último acesso"
                                fullWidth
                                variant="outlined"
                                defaultValue={moment(props.last_access).format('DD-MM-YYYY hh:mm')}
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                label="Data da última atualização"
                                fullWidth
                                defaultValue={moment(props.last_update).format('DD-MM-YYYY hh:mm')}
                                variant="outlined"
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Button type="submit" variant="contained" color="primary" disabled={!saveNecessary} sx={{ mt: 2 }}>
                        Atualizar
                    </Button>

                </Paper>
            </Box>

        </>
    );

});