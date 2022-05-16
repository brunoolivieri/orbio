// React
import * as React from 'react';
// Material UI
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { Box } from '@mui/system';
import { Paper } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
// Custom
import AxiosApi from "../../../../../services/AxiosApi";
import { FormValidation } from '../../../../../utils/FormValidation';
// Libs
import moment from 'moment';
import { useSnackbar } from 'notistack';

export const BasicDataPanel = React.memo((props) => {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // States referentes ao formulário
    const [editMode, setEditMode] = React.useState(false);
    const [saveNecessary, setSaveNecessary] = React.useState(false);

    // States de validação dos campos
    const [errorDetected, setErrorDetected] = React.useState({ name: false, email: false }); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = React.useState({ name: "", email: "" }); // State para a mensagem do erro - objeto com mensagens para cada campo

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

    /*
    * Rotina 1
    * Ponto inicial do processamento do envio do formulário 
    * Recebe os dados do formulário, e transforma em um objeto da classe FormData
    * A próxima rotina, 2, validará esses dados
    */
    function handleSubmitForm(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        if (formDataValidate(data)) {

            requestServerOperation(data);

        }

    }

    /*
    * Rotina 2
    * Validação dos dados no frontend
    * Recebe o objeto da classe FormData criado na rotina 1
    * Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
    */
    function formDataValidate(formData) {

        // Regex para validação
        const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

        const nameValidate = FormValidation(formData.get("user_fullname"), 3, null, null, null);
        const emailValidate = FormValidation(formData.get("user_email"), null, null, emailPattern, "EMAIL");

        setErrorDetected({ name: nameValidate.error, email: emailValidate.error });
        setErrorMessage({ name: nameValidate.message, email: emailValidate.message });

        if (nameValidate.error || emailValidate.error) {

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

        let request_data = {};

        request_data = {
            email: data.get("user_email"),
            name: data.get("user_fullname")
        };

        AxiosApi.patch(`/api/update-basic-data/${props.userid}`, request_data)
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

            if (response.data.error === "email_already_exists") {

                setErrorDetected({ name: false, email: true });
                setErrorMessage({ name: null, email: "Esse email já existe" });

                handleOpenSnackbar("Erro! O email já existe", "error");

            } else {

                handleOpenSnackbar("Erro do servidor!", "error");

            }

        }

    }

    function handleOpenSnackbar(text, variant) {

        enqueueSnackbar(text, { variant });

    }

    // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return (
        <>
            <Grid container spacing={1} alignItems="center">

                {saveNecessary && <Grid item>
                    <Tooltip title="Salvar Alterações">
                        <IconButton form="user_account_basic_form" type="submit">
                            <PublishedWithChangesIcon color={'#007937'}/>
                        </IconButton>
                    </Tooltip>
                </Grid>}

                <Grid item>
                    <Tooltip title="Editar">
                        <IconButton onClick={enableFieldsEdition}>
                            <FontAwesomeIcon icon={faPen} size="sm" color={'#007937'} />
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item>
                    <Tooltip title="Carregar">
                        <IconButton onClick={reloadFormulary}>
                            <FontAwesomeIcon icon={faArrowsRotate} size="sm" color={'#007937'} />
                        </IconButton>
                    </Tooltip>
                </Grid>

            </Grid>

            <Box component="form" id="user_account_basic_form" noValidate onSubmit={handleSubmitForm} sx={{ mt: 2 }} >
                <Paper sx={{ marginTop: 4, padding: '0px 18px 18px 18px', borderRadius: '0px 15px 15px 15px' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="user_fullname"
                                name="user_fullname"
                                label="Nome completo"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.name}
                                helperText={errorMessage.name}
                                error={errorDetected.name}
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
                                id="user_email"
                                name="user_email"
                                label="Email"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.email}
                                helperText={errorMessage.email}
                                error={errorDetected.email}
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
                                id="profile_type"
                                name="profile_type"
                                label="Perfil de usuário"
                                fullWidth
                                variant="outlined"
                                defaultValue={props.profile}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="user_last_access"
                                name="user_last_access"
                                label="Data do último acesso"
                                fullWidth
                                variant="outlined"
                                defaultValue={moment(props.last_access).format('DD-MM-YYYY hh:mm')}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="user_last_update"
                                name="user_last_update"
                                label="Data da última atualização"
                                fullWidth
                                defaultValue={moment(props.last_update).format('DD-MM-YYYY hh:mm')}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

        </>
    );

});