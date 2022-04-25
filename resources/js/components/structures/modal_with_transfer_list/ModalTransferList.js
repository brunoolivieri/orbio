import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

import { useEffect, useState } from 'react';

// Custom Transfer List
import { TransferList } from '../transfer_list/TransferList';
import AxiosApi from '../../../services/AxiosApi';
import { useAuthentication } from '../../context/InternalRoutesAuth/AuthenticationContext';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export function ModalTransferList({...props}) {

// ============================================================================== STATES E OUTROS VALORES ============================================================================== //

  const [open, setOpen] = React.useState(false);

  // Utilizador do state global de autenticação
  const {AuthData, setAuthData} = useAuthentication();
  
  // State da fonte dos dados
  const [axiosURL] = useState(props.data_source);

  // State do carregamento dos dados do input de select
  const [selectOptions, setSelectOptions] = useState({status: {loading: true, success: false}, records: null, default_option: "Carregando", label_text: props.label_text});

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

// ============================================================================== FUNÇÕES/ROTINAS ============================================================================== //

  useEffect(() => {

    // Comunicação com o backend
    // Para recuperação dos dados que formam o input de seleção de perfis no formulário de registro
    AxiosApi.get(axiosURL, {
      access: AuthData.data.access
      })
      .then(function (response) {

      if(response.status === 200){

        //console.log(response.data)

        setSelectOptions({status: {loading: false, success: true}, records: response.data, default_option: "Escolha uma opção", label_text: props.label_text});

      }else{

        setSelectOptions({status: {loading: false, success: false}, default_option: "Erro", label_text: props.label_text});

      }

      })
      .catch(function (error) {

        console.log(error)

        setSelectOptions({status: {loading: false, success: false}, default_option: "Erro", label_text: props.label_text});

      });

  },[]);

  function handleSubmitList(){


  }

// ============================================================================== ESTRUTURAÇÃO ============================================================================== //

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen} disabled={(selectOptions.status.loading || !selectOptions.status.success) ? true : false}>
        {selectOptions.status.loading ? "Carregando..." : (!selectOptions.status.success ? "Erro!" : props.open_button_text)} 
      </Button>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {props.modal_title}
        </BootstrapDialogTitle>
        <DialogContent dividers>

            {(selectOptions.status.loading == false && selectOptions.status.success) && 
              <TransferList values = {selectOptions} />
            }

        </DialogContent>
        <DialogActions>
          <Button variant = "outlined" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant = "contained" autoFocus onClick={handleSubmitList}>
            Salvar alterações
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
