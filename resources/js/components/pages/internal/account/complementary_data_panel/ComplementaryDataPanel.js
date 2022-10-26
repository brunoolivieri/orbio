// React
import * as React from 'react';
// Material UI
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
// Custom
import axios from "../../../../../services/AxiosApi";
import { InputMask } from '../../../../../utils/InputMask';
import { FormValidation } from '../../../../../utils/FormValidation';
import { AutoCompleteCity } from '../../../../structures/input_select/AutoCompleteCity';
import { AutoCompleteState } from '../../../../structures/input_select/AutoCompleteState';
// Libs
import { useSnackbar } from 'notistack';

const initialControlledInput = {
    anac_license: "Carregando",
    cpf: "Carregando",
    cnpj: "Carregando",
    telephone: "Carregando",
    cellphone: "Carregando",
    company_name: "Carregando",
    trading_name: "Carregando",
    address: "Carregando",
    number: "Carregando",
    cep: "Carregando",
    complement: "Carregando"
};

const initialFieldError = { anac_license: false, cpf: false, cnpj: false, telephone: false, cellphone: false, company_name: false, trading_name: false, address: false, number: false, cep: false, city: false, state: false, complement: false };
const initialFieldErrorMessage = { anac_license: "", cpf: "", cnpj: "", telephone: "", cellphone: "", company_name: "", trading_name: "", address: "", number: "", cep: "", complement: "" };

