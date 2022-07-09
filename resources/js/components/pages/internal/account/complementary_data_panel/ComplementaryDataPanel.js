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
import { FormValidation } from '../../../../../utils/FormValidation';
import { SelectStates } from '../../../../structures/input_select/InputSelectStates';
import { SelectCities } from '../../../../structures/input_select/SelectCities';
import { useAuthentication } from "../../../../../components/context/InternalRoutesAuth/AuthenticationContext";
// Libs
import { useSnackbar } from 'notistack';

export const ComplementaryDataPanel = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();

    const [controlledInput, setControlledInput] = React.useState({
        complementary_data_id: props.data.complementary_data_id, 
        address_id: props.data.address_id, 
        anac_license: props.data.anac_license,
        cpf: props.data.cpf,
        cnpj: props.data.cnpj,
        telephone: props.data.telephone,
        cellphone: props.data.cellphone,
        company_name: props.data.company_name,
        trading_name: props.data.trading_name,
        address: props.data.address,
        number: props.data.number,
        cep: props.data.cep,
        city: props.data.city,
        state: props.data.state,
        complement: props.data.complement
    });

    const [loading, setLoading] = React.useState(false);

    const [fieldError, setFieldError] = React.useState({ anac_license: false, cpf: false, cnpj: false, telephone: false, cellphone: false, company_name: false, trading_name: false, address: false, number: false, cep: false, city: false, state: false, complement: false });
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ anac_license: "", cpf: "", cnpj: "", telephone: "", cellphone: "", company_name: "", trading_name: "", address: "", number: "", cep: "", city: "", state: "", complement: "" });

    const [keyPressed, setKeyPressed] = React.useState();

    const [inputState, setInputState] = React.useState(props.state);

    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNCTIONS ============================================================================== //

    const reloadFormulary = () => {
        props.reload_setter(!props.reload_state);
    }

    const handleInputChange = (event) => {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }


    const inputSetMask = (event, input) => {

        if (keyPressed != "Backspace") {

            if (input == "HAB_ANAC") {

                console.log(event.currentTarget.value.length)

            } else if (input == "CNPJ") {

                if (event.currentTarget.value.length == 2 || event.currentTarget.value.length == 6) {

                    event.currentTarget.value = `${event.currentTarget.value}.`;

                } else if (event.currentTarget.value.length == 10) {

                    event.currentTarget.value = event.currentTarget.value + "/";

                } else if (event.currentTarget.value.length == 15) {

                    event.currentTarget.value = event.currentTarget.value + "-";

                }

            } else if (input == "CPF") {

                if (event.currentTarget.value.length == 3 || event.currentTarget.value.length == 7) {

                    event.currentTarget.value = `${event.currentTarget.value}.`;

                } else if (event.currentTarget.value.length == 11) {

                    event.currentTarget.value = event.currentTarget.value + "-";

                }

            } else if (input == "PHONE") {

                if (event.currentTarget.value.length == 1) {

                    event.currentTarget.value = `(${event.currentTarget.value}`;

                } else if (event.currentTarget.value.length == 3) {

                    event.currentTarget.value = event.currentTarget.value + ")";

                } else if (event.currentTarget.value.length == 9) {

                    event.currentTarget.value = event.currentTarget.value + "-";
                }

            } else if (input == "CEP") {

                if (event.currentTarget.value.length == 5) {

                    event.currentTarget.value = event.currentTarget.value + "-";

                }
            }
        }
    }

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

        const habAnacPattern = /^\d{6}$/;
        const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        const cnpjPattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        const phonePattern = /(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/;

        const habanacValidate = FormValidation(controlledInput.anac_license, 3, null, habAnacPattern, "HABILITAÇÃO ANAC");
        const cpfValidate = FormValidation(controlledInput.cpf, null, null, cpfPattern, "CPF");
        const cnpjValidate = FormValidation(controlledInput.cnpj, null, null, cnpjPattern, "CNPJ");
        const telephoneValidate = FormValidation(controlledInput.telephone, null, null, phonePattern, "NÚMERO DE TELEFONE");
        const cellphoneValidate = FormValidation(controlledInput.cellphone, null, null, phonePattern, "NÚMERO DE CELULAR");
        const rsocialValidate = FormValidation(controlledInput.company_name, 3);
        const nfantasiaValidate = FormValidation(controlledInput.trading_name, 3);

        setFieldError(
            {
                anac_license: habanacValidate.error,
                cpf: cpfValidate.error,
                cnpj: cnpjValidate.error,
                telephone: telephoneValidate.error,
                cellphone: cellphoneValidate.error,
                company_name: rsocialValidate.error,
                trading_name: nfantasiaValidate.error,
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
                anac_license: habanacValidate.message,
                cpf: cpfValidate.message,
                cnpj: cnpjValidate.message,
                telephone: telephoneValidate.message,
                cellphone: cellphoneValidate.message,
                company_name: rsocialValidate.message,
                trading_name: nfantasiaValidate.message,
                address: "",
                number: "",
                cep: "",
                city: "",
                state: "",
                complement: ""
            }
        );

        return !(habanacValidate.error || cpfValidate.error || cnpjValidate.error || telephoneValidate.error || cellphoneValidate.error || rsocialValidate.error || nfantasiaValidate.error);

    }

    const addressFormularyDataValidation = () => {

        const adressNumberPattern = /^\d+$/;
        const cepPattern = /^[0-9]{5}-[0-9]{3}$/;

        const logradouroValidate = FormValidation(controlledInput.address, 3);
        const numeroValidate = FormValidation(controlledInput.number, null, null, adressNumberPattern, "NÚMERO DE ENDEREÇO");
        const cepValidate = FormValidation(controlledInput.cep, null, null, cepPattern, "CEP");
        const cidadeValidate = controlledInput.city != 0 ? { error: false, message: "" } : { error: true, message: "Selecione uma cidade" };
        const estadoValidate = controlledInput.state != 0 ? { error: false, message: "" } : { error: true, message: "Selecione um estado" };
        const complementoValidate = FormValidation(controlledInput.complement);

        setFieldError(
            {
                anac_license: false,
                cpf: false,
                cnpj: false,
                telephone: false,
                cellphone: false,
                company_name: false,
                trading_name: false,
                address: logradouroValidate.error,
                number: numeroValidate.error,
                cep: cepValidate.error,
                city: cidadeValidate.error,
                state: estadoValidate.error,
                complement: complementoValidate.error
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
                address: logradouroValidate.message,
                number: numeroValidate.message,
                cep: cepValidate.message,
                city: cidadeValidate.message,
                state: estadoValidate.message,
                complement: complementoValidate.message
            }
        );

        return !(logradouroValidate.error || numeroValidate.error || cepValidate.error || cidadeValidate.error || estadoValidate.error || complementoValidate.error);
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
                documentsSuccessRequestServerOperation(response);

            })
            .catch(function (error) {

                setLoading(false);
                documentsErrorRequestServerOperation(error.response.data);

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
                addressSuccessRequestServerOperation(response);

            })
            .catch(function (error) {

                setLoading(false);
                addressErrorRequestServerOperation(error.response);

            });

    }

    const documentsSuccessRequestServerOperation = (response) => {
        handleOpenSnackbar(response.data.message, "success");
        props.reload_setter(!props.reload_state);

    }

    const addressSuccessRequestServerOperation = (response) => {
        handleOpenSnackbar(response.data.message, "success");
        props.reload_setter(!props.reload_state);

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

        let error_message = (response.data.message != "" && response.data.message != undefined) ? response.data.message : "Houve um erro na realização da operação!";
        handleOpenSnackbar(error_message, "error");

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let input_errors = {
            address: { error: false, message: null },
            number: { error: false, message: null },
            cep: { error: false, message: null },
            city: { error: false, message: null },
            state: { error: false, message: null },
            complement: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
        for (let prop in response.data.errors) {

            input_errors[prop] = {
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
            address: input_errors.address.error,
            number: input_errors.number.error,
            cep: input_errors.cep.error,
            city: input_errors.city.error,
            state: input_errors.state.error,
            complement: input_errors.complement.error
        });

        setFieldErrorMessage({
            anac_license: "",
            cpf: "",
            cnpj: "",
            telephone: "",
            cellphone: "",
            company_name: "",
            trading_name: "",
            address: input_errors.address.message,
            number: input_errors.number.message,
            cep: input_errors.cep.message,
            city: input_errors.city.message,
            state: input_errors.state.message,
            complement: input_errors.complement.message
        });
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

            <Box component="form" onSubmit={handleDocumentsSubmitForm} sx={{ mt: 2 }} >
                <Paper sx={{ marginTop: 2, padding: '18px 18px 18px 18px', borderRadius: '0px 15px 15px 0px' }}>

                    <Typography variant="h5" marginBottom={2}>Documentos</Typography>

                    <Grid container spacing={3}>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="anac_license"
                                name="anac_license"
                                label="Habilitação ANAC"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.anac_license}
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
                                required
                                id="cpf"
                                name="cpf"
                                label="CPF"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.cpf}
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
                                required
                                id="cnpj"
                                name="cnpj"
                                label="CNPJ"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.cnpj}
                                helperText={fieldErrorMessage.cnpj}
                                error={fieldError.cnpj}
                                onChange={(event) => {
                                    inputSetMask(event, "CNPJ");
                                    handleInputChange(event);
                                }}
                                onKeyDown={(event) => { setKeyPressed(event.key) }}
                                InputProps={{
                                    maxLength: 18
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="telephone"
                                name="telephone"
                                label="Telefone (com DDD)"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.telephone}
                                helperText={fieldErrorMessage.telephone}
                                error={fieldError.telephone}
                                onChange={(event) => {
                                    inputSetMask(event, "PHONE");
                                    handleInputChange(event);
                                }}
                                onKeyDown={(event) => { setKeyPressed(event.key) }}
                                InputProps={{
                                    maxLength: 14
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="cellphone"
                                name="cellphone"
                                label="Celular (com DDD)"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.cellphone}
                                helperText={fieldErrorMessage.cellphone}
                                error={fieldError.cellphone}
                                onChange={(event) => {
                                    inputSetMask(event, "PHONE");
                                    handleInputChange(event);
                                }}
                                onKeyDown={(event) => { setKeyPressed(event.key) }}
                                InputProps={{
                                    maxLength: 14
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="company_name"
                                name="company_name"
                                label="Razão Social"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.company_name}
                                helperText={fieldErrorMessage.company_name}
                                error={fieldError.company_name}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="trading_name"
                                name="trading_name"
                                label="Nome Fantasia"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.trading_name}
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

            <Box component="form" onSubmit={handleAddressSubmitForm} sx={{ mt: 2 }} >
                <Paper sx={{ marginTop: 2, padding: '18px 18px 18px 18px', borderRadius: '0px 15px 15px 15px' }}>

                    <Typography variant="h5" marginBottom={2}>Endereço</Typography>

                    <Grid container spacing={3}>

                        <Grid item xs={12} sm={12}>
                            <SelectStates default={props.state} state_input_setter={setInputState} error={fieldError.state} error_message={fieldErrorMessage.state} edit_mode={true} />
                            <SelectCities default={props.city} choosen_state={inputState} error={fieldError.city} error_message={fieldErrorMessage.city} edit_mode={true}/>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="cep"
                                name="cep"
                                label="CEP"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.cep}
                                helperText={fieldErrorMessage.cep}
                                error={fieldError.cep}
                                onChange={(event) => {
                                    inputSetMask(event, "CEP");
                                    handleInputChange(event);
                                }}
                                onKeyDown={(event) => { setKeyPressed(event.key) }}
                                InputProps={{
                                    maxLength: 9
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="address"
                                name="address"
                                label="Logradouro"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.address}
                                helperText={fieldErrorMessage.address}
                                error={fieldError.address}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="number"
                                name="number"
                                label="Numero"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.number}
                                helperText={fieldErrorMessage.number}
                                error={fieldError.number}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="complement"
                                name="complement"
                                label="Complemento"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.complement}
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
        </>

    );

});