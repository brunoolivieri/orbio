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
// Custom
import axios from '../../../../../../services/AxiosApi';
import { AutoCompleteState } from '../input/AutoCompleteState';
import { AutoCompleteCity } from '../input/AutoCompleteCity';

const initialFormData =
{
    address: "",
    cep: "",
    city: "0",
    complement: "",
    number: "",
    state: "0"
}

const initialFormError = {
    address: { error: false, message: "" },
    cep: { error: false, message: "" },
    city: { error: false, message: "" },
    complement: { error: false, message: "" },
    number: { error: false, message: "" },
    state: { error: false, message: "" }
}

const formConfig = {
    address: { label: "Endereço", validation: { regex: /^\d{3,}$/, message: 'CEP inválido.' } },
    cep: { label: "CEP", validation: { regex: /^\d{5}-\d{3}$/, message: 'CEP inválido.' } },
    complement: { label: "Complemento", validation: { regex: /^[a-zA-Z]{3,}$/, message: 'Deve ter pelo menos 3 letras.' } },
    number: { label: "Número", validation: { regex: /^\d+$/, message: 'Número residêncial inválido.' } },
    city: { label: "Cidade", validation: { regex: /^[^0]\d*\.?\d+$/, message: 'A cidade precisa ser selecionada.' } },
    state: { label: "Estado", validation: { regex: /^[^0]\d*\.?\d+$/, message: 'O estado precisa ser selecionado.' } }
}

export function AddressFormulary() {

    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = React.useState(initialFormData);
    const [formError, setFormError] = React.useState(initialFormError);
    const [loading, setLoading] = React.useState(true);
    const [selectedState, setSelectedState] = React.useState(null);
    const [selectedCity, setSelectedCity] = React.useState(null);
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
        let form_validation = Object.assign({}, formError);

        for (let field in formData) {
            let field_regex = formConfig[field].validation.regex;
            let field_error_message = formConfig[field].validation.message;
            let field_value = formData[field];

            if (field_regex.test(field_value)) {
                form_validation[field].error = false;
                form_validation[field].message = "";
            } else {
                is_valid = false;
                form_validation[field].error = true;
                form_validation[field].message = field_error_message;
            }
        }

        setFormError(formError);
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
        let request_errors = {}
        for (let prop in response.data.errors) {
            request_errors[prop] = {
                error: true,
                message: response.data.errors[prop][0]
            }
        }
        setFormError(request_errors);
    }

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
    }

    return (
        <>
            <Box sx={{ mt: 2 }} >
                <Paper sx={{ marginTop: 2, padding: '18px 18px 18px 18px', borderRadius: '0px 15px 15px 15px' }}>

                    <Typography variant="h5" mb={2}>Endereço</Typography>

                    <Grid container spacing={3} columns={10}>

                        <Grid item xs={5} lg={2} xl={2}>
                            <AutoCompleteState
                                label={"Estados"}
                                name={"state"}
                                source={"https://servicodados.ibge.gov.br/api/v1/localidades/estados"}
                                primary_key={"id"}
                                key_text={"sigla"}
                                error={formError.state}
                                setSelectedState={setSelectedState}
                                setControlledInput={setFormData}
                                controlledInput={formData}
                            />
                        </Grid>

                        <Grid item xs={5} lg={2} xl={2}>
                            {selectedState ?
                                <AutoCompleteCity
                                    label={"Cidades"}
                                    name={"city"}
                                    source={"https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + selectedState + "/municipios"}
                                    primary_key={"id"}
                                    key_text={"nome"}
                                    error={formError.city}
                                    setSelectedCity={setSelectedCity}
                                    setControlledInput={setFormData}
                                    controlledInput={formData}
                                />
                                :
                                <TextField
                                    label="Selecione um estado"
                                    disabled
                                    fullWidth
                                    variant="outlined"
                                />
                            }
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
                                        </InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid item xs={3} lg={3} xl={3}>
                            <TextField
                                id="number"
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
                                id="address"
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
                                id="complement"
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