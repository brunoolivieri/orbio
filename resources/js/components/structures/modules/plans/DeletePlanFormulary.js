// React
import { useState} from 'react';
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import AxiosApi from '../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

export const DeletePlanFormulary = React.memo(({...props}) => {

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    const [open, setOpen] = useState(false); 

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Função para abrir o modal
    const handleClickOpen = () => {
      setOpen(true);   
    };

    // Função para fechar o modal
    const handleClose = () => {

      // Deselecionar registro na tabela
      props.record_setter(null);
      // Outros
      setDisplayAlert({display: false, type: "", message: ""});
      setDisabledButton(false);

      setOpen(false);

    };

     /*
    * Rotina 1
    * Captura do envio do formulário
    * 
    */ 
    const handleSubmitOperation = (event) => {
      event.preventDefault();

      // Instância da classe JS FormData - para trabalhar os dados do formulário
      const data = new FormData(event.currentTarget);

        // Botão é desabilitado
        setDisabledButton(true);

        // Inicialização da requisição para o servidor
        requestServerOperation(data);  

    }

     /*
    * Rotina 3
    * Realização da requisição AXIOS
    * Possui dois casos: o Update e o Delete
    * 
    */ 
    function requestServerOperation(data){

        // Dados para o middleware de autenticação 
        let logged_user_id = AuthData.data.id;
        let module_id = 2;
        let module_action = "escrever";

        setDisabledButton(false);

        AxiosApi.delete(`/api/plans-module/${data.get("plan_id")}?auth=${logged_user_id}.${module_id}.${module_action}`)
        .then(function (response) {

            successServerResponseTreatment();

        })
        .catch(function (error) {
            
            errorServerResponseTreatment(error.response.data);

        });

    }

    /*
    * Rotina 4A
    * Tratamento da resposta de uma requisição bem sucedida
    */
    function successServerResponseTreatment(){

      setDisplayAlert({display: true, type: "success", message: "Operação realizada com sucesso!"});

      setTimeout(() => {

        // Deselecionar registro na tabela
        props.record_setter(null);
        // Outros
        setIsChecked(null);
        setDisabledButton(false);
        handleClose();

      }, 2000);

    }

    /*
    * Rotina 4B
    * Tratamento da resposta de uma requisição falha
    */
    function errorServerResponseTreatment(response_data){

      let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da atualização!";
      setDisplayAlert({display: true, type: "error", message: error_message});

    }

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //

  return (
    <>
        <Tooltip title="Deletar">
          <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.escrever == 1 ? false : true} onClick={handleClickOpen}>
            <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["2"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size = "sm"/>
          </IconButton>
        </Tooltip>

        {(props.record != null && open) && 

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>DELEÇÃO | PLANO DE VÔO (ID: {props.record.plan_id})</DialogTitle>

          {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
          <Box component="form" noValidate onSubmit={handleSubmitOperation} >

            <DialogContent>

              <TextField
              margin="dense"
              id="plan_id"
              name="plan_id"
              label="ID do plano"
              type="text"
              fullWidth
              variant="outlined"
              inputProps={{
                  readOnly: true
              }}
              value={props.record.plan_id}
              sx={{mb: 2}}
              />

              <TextField
              margin="dense"
              label="Arquivo"
              type="text"
              fullWidth
              variant="outlined"
              inputProps={{
                  readOnly: true
              }}
              defaultValue={props.record.plan_file}
              />

            </DialogContent>

            {displayAlert.display && 
                <Alert severity={displayAlert.type}>{displayAlert.message}</Alert> 
            }
          
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button type="submit" disabled={disabledButton} variant="contained">Confirmar deleção</Button>
            </DialogActions>

          </Box>
        </Dialog>
        }
    </>

  );

});