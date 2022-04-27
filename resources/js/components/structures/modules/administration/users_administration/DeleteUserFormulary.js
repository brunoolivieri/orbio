// IMPORTAÇÃO DOS COMPONENTES REACT
import { useState} from 'react';
import * as React from 'react';
// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
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
import { DialogContentText } from '@mui/material';
// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import AxiosApi from '../../../../../services/AxiosApi';
// IMPORTAÇÃO DOS ÍCONES DO FONTS AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

export const DeleteUserFormulary = React.memo(({...props}) => {

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

     // Função para abrir o modal
     const handleClickOpen = () => {
      if(props.selected_record.dom != null){
        setOpen(true);
      }
    };

    // Função para fechar o modal
    const handleClose = () => {

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
  
        const data = new FormData(event.currentTarget);
  
        setDisabledButton(true);

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
        let logged_user_id = AuthData.data.id; // ID do usuário logado
        let module_id = 1; // ID do módulo
        let action = "escrever"; // Tipo de ação realizada
  
        setDisabledButton(false);

        AxiosApi.delete(`/api/admin-module-user/${data.get("user_id")}?auth=${logged_user_id}.${module_id}.${action}`)
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
  
          setDisabledButton(false);
  
          handleClose();
  
        }, 2000);
  
      }
  
      /*
      * Rotina 4B
      * Tratamento da resposta de uma requisição falha
      */
      function errorServerResponseTreatment(response_data){
  
        setDisabledButton(false);

        let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
        setDisplayAlert({display: true, type: "error", message: error_message});
  
      }
  
// ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

return (
    <>
        <Tooltip title="Deletar">
            <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? false : true} onClick={handleClickOpen}>
                <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size = "sm"/>
            </IconButton>
        </Tooltip>

        {(props.selected_record.dom != null && open) && 

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>DELEÇÃO | USUÁRIO (ID: {props.selected_record.data_cells.user_id})</DialogTitle>

                {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
                <Box component="form" noValidate onSubmit={handleSubmitOperation} >

                    <DialogContent>

                    <DialogContentText mb={2}>
                      Todos os vínculos do usuário serão desfeitos, e todos os seus dados serão apagados do sistema.
                    </DialogContentText>

                        <TextField
                        margin="dense"
                        id="user_id"
                        name="user_id"
                        label="ID do usuário"
                        type="text"
                        fullWidth
                        variant="outlined"
                        inputProps={{
                            readOnly: true
                        }}
                        value={props.selected_record.data_cells.user_id}
                        sx={{mb: 2}}
                        />

                        <TextField
                        margin="dense"
                        id="name"
                        name="name"
                        label="Nome"
                        type="text"
                        fullWidth
                        variant="outlined"
                        inputProps={{
                            readOnly: true
                        }}
                        value={props.selected_record.data_cells.name}
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