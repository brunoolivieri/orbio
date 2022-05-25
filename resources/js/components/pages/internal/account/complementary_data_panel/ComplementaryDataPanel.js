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

export const ComplementaryDataPanel = ((props) => {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const { AuthData } = useAuthentication();

    const [saveNecessary, setSaveNecessary] = React.useState({ documents: false, address: false });

    // States de validação dos campos
    const [errorDetected, setErrorDetected] = React.useState({ habANAC: false, cpf: false, cnpj: false, telephone: false, cellphone: false, razaoSocial: false, nomeFantasia: false, logradouro: false, numero: false, cep: false, cidade: false, estado: false, complemento: false });
    const [errorMessage, setErrorMessage] = React.useState({ habANAC: null, cpf: null, cnpj: null, telephone: null, cellphone: null, razaoSocial: null, nomeFantasia: null, logradouro: null, numero: null, cep: null, cidade: null, estado: null, complemento: null });

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

            requestServerOperationAddress(data, "ADDRESS");

        }

    }

    /*
    * Rotina 1
    */
    function handleDocumentsSubmitForm(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        if (formDocumentsValidate(data)) {

            requestServerOperationComplementaryData(data);

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

        const habanacValidate = FormValidation(data.get("habanac"), 3, null, habAnacPattern, "HABILITAÇÃO ANAC");
        const cpfValidate = FormValidation(data.get("cpf"), null, null, cpfPattern, "CPF");
        const cnpjValidate = FormValidation(data.get("cnpj"), null, null, cnpjPattern, "CNPJ");
        const telephoneValidate = FormValidation(data.get("telephone"), null, null, phonePattern, "NÚMERO DE TELEFONE");
        const cellphoneValidate = FormValidation(data.get("cellphone"), null, null, phonePattern, "NÚMERO DE CELULAR");
        const rsocialValidate = FormValidation(data.get("rsocial"), 3, null, null);
        const nfantasiaValidate = FormValidation(data.get("nfantasia"), 3, null, null);

        setErrorDetected(
            {
                habANAC: habanacValidate.error,
                cpf: cpfValidate.error,
                cnpj: cnpjValidate.error,
                telephone: telephoneValidate.error,
                cellphone: cellphoneValidate.error,
                razaoSocial: rsocialValidate.error,
                nomeFantasia: nfantasiaValidate.error,
                logradouro: false,
                numero: false,
                cep: false,
                cidade: false,
                estado: false,
                complemento: false
            }
        );

        setErrorMessage(
            {
                habANAC: habanacValidate.message,
                cpf: cpfValidate.message,
                cnpj: cnpjValidate.message,
                telephone: telephoneValidate.message,
                cellphone: cellphoneValidate.message,
                razaoSocial: rsocialValidate.message,
                nomeFantasia: nfantasiaValidate.message,
                logradouro: "",
                numero: "",
                cep: "",
                cidade: "",
                estado: "",
                complemento: ""
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

        const logradouroValidate = FormValidation(data.get("logradouro"), 3, null, null);
        const numeroValidate = FormValidation(data.get("numero"), null, null, adressNumberPattern, "NÚMERO DE ENDEREÇO");
        const cepValidate = FormValidation(data.get("cep"), null, null, cepPattern, "CEP");
        const cidadeValidate = data.get("select_city_input") != 0 ? { error: false, message: "" } : { error: true, message: "Selecione uma cidade" };
        const estadoValidate = data.get("select_state_input") != 0 ? { error: false, message: "" } : { error: true, message: "Selecione um estado" };
        const complementoValidate = FormValidation(data.get("complemento"), null, null, null);

        setErrorDetected(
            {
                habANAC: false,
                cpf: false,
                cnpj: false,
                telephone: false,
                cellphone: false,
                razaoSocial: false,
                nomeFantasia: false,
                logradouro: logradouroValidate.error,
                numero: numeroValidate.error,
                cep: cepValidate.error,
                cidade: cidadeValidate.error,
                estado: estadoValidate.error,
                complemento: complementoValidate.error
            }
        );

        setErrorMessage(
            {
                habANAC: "",
                cpf: "",
                cnpj: "",
                telephone: "",
                cellphone: "",
                razaoSocial: "",
                nomeFantasia: "",
                logradouro: logradouroValidate.message,
                numero: numeroValidate.message,
                cep: cepValidate.message,
                cidade: cidadeValidate.message,
                estado: estadoValidate.message,
                complemento: complementoValidate.message
            }
        );

        if (logradouroValidate.error || numeroValidate.error || cepValidate.error || cidadeValidate.error || estadoValidate.error || complementoValidate.error) {

            return false;

        } else {

            return true;

        }
    }

    function requestServerOperationComplementaryData(data) {

        AxiosApi.patch(`/api/update-complementary-data/${AuthData.data.id}`, {
            complementary_data_id: props.complementary_data_id,
            address_id: props.address_id,
            habAnac: data.get("habanac"),
            cpf: data.get("cpf"),
            cnpj: data.get("cnpj"),
            telephone: data.get("telephone"),
            cellphone: data.get("cellphone"),
            rSocial: data.get("rsocial"),
            nFantasia: data.get("nfantasia")
        })
            .then(function (response) {

                serverResponseTreatment(response);

            })
            .catch(function (error) {

                serverResponseTreatment(error.response);

            });

    }

    function requestServerOperationAddress(data) {

        AxiosApi.patch(`/api/update-address-data/${AuthData.data.id}`, {
            logradouro: data.get("logradouro"),
            address_number: data.get("numero"),
            cep: data.get("cep"),
            city: data.get("select_city_input"),
            state: data.get("select_state_input"),
            complemento: data.get("complemento")
        })
            .then(function (response) {

                serverResponseTreatment(response);

            })
            .catch(function (error) {

                serverResponseTreatment(error.response);

            });

    }

    /*
    * Rotina 4
    */
    function serverResponseTreatment(response) {

        if (response.status === 200) {

            handleOpenSnackbar("Dados atualizados com sucesso!", "success");

            props.reload_setter(!props.reload_state);

        } else {

            setErrorDetected(
                {
                    habANAC: response.data.error.habAnac ? true : false,
                    cpf: response.data.error.cpf ? true : false,
                    cnpj: response.data.error.cnpj ? true : false,
                    telephone: response.data.error.telephone ? true : false,
                    cellphone: response.data.error.cellphone ? true : false,
                    razaoSocial: response.data.error.rSocial ? true : false,
                    nomeFantasia: response.data.error.nFantasia ? true : false,
                    logradouro: false,
                    numero: false,
                    cep: false,
                    cidade: false,
                    estado: false,
                    complemento: false
                }
            );

            setErrorMessage(
                {
                    habANAC: response.data.error.habAnac,
                    cpf: response.data.error.cpf,
                    cnpj: response.data.error.cnpj,
                    telephone: response.data.error.telephone,
                    cellphone: response.data.error.cellphone,
                    razaoSocial: response.data.error.rSocial,
                    nomeFantasia: response.data.error.nFantasia,
                    logradouro: null,
                    numero: null,
                    cep: null,
                    cidade: null,
                    estado: null,
                    complemento: null
                }
            );

            handleOpenSnackbar("Erro! Dados inválidos", "error");

        }

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
                                id="habanac"
                                name="habANAC"
                                label="Habilitação ANAC"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.habANAC}
                                helperText={errorMessage.habANAC}
                                error={errorDetected.habANAC}
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
                                id="celular"
                                name="celular"
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
                                id="razaoSocial"
                                name="razaoSocial"
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
                                id="nomeFantasia"
                                name="nomeFantasia"
                                label="Nome Fantasia"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.nomeFantasia}
                                helperText={errorMessage.nomeFantasia}
                                error={errorDetected.nomeFantasia}
                                onChange={() => { setSaveNecessary({ documents: true, address: false }) }}
                            />
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

                    </Grid>

                    <Button variant="contained" color="primary" disabled={!saveNecessary.documents} sx={{ mt: 2 }}>
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

                        <Grid item xs={12} sm={12}>
                            <TextField
                                required
                                id="logradouro"
                                name="logradouro"
                                label="Logradouro"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.logradouro}
                                helperText={errorMessage.logradouro}
                                error={errorDetected.logradouro}
                                onChange={() => { setSaveNecessary({ documents: false, address: true }) }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <TextField
                                required
                                id="numero"
                                name="numero"
                                label="Numero"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.numero}
                                helperText={errorMessage.numero}
                                error={errorDetected.numero}
                                onChange={() => { setSaveNecessary({ documents: false, address: true }) }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <TextField
                                required
                                id="complemento"
                                name="complemento"
                                label="Complemento"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.complemento}
                                helperText={errorMessage.complemento}
                                error={errorDetected.complemento}
                                onChange={() => { setSaveNecessary({ documents: false, address: true }) }}
                            />
                        </Grid>

                    </Grid>

                    <Button variant="contained" color="primary" disabled={!saveNecessary.address} sx={{ mt: 2 }}>
                        Atualizar
                    </Button>

                </Paper>
            </Box>
        </>

    );

});