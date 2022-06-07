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

export const AccountConfiguration = React.memo(({ ...props }) => {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const { AuthData } = useAuthentication();

    // States referentes ao formulário
    const [saveNecessary, setSaveNecessary] = React.useState(false);

    // States de validação dos campos
    const [errorDetected, setErrorDetected] = React.useState({ actual_password: false, new_password: false, new_password_confirmation: false }); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = React.useState({ actual_password: "", new_password: "", new_password_confirmation: "" }); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State do modal informativo acerca da desativação da conta
    const [openGenericModal, setOpenGenericModal] = React.useState(false);

    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    function handleSubmitChangePassword(event) {

        event.preventDefault();

        const data = new FormData(event.currentTarget);

        if (formChangePasswordValidate(data)) {

            requestServerOperation(data);

        }


    }

    function formChangePasswordValidate(data) {

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        const actualPasswordValidate = FormValidation(data.get("actual_password"), null, null, null, null);
        const newPasswordValidate = FormValidation(data.get("new_password"), null, null, passwordPattern, "PASSWORD");
        const newPasswordConfirmationValidate = data.get("new_password") != data.get("new_password_confirmation") ? { error: true, message: "As senhas são incompátiveis" } : { error: false, message: "" };

        setErrorDetected(
            {
                actual_password: actualPasswordValidate.error,
                new_password: newPasswordValidate.error,
                new_password_confirmation: newPasswordConfirmationValidate.error
            }
        );

        setErrorMessage(
            {
                actual_password: actualPasswordValidate.message,
                new_password: newPasswordValidate.message,
                new_password_confirmation: newPasswordConfirmationValidate.message
            }
        );

        if (actualPasswordValidate.error || newPasswordValidate.error || newPasswordConfirmationValidate.error) {

            return false;

        } else {

            return true;

        }

    }

    function requestServerOperation(data) {

        AxiosApi.post(`/api/update-password/${AuthData.data.id}`, data)
            .then(function () {

                handleOpenSnackbar("Senha alterada com sucesso!", "success");

            })
            .catch(function (error) {

                requestErrorServerOperation(error.response.data);

            });

    }

    function requestErrorServerOperation(response_data) {

        let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
        handleOpenSnackbar(error_message, "error");

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let input_errors = {
            actual_password: { error: false, message: null },
            new_password: { error: false, message: null },
            new_password_confirmation: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
        for (let prop in response_data.errors) {

            input_errors[prop] = {
                error: true,
                message: response_data.errors[prop][0]
            }

        }

        setErrorDetected({
            actual_password: input_errors.actual_password.error,
            new_password: input_errors.new_password.error,
            new_password_confirmation: input_errors.new_password_confirmation.error
        });

        setErrorMessage({
            actual_password: input_errors.actual_password.message,
            new_password: input_errors.new_password.message,
            new_password_confirmation: input_errors.new_password_confirmation.message
        });

    }

    function reloadFormulary() {

        props.reload_setter(!props.reload_state);

    }

    function disableAccount() {

        AxiosApi.post(`/api/desactivate-account/${AuthData.data.id}`)
            .then(function () {

                setOpenGenericModal(false);
                handleOpenSnackbar("Conta desativada com sucesso!", "success");

                setTimeout(() => {
                    window.location.href = "/sistema/sair";
                }, [2000])

            })
            .catch(function (error) {

                console.log(error)
                handleOpenSnackbar("Erro! Tente novamente.", "error");

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
                                helperText={errorMessage.actual_password}
                                error={errorDetected.actual_password}
                                onChange={() => { setSaveNecessary(true) }}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                label="Digite a nova senha"
                                name="new_password"
                                type={"password"}
                                fullWidth
                                variant="outlined"
                                helperText={errorMessage.new_password}
                                error={errorDetected.new_password}
                                onChange={() => { setSaveNecessary(true) }}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                label="Confirme a nova senha"
                                name="new_password_confirmation"
                                type={"password"}
                                fullWidth
                                variant="outlined"
                                helperText={errorMessage.new_password_confirmation}
                                error={errorDetected.new_password_confirmation}
                                onChange={() => { setSaveNecessary(true) }}
                                sx={{ marginBottom: 2 }}
                            />
                            <Button type="submit" variant="contained" color="primary" disabled={!saveNecessary}>
                                Alterar senha
                            </Button>
                        </PaperStyled>

                        <PaperStyled>
                            <Typography variant="h5" marginBottom={2}>Sessões ativas</Typography>
                            <Stack spacing={2}>
                                {props.data.length > 0 &&
                                    props.data.map((session) => (
                                        <Paper key={session.id} sx={{ boxShadow: 'none' }}>
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

});