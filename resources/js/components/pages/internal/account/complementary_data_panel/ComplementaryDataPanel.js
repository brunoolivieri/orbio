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

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const { AuthData } = useAuthentication();

    const [saveNecessary, setSaveNecessary] = React.useState({ documents: false, address: false });

    // States de validação dos campos
    const [errorDetected, setErrorDetected] = React.useState({ anac_license: false, cpf: false, cnpj: false, telephone: false, cellphone: false, company_name: false, trading_name: false, street_name: false, number: false, cep: false, city: false, state: false, complement: false });
    const [errorMessage, setErrorMessage] = React.useState({ anac_license: null, cpf: null, cnpj: null, telephone: null, cellphone: null, company_name: null, trading_name: null, street_name: null, number: null, cep: null, city: null, state: null, complement: null });

    // State key Down
    const [keyPressed, setKeyPressed] = React.useState();

    // State do input de estado e de cidade
    const [inputState, setInputState] = React.useState(props.estado);

    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    function reloadFormulary() {

        props.reload_setter(!props.reload_state);

    }


    function inputSetMask(event, input) {

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

    /*
    * Rotina 1
    */
    function handleAddressSubmitForm(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        if (formAddressValidate(data)) {

            formAddressRequestServerOperation(data);

        }

    }

    /*
    * Rotina 1
    */
    function handleDocumentsSubmitForm(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        if (formDocumentsValidate(data)) {

            formDocumentsRequestServerOperation(data);

        }

    }

    /*
    * Rotina 2A
    */
    function formDocumentsValidate(data) {

        const habAnacPattern = /^\d{6}$/;
        const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        const cnpjPattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        const phonePattern = /(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/;

        const habanacValidate = FormValidation(data.get("anac_license"), 3, null, habAnacPattern, "HABILITAÇÃO ANAC");
        const cpfValidate = FormValidation(data.get("cpf"), null, null, cpfPattern, "CPF");
        const cnpjValidate = FormValidation(data.get("cnpj"), null, null, cnpjPattern, "CNPJ");
        const telephoneValidate = FormValidation(data.get("telephone"), null, null, phonePattern, "NÚMERO DE TELEFONE");
        const cellphoneValidate = FormValidation(data.get("cellphone"), null, null, phonePattern, "NÚMERO DE CELULAR");
        const rsocialValidate = FormValidation(data.get("company_name"), 3, null, null);
        const nfantasiaValidate = FormValidation(data.get("trading_name"), 3, null, null);

        setErrorDetected(
            {
                anac_license: habanacValidate.error,
                cpf: cpfValidate.error,
                cnpj: cnpjValidate.error,
                telephone: telephoneValidate.error,
                cellphone: cellphoneValidate.error,
                company_name: rsocialValidate.error,
                trading_name: nfantasiaValidate.error,
                street_name: false,
                number: false,
                cep: false,
                city: false,
                state: false,
                complement: false
            }
        );

        setErrorMessage(
            {
                anac_license: habanacValidate.message,
                cpf: cpfValidate.message,
                cnpj: cnpjValidate.message,
                telephone: telephoneValidate.message,
                cellphone: cellphoneValidate.message,
                company_name: rsocialValidate.message,
                trading_name: nfantasiaValidate.message,
                street_name: "",
                number: "",
                cep: "",
                city: "",
                state: "",
                complement: ""
            }
        );

        if (habanacValidate.error || cpfValidate.error || cnpjValidate.error || telephoneValidate.error || cellphoneValidate.error || rsocialValidate.error || nfantasiaValidate.error) {

            return false;

        } else {

            return true;

        }

    }

    /*
    * Rotina 2B
    */
    function formAddressValidate(data) {

        const adressNumberPattern = /^\d+$/;
        const cepPattern = /^[0-9]{5}-[0-9]{3}$/;

        const logradouroValidate = FormValidation(data.get("street_name"), 3, null, null);
        const numeroValidate = FormValidation(data.get("number"), null, null, adressNumberPattern, "NÚMERO DE ENDEREÇO");
        const cepValidate = FormValidation(data.get("cep"), null, null, cepPattern, "CEP");
        const cidadeValidate = data.get("select_city_input") != 0 ? { error: false, message: "" } : { error: true, message: "Selecione uma cidade" };
        const estadoValidate = data.get("select_state_input") != 0 ? { error: false, message: "" } : { error: true, message: "Selecione um estado" };
        const complementoValidate = FormValidation(data.get("complement"), null, null, null);

        setErrorDetected(
            {
                anac_license: false,
                cpf: false,
                cnpj: false,
                telephone: false,
                cellphone: false,
                company_name: false,
                trading_name: false,
                street_name: logradouroValidate.error,
                number: numeroValidate.error,
                cep: cepValidate.error,
                city: cidadeValidate.error,
                state: estadoValidate.error,
                complement: complementoValidate.error
            }
        );

        setErrorMessage(
            {
                anac_license: "",
                cpf: "",
                cnpj: "",
                telephone: "",
                cellphone: "",
                company_name: "",
                trading_name: "",
                street_name: logradouroValidate.message,
                number: numeroValidate.message,
                cep: cepValidate.message,
                city: cidadeValidate.message,
                state: estadoValidate.message,
                complement: complementoValidate.message
            }
        );

        if (logradouroValidate.error || numeroValidate.error || cepValidate.error || cidadeValidate.error || estadoValidate.error || complementoValidate.error) {

            return false;

        } else {

            return true;

        }
    }

    /*
    * Rotina 3A
    */
    function formDocumentsRequestServerOperation(data) {

        AxiosApi.patch(`/api/update-documents-data/${AuthData.data.id}`, {
            complementary_data_id: props.complementary_data_id,
            address_id: props.address_id,
            anac_license: data.get("anac_license"),
            cpf: data.get("cpf"),
            cnpj: data.get("cnpj"),
            telephone: data.get("telephone"),
            cellphone: data.get("cellphone"),
            company_name: data.get("company_name"),
            trading_name: data.get("trading_name")
        })
            .then(function (response) {

                formDocumentsSuccessRequestServerOperation(response);

            })
            .catch(function (error) {

                formDocumentsErrorRequestServerOperation(error.response.data);

            });

    }

    /*
    * Rotina 3B
    */
    function formAddressRequestServerOperation(data) {

        AxiosApi.patch(`/api/update-address-data/${AuthData.data.id}`, {
            street_name: data.get("street_name"),
            number: data.get("number"),
            cep: data.get("cep"),
            city: data.get("select_city_input"),
            state: data.get("select_state_input"),
            complement: data.get("complement")
        })
            .then(function (response) {

                formAddressSuccessRequestServerOperation(response);

            })
            .catch(function (error) {

                formAddressErrorRequestServerOperation(error.response.data);

            });

    }

    /*
    * Rotina 4A
    */
    function formDocumentsSuccessRequestServerOperation() {

        handleOpenSnackbar("Documentos atualizados com sucesso!", "success");

        props.reload_setter(!props.reload_state);


    }

    /*
    * Rotina 4B
    */
    function formAddressSuccessRequestServerOperation() {

        handleOpenSnackbar("Endereço atualizado com sucesso!", "success");

        props.reload_setter(!props.reload_state);

    }

    /*
    * Rotina 4AA
    */
    function formDocumentsErrorRequestServerOperation(response_data) {

        let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
        handleOpenSnackbar(error_message, "error");

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let input_errors = {
            anac_license: { error: false, message: null },
            cpf: { error: false, message: null },
            cnpj: { error: false, message: null },
            telephone: { error: false, message: null },
            cellphone: { error: false, message: null },
            company_name: { error: false, message: null },
            trading_name: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
        for (let prop in response_data.errors) {

            input_errors[prop] = {
                error: true,
                message: response_data.errors[prop][0]
            }

        }

        setErrorDetected({
            anac_license: input_errors.anac_license.error,
            cpf: input_errors.cpf.error,
            cnpj: input_errors.cnpj.error,
            telephone: input_errors.telephone.error,
            cellphone: input_errors.cellphone.error,
            company_name: input_errors.company_name.error,
            trading_name: input_errors.trading_name.error,
            street_name: "",
            number: "",
            cep: "",
            city: "",
            state: "",
            complement: ""
        });

        setErrorMessage({
            anac_license: input_errors.anac_license.message,
            cpf: input_errors.cpf.message,
            cnpj: input_errors.cnpj.message,
            telephone: input_errors.telephone.message,
            cellphone: input_errors.cellphone.message,
            company_name: input_errors.company_name.message,
            trading_name: input_errors.trading_name.message,
            street_name: "",
            number: "",
            cep: "",
            city: "",
            state: "",
            complement: ""
        });


    }

    /*
    * Rotina 4BB
    */
    function formAddressErrorRequestServerOperation(response_data) {

        let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
        handleOpenSnackbar(error_message, "error");

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let input_errors = {
            street_name: { error: false, message: null },
            number: { error: false, message: null },
            cep: { error: false, message: null },
            city: { error: false, message: null },
            state: { error: false, message: null },
            complement: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
        for (let prop in response_data.errors) {

            input_errors[prop] = {
                error: true,
                message: response_data.errors[prop][0]
            }

        }

        setErrorDetected({
            anac_license: false,
            cpf: false,
            cnpj: false,
            telephone: false,
            cellphone: false,
            company_name: false,
            trading_name: false,
            street_name: input_errors.street_name.error,
            number: input_errors.number.error,
            cep: input_errors.cep.error,
            city: input_errors.city.error,
            state: input_errors.state.error,
            complement: input_errors.complement.error
        });

        setErrorMessage({
            anac_license: "",
            cpf: "",
            cnpj: "",
            telephone: "",
            cellphone: "",
            company_name: "",
            trading_name: "",
            street_name: input_errors.street_name.message,
            number: input_errors.number.message,
            cep: input_errors.cep.message,
            city: input_errors.city.message,
            state: input_errors.state.message,
            complement: input_errors.complement.message
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
                                defaultValue={props.habANAC}
                                helperText={errorMessage.anac_license}
                                error={errorDetected.anac_license}
                                onChange={(event) => { setSaveNecessary({ documents: true, address: false }); inputSetMask(event, "HAB_ANAC"); }}
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
                                helperText={errorMessage.cpf}
                                error={errorDetected.cpf}
                                onChange={(event) => { setSaveNecessary({ documents: true, address: false }); inputSetMask(event, "CPF"); }}
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
                                helperText={errorMessage.cnpj}
                                error={errorDetected.cnpj}
                                onChange={(event) => { setSaveNecessary({ documents: true, address: false }); inputSetMask(event, "CNPJ"); }}
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
                                helperText={errorMessage.telephone}
                                error={errorDetected.telephone}
                                onChange={(event) => { setSaveNecessary({ documents: true, address: false }); inputSetMask(event, "PHONE"); }}
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
                                helperText={errorMessage.cellphone}
                                error={errorDetected.cellphone}
                                onChange={(event) => { setSaveNecessary({ documents: true, address: false }); inputSetMask(event, "PHONE"); }}
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
                                defaultValue={props.razaoSocial}
                                helperText={errorMessage.razaoSocial}
                                error={errorDetected.razaoSocial}
                                onChange={() => { setSaveNecessary({ documents: true, address: false }) }}
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
                                defaultValue={props.nomeFantasia}
                                helperText={errorMessage.company_name}
                                error={errorDetected.company_name}
                                onChange={() => { setSaveNecessary({ documents: true, address: false }) }}
                            />
                        </Grid>

                    </Grid>

                    <Button type="submit" variant="contained" color="primary" disabled={!saveNecessary.documents} sx={{ mt: 2 }}>
                        Atualizar
                    </Button>
                </Paper>
            </Box>

            <Box component="form" onSubmit={handleAddressSubmitForm} sx={{ mt: 2 }} >
                <Paper sx={{ marginTop: 2, padding: '18px 18px 18px 18px', borderRadius: '0px 15px 15px 15px' }}>

                    <Typography variant="h5" marginBottom={2}>Endereço</Typography>

                    <Grid container spacing={3}>

                        <Grid item xs={12} sm={12}>
                            <SelectStates default={props.estado} state_input_setter={setInputState} error={errorDetected.estado} error_message={errorMessage.estado} edit_mode={true} save_necessary_setter={setSaveNecessary} />
                            <SelectCities default={props.cidade} choosen_state={inputState} error={errorDetected.cidade} error_message={errorMessage.cidade} edit_mode={true} save_necessary_setter={setSaveNecessary} />
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
                                helperText={errorMessage.cep}
                                error={errorDetected.cep}
                                onChange={(event) => { setSaveNecessary({ documents: true, address: false }); inputSetMask(event, "CEP"); }}
                                onKeyDown={(event) => { setKeyPressed(event.key) }}
                                InputProps={{
                                    maxLength: 9
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="street_name"
                                name="street_name"
                                label="Logradouro"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.logradouro}
                                helperText={errorMessage.street_name}
                                error={errorDetected.street_name}
                                onChange={() => { setSaveNecessary({ documents: false, address: true }) }}
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
                                defaultValue={props.numero}
                                helperText={errorMessage.number}
                                error={errorDetected.number}
                                onChange={() => { setSaveNecessary({ documents: false, address: true }) }}
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
                                defaultValue={props.complemento}
                                helperText={errorMessage.complement}
                                error={errorDetected.complement}
                                onChange={() => { setSaveNecessary({ documents: false, address: true }) }}
                            />
                        </Grid>

                    </Grid>

                    <Button type="submit" variant="contained" color="primary" disabled={!saveNecessary.address} sx={{ mt: 2 }}>
                        Atualizar
                    </Button>

                </Paper>
            </Box>
        </>

    );

});