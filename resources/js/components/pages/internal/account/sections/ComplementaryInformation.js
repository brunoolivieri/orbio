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
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
// Custom
import axios from "../../../../../services/AxiosApi";
import { AutoCompleteCity } from './input/AutoCompleteCity';
import { AutoCompleteState } from './input/AutoCompleteState';
// Libs
import { useSnackbar } from 'notistack';

const initialDocumentsForm = {};
const initialDocumentsFormError = {};

const initialAddressForm =
{
    address: "",
    cep: "",
    city: "0",
    complement: "",
    number: "",
    state: "0"
};

const initialAddressFormError = {
    address: { error: false, message: "" },
    cep: { error: false, message: "" },
    city: { error: false, message: "" },
    complement: { error: false, message: "" },
    number: { error: false, message: "" },
    state: { error: false, message: "" }
};

const initialFormLoading = { documents: false, address: false };

const documentsFormConfig = {
    cpf: { label: "CPF", validation: { regex: /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, message: 'CPF inválido.' }, help: "XX.XXX.XXX-XX" },
    cnpj: { label: "CNPJ", validation: { regex: /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, message: 'CNPJ inválido.' }, help: "XX.XXX.XXX/XXXX-XX" },
    cellphone: { label: "Celular", validation: { regex: /^\(\d{2}\)\d{4,5}-\d{4}$/, message: 'Número de celular inválido.' }, help: "(XX)XXXXX-XXXX. O dígito adicional é opcional." },
    telephone: { label: "Telefone", validation: { regex: /^\(\d{2}\)\d{4,5}-\d{4}$/, message: 'Número de telefone inválido.' }, help: "(XX)XXXXX-XXXX. O dígito adicional é opcional." },
    anac_license: { label: "Licença Anac", validation: { regex: /^[0-9]{9}$/, message: 'Licença Anac inválida.' }, help: "XXXXXXXXX" },
    company_name: { label: "Razão Social", validation: { regex: /^[a-zA-Z]{3,}$/, message: 'Deve ter pelo menos 3 letras.' }, help: null },
    trading_name: { label: "Nome Fantasia", validation: { regex: /^[a-zA-Z]{3,}$/, message: 'Deve ter pelo menos 3 letras.' }, help: null }
}

const addressFormConfig = {
    address: { label: "Endereço", validation: { regex: /^\d{3,}$/, message: 'CEP inválido.' } },
    cep: { label: "CEP", validation: { regex: /^\d{5}-\d{3}$/, message: 'CEP inválido.' } },
    complement: { label: "Complemento", validation: { regex: /^[a-zA-Z]{3,}$/, message: 'Deve ter pelo menos 3 letras.' } },
    number: { label: "Número", validation: { regex: /^\d+$/, message: 'Número residêncial inválido.' } },
    city: { label: "Cidade", validation: { regex: /^[^0]\d*\.?\d+$/, message: 'A cidade precisa ser selecionada.' } },
    state: { label: "Estado", validation: { regex: /^[^0]\d*\.?\d+$/, message: 'O estado precisa ser selecionado.' } }
}

