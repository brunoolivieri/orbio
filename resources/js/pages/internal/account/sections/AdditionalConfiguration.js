import * as React from 'react';
// MUI
import { Tooltip, Typography, IconButton, Grid, TextField, Button, Paper, Stack, Divider, Box } from '@mui/material';
import styled from '@emotion/styled';
import { useSnackbar } from 'notistack';
// Fonts awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
// Custom
import { DeactivateAccountModal } from './modal/DeactivateAccount';
import { useAuth } from '../../../../context/Auth';
import axios from '../../../../services/AxiosApi';
import { FormValidation } from '../../../../utils/FormValidation';

const PaperStyled = styled(Paper)({
    boxShadow: 'none',
    padding: 2,
    flexGrow: 1
});

const initialFormData = { actual_password: "", new_password: "", new_password_confirmation: "" }
const fieldError = { error: false, message: "" }
const initialFormError = { actual_password: fieldError, new_password: fieldError, new_password_confirmation: fieldError }

export function AdditionalConfiguration() {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = React.useState(initialFormData);
    const [loading, setLoading] = React.useState(false);
    const [refresh, setRefresh] = React.useState(false);
    const [formError, setFormError] = React.useState(initialFormError);

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {
        setFormData({ actual_password: user.password, new_password: "", new_password_confirmation: "" });
    }, [refresh]);

    function handleSubmitChangePassword() {
        if (!formSubmissionValidation()) return ''
        setLoading(true);
        requestServer();
    }

    function formSubmissionValidation() {

        let validation = Object.assign({}, initialFormError);

        validation["actual_password"] = FormValidation(formData["actual_password"], null, 255);
        validation["new_password"] = FormValidation(formData.new_password, null, 255);
        validation["new_password_confirmation"] = formData.new_password != formData.new_password_confirmation ? { error: true, message: "As senhas não coincidem" } : { error: false, message: "" };

        setFormError(validation);

        return !(validation.actual_password.error || validation.new_password.error || validation.new_password_confirmation.error);

    }

    async function requestServer() {

        try {

            const response = await axios.patch(`api/myprofile/change-password/${user.id}`, formData);
            enqueueSnackbar(response.data.message, { variant: "success" });

            setFormData(initialFormData);

        } catch (error) {
            console.log(error.response)
            errorResponse(error.response);
        } finally {
            setLoading(false);
        }

    }

    function errorResponse(response) {
        enqueueSnackbar(response.data.message, { variant: "error" });
        if (response.status === 422) {
            let response_errors = Object.assign({}, initialFormError);
            for (let field in response.data.errors) {
                response_errors[field] = {
                    error: true,
                    message: response.data.errors[field][0]
                }
            }
            setFormError(response_errors);
        }
    }

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
    }

    // ============================================================================== JSX ============================================================================== //

    return (
        <>
            <Grid container spacing={1} alignItems="center">
                <Grid item>
                    <Tooltip title="Carregar">
                        <IconButton onClick={() => setRefresh((prev) => !prev)}>
                            <FontAwesomeIcon icon={faArrowsRotate} size="sm" color={'#007937'} />
                        </IconButton>
                    </Tooltip>
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
                                label="Informe a senha atual"
                                name="actual_password"
                                type={"password"}
                                fullWidth
                                variant="outlined"
                                value={formData.actual_password}
                                helperText={formError.actual_password.message}
                                error={formError.actual_password.error}
                                onChange={handleInputChange}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                label="Digite a nova senha"
                                name="new_password"
                                type={"password"}
                                fullWidth
                                variant="outlined"
                                value={formData.new_password}
                                helperText={formError.new_password.message}
                                error={formError.new_password.error}
                                onChange={handleInputChange}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                label="Confirme a nova senha"
                                name="new_password_confirmation"
                                type={"password"}
                                fullWidth
                                variant="outlined"
                                value={formData.new_password_confirmation}
                                helperText={formError.new_password_confirmation.message}
                                error={formError.new_password_confirmation.error}
                                onChange={handleInputChange}
                                sx={{ marginBottom: 2 }}
                            />
                            <Button variant="contained" color="primary" disabled={loading} onClick={handleSubmitChangePassword}>
                                Atualizar
                            </Button>
                        </PaperStyled>

                        <PaperStyled>
                            <Typography variant="h5" marginBottom={2}>Desativar a conta</Typography>
                            <Stack spacing={2}>
                                <Paper sx={{ boxShadow: 'none' }}>
                                    <Typography>A conta será desativada, o perfil será alterado para visitante, e todos os dados cadastrados serão preservados. Para que seja novamente reativada, o usuário deve entrar em contato com o suporte.</Typography>
                                </Paper>
                                <Paper sx={{ boxShadow: 'none' }}>
                                    <DeactivateAccountModal />
                                </Paper>
                            </Stack>
                        </PaperStyled>

                    </Stack>
                </Paper>
            </Box>
        </>
    );
}