// IMPORTAÇÃO DOS COMPONENTES REACT
import { useState, useEffect } from 'react';
import * as React from 'react';

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';

import { Modal } from '@mui/material';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { Map } from './MapBoxGL/Map';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "80vw",
  height: "80vh",
  background: '#fff',
  borderRadius: "5px",
  padding: "10px",
};

export function MapModal({...props}){

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = useState(false);

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Função para abrir o modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Função para fechar o modal
    const handleClose = () => {
      setOpen(false);
    };

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <RemoveRedEyeIcon />
      </IconButton>

      <Modal
      open={open} 
      onClose={handleClose} 
      >

        <Box style={style}>

          <Map />

          <DialogActions sx={{position: "absolute", right: "0px"}}>
            <Button onClick={handleClose} sx={{background: "#fff"}}>Cancelar</Button>
            <Button sx={{background: "#fff"}}>Gerar plano</Button>
          </DialogActions>

        </Box>

      </Modal>
    </>

  );

}