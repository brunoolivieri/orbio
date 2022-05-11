// React
import * as React from 'react';
// Material UI
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
// Custom
import AxiosApi from "../../../../../services/AxiosApi";
import { FormValidation } from '../../../../../utils/FormValidation';
import { SelectStates } from '../../../../structures/input_select/InputSelectStates';
import { SelectCities } from '../../../../structures/input_select/SelectCities';
// Libs
import { useSnackbar } from 'notistack';

export const ComplementaryDataPanel = ((props) => {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // States referentes ao formulário
    // const [dataChanged, setDataChanged] = useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [saveNecessary, setSaveNecessary] = React.useState(false);

    // States de validação dos campos
    const [errorDetected, setErrorDetected] = React.useState({ habANAC: false, cpf: false, cnpj: false, telephone: false, cellphone: false, razaoSocial: false, nomeFantasia: false, logradouro: false, numero: false, cep: false, cidade: false, estado: false, complemento: false }); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = React.useState({ habANAC: null, cpf: null, cnpj: null, telephone: null, cellphone: null, razaoSocial: null, nomeFantasia: null, logradouro: null, numero: null, cep: null, cidade: null, estado: null, complemento: null }); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State key Down
    const [keyPressed, setKeyPressed] = React.useState();

    // State do input de estado e de cidade
    const [inputState, setInputState] = React.useState(props.estado);
    const [inputCity, setInputCity] = React.useState(props.cidade);

    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    function enableFieldsEdition() {

        setEditMode(!editMode);

    }

    function enableSaveButton() {

        setSaveNecessary(true);

    }

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
    * Ponto inicial do processamento do envio do formulário 
    * Recebe os dados do formulário, e transforma em um objeto da classe FormData
    * A próxima rotina, 2, validará esses dados
    */
    function handleSubmitForm(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        if (dataValidate(data)) {

            requestServerOperation(data);

        }

    }

    /*
    * Rotina 2
    * Validação dos dados no frontend
    * Recebe o objeto da classe FormData criado na rotina 1
    * Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
    */
    function dataValidate(formData) {

        const habAnacPattern = /^\d{6}$/;
        const cpfPattern = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
        const cnpjPattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
        const phonePattern = /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/;
        const adressNumberPattern = /^\d+$/;
        const cepPattern = /^[0-9]{5}-[0-9]{3}$/;

        const habanacValidate = FormValidation(formData.get("user_habanac"), 3, null, habAnacPattern, "HABILITAÇÃO ANAC");
        const cpfValidate = FormValidation(formData.get("user_cpf"), null, null, cpfPattern, "CPF");
        const cnpjValidate = FormValidation(formData.get("user_cnpj"), null, null, cnpjPattern, "CNPJ");
        const telephoneValidate = FormValidation(formData.get("user_telephone"), null, null, phonePattern, "NÚMERO DE TELEFONE");
        const cellphoneValidate = FormValidation(formData.get("user_cellphone"), null, null, phonePattern, "NÚMERO DE CELULAR");
        const rsocialValidate = FormValidation(formData.get("user_rsocial"), 3, null, null);
        const nfantasiaValidate = FormValidation(formData.get("user_nfantasia"), 3, null, null);
        const logradouroValidate = FormValidation(formData.get("user_logradouro"), 3, null, null);
        const numeroValidate = FormValidation(formData.get("user_numero"), null, null, adressNumberPattern, "NÚMERO DE ENDEREÇO");
        const cepValidate = FormValidation(formData.get("user_cep"), null, null, cepPattern, "CEP");
        const cidadeValidate = formData.get("select_city_input") != 0 ? { error: false, message: "" } : { error: true, message: "Selecione uma cidade" };
        const estadoValidate = formData.get("select_state_input") != 0 ? { error: false, message: "" } : { error: true, message: "Selecione um estado" };
        const complementoValidate = FormValidation(formData.get("user_complemento"), null, null, null);

        setErrorDetected(
            {
                habANAC: habanacValidate.error,
                cpf: cpfValidate.error,
                cnpj: cnpjValidate.error,
                telephone: telephoneValidate.error,
                cellphone: cellphoneValidate.error,
                razaoSocial: rsocialValidate.error,
                nomeFantasia: nfantasiaValidate.error,
                logradouro: logradouroValidate.error,
                numero: numeroValidate.error,
                cep: cepValidate.error,
                cidade: cidadeValidate.error,
                estado: estadoValidate.error,
                complemento: complementoValidate.error
            });

        setErrorMessage(
            {
                habANAC: habanacValidate.message,
                cpf: cpfValidate.message,
                cnpj: cnpjValidate.message,
                telephone: telephoneValidate.message,
                cellphone: cellphoneValidate.message,
                razaoSocial: rsocialValidate.message,
                nomeFantasia: nfantasiaValidate.message,
                logradouro: logradouroValidate.message,
                numero: numeroValidate.message,
                cep: cepValidate.message,
                cidade: cidadeValidate.message,
                estado: estadoValidate.message,
                complemento: complementoValidate.message
            });

        if (habanacValidate.error || cpfValidate.error || cnpjValidate.error || telephoneValidate.error || cellphoneValidate.error || rsocialValidate.error || nfantasiaValidate.error || logradouroValidate.error || numeroValidate.error || cepValidate.error || cidadeValidate.error || estadoValidate.error || complementoValidate.error) {

            return false;

        } else {

            return true;

        }

    }

    /*
  * Rotina 3
  * Comunicação AJAX com o Laravel utilizando AXIOS
  * Após o recebimento da resposta, é chamada próxima rotina, 4, de tratamento da resposta do servidor
  */
    function requestServerOperation(data) {

        AxiosApi.patch(`/api/update-complementary-data/${props.userid}`, {
            complementary_data_id: props.complementary_data_id,
            address_id: props.address_id,
            habAnac: data.get("user_habanac"),
            cpf: data.get("user_cpf"),
            cnpj: data.get("user_cnpj"),
            telephone: data.get("user_telephone"),
            cellphone: data.get("user_cellphone"),
            rSocial: data.get("user_rsocial"),
            nFantasia: data.get("user_nfantasia"),
            logradouro: data.get("user_logradouro"),
            address_number: data.get("user_numero"),
            cep: data.get("user_cep"),
            city: data.get("select_city_input"),
            state: data.get("select_state_input"),
            complemento: data.get("user_complemento")
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
  * Tratamento da resposta do servidor
  * Se for um sucesso, aparece, mo modal, um alerta com a mensagem de sucesso, e o novo registro na tabela de usuários
  */
    function serverResponseTreatment(response) {

        if (response.status === 200) {

            handleOpenSnackbar("Dados atualizados com sucesso!", "success");

            props.reload_setter(!props.reload_state);

            setEditMode(false);

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

    };

    // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return (
        <>
            <Grid container spacing={1} alignItems="center">

                {saveNecessary && <Grid item>
                    <Tooltip title="Salvar Alterações">
                        <IconButton form="user_account_complementary_form" type="submit">
                            <PublishedWithChangesIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>}

                <Grid item>
                    <Tooltip title="Editar">
                        <IconButton onClick={enableFieldsEdition}>
                            <FontAwesomeIcon icon={faPenToSquare} size="sm" />
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item>
                    <Tooltip title="Reload">
                        <IconButton onClick={reloadFormulary}>
                            <FontAwesomeIcon icon={faArrowRotateRight} size="sm" />
                        </IconButton>
                    </Tooltip>
                </Grid>

            </Grid>

            <Box component="form" id="user_account_complementary_form" noValidate onSubmit={handleSubmitForm} sx={{ mt: 2 }} >

                <Grid container spacing={3}>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="user_habanac"
                            name="user_habanac"
                            label="Habilitação ANAC"
                            fullWidth
                            variant="outlined"
                            defaultValue={props.habANAC}
                            helperText={errorMessage.habANAC}
                            error={errorDetected.habANAC}
                            onChange={(event) => { enableSaveButton(); inputSetMask(event, "HAB_ANAC"); }}
                            InputProps={{
                                readOnly: !editMode,
                            }}
                            focused={editMode}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="user_cpf"
                            name="user_cpf"
                            label="CPF"
                            fullWidth
                            variant="outlined"
                            defaultValue={props.cpf}
                            helperText={errorMessage.cpf}
                            error={errorDetected.cpf}
                            onChange={(event) => { enableSaveButton(); inputSetMask(event, "CPF"); }}
                            onKeyDown={(event) => { setKeyPressed(event.key) }}
                            InputProps={{
                                readOnly: !editMode,
                                maxLength: 14
                            }}
                            focused={editMode}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="user_cnpj"
                            name="user_cnpj"
                            label="CNPJ"
                            fullWidth
                            variant="outlined"
                            defaultValue={props.cnpj}
                            helperText={errorMessage.cnpj}
                            error={errorDetected.cnpj}
                            onChange={(event) => { enableSaveButton(); inputSetMask(event, "CNPJ"); }}
                            onKeyDown={(event) => { setKeyPressed(event.key) }}
                            InputProps={{
                                readOnly: !editMode,
                                maxLength: 18
                            }}
                            focused={editMode}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="user_telephone"
                            name="user_telephone"
                            label="Telefone (com DDD)"
                            fullWidth
                            variant="outlined"
                            defaultValue={props.telephone}
                            helperText={errorMessage.telephone}
                            error={errorDetected.telephone}
                            onChange={(event) => { enableSaveButton(); inputSetMask(event, "PHONE"); }}
                            onKeyDown={(event) => { setKeyPressed(event.key) }}
                            InputProps={{
                                readOnly: !editMode,
                                maxLength: 14
                            }}
                            focused={editMode}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="user_cellphone"
                            name="user_cellphone"
                            label="Celular (com DDD)"
                            fullWidth
                            variant="outlined"
                            defaultValue={props.cellphone}
                            helperText={errorMessage.cellphone}
                            error={errorDetected.cellphone}
                            onChange={(event,) => { enableSaveButton(); inputSetMask(event, "PHONE"); }}
                            onKeyDown={(event) => { setKeyPressed(event.key) }}
                            InputProps={{
                                readOnly: !editMode,
                                maxLength: 14
                            }}
                            focused={editMode}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="user_rsocial"
                            name="user_rsocial"
                            label="Razão Social"
                            fullWidth
                            variant="outlined"
                            defaultValue={props.razaoSocial}
                            helperText={errorMessage.razaoSocial}
                            error={errorDetected.razaoSocial}
                            onChange={enableSaveButton}
                            InputProps={{
                                readOnly: !editMode,
                            }}
                            focused={editMode}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="user_nfantasia"
                            name="user_nfantasia"
                            label="Nome Fantasia"
                            fullWidth
                            variant="outlined"
                            defaultValue={props.nomeFantasia}
                            helperText={errorMessage.nomeFantasia}
                            error={errorDetected.nomeFantasia}
                            onChange={enableSaveButton}
                            InputProps={{
                                readOnly: !editMode,
                            }}
                            focused={editMode}
                        />
                    </Grid>

                </Grid>

                <Box >
                    <Typography variant="inherit" sx={{ m: "10px 0px 10px 0px" }}>Preenchimento dos dados de localização.</Typography>
                </Box>

                <Grid container spacing={3}>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="user_cep"
                            name="user_cep"
                            label="CEP"
                            fullWidth
                            variant="outlined"
                            defaultValue={props.cep}
                            helperText={errorMessage.cep}
                            error={errorDetected.cep}
                            onChange={(event) => { enableSaveButton(); inputSetMask(event, "CEP"); }}
                            onKeyDown={(event) => { setKeyPressed(event.key) }}
                            InputProps={{
                                readOnly: !editMode,
                                maxLength: 9
                            }}
                            focused={editMode}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <SelectStates default={props.estado} state_input_setter={setInputState} error={errorDetected.estado} error_message={errorMessage.estado} edit_mode={editMode} save_necessary_setter={setSaveNecessary} />
                        <SelectCities default={props.cidade} choosen_state={inputState} error={errorDetected.cidade} error_message={errorMessage.cidade} edit_mode={editMode} save_necessary_setter={setSaveNecessary} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="user_logradouro"
                            name="user_logradouro"
                            label="Logradouro"
                            fullWidth
                            variant="outlined"
                            defaultValue={props.logradouro}
                            helperText={errorMessage.logradouro}
                            error={errorDetected.logradouro}
                            onChange={enableSaveButton}
                            InputProps={{
                                readOnly: !editMode,
                            }}
                            focused={editMode}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="user_numero"
                            name="user_numero"
                            label="Numero"
                            fullWidth
                            variant="outlined"
                            defaultValue={props.numero}
                            helperText={errorMessage.numero}
                            error={errorDetected.numero}
                            onChange={enableSaveButton}
                            InputProps={{
                                readOnly: !editMode,
                            }}
                            focused={editMode}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="user_complemento"
                            name="user_complemento"
                            label="Complemento"
                            fullWidth
                            variant="outlined"
                            defaultValue={props.complemento}
                            helperText={errorMessage.complemento}
                            error={errorDetected.complemento}
                            onChange={enableSaveButton}
                            InputProps={{
                                readOnly: !editMode,
                            }}
                            focused={editMode}
                        />
                    </Grid>

                </Grid>

            </Box>
        </>

    );

});