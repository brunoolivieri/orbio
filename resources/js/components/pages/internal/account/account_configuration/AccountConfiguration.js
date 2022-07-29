// React
import * as React from 'react';
// Material UI
import { Tooltip, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import { Paper } from '@mui/material';
import { Stack } from '@mui/material';
import { Divider } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faComputer } from '@fortawesome/free-solid-svg-icons';
// Custom
import AxiosApi from "../../../../../services/AxiosApi";
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../../utils/FormValidation';
import { GenericModalDialog } from '../../../../structures/generic_modal_dialog/GenericModalDialog';
// Assets
import AlertImage from "../../../../assets/images/Alert/Alert_md.png";
// Libs
import { useSnackbar } from 'notistack';
import styled from '@emotion/styled';

const PaperStyled = styled(Paper)({
    boxShadow: 'none',
    padding: 2,
    flexGrow: 1
});

export const AccountConfiguration = () => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();
    const [controlledInput, setControlledInput] = React.useState({ actual_password: "", new_password: "", new_password_confirmation: "" });
    const [sessions, setSessions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [updateLoading, setUpdateLoading] = React.useState(false);
    const [fieldError, setFieldError] = React.useState({ actual_password: false, new_password: false, new_password_confirmation: false });
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ actual_password: "", new_password: "", new_password_confirmation: "" });
    const [openGenericModal, setOpenGenericModal] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {

        setControlledInput({ actual_password: "", new_password: "", new_password_confirmation: "" });

        AxiosApi.get("/api/load-sessions-data")
            .then(function (response) {

                setSessions(response.data);
                setLoading(false);

            })
            .catch(function () {

                setSessions([]);
                setLoading(false);
                handleOpenSnackbar("Erro no carregamento das sessões ativas.", "error");

            });

    }, [loading]);

    const handleInputChange = (event) => {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }

    const handleSubmitChangePassword = (event) => {
        event.preventDefault();

        if (formChangePasswordValidate()) {
            setUpdateLoading(true);
            requestServerOperation();
        }

    }

    const formChangePasswordValidate = () => {

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        const actualPasswordValidate = FormValidation(controlledInput.actual_password);
        const newPasswordValidate = FormValidation(controlledInput.new_password, null, null, passwordPattern, "PASSWORD");
        const newPasswordConfirmationValidate = controlledInput.new_password != controlledInput.new_password_confirmation ? { error: true, message: "As senhas são incompátiveis" } : { error: false, message: "" };

        setFieldError(
            {
                actual_password: actualPasswordValidate.error,
                new_password: newPasswordValidate.error,
                new_password_confirmation: newPasswordConfirmationValidate.error
            }
        );

        setFieldErrorMessage(
            {
                actual_password: actualPasswordValidate.message,
                new_password: newPasswordValidate.message,
                new_password_confirmation: newPasswordConfirmationValidate.message
            }
        );

        return !(actualPasswordValidate.error || newPasswordValidate.error || newPasswordConfirmationValidate.error);

    }

    const requestServerOperation = () => {

        AxiosApi.post(`/api/update-password/${AuthData.data.id}`, controlledInput)
            .then(function (response) {

                setUpdateLoading(false);
                setControlledInput({ actual_password: "", new_password: "", new_password_confirmation: "" });
                handleOpenSnackbar(response.data.message, "success");

            })
            .catch(function (error) {

                setUpdateLoading(false);
                setControlledInput({ actual_password: "", new_password: "", new_password_confirmation: "" });
                requestErrorServerOperation(error.response);

            });

    }

    const requestErrorServerOperation = (response) => {

        const error_message = response.data.message ? response.data.message : "Erro do servidor";
        handleOpenSnackbar(error_message, "error");

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let request_errors = {
            actual_password: { error: false, message: null },
            new_password: { error: false, message: null },
            new_password_confirmation: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
        for (let prop in response.data.errors) {

            request_errors[prop] = {
                error: true,
                message: response.data.errors[prop][0]
            }

        }

        setFieldError({
            actual_password: request_errors.actual_password.error,
            new_password: request_errors.new_password.error,
            new_password_confirmation: request_errors.new_password_confirmation.error
        });

        setFieldErrorMessage({
            actual_password: request_errors.actual_password.message,
            new_password: request_errors.new_password.message,
            new_password_confirmation: request_errors.new_password_confirmation.message
        });

    }

    const reloadFormulary = () => {
        setLoading(true);
    }

    const disableAccount = () => {

        AxiosApi.post(`/api/desactivate-account/${AuthData.data.id}`)
            .then(function () {

                setOpenGenericModal(false);
                handleOpenSnackbar("Conta desativada com sucesso!", "success");

                setTimeout(() => {
                    window.location.href = "/api/auth/logout";
                }, [2000])

            })
            .catch(function (error) {

                console.log(error)
                handleOpenSnackbar("Erro! Tente novamente.", "error");

            });

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

                <Grid item>
                    <GenericModalDialog
                        modal_controller={{ state: openGenericModal, setModalState: setOpenGenericModal, counter: { required: false } }}
                        title={{ top: { required: false }, middle: { required: false } }}
                        image={{ required: true, src: AlertImage }}
                        lottie={{ required: false }}
                        content_text={"A desativação é imediata. O login ainda será possível, mas a conta terá acesso mínimo ao sistema."}
                        actions={{
                            required: true,
                            close_button_text: {
                                required: true,
                                text: "Cancelar"
                            },
                            confirmation_default_button: {
                                required: true,
                                text: "Desativar a conta",
                                event: disableAccount
                            },
                            confirmation_button_with_link: {
                                required: false
                            }
                        }}
                    />
                </Grid>

            </Grid>

            <Box component="form" onSubmit={handleSubmitChangePassword} sx={{ mt: 2 }} >
                <Paper sx={{ marginTop: 2, padding: '18px 18px 18px 18px', borderRadius: '0px 15px 15px 15px' }}>
                    <Stack
                        direction="column"
                        spacing={2}
                        divider={<Divider orientation="horizontal" flexItem />}
                    >
                        <PaperStyled sx={{ maxWidth: '800px' }}>
                            <Typography variant="h5" marginBottom={2}>Alteração da senha</Typography>
                            <TextField
                                label="Informe a senha atual"
                                name="actual_password"
                                type={"password"}
                                fullWidth
                                variant="outlined"
                                value={controlledInput.actual_password}
                                helperText={fieldErrorMessage.actual_password}
                                error={fieldError.actual_password}
                                onChange={handleInputChange}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                label="Digite a nova senha"
                                name="new_password"
                                type={"password"}
                                fullWidth
                                variant="outlined"
                                value={controlledInput.new_password}
                                helperText={fieldErrorMessage.new_password}
                                error={fieldError.new_password}
                                onChange={handleInputChange}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                label="Confirme a nova senha"
                                name="new_password_confirmation"
                                type={"password"}
                                fullWidth
                                variant="outlined"
                                value={controlledInput.new_password_confirmation}
                                helperText={fieldErrorMessage.new_password_confirmation}
                                error={fieldError.new_password_confirmation}
                                onChange={handleInputChange}
                                sx={{ marginBottom: 2 }}
                            />
                            <Button type="submit" variant="contained" color="primary" disabled={updateLoading}>
                                {updateLoading ? "Processando..." : "Atualizar"}
                            </Button>
                        </PaperStyled>


                        <PaperStyled>
                            <Typography variant="h5" marginBottom={2}>Sessões ativas</Typography>
                            <Stack spacing={2}>
                                {!loading && sessions.length > 0 &&
                                    sessions.map((session, index) => (
                                        <Paper key={index} sx={{ boxShadow: 'none' }}>
                                            <Card sx={{ display: 'flex', alignItems: 'center', boxShadow: 'none' }}>
                                                <Box sx={{ padding: 2 }}>
                                                    <FontAwesomeIcon icon={faComputer} size="2x" color={'#4caf50'} />
                                                </Box>
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                                        <Typography component="div" variant="h5">
                                                            Sessão ativa
                                                        </Typography>
                                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                                            Navegador: {session.user_agent} | IP: {session.ip}
                                                        </Typography>
                                                    </CardContent>
                                                </Box>
                                            </Card>
                                        </Paper>
                                    ))
                                }
                            </Stack>
                        </PaperStyled>

                        <PaperStyled>
                            <Typography variant="h5" marginBottom={2}>Desativar a conta</Typography>
                            <Stack spacing={2}>
                                <Paper sx={{ boxShadow: 'none' }}>
                                    <Typography>A conta será desativada, o perfil será alterado para visitante, e todos os dados cadastrados serão preservados. Para que seja novamente reativada, o usuário deve entrar em contato com o suporte.</Typography>
                                </Paper>
                                <Paper sx={{ boxShadow: 'none' }}>
                                    <Button variant="contained" color="error" onClick={() => { setOpenGenericModal(true) }}>
                                        Desativar conta temporariamente
                                    </Button>
                                </Paper>
                            </Stack>
                        </PaperStyled>

                    </Stack>
                </Paper>
            </Box>

        </>
    );
}