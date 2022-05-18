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
//import { FormValidation } from '../../../../../utils/FormValidation';
import { GenericModalDialog } from '../../../../structures/generic_modal_dialog/GenericModalDialog';
// Assets
import ErrorAnimation from "../../../../assets/lotties/ErrorLottie";
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

    // States referentes ao formulário
    const [saveNecessary, setSaveNecessary] = React.useState(false);

    // States de validação dos campos
    const [errorDetected] = React.useState({ actual_password: false, new_password: false }); // State para o efeito de erro - true ou false
    const [errorMessage] = React.useState({ actual_password: "", new_password: "" }); // State para a mensagem do erro - objeto com mensagens para cada campo

    // States dos inputs de senha
    const [password, setPassword] = React.useState({ update: false, actual_password: null, new_password: null });

    // State do modal informativo acerca da desativação da conta
    const [openGenericModal, setOpenGenericModal] = React.useState(false);

    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    function handleChangePassword(event, type) {

        setSaveNecessary(true);

        if (type == "ACTUAL_PASSWORD") {
            setPassword({ update: false, actual_password: event.currentTarget.value, new_password: password.new_password });
        } else if (type == "NEW_PASSWORD") {
            setPassword({ update: false, actual_password: password.actual_password, new_password: event.currentTarget.value });
        }
    }

    function reloadFormulary() {

        props.reload_setter(!props.reload_state);

    }

    function disableAccount() {

        AxiosApi.post(`/api/desactivate-account/${props.userid}`)
            .then(function () {

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
                        image={{ required: false }}
                        lottie={{ required: true, animation: ErrorAnimation }}
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

            <Box sx={{ mt: 2 }} >
                <Paper sx={{ marginTop: 2, padding: '18px 18px 18px 18px', borderRadius: '0px 15px 15px 15px' }}>
                    <Stack
                        direction="column"
                        spacing={2}
                        divider={<Divider orientation="horizontal" flexItem />}
                    >
                        <PaperStyled sx={{ maxWidth: '800px' }}>
                            <Typography variant="h5" marginBottom={2}>Alteração da senha</Typography>
                            <TextField
                                id="actual_password"
                                label="Informe a senha atual"
                                fullWidth
                                variant="outlined"
                                defaultValue={""}
                                helperText={errorMessage.actual_password}
                                error={errorDetected.actual_password}
                                onChange={(event) => { handleChangePassword(event, "ACTUAL_PASSWORD") }}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                id="new_password"
                                label="Informe a nova senha"
                                fullWidth
                                defaultValue={""}
                                variant="outlined"
                                helperText={errorMessage.new_password}
                                error={errorDetected.new_password}
                                onChange={(event) => { handleChangePassword(event, "NEW_PASSWORD") }}
                                sx={{ marginBottom: 2 }}
                            />
                            <Button variant="contained" color="primary" disabled={!saveNecessary}>
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
                                    <Button variant="contained" color="error" onClick={() => disableAccount}>
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