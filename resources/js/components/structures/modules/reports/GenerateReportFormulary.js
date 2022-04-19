// IMPORTAÇÃO DOS COMPONENTES REACT
import { useState} from 'react';
import * as React from 'react';

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';

// IMPORTAÇÃO DOS ÍCONES DO FONTS AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import AxiosApi from '../../../../services/AxiosApi';

export function GenerateReportFormulary({...props}){

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = useState(false);

    // State do tipo de relatório
    const [reportType, setReportType] = useState("BASIC");

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Função para abrir o modal
    const handleClickOpen = () => {
      setOpen(true);
    }

    // Função para fechar o modal
    const handleClose = () => {

        setDisplayAlert({display: false, type: "", message: ""});
        setDisabledButton(false);
  
        setOpen(false);

    };

    // Função para atualizar o registro
    const handleSubmitOperation = (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        if(dataValidate(data)){

        setDisabledButton(true);

        requestServerOperation(data, operation);

    }


    }

    function dataValidate(formData){


    }

    function requestServerOperation(data){


    }

    function serverResponseTreatment(response){

    }

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //

  return (
    <>

      <Tooltip title="Baixar relatório">
        <IconButton disabled={AuthData.data.user_powers["4"].profile_powers.ler == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faFileArrowDown} size = "sm" color={AuthData.data.user_powers["4"].profile_powers.ler == 1 ? "green" : "#808991"} />
        </IconButton>
      </Tooltip> 
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>DOWNLOAD DO RELATÓRIO</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate onSubmit={handleSubmitOperation} >

          <DialogContent>
            <DialogContentText>
              Formulário para download do documento do relatório de ID {props.data.report_id}.
            </DialogContentText>

          </DialogContent>

          {displayAlert.display && 
              <Alert severity={displayAlert.type} variant="filled">{displayAlert.message}</Alert> 
          }
          
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
          </DialogActions>

        </Box>

        
      </Dialog>
    </>

  );

}