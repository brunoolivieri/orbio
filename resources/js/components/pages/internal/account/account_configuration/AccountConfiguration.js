// React
import * as React from 'react';
// Material UI
import { Tooltip, Typography, IconButton, Grid, TextField, Button, Paper, Stack, Divider, Box } from '@mui/material';
import styled from '@emotion/styled';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
// Custom
import axios from "../../../../../services/AxiosApi";
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../../utils/FormValidation';
import { GenericModalDialog } from '../../../../structures/modals/dialog/GenericModalDialog';
// Assets
import AlertImage from "../../../../assets/images/Alert/Alert_md.png";
// Libs
import { useSnackbar } from 'notistack';

const PaperStyled = styled(Paper)({
    boxShadow: 'none',
    padding: 2,
    flexGrow: 1
});

const initialControlledInput = {
    actual_password: "",
    new_password: "",
    new_password_confirmation: ""
}

const initialFieldError = { actual_password: false, new_password: false, new_password_confirmation: false };
const initialFieldErrorMessage = { actual_password: "", new_password: "", new_password_confirmation: "" };

export const AccountConfiguration = () => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();
    const [controlledInput, setControlledInput] = React.useState(initialControlledInput);
    const [loading, setLoading] = React.useState(true);
    const [updateLoading, setUpdateLoading] = React.useState(false);
    const [fieldError, setFieldError] = React.useState(initialFieldError);
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
    const [openGenericModal, setOpenGenericModal] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {
        setControlledInput(initialControlledInput);
        axios.get("/api/load-sessions-data")
            .then(function () {
                setLoading(false);
            })
            .catch(function (error) {
                setLoading(false);
                handleOpenSnackbar(error.response.data.message, "error");
            });
    }, [loading]);

    function handleChangePasswordSubmit(e) {
        e.preventDefault();
        if (formValidation()) {
            setUpdateLoading(true);
            requestServerOperation();
        }
    }

    function formValidation() {

        const actualPasswordValidate = FormValidation(controlledInput.actual_password);
        const newPasswordValidate = FormValidation(controlledInput.new_password, null, null, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, "PASSWORD");
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

    function requestServerOperation() {
        axios.post(`/api/update-password/${AuthData.data.id}`, controlledInput)
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

    function requestErrorServerOperation(response) {
        handleOpenSnackbar(response.data.message, "error");

        let request_errors = {
            actual_password: { error: false, message: null },
            new_password: { error: false, message: null },
            new_password_confirmation: { error: false, message: null }
        }

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

    function disableAccount() {
        axios.post(`/api/desactivate-account/${AuthData.data.id}`)
            .then(function (response) {
                setOpenGenericModal(false);
                handleOpenSnackbar(response.data.message, "success");
                setTimeout(() => {
                    window.location.href = "/api/auth/logout";
                }, [2000])
            })
            .catch(function (error) {
                console.log(error)
                handleOpenSnackbar(error.response.data.message, "error");
            });
    }

    function handleInputChange(event) {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }

    function handleOpenSnackbar(text, variant) {
        enqueueSnackbar(text, { variant });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Grid container spacing={1} alignItems="center">

                <Grid item>
                    <Tooltip title="Carregar">
                        <IconButton onClick={() => setLoading(true)}>
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

            <Box component="form" onSubmit={handleChangePasswordSubmit} sx={{ mt: 2 }} >
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
                            <Typography variant="h5" marginBottom={2}>Desativar a conta</Typography>
                            <Stack spacing={2}>
                                <Paper sx={{ boxShadow: 'none' }}>
                                    <Typography>A conta será desativada, o perfil será alterado para visitante, e todos os dados cadastrados serão preservados. Para que seja novamente reativada, o usuário deve entrar em contato com o suporte.</Typography>
                                </Paper>
                                <Paper sx={{ boxShadow: 'none' }}>
                                    <Button variant="contained" color="error" onClick={() => setOpenGenericModal(true)}>
                                        Desativar conta
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