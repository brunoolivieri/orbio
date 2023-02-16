import * as React from 'react';
// Material UI
import InputAdornment from '@mui/material/InputAdornment';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { useSnackbar } from 'notistack';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
// Custom

import { FormValidation } from '../../../../../../utils/FormValidation';
import axios from '../../../../../../services/AxiosApi';
import { FetchedStatesSelection } from '../input/FetchedStatesSelection';
import { FetchedCitiesSelection } from '../input/FetchedCitiesSelection';

const initialFormData =
{
    address: "",
    cep: "",
    complement: "",
    number: "",
    state: "0",
    city: "0"
}

const initialFormError = {
    address: { error: false, message: "" },
    cep: { error: false, message: "" },
    complement: { error: false, message: "" },
    number: { error: false, message: "" },
    city: { error: false, message: "" },
    state: { error: false, message: "" }
}

const formConfig = {
    address: { label: "Endereço", test: (value) => FormValidation(value, 3, 255) },
    cep: { label: "CEP", test: (value) => FormValidation(value, 3, 255, /^\d{5}-\d{3}$/, "cep") },
    complement: { label: "Complemento", test: (value) => FormValidation(value, 3, 255) },
    number: { label: "Número", test: (value) => FormValidation(value, 3, 255, /^\d+$/, "número") },
    state: { test: (value) => value != "0" ? { error: false, message: "" } : { error: true, message: "Selecione um estado" } },
    city: { test: (value) => value != "0" ? { error: false, message: "" } : { error: true, message: "Selecione uma cidade" } }
}

export function AddressFormulary() {

    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = React.useState(initialFormData);
    const [formError, setFormError] = React.useState(initialFormError);
    const [loading, setLoading] = React.useState(true);
    const [refresh, setRefresh] = React.useState(false);

    React.useEffect(() => {

        axios.get("api/myprofile/address")
            .then(function (response) {
                setFormData(response.data);
            })
            .catch(function (error) {
                console.log(error)
                errorResponse(error.response);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [refresh]);

    function handleSubmit() {
        if (!formSubmissionValidation()) return;

        setLoading(true);
        requestServer();
    }

    function formSubmissionValidation() {

        let is_valid = true;
        let form_validation = Object.assign({}, initialFormError);

        for (let field in formData) {
            form_validation[field] = formConfig[field].test(formData[field]);
            if (form_validation[field].error) {
                is_valid = false;
            }
        }

        setFormError(form_validation);
        return is_valid;

    }

    function requestServer() {
        axios.patch("api/myprofile/address", formData)
            .then(function (response) {
                enqueueSnackbar(response.data.message, { variant: "success" });
            })
            .catch(function (error) {
                errorResponse(error.response);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function errorResponse(response) {
        const message = response.message ? response.message : "Erro do servidor";
        enqueueSnackbar(message, { variant: "error" });
        
        if (response.status === 422) {
            let request_errors = {}
            for (let prop in response.data.errors) {
                request_errors[prop] = {
                    error: true,
                    message: response.data.errors[prop][0]
                }
            }
            setFormError(request_errors);
        }
    }

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    return (
        <>
            <Grid container spacing={1} alignItems="center" mt={2}>
                <Grid item>
                    <Tooltip title="Carregar">
                        <IconButton onClick={() => setRefresh((old) => !old)}>
                            <FontAwesomeIcon icon={faArrowsRotate} size="sm" color={'#007937'} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>

            <Box sx={{ mt: 2 }} >
                <Paper sx={{ marginTop: 2, padding: '18px 18px 18px 18px', borderRadius: '0px 15px 15px 15px' }}>
                    <Typography variant="h5" mb={2}>Endereço</Typography>
                    <Grid container spacing={3} columns={10}>

                        <Grid item xs={5} lg={2} xl={2}>
                            <FetchedStatesSelection
                                fetch_from={"https://servicodados.ibge.gov.br/api/v1/localidades/estados"}
                                handleChange={handleInputChange}
                                error={formError.state.error}
                                errorMessage={formError.state.message}
                                selected={formData.state}
                            />
                        </Grid>

                        <Grid item xs={5} lg={2} xl={2}>
                            <FetchedCitiesSelection
                                fetch_from={`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.state}/municipios`}
                                error={formError.city.error}
                                errorMessage={formError.city.message}
                                selected={formData.city}
                                handleChange={handleInputChange}
                                refresh={formData.state}
                            />
                        </Grid>

                        <Grid item xs={7} lg={3} xl={3}>
                            <TextField
                                id="cep"
                                name="cep"
                                label="CEP"
                                fullWidth
                                variant="outlined"
                                value={formData.cep}
                                disabled={loading}
                                error={formError.cep.error}
                                helperText={formError.cep.message}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <Tooltip title={"XXXXX-XXX"}>
                                                <IconButton>
                                                    <HelpIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                }}
                            />
                        </Grid>

                        <Grid item xs={3} lg={3} xl={3}>
                            <TextField
                                name="number"
                                label="Numero"
                                fullWidth
                                variant="outlined"
                                value={formData.number}
                                disabled={loading}
                                error={formError.number.error}
                                helperText={formError.number.message}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={10} sm={6} lg={5} xl={5}>
                            <TextField
                                name="address"
                                label="Logradouro"
                                fullWidth
                                variant="outlined"
                                value={formData.address}
                                disabled={loading}
                                error={formError.address.error}
                                helperText={formError.address.message}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={10} sm={4} lg={5} xl={5}>
                            <TextField
                                name="complement"
                                label="Complemento"
                                fullWidth
                                variant="outlined"
                                value={formData.complement}
                                disabled={loading}
                                error={formError.complement.error}
                                helperText={formError.complement.message}
                                onChange={handleInputChange}
                            />
                        </Grid>

                    </Grid>
                    <Button variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }} onClick={handleSubmit}>
                        Atualizar
                    </Button>
                </Paper>
            </Box>
        </>
    )

}