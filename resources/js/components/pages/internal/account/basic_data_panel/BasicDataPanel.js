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
import { BackdropLoading } from '../../../../structures/backdrop_loading/BackdropLoading';
// Libs
import moment from 'moment';
import { useSnackbar } from 'notistack';

export const BasicDataPanel = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();

    const [controlledInput, setControlledInput] = React.useState({ name: props.name, email: props.email });

    const [loading, setLoading] = React.useState(false);

    const [fieldError, setFieldError] = React.useState({ name: false, email: false });
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ name: "", email: "" });

    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNCTIONS ============================================================================== //

    const reloadFormulary = () => {
        setLoading(true);
        props.reload_setter(!props.reload_state);
    }

    const handleSubmitBasicDataForm = (event) => {
        event.preventDefault();

        if (formularyDataValidation()) {
            setLoading(true);
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

        AxiosApi.patch(`/api/update-basic-data/${AuthData.data.id}`, controlledInput)
            .then(function (response) {

                setLoading(false);
                serverSuccessResponseTreatment(response);

            })
            .catch(function (error) {

                setLoading(false);
                serverErrorResponseTreatment(error.response.data);

            });

    }

    const serverSuccessResponseTreatment = (response) => {
        handleOpenSnackbar(response.data.message, "success");
        props.reload_setter(!props.reload_state);
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

    const handleInputChange = (event) => {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }

    function handleOpenSnackbar(text, variant) {
        enqueueSnackbar(text, { variant });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            {loading && <BackdropLoading />}
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
                                defaultValue={props.data.name}
                                helperText={fieldErrorMessage.name}
                                error={fieldError.name}
                                onChange={handleInputChange}
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
                                defaultValue={props.data.email}
                                helperText={fieldErrorMessage.email}
                                error={fieldError.email}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                label="Perfil de usuário"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.data.profile}
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

                    <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }}>
                        Atualizar
                    </Button>

                </Paper>
            </Box>

        </>
    );

});