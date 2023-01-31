import * as React from 'react';
// Material UI
import { Tooltip, IconButton, Grid, TextField, Box, Paper, Button } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
// Custom
import axios from "../../../../../services/AxiosApi";
import { FormValidation } from '../../../../../utils/FormValidation';
// Libs
import moment from 'moment';
import { useSnackbar } from 'notistack';

const initialFormData = { name: "Carregando", email: "Carregando", profile: "Carregando", last_access: "Carregando", last_update: "Carregando" };
const initialFormError = { name: { error: false, message: "" }, email: { error: false, message: "" }, profile: { error: false, message: "" }, last_access: { error: false, message: "" }, last_update: { error: false, message: "" } };

export function BasicInformation() {

    // ============================================================================== STATES ============================================================================== //

    const [formData, setFormData] = React.useState(initialFormData);
    const [formError, setFormError] = React.useState(initialFormError);
    const [loading, setLoading] = React.useState(false);
    const [refresh, setRefresh] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {

        let is_mounted = true;
        if (!is_mounted) return '';

        setFormData(initialFormData);
        setLoading(true);

        async () => {

            try {
                const response = await axios.get("/api/load-basic-account-data");
                setFormData({ name: response.data.name, email: response.data.email, profile: response.data.profile, last_access: moment(response.data.last_access).format('DD/MM/YYYY hh:mm'), last_update: moment(response.data.last_update).format('DD/MM/YYYY hh:mm') });
            } catch (error) {
                console.log(error);
                enqueueSnackbar(error.response.data.message, { variant: "error" });
            } finally {
                setLoading(false);
            }

        }

        return () => {
            is_mounted = false;
        }

    }, [refresh]);

    function handleSubmit() {

        if (!formSubmissionValidation()) return ''

        setLoading(true);
        requestServer();

    }

    function formSubmissionValidation() {

        const nameValidation = FormValidation(formData.name, 3);
        const emailValidation = FormValidation(formData.email, null, null, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "e-mail");

        setFormError({ name: nameValidation, email: emailValidation });

        return !(nameValidation.error || emailValidation.error);

    }

    async function requestServer() {

        try {

            const response = await axios.patch("/api/update-basic-data", {
                name: formData.name,
                email: formData.email
            });

            enqueueSnackbar(response.data.message, { variant: "success" });

        } catch (error) {
            errorServerResponse(error.response);
        } finally {
            setLoading(false);
        }

    }

    function errorServerResponse(response) {

        enqueueSnackbar(response.data.message, { variant: "error" });

        let serverValidation = {}

        for (let field in response.data.errors) {
            serverValidation[field] = {
                error: true,
                message: response.data.errors[field][0]
            }
        }

        setFormError(serverValidation);

    }

    function reloadFormulary() {
        setRefresh((prev) => !prev);
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
                        <IconButton onClick={reloadFormulary}>
                            <FontAwesomeIcon icon={faArrowsRotate} size="sm" color={'#007937'} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>

            < Box sx={{ mt: 2 }} >
                <Paper sx={{ marginTop: 4, padding: '0px 18px 18px 18px', borderRadius: '0px 15px 15px 15px' }}>
                    <Grid container spacing={3}>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="name"
                                name="name"
                                label="Nome completo"
                                fullWidth
                                value={formData.name}
                                disabled={loading}
                                variant="outlined"
                                helperText={formError.name.message}
                                error={formError.name.error}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="email"
                                name="email"
                                label="Email"
                                value={formData.email}
                                disabled={loading}
                                fullWidth
                                variant="outlined"
                                helperText={formError.email.message}
                                error={formError.email.error}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Perfil de usuário"
                                fullWidth
                                variant="outlined"
                                value={formData.profile}
                                disabled={true}
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Último acesso"
                                fullWidth
                                variant="outlined"
                                value={formData.last_access}
                                disabled={true}
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Última atualização"
                                fullWidth
                                value={formData.last_update}
                                disabled={true}
                                variant="outlined"
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }} onClick={handleSubmit}>
                        Atualizar
                    </Button>
                </Paper>
            </Box>
        </>
    );

}