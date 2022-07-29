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

export const BasicDataPanel = React.memo(() => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();
    const [controlledInput, setControlledInput] = React.useState({ name: "Carregando", email: "Carregando", profile: "Carregando", last_access: "Carregando", last_update: "Carregando" });
    const [updateLoading, setUpdateLoading] = React.useState(false);
    const [loadingFields, setLoadingFields] = React.useState(true);
    const [fieldError, setFieldError] = React.useState({ name: false, email: false });
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ name: "", email: "" });

    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {

        setControlledInput({ name: "Carregando", email: "Carregando", profile: "Carregando", last_access: "Carregando", last_update: "Carregando" });

        AxiosApi.get("/api/load-basic-account-data")
            .then(function (response) {

                setLoadingFields(false);
                setUpdateLoading(false);
                setControlledInput({ name: response.data.name, email: response.data.email, profile: AuthData.data.profile, last_access: moment(AuthData.data.last_access).format('DD-MM-YYYY hh:mm'), last_update: moment(AuthData.data.last_update).format('DD-MM-YYYY hh:mm') });

            })
            .catch(function () {

                setLoadingFields(false);
                setUpdateLoading(false);
                setControlledInput({ name: "Erro", email: "Erro", profile: AuthData.data.profile, last_access: moment(AuthData.data.last_access).format('DD-MM-YYYY hh:mm'), last_update: moment(AuthData.data.last_update).format('DD-MM-YYYY hh:mm') });
                handleOpenSnackbar("Erro no carregamento dos dados.", "error");

            });

    }, [loadingFields]);

    const handleSubmitBasicDataForm = (event) => {
        event.preventDefault();

        if (formularyDataValidation()) {
            setUpdateLoading(true);
            requestServerOperation();
        }

    }

    const formularyDataValidation = () => {

        const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

        const nameValidate = FormValidation(controlledInput.name, 3);
        const emailValidate = FormValidation(controlledInput.email, null, null, emailPattern, "e-mail");

        setFieldError({ name: nameValidate.error, email: emailValidate.error });
        setFieldErrorMessage({ name: nameValidate.message, email: emailValidate.message });

        return !(nameValidate.error || emailValidate.error);

    }

    const requestServerOperation = () => {

        const body_data = {
            name: controlledInput.name,
            email: controlledInput.email
        }

        AxiosApi.patch(`/api/update-basic-data`, body_data)
            .then(function (response) {
                setUpdateLoading(false);
                setLoadingFields(true);
                handleOpenSnackbar(response.data.message, "success");
            })
            .catch(function (error) {
                setUpdateLoading(false);
                serverErrorResponseTreatment(error.response);
            });
    }

    const serverErrorResponseTreatment = (response) => {

        const error_message = response.data.message ? response.data.message : "Erro do servidor";
        handleOpenSnackbar(error_message, "error");

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let request_errors = {
            name: { error: false, message: null },
            email: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
        for (let prop in response.data.errors) {

            request_errors[prop] = {
                error: true,
                message: response.data.errors[prop][0]
            }

        }

        setFieldError({
            name: request_errors.name.error,
            email: request_errors.email.error
        });

        setFieldErrorMessage({
            name: request_errors.name.message,
            email: request_errors.email.message
        });

    }

    const reloadFormulary = () => {
        setLoadingFields(true);
    }

    const handleInputChange = (event) => {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }

    const handleOpenSnackbar = (text, variant) => {
        enqueueSnackbar(text, { variant });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

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

            < Box component="form" noValidate onSubmit={handleSubmitBasicDataForm} sx={{ mt: 2 }} >
                <Paper sx={{ marginTop: 4, padding: '0px 18px 18px 18px', borderRadius: '0px 15px 15px 15px' }}>
                    <Grid container spacing={3}>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="name"
                                name="name"
                                label="Nome completo"
                                fullWidth
                                value={controlledInput.name}
                                disabled={loadingFields}
                                variant="outlined"
                                helperText={fieldErrorMessage.name}
                                error={fieldError.name}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="email"
                                name="email"
                                label="Email"
                                value={controlledInput.email}
                                disabled={loadingFields}
                                fullWidth
                                variant="outlined"
                                helperText={fieldErrorMessage.email}
                                error={fieldError.email}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Perfil de usuário"
                                fullWidth
                                variant="outlined"
                                value={controlledInput.profile}
                                disabled={true}
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Data do último acesso"
                                fullWidth
                                variant="outlined"
                                value={controlledInput.last_access}
                                disabled={true}
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Data da última atualização"
                                fullWidth
                                value={controlledInput.last_update}
                                disabled={true}
                                variant="outlined"
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Button type="submit" variant="contained" color="primary" disabled={updateLoading || loadingFields} sx={{ mt: 2 }}>
                        {updateLoading ? "Processando..." : "Atualizar"}
                    </Button>

                </Paper>
            </Box>


        </>
    );

});