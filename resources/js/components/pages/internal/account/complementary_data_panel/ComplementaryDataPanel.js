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
import AxiosApi from "../../../../../services/AxiosApi";
import { InputMask } from '../../../../../utils/InputMask';
import { FormValidation } from '../../../../../utils/FormValidation';
import { SelectStates } from '../../../../structures/input_select/SelectStates';
import { SelectCities } from '../../../../structures/input_select/SelectCities';
import { useAuthentication } from "../../../../../components/context/InternalRoutesAuth/AuthenticationContext";
// Libs
import { useSnackbar } from 'notistack';

export const ComplementaryDataPanel = React.memo(() => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();

    const [controlledInput, setControlledInput] = React.useState({ anac_license: "", cpf: "", cnpj: "", telephone: "", cellphone: "", company_name: "", trading_name: "", address: "", number: "", cep: "", city: "", state: "", complement: "" });

    const [loading, setLoading] = React.useState(true);

    const [fieldError, setFieldError] = React.useState({ anac_license: false, cpf: false, cnpj: false, telephone: false, cellphone: false, company_name: false, trading_name: false, address: false, number: false, cep: false, city: false, state: false, complement: false });
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ anac_license: "", cpf: "", cnpj: "", telephone: "", cellphone: "", company_name: "", trading_name: "", address: "", number: "", cep: "", complement: "" });

    const [keyPressed, setKeyPressed] = React.useState(null);

    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {

        AxiosApi.get("/api/load-complementary-account-data")
            .then(function (response) {

                setControlledInput({
                    anac_license: response.data.complementary.anac_license,
                    cpf: response.data.complementary.cpf,
                    cnpj: response.data.complementary.cnpj,
                    telephone: response.data.complementary.telephone,
                    cellphone: response.data.complementary.cellphone,
                    company_name: response.data.complementary.company_name,
                    trading_name: response.data.complementary.trading_name,
                    address: response.data.address.address,
                    number: response.data.address.number,
                    cep: response.data.address.cep,
                    city: response.data.address.city,
                    state: response.data.address.state,
                    complement: response.data.address.complement
                });

                setLoading(false);

            })
            .catch(function () {

                setControlledInput(null);
                setLoading(false);
                handleOpenSnackbar("Erro no carregamento dos dados.", "error");

            });

    }, [loading]);

    const handleDocumentsSubmitForm = (event) => {
        event.preventDefault();

        if (documentFormularyDataValidation()) {
            setLoading(true);
            documentsRequestServerOperation();
        }

    }

    const handleAddressSubmitForm = (event) => {
        event.preventDefault();

        if (addressFormularyDataValidation()) {
            setLoading(true);
            addressRequestServerOperation();
        }

    }

    const documentFormularyDataValidation = () => {

        const anacLicensePattern = /^\d{6}$/;
        const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        const cnpjPattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        const phonePattern = /(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/;

        console.log(controlledInput)

        const anacLicenseValidate = FormValidation(controlledInput.anac_license, 3, null, anacLicensePattern, "HABILITAÇÃO ANAC");
        const cpfValidate = FormValidation(controlledInput.cpf, null, null, cpfPattern, "CPF");
        const cnpjValidate = FormValidation(controlledInput.cnpj, null, null, cnpjPattern, "CNPJ");
        const telephoneValidate = FormValidation(controlledInput.telephone, null, null, phonePattern, "NÚMERO DE TELEFONE");
        const cellphoneValidate = FormValidation(controlledInput.cellphone, null, null, phonePattern, "NÚMERO DE CELULAR");
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

    const addressFormularyDataValidation = () => {

        const adressNumberPattern = /^\d+$/;
        const cepPattern = /^[0-9]{5}-[0-9]{3}$/;

        const addressValidate = FormValidation(controlledInput.address, 3);
        const numberValidate = FormValidation(controlledInput.number, null, null, adressNumberPattern, "NÚMERO DE ENDEREÇO");
        const cepValidate = FormValidation(controlledInput.cep, null, null, cepPattern, "CEP");
        const cityValidate = controlledInput.city != 0 ? { error: false, message: "" } : { error: true, message: "Selecione uma cidade" };
        const stateValidate = controlledInput.state != 0 ? { error: false, message: "" } : { error: true, message: "Selecione um estado" };
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

    const documentsRequestServerOperation = () => {

        AxiosApi.patch(`/api/update-documents-data/${AuthData.data.id}`, {
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

                setLoading(false);
                handleOpenSnackbar(response.data.message, "success");

            })
            .catch(function (error) {

                setLoading(false);
                documentsErrorRequestServerOperation(error.response);

            });

    }

    const addressRequestServerOperation = () => {

        AxiosApi.patch(`/api/update-address-data/${AuthData.data.id}`, {
            address: controlledInput.address,
            number: controlledInput.number,
            cep: controlledInput.cep,
            city: controlledInput.city,
            state: controlledInput.state,
            complement: controlledInput.complement
        })
            .then(function (response) {

                setLoading(false);
                handleOpenSnackbar(response.data.message, "success");

            })
            .catch(function (error) {

                setLoading(false);
                addressErrorRequestServerOperation(error.response);

            });

    }

    const documentsErrorRequestServerOperation = (response) => {

        const error_message = response.data.message ? response.data.message : "Erro do servidor";
        handleOpenSnackbar(error_message, "error");

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let request_errors = {
            anac_license: { error: false, message: null },
            cpf: { error: false, message: null },
            cnpj: { error: false, message: null },
            telephone: { error: false, message: null },
            cellphone: { error: false, message: null },
            company_name: { error: false, message: null },
            trading_name: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
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

    const addressErrorRequestServerOperation = (response) => {

        const error_message = response.data.message ? response.data.message : "Erro do servidor";
        handleOpenSnackbar(error_message, "error");

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let request_errors = {
            address: { error: false, message: null },
            number: { error: false, message: null },
            cep: { error: false, message: null },
            city: { error: false, message: null },
            state: { error: false, message: null },
            complement: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
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

    const reloadFormulary = () => {
        setControlledInput(null);
        setLoading(true);
    }

    const handleInputChange = (event) => {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }


    const inputSetMask = (event) => {

        InputMask(event, keyPressed);

    }

    const handleOpenSnackbar = (text, variant) => {
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

            {!loading &&
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
                                    defaultValue={controlledInput.anac_license}
                                    helperText={fieldErrorMessage.anac_license}
                                    error={fieldError.anac_license}
                                    onChange={(event) => {
                                        inputSetMask(event, "HAB_ANAC");
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
                                    defaultValue={controlledInput.cpf}
                                    helperText={fieldErrorMessage.cpf}
                                    error={fieldError.cpf}
                                    onChange={(event) => {
                                        inputSetMask(event, "CPF");
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
                                    defaultValue={controlledInput.cnpj}
                                    helperText={fieldErrorMessage.cnpj}
                                    error={fieldError.cnpj}
                                    onChange={(event) => {
                                        inputSetMask(event, "CNPJ");
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
                                    defaultValue={controlledInput.telephone}
                                    helperText={fieldErrorMessage.telephone}
                                    error={fieldError.telephone}
                                    onChange={(event) => {
                                        inputSetMask(event, "PHONE");
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
                                    defaultValue={controlledInput.cellphone}
                                    helperText={fieldErrorMessage.cellphone}
                                    error={fieldError.cellphone}
                                    onChange={(event) => {
                                        inputSetMask(event, "PHONE");
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
                                    defaultValue={controlledInput.company_name}
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
                                    defaultValue={controlledInput.trading_name}
                                    helperText={fieldErrorMessage.trading_name}
                                    error={fieldError.trading_name}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                        </Grid>

                        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }}>
                            Atualizar
                        </Button>
                    </Paper>
                </Box>
            }

            {!loading &&
                <Box component="form" onSubmit={handleAddressSubmitForm} sx={{ mt: 2 }} >
                    <Paper sx={{ marginTop: 2, padding: '18px 18px 18px 18px', borderRadius: '0px 15px 15px 15px' }}>

                        <Typography variant="h5" marginBottom={2}>Endereço</Typography>

                        <Grid container spacing={3}>

                            <Grid item xs={12} sm={12}>
                                <SelectStates default={controlledInput.state} controlledInput={controlledInput} setControlledInput={setControlledInput} error={fieldError.state} />
                                <SelectCities default={controlledInput.city} selectedState={controlledInput.state} controlledInput={controlledInput} setControlledInput={setControlledInput} error={fieldError.city} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="cep"
                                    name="cep"
                                    label="CEP"
                                    fullWidth
                                    variant="outlined"
                                    defaultValue={controlledInput.cep}
                                    helperText={fieldErrorMessage.cep}
                                    error={fieldError.cep}
                                    onChange={(event) => {
                                        inputSetMask(event, "CEP");
                                        handleInputChange(event);
                                    }}
                                    InputProps={{
                                        maxLength: 9
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="address"
                                    name="address"
                                    label="Logradouro"
                                    fullWidth
                                    variant="outlined"
                                    defaultValue={controlledInput.address}
                                    helperText={fieldErrorMessage.address}
                                    error={fieldError.address}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="number"
                                    name="number"
                                    label="Numero"
                                    fullWidth
                                    variant="outlined"
                                    defaultValue={controlledInput.number}
                                    helperText={fieldErrorMessage.number}
                                    error={fieldError.number}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="complement"
                                    name="complement"
                                    label="Complemento"
                                    fullWidth
                                    variant="outlined"
                                    defaultValue={controlledInput.complement}
                                    helperText={fieldErrorMessage.complement}
                                    error={fieldError.complement}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                        </Grid>

                        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }}>
                            Atualizar
                        </Button>

                    </Paper>
                </Box>
            }
        </>

    );

});