export const ComplementaryDataPanel = React.memo(() => {

    // ============================================================================== STATES ============================================================================== //

    const [controlledInput, setControlledInput] = React.useState(initialControlledInput);
    const [addressUpdateLoading, setAddressUpdateLoading] = React.useState(false);
    const [documentUpdateLoading, setDocumentUpdateLoading] = React.useState(false);
    const [loadingFields, setLoadingFields] = React.useState(true);
    const [fieldError, setFieldError] = React.useState(initialFieldError);
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
    const [keyPressed, setKeyPressed] = React.useState(null);
    const [selectedState, setSelectedState] = React.useState(null);
    const [selectedCity, setSelectedCity] = React.useState(null);
    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {
        setControlledInput(initialControlledInput);

        axios.get("/api/load-complementary-account-data")
            .then(function (response) {
                setLoadingFields(false);
                setAddressUpdateLoading(false);
                setDocumentUpdateLoading(false);
                setControlledInput({
                    anac_license: response.data.complementary.anac_license ? response.data.complementary.anac_license : "",
                    cpf: response.data.complementary.cpf ? response.data.complementary.cpf : "",
                    cnpj: response.data.complementary.cnpj ? response.data.complementary.cnpj : "",
                    telephone: response.data.complementary.telephone ? response.data.complementary.telephone : "",
                    cellphone: response.data.complementary.cellphone ? response.data.complementary.cellphone : "",
                    company_name: response.data.complementary.company_name ? response.data.complementary.company_name : "",
                    trading_name: response.data.complementary.trading_name ? response.data.complementary.trading_name : "",
                    address: response.data.address.address ? response.data.address.address : "",
                    number: response.data.address.number ? response.data.address.number : "",
                    cep: response.data.address.cep ? response.data.address.cep : "",
                    city: response.data.address.city,
                    state: response.data.address.state,
                    complement: response.data.address.complement ? response.data.address.complement : ""
                });
            })
            .catch(function (error) {
                setLoadingFields(false);
                setAddressUpdateLoading(false);
                setDocumentUpdateLoading(false);
                setControlledInput({
                    anac_license: "Erro",
                    cpf: "Erro",
                    cnpj: "Erro",
                    telephone: "Erro",
                    cellphone: "Erro",
                    company_name: "Erro",
                    trading_name: "Erro",
                    address: "Erro",
                    number: "Erro",
                    cep: "Erro",
                    complement: "Erro"
                });
                handleOpenSnackbar(error.response.data.message, "error");
            });

    }, [loadingFields]);

    function handleDocumentsSubmitForm(e) {
        e.preventDefault();
        if (documentFormValidation()) {
            setDocumentUpdateLoading(true);
            documentsRequestServerOperation();
        }
    }

    function handleAddressSubmitForm(e) {
        e.preventDefault();
        if (addressFormValidation()) {
            setAddressUpdateLoading(true);
            addressRequestServerOperation();
        }
    }

    function documentFormValidation() {

        const anacLicenseValidate = FormValidation(controlledInput.anac_license, 3, null, /^\d{6}$/, "HABILITAÇÃO ANAC");
        const cpfValidate = FormValidation(controlledInput.cpf, null, null, /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF");
        const cnpjValidate = FormValidation(controlledInput.cnpj, null, null, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ");
        const telephoneValidate = FormValidation(controlledInput.telephone, null, null, /(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/, "NÚMERO DE TELEFONE");
        const cellphoneValidate = FormValidation(controlledInput.cellphone, null, null, /(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/, "NÚMERO DE CELULAR");
        const companyNameValidate = FormValidation(controlledInput.company_name, 3);
        const tradingNameValidate = FormValidation(controlledInput.trading_name, 3);

        setFieldError(
            {
                anac_license: anacLicenseValidate.error,
                cpf: cpfValidate.error,
                cnpj: cnpjValidate.error,
                telephone: telephoneValidate.error,
                cellphone: cellphoneValidate.error,
                company_name: companyNameValidate.error,
                trading_name: tradingNameValidate.error,
                address: false,
                number: false,
                cep: false,
                city: false,
                state: false,
                complement: false
            }
        );

        setFieldErrorMessage(
            {
                anac_license: anacLicenseValidate.message,
                cpf: cpfValidate.message,
                cnpj: cnpjValidate.message,
                telephone: telephoneValidate.message,
                cellphone: cellphoneValidate.message,
                company_name: companyNameValidate.message,
                trading_name: tradingNameValidate.message,
                address: "",
                number: "",
                cep: "",
                city: "",
                state: "",
                complement: ""
            }
        );

        return !(anacLicenseValidate.error || cpfValidate.error || cnpjValidate.error || telephoneValidate.error || cellphoneValidate.error || companyNameValidate.error || tradingNameValidate.error);

    }

    function addressFormValidation() {

        const addressValidate = FormValidation(controlledInput.address, 3);
        const numberValidate = FormValidation(controlledInput.number, null, null, /^\d+$/, "NÚMERO DE ENDEREÇO");
        const cepValidate = FormValidation(controlledInput.cep, null, null, /^[0-9]{5}-[0-9]{3}$/, "CEP");
        const cityValidate = selectedCity != 0 ? { error: false, message: "" } : { error: true, message: "Selecione uma cidade" };
        const stateValidate = selectedState != 0 ? { error: false, message: "" } : { error: true, message: "Selecione um estado" };
        const complementValidate = FormValidation(controlledInput.complement);

        setFieldError(
            {
                anac_license: false,
                cpf: false,
                cnpj: false,
                telephone: false,
                cellphone: false,
                company_name: false,
                trading_name: false,
                address: addressValidate.error,
                number: numberValidate.error,
                cep: cepValidate.error,
                city: cityValidate.error,
                state: stateValidate.error,
                complement: complementValidate.error
            }
        );

        setFieldErrorMessage(
            {
                anac_license: "",
                cpf: "",
                cnpj: "",
                telephone: "",
                cellphone: "",
                company_name: "",
                trading_name: "",
                address: addressValidate.message,
                number: numberValidate.message,
                cep: cepValidate.message,
                city: cityValidate.message,
                state: stateValidate.message,
                complement: complementValidate.message
            }
        );

        return !(addressValidate.error || numberValidate.error || cepValidate.error || cityValidate.error || stateValidate.error || complementValidate.error);
    }

    function documentsRequestServerOperation() {
        axios.patch("/api/update-documents-data", {
            complementary_data_id: controlledInput.complementary_data_id,
            address_id: controlledInput.address_id,
            anac_license: controlledInput.anac_license,
            cpf: controlledInput.cpf,
            cnpj: controlledInput.cnpj,
            telephone: controlledInput.telephone,
            cellphone: controlledInput.cellphone,
            company_name: controlledInput.company_name,
            trading_name: controlledInput.trading_name
        })
            .then(function (response) {
                setDocumentUpdateLoading(false);
                setLoadingFields(true);
                handleOpenSnackbar(response.data.message, "success");
            })
            .catch(function (error) {
                setDocumentUpdateLoading(false);
                documentsErrorRequestServerOperation(error.response);
            });
    }

    function addressRequestServerOperation() {
        axios.patch("/api/update-address-data", {
            address: controlledInput.address,
            number: controlledInput.number,
            cep: controlledInput.cep,
            city: selectedCity,
            state: selectedState,
            complement: controlledInput.complement
        })
            .then(function (response) {

                setAddressUpdateLoading(false);
                setLoadingFields(true);
                handleOpenSnackbar(response.data.message, "success");

            })
            .catch(function (error) {

                setAddressUpdateLoading(false);
                addressErrorRequestServerOperation(error.response);

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

        setFieldError({
            anac_license: request_errors.anac_license.error,
            cpf: request_errors.cpf.error,
            cnpj: request_errors.cnpj.error,
            telephone: request_errors.telephone.error,
            cellphone: request_errors.cellphone.error,
            company_name: request_errors.company_name.error,
            trading_name: request_errors.trading_name.error,
            address: "",
            number: "",
            cep: "",
            city: "",
            state: "",
            complement: ""
        });

        setFieldErrorMessage({
            anac_license: request_errors.anac_license.message,
            cpf: request_errors.cpf.message,
            cnpj: request_errors.cnpj.message,
            telephone: request_errors.telephone.message,
            cellphone: request_errors.cellphone.message,
            company_name: request_errors.company_name.message,
            trading_name: request_errors.trading_name.message,
            address: "",
            number: "",
            cep: "",
            city: "",
            state: "",
            complement: ""
        });


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

        setFieldError({
            anac_license: false,
            cpf: false,
            cnpj: false,
            telephone: false,
            cellphone: false,
            company_name: false,
            trading_name: false,
            address: request_errors.address.error,
            number: request_errors.number.error,
            cep: request_errors.cep.error,
            city: request_errors.city.error,
            state: request_errors.state.error,
            complement: request_errors.complement.error
        });

        setFieldErrorMessage({
            anac_license: "",
            cpf: "",
            cnpj: "",
            telephone: "",
            cellphone: "",
            company_name: "",
            trading_name: "",
            address: request_errors.address.message,
            number: request_errors.number.message,
            cep: request_errors.cep.message,
            city: request_errors.city.message,
            state: request_errors.state.message,
            complement: request_errors.complement.message
        });
    }

    function reloadFormulary() {
        setLoadingFields(true);
    }

    function handleInputChange(e) {
        setControlledInput({ ...controlledInput, [e.target.name]: e.currentTarget.value });
    }


    function handleInputSetMask(e) {
        InputMask(e, keyPressed);
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
                        <IconButton onClick={reloadFormulary}>
                            <FontAwesomeIcon icon={faArrowsRotate} size="sm" color={'#007937'} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>

            <Box component="form" onSubmit={handleDocumentsSubmitForm} sx={{ mt: 2 }} >
                <Paper sx={{ marginTop: 2, padding: '18px 18px 18px 18px', borderRadius: '0px 15px 15px 0px' }}>

                    <Typography variant="h5" marginBottom={2}>Documentos</Typography>

                    <Grid container spacing={3}>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="anac_license"
                                name="anac_license"
                                label="Habilitação ANAC"
                                fullWidth
                                variant="outlined"
                                value={controlledInput.anac_license}
                                disabled={loadingFields}
                                helperText={fieldErrorMessage.anac_license}
                                error={fieldError.anac_license}
                                onChange={(event) => {
                                    handleInputSetMask(event);
                                    handleInputChange(event);
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="cpf"
                                name="cpf"
                                label="CPF"
                                fullWidth
                                variant="outlined"
                                value={controlledInput.cpf}
                                disabled={loadingFields}
                                helperText={fieldErrorMessage.cpf}
                                error={fieldError.cpf}
                                onChange={(event) => {
                                    handleInputSetMask(event);
                                    handleInputChange(event);
                                }}
                                onKeyDown={(event) => { setKeyPressed(event.key) }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="cnpj"
                                name="cnpj"
                                label="CNPJ"
                                fullWidth
                                variant="outlined"
                                value={controlledInput.cnpj}
                                disabled={loadingFields}
                                helperText={fieldErrorMessage.cnpj}
                                error={fieldError.cnpj}
                                onChange={(event) => {
                                    handleInputSetMask(event);
                                    handleInputChange(event);
                                }}
                                InputProps={{
                                    maxLength: 18
                                }}
                                onKeyDown={(event) => { setKeyPressed(event.key) }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="telephone"
                                name="telephone"
                                label="Telefone (com DDD)"
                                fullWidth
                                variant="outlined"
                                value={controlledInput.telephone}
                                disabled={loadingFields}
                                helperText={fieldErrorMessage.telephone}
                                error={fieldError.telephone}
                                onChange={(event) => {
                                    handleInputSetMask(event);
                                    handleInputChange(event);
                                }}
                                InputProps={{
                                    maxLength: 14
                                }}
                                onKeyDown={(event) => { setKeyPressed(event.key) }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="cellphone"
                                name="cellphone"
                                label="Celular (com DDD)"
                                fullWidth
                                variant="outlined"
                                value={controlledInput.cellphone}
                                disabled={loadingFields}
                                helperText={fieldErrorMessage.cellphone}
                                error={fieldError.cellphone}
                                onChange={(event) => {
                                    handleInputSetMask(event);
                                    handleInputChange(event);
                                }}
                                InputProps={{
                                    maxLength: 14
                                }}
                                onKeyDown={(event) => { setKeyPressed(event.key) }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="company_name"
                                name="company_name"
                                label="Razão Social"
                                fullWidth
                                variant="outlined"
                                value={controlledInput.company_name}
                                disabled={loadingFields}
                                helperText={fieldErrorMessage.company_name}
                                error={fieldError.company_name}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="trading_name"
                                name="trading_name"
                                label="Nome Fantasia"
                                fullWidth
                                variant="outlined"
                                value={controlledInput.trading_name}
                                disabled={loadingFields}
                                helperText={fieldErrorMessage.trading_name}
                                error={fieldError.trading_name}
                                onChange={handleInputChange}
                            />
                        </Grid>

                    </Grid>

                    <Button type="submit" variant="contained" color="primary" disabled={documentUpdateLoading || loadingFields} sx={{ mt: 2 }}>
                        {documentUpdateLoading ? "Processando..." : "Atualizar"}
                    </Button>
                </Paper>
            </Box>

            <Box component="form" onSubmit={handleAddressSubmitForm} sx={{ mt: 2 }} >
                <Paper sx={{ marginTop: 2, padding: '18px 18px 18px 18px', borderRadius: '0px 15px 15px 15px' }}>

                    <Typography variant="h5" marginBottom={2}>Endereço</Typography>

                    <Grid container spacing={3} columns={10}>

                        <Grid item xs={5} lg={2} xl={2}>
                            <AutoCompleteState
                                label={"Estados"}
                                name={"state"}
                                source={"https://servicodados.ibge.gov.br/api/v1/localidades/estados"}
                                primary_key={"id"}
                                key_text={"sigla"}
                                error={fieldError.state}
                                setSelectedState={setSelectedState}
                                setControlledInput={setControlledInput}
                                controlledInput={controlledInput}
                            />
                        </Grid>

                        <Grid item xs={5} lg={2} xl={2}>
                            {(selectedState != null) ?
                                <AutoCompleteCity
                                    label={"Cidades"}
                                    name={"city"}
                                    source={"https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + selectedState + "/municipios"}
                                    primary_key={"id"}
                                    key_text={"nome"}
                                    error={fieldError.city}
                                    setSelectedCity={setSelectedCity}
                                    setControlledInput={setControlledInput}
                                    controlledInput={controlledInput}
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
                                value={controlledInput.cep}
                                disabled={loadingFields}
                                helperText={fieldErrorMessage.cep}
                                error={fieldError.cep}
                                onChange={(event) => {
                                    handleInputSetMask(event);
                                    handleInputChange(event);
                                }}
                                InputProps={{
                                    maxLength: 9
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
                                value={controlledInput.number}
                                disabled={loadingFields}
                                helperText={fieldErrorMessage.number}
                                error={fieldError.number}
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
                                value={controlledInput.address}
                                disabled={loadingFields}
                                helperText={fieldErrorMessage.address}
                                error={fieldError.address}
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
                                value={controlledInput.complement}
                                disabled={loadingFields}
                                helperText={fieldErrorMessage.complement}
                                error={fieldError.complement}
                                onChange={handleInputChange}
                            />
                        </Grid>

                    </Grid>

                    <Button type="submit" variant="contained" color="primary" disabled={addressUpdateLoading || loadingFields} sx={{ mt: 2 }}>
                        {addressUpdateLoading ? "Processando..." : "Atualizar"}
                    </Button>

                </Paper>
            </Box>

        </>

    );

});