export function ComplementaryInformation() {

    // ============================================================================== STATES ============================================================================== //

    // Form states
    const [documentsForm, setDocumentsForm] = React.useState(initialDocumentsForm);
    const [documentsFormError, setDocumentsFormError] = React.useState(initialDocumentsFormError);
    const [addressForm, setAddressForm] = React.useState(initialAddressForm);
    const [addressFormError, setAddressFormError] = React.useState(initialAddressFormError);
    // Others
    const [formLoading, setFormLoading] = React.useState(initialFormLoading);
    const [selectedState, setSelectedState] = React.useState(null);
    const [selectedCity, setSelectedCity] = React.useState(null);
    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {

        let is_mounted = true;
        if (!is_mounted) return '';

        setDocumentsForm(initialDocumentsForm);
        setAddressForm(initialAddressForm);
        setDocumentsFormError(initialDocumentsFormError);
        setAddressFormError(initialAddressFormError);

        axios.get("/api/load-complementary-account-data")
            .then(function (response) {

                setDocumentsForm(response.data.documents);
                setDocumentsFormError(() => {
                    let documentsFormClone = Object.assign({}, response.data.documents);
                    for (let field in documentsFormClone) {
                        documentsFormClone[field] = { error: false, message: "" }
                    }
                    return documentsFormClone;
                });
                setAddressForm(response.data.address);

            })
            .catch(function (error) {
                handleOpenSnackbar(error.response.data.message, "error");
            })
            .finally(() => {
                setFormLoading(formLoading);
            });

        return () => {
            is_mounted = false;
        }

    }, []);

    function handleDocumentsSubmitForm() {
        if (!documentFormValidation()) {
            return '';
        }
        setFormLoading({ documents: true, address: true });
        documentsRequestServerOperation();
    }

    function handleAddressSubmitForm() {
        if (!addressFormValidation()) {
            return '';
        }
        setFormLoading({ documents: false, address: true });
        addressRequestServerOperation();
    }

    function documentFormValidation() {

        let is_valid = true;

        let documentsFormErrorClone = Object.assign({}, documentsFormError);

        for (let field in documentsForm) {

            let field_regex = documentsFormConfig[field].validation.regex;
            let field_error_message = documentsFormConfig[field].validation.message;
            let field_value = documentsForm[field];

            if (field_regex.test(field_value)) {
                documentsFormErrorClone[field].error = false;
                documentsFormErrorClone[field].message = "";
            } else {
                is_valid = false;
                documentsFormErrorClone[field].error = true;
                documentsFormErrorClone[field].message = field_error_message;
            }
        }

        setDocumentsFormError(documentsFormErrorClone);

        return is_valid;

    }

    function addressFormValidation() {

        let is_valid = true;

        let addressFormErrorClone = Object.assign({}, addressFormError);

        for (let field in addressForm) {

            let field_regex = addressFormConfig[field].validation.regex;
            let field_error_message = addressFormConfig[field].validation.message;
            let field_value = addressForm[field];

            if (field_regex.test(field_value)) {
                addressFormErrorClone[field].error = false;
                addressFormErrorClone[field].message = "";
            } else {
                is_valid = false;
                addressFormErrorClone[field].error = true;
                addressFormErrorClone[field].message = field_error_message;
            }
        }

        setDocumentsFormError(addressFormErrorClone);

        return is_valid;
    }

    function documentsRequestServerOperation() {
        axios.patch("/api/update-documents-data", documentsForm)
            .then(function (response) {
                handleOpenSnackbar(response.data.message, "success");
            })
            .catch(function (error) {
                documentsErrorRequestServerOperation(error.response);
            })
            .finally(() => {
                setFormLoading(formLoading);
            });

    }

    function addressRequestServerOperation() {
        axios.patch("/api/update-address-data", addressForm)
            .then(function (response) {
                handleOpenSnackbar(response.data.message, "success");
            })
            .catch(function (error) {
                addressErrorRequestServerOperation(error.response);
            })
            .finally(() => {
                setFormLoading(formLoading);
            });
    }

    function documentsErrorRequestServerOperation(response) {
        handleOpenSnackbar(response.data.message, "error");

        let request_errors = {
            anac_license: { error: false, message: null },
            cpf: { error: false, message: null },
            cnpj: { error: false, message: null },
            telephone: { error: false, message: null },
            cellphone: { error: false, message: null },
            company_name: { error: false, message: null },
            trading_name: { error: false, message: null }
        }

        for (let prop in response.data.errors) {
            request_errors[prop] = {
                error: true,
                message: response.data.errors[prop][0]
            }
        }

        setDocumentsFormError(request_errors);

    }

    function addressErrorRequestServerOperation(response) {
        handleOpenSnackbar(response.data.message, "error");

        let request_errors = {
            address: { error: false, message: null },
            number: { error: false, message: null },
            cep: { error: false, message: null },
            city: { error: false, message: null },
            state: { error: false, message: null },
            complement: { error: false, message: null }
        }

        for (let prop in response.data.errors) {
            request_errors[prop] = {
                error: true,
                message: response.data.errors[prop][0]
            }
        }

        setDocumentsFormError(request_errors);
    }

    function reloadFormulary() {
        console.log('reload');
    }

    function handleDocumentsFormChange(e) {
        setDocumentsForm({ ...documentsForm, [e.target.name]: e.currentTarget.value });
    }

    function handleAddressFormChange(e) {
        setAddressForm({ ...addressForm, [e.target.name]: e.currentTarget.value });
    }

    function handleOpenSnackbar(text, variant) {
        enqueueSnackbar(text, { variant });
    }

    function checkIfCanRenderDocuments() {
        return Object.keys(documentsFormError).length != 0 && Object.keys(documentsForm).length != 0;
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

            <Box sx={{ mt: 2 }} >
                <Paper sx={{ marginTop: 2, padding: '18px 18px 18px 18px', borderRadius: '0px 15px 15px 0px' }}>

                    <Typography variant="h5" marginBottom={2}>Documentos</Typography>

                    <Grid container spacing={3}>

                        {checkIfCanRenderDocuments() && Object.keys(documentsForm).map((key, index) => {

                            return (
                                <>
                                    <Grid item xs={12} sm={6} key={key}>
                                        <TextField
                                            id={key}
                                            name={key}
                                            label={documentsFormConfig[key].label}
                                            fullWidth
                                            variant="outlined"
                                            value={documentsForm[key]}
                                            disabled={formLoading.documents}
                                            error={documentsFormError[key].error}
                                            helperText={documentsFormError[key].message}
                                            onChange={(event) => handleDocumentsFormChange(event)}
                                            InputProps={documentsFormConfig[key].help && {
                                                endAdornment:
                                                    <InputAdornment position="end">
                                                        <Tooltip title={documentsFormConfig[key].help}>
                                                            <IconButton>
                                                                <HelpIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                </>
                            )
                        })}
                    </Grid>

                    <Button type="submit" variant="contained" color="primary" disabled={formLoading.documents} sx={{ mt: 2 }} onClick={handleDocumentsSubmitForm}>
                        Atualizar
                    </Button>
                </Paper>
            </Box>

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
                                error={addressFormError.state}
                                setSelectedState={setSelectedState}
                                setControlledInput={setAddressForm}
                                controlledInput={addressForm}
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
                                    error={addressFormError.city}
                                    setSelectedCity={setSelectedCity}
                                    setControlledInput={setAddressForm}
                                    controlledInput={addressForm}
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
                                value={addressForm.cep}
                                disabled={formLoading.address}
                                error={addressFormError.cep.error}
                                helperText={addressFormError.cep.message}
                                onChange={(event) => handleAddressFormChange(event)}
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
                                value={addressForm.number}
                                disabled={formLoading.address}
                                error={addressFormError.number.error}
                                helperText={addressFormError.number.message}
                                onChange={(event) => handleAddressFormChange(event)}
                            />
                        </Grid>

                        <Grid item xs={10} sm={6} lg={5} xl={5}>
                            <TextField
                                id="address"
                                name="address"
                                label="Logradouro"
                                fullWidth
                                variant="outlined"
                                value={addressForm.address}
                                disabled={formLoading.address}
                                error={addressFormError.address.error}
                                helperText={addressFormError.address.message}
                                onChange={(event) => handleAddressFormChange(event)}
                            />
                        </Grid>

                        <Grid item xs={10} sm={4} lg={5} xl={5}>
                            <TextField
                                id="complement"
                                name="complement"
                                label="Complemento"
                                fullWidth
                                variant="outlined"
                                value={addressForm.complement}
                                disabled={formLoading.address}
                                error={addressFormError.complement.error}
                                helperText={addressFormError.complement.message}
                                onChange={(event) => handleAddressFormChange(event)}
                            />
                        </Grid>

                    </Grid>

                    <Button variant="contained" color="primary" disabled={formLoading.address} sx={{ mt: 2 }} onClick={handleAddressSubmitForm}>
                        Atualizar
                    </Button>

                </Paper>
            </Box>
        </>
    );
}