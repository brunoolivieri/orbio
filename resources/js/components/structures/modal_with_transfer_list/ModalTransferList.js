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
import { Alert } from '@mui/material';

// Custom Transfer List
import { TransferList } from '../transfer_list/TransferList';
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

  // State dos planos selecionados
  const [selectedItems, setSelectedItems] = React.useState([]);

  // State da mensagem do alerta
  const [displayAlert, setDisplayAlert] = React.useState({display: false, type: "", message: ""});

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    props.set_selected_items(selectedItems);
    setOpen(false);
  };

// ============================================================================== FUNÇÕES/ROTINAS ============================================================================== //

  function handleSubmitList(){

    if(selectedItems.length > 0){

      props.set_selected_items(selectedItems);

      setOpen(false);

    }else{

      setDisplayAlert({display: true, type: "error", message: "Erro! Nenhum plano de vôo foi selecionado."});

    }

  }

// ============================================================================== ESTRUTURAÇÃO ============================================================================== //

  return (
    <>
      <Button 
      variant="contained" 
      onClick={handleClickOpen} 

      >
        {props.open_button} 
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

          <TransferList  axios_url = {props.data_source} default_selections = {props.default} right_items = {{state: selectedItems, setter: setSelectedItems}} />

        </DialogContent>

        {displayAlert.display && 
          <Alert severity={displayAlert.type}>{displayAlert.message}</Alert> 
        }

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
