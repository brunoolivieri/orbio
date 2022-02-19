// IMPORTAÇÃO DOS COMPONENTES PARA O MATERIAL UI
import { Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import RefreshIcon from '@mui/icons-material/Refresh';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { Box } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import { Alert } from '@mui/material';

import AxiosApi from "../../../../../services/AxiosApi";

import { FormValidation } from '../../../../../services/FormValidation';

import { useState, useEffect } from 'react';

export function ComplementaryDataPanel(props){

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // States referentes ao formulário
    // const [dataChanged, setDataChanged] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [saveNecessary, setSaveNecessary] = useState(false);
    
    // States de validação dos campos
    const [errorDetected, setErrorDetected] = useState({habANAC: false, cpf: false, cnpj: false, telephone: false, cellphone: false, razaoSocial: false, nomeFantasia: false, logradouro: false, numero: false, cep: false, cidade: false, estado: false, complemento: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({habANAC: null, cpf: null, cnpj: null, telephone: null, cellphone: null,  razaoSocial: null, nomeFantasia: null, logradouro: null, numero: null, cep: null, cidade: null, estado: null, complemento: null}); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    function enableFieldsEdition(){

        setEditMode(!editMode);

    }

    function enableSaveButton(){

        setSaveNecessary(true);

    }

    function reloadFormulary(){

        props.reload_setter(!props.reload_state);

    }

    /*
    * Rotina 1
    * Ponto inicial do processamento do envio do formulário 
    * Recebe os dados do formulário, e transforma em um objeto da classe FormData
    * A próxima rotina, 2, validará esses dados
    */ 
    function handleSubmitForm(event){
        event.preventDefault();

        // Instância da classe JS FormData - para trabalhar os dados do formulário
        const data = new FormData(event.currentTarget);

        // Validação dos dados do formulário
        // A comunicação com o backend só é realizada se o retorno for true
        if(dataValidate(data)){
  
            // Inicialização da requisição para o servidor
            requestServerOperation(data);
  
        }

    }

    /*
    * Rotina 2
    * Validação dos dados no frontend
    * Recebe o objeto da classe FormData criado na rotina 1
    * Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
    */
    function dataValidate(formData){

        // Padrões válidos
        const cpfPattern = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
        const cnpjPattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
        const phonePattern = /^[0-9]{11}$/;
        const adressNumberPattern = /^\d+$/;
        const cepPattern = /[0-9]{8}/;

        // Validação dos dados - true para presença de erro e false para ausência
        // O valor final é um objeto com dois atributos: "erro" e "message"
        // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
        const habanacValidate = FormValidation(formData.get("user_habanac"), 3, null, null, null);
        const cpfValidate = FormValidation(formData.get("user_cpf"), null, null, cpfPattern, "CPF");
        const cnpjValidate = FormValidation(formData.get("user_cnpj"), null, null, cnpjPattern, "CNPJ");
        const telephoneValidate = FormValidation(formData.get("user_telephone"), null, null, phonePattern, "NÚMERO DE TELEFONE");
        const cellphoneValidate = FormValidation(formData.get("user_cellphone"), null, null, phonePattern, "NÚMERO DE CELULAR");
        const rsocialValidate = FormValidation(formData.get("user_rsocial"), 3, null, null);
        const nfantasiaValidate = FormValidation(formData.get("user_nfantasia"), 3, null, null);
        const logradouroValidate = FormValidation(formData.get("user_logradouro"), 3, null, null);
        const numeroValidate = FormValidation(formData.get("user_numero"), null, null, adressNumberPattern, "NÚMERO DE ENDEREÇO");
        const cepValidate = FormValidation(formData.get("user_cep"), null, null, cepPattern, "CEP");
        const cidadeValidate = FormValidation(formData.get("user_cidade"), 3, null, null);
        const estadoValidate = FormValidation(formData.get("user_estado"), null, null, null);
        const complementoValidate = FormValidation(formData.get("user_complemento"), null, null, null);
  
        // Atualização dos estados responsáveis por manipular os inputs
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
        
        // Se o nome ou acesso estiverem errados
        if(habanacValidate.error || cpfValidate.error || cnpjValidate.error || telephoneValidate.error || cellphoneValidate.error || rsocialValidate.error || nfantasiaValidate.error || logradouroValidate.error || numeroValidate.error || cepValidate.error || cidadeValidate.error || estadoValidate.error || complementoValidate.error){

            return false;
  
        }else{

            return true;
  
        }
  
      }

      /*
    * Rotina 3
    * Comunicação AJAX com o Laravel utilizando AXIOS
    * Após o recebimento da resposta, é chamada próxima rotina, 4, de tratamento da resposta do servidor
    */
    function requestServerOperation(data){

        AxiosApi.post("/api/user-update-data?panel=complementary_data", {
          id: props.userid,
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
          city: data.get("user_cidade"),
          state: data.get("user_estado"),
          complemento: data.get("user_complemento")
        })
        .then(function (response) {
  
            // Tratamento da resposta do servidor
            serverResponseTreatment(response);
  
        })
        .catch(function (error) {
          
          // Tratamento da resposta do servidor
          serverResponseTreatment(error.response);
  
        });
  
      }

      /*
    * Rotina 4
    * Tratamento da resposta do servidor
    * Se for um sucesso, aparece, mo modal, um alerta com a mensagem de sucesso, e o novo registro na tabela de usuários
    */
    function serverResponseTreatment(response){

        console.log(response)

        if(response.status === 200){
   
           // Alerta sucesso
           setDisplayAlert({display: true, type: "success", message: "Dados atualizados com sucesso!"});

           // Recarregar os dados do usuário
           props.reload_setter(!props.reload_state);

           // Desabilitar modo de edição
           setEditMode(false);
   
         }else{

            setErrorDetected(
                {habANAC: response.data.error.habAnac ? true : false, 
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
                {habANAC: response.data.error.habAnac, 
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

            // Alerta erro
            setDisplayAlert({display: true, type: "error", message: "Erro! Tente novamente."});
   
         }
   
       }

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return(
        <>
        <Grid container spacing={1} alignItems="center">

            {saveNecessary && <Grid item>
                <Tooltip title="Salvar Alterações">
                    <IconButton form = "user_account_complementary_form" type = "submit">
                        <PublishedWithChangesIcon />         
                    </IconButton>
                </Tooltip>  
            </Grid>}

            <Grid item>
                <Tooltip title="Habilitar Edição">
                    <IconButton onClick = {enableFieldsEdition}>
                        <EditIcon />         
                    </IconButton>
                </Tooltip>  
            </Grid>

            <Grid item>
                <Tooltip title="Reload">
                    <IconButton onClick = {reloadFormulary}>
                    {/* O recarregamento dos dados é a alteração do valor das dependências do useEffect que realiza uma requisição AXIOS */}
                    <RefreshIcon color="inherit" sx={{ display: 'block' }} />         
                    </IconButton>
                </Tooltip>  
            </Grid>

        </Grid>

        {displayAlert.display && 
            <Alert severity={displayAlert.type}>{displayAlert.message}</Alert> 
        } 

        <Box component="form" id = "user_account_complementary_form" noValidate onSubmit={handleSubmitForm} sx={{ mt: 2 }} >

            <Grid container spacing={5}>
        
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="user_habanac"
                        name="user_habanac"
                        label="Habilitação ANAC"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.habANAC}
                        helperText = {errorMessage.habANAC}
                        error = {errorDetected.habANAC}
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
                        id="user_cpf"
                        name="user_cpf"
                        label="CPF"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.cpf}
                        helperText = {errorMessage.cpf}
                        error = {errorDetected.cpf}
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
                        id="user_cnpj"
                        name="user_cnpj"
                        label="CNPJ"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.cnpj}
                        helperText = {errorMessage.cnpj}
                        error = {errorDetected.cnpj}
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
                        id="user_telephone"
                        name="user_telephone"
                        label="Telefone"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.telephone}
                        helperText = {errorMessage.telephone}
                        error = {errorDetected.telephone}
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
                        id="user_cellphone"
                        name="user_cellphone"
                        label="Celular"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.cellphone}
                        helperText = {errorMessage.cellphone}
                        error = {errorDetected.cellphone}
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
                        id="user_rsocial"
                        name="user_rsocial"
                        label="Razão Social"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.razaoSocial}
                        helperText = {errorMessage.razaoSocial}
                        error = {errorDetected.razaoSocial}
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
                        helperText = {errorMessage.nomeFantasia}
                        error = {errorDetected.nomeFantasia}
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
                        id="user_logradouro"
                        name="user_logradouro"
                        label="Logradouro"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.logradouro}
                        helperText = {errorMessage.logradouro}
                        error = {errorDetected.logradouro}
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
                        helperText = {errorMessage.numero}
                        error = {errorDetected.numero}
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
                        id="user_cep"
                        name="user_cep"
                        label="CEP"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.cep}
                        helperText = {errorMessage.cep}
                        error = {errorDetected.cep}
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
                        id="user_cidade"
                        name="user_cidade"
                        label="Cidade"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.cidade}
                        helperText = {errorMessage.cidade}
                        error = {errorDetected.cidade}
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
                        id="user_estado"
                        name="user_estado"
                        label="Estado"
                        fullWidth
                        variant="outlined"
                        defaultValue={props.estado}
                        helperText = {errorMessage.estado}
                        error = {errorDetected.estado}
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
                        helperText = {errorMessage.complemento}
                        error = {errorDetected.complemento}
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
    
}