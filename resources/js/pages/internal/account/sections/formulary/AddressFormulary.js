import * as React from 'react';
// Mui
import InputAdornment from '@mui/material/InputAdornment';
import { Tooltip, IconButton, Grid, TextField, Typography, Paper, Button } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { useSnackbar } from 'notistack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
// Custom
import { FormValidation } from '../../../../../utils/FormValidation';
import axios from '../../../../../services/AxiosApi'
import { FetchedStatesSelection } from '../input/FetchedStatesSelection';
import { FetchedCitiesSelection } from '../input/FetchedCitiesSelection';

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

    const [formData, setFormData] = React.useState({ address: "", cep: "", number: "", complement: "" });
    const [formError, setFormError] = React.useState(initialFormError);
    const [loading, setLoading] = React.useState(true);
    const [refresh, setRefresh] = React.useState(false);

    React.useEffect(() => {

        axios.get("api/module/my-profile/address")
            .then(function (response) {
                console.log(response)
                setFormData(response.data);
            })
            .catch(function (error) {
                console.log(error.message)
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
        axios.patch("api/module/my-profile/address", formData)
            .then(function (response) {
                enqueueSnackbar(response.data.message, { variant: "success" });
            })
            .catch(function (error) {
                console.log(error.message)
                errorResponse(error.response);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function errorResponse(response) {
        enqueueSnackbar(response.data.message, { variant: "error" });

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

            <Paper className='mt-2 p-[18px] rounded-[8px]'>
                <Typography className='text-black' variant="h5" mb={2}>Endereço</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        {formData.state ?
                            <FetchedStatesSelection
                                fetch_from={"https://servicodados.ibge.gov.br/api/v1/localidades/estados"}
                                error={formError.state.error}
                                errorMessage={formError.state.message}
                                selected={formData.state}
                                handleChange={handleInputChange}
                            />
                            :
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={"Escolha"}
                                disabled
                            />
                        }
                    </Grid>

                    <Grid item xs={10} lg={3}>
                        {formData.state && formData.state != "0" ?
                            <FetchedCitiesSelection
                                fetch_from={`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.state}/municipios`}
                                error={formError.city.error}
                                errorMessage={formError.city.message}
                                selected={formData.city}
                                refresh={formData.state}
                                handleChange={handleInputChange}
                            />
                            :
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={"Selecione um estado"}
                                disabled
                            />
                        }
                    </Grid>

                    <Grid item xs={10} lg={3}>
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

                    <Grid item xs={10} lg={1}>
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

                    <Grid item xs={12}>
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

                    <Grid item xs={12}>
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
        </>
    )

}