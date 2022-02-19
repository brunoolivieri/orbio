import successImage from "../../assets/images/Success/success.png";
import errorImage from "../../assets/images/Error/error.png";
import emailImage from "../../assets/images/Email/email.png";

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';

export function InformativeModal({...operation}){

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // Função para abrir o modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Função para fechar o modal
    const handleClose = () => {
        setOpen(false);
    };

    //console.log(operation)

    let modalImage = "";

    if(operation.type === "registration" && operation.status){

        modalImage = successImage;

    }else if(operation.type === "send_code" && operation.status){

        modalImage = emailImage;

    }else if(operation.type === "change_password" && operation.status){

        modalImage = successImage;

    }else if(!operation.status){

        modalImage = errorImage;

    }

    // Por que esse comando é executado mais vezes que o número total de setStates?
    // console.log(operation)

    return(
        <div>
        <Dialog
          open={true}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <Box sx={{ display: 'flex' }} justifyContent="center" >
              <img src={modalImage} width={100} />
            </Box>
            <DialogTitle id="alert-dialog-title" textAlign="center">
              {operation.tittle}
            </DialogTitle>
            <DialogContentText id="alert-dialog-description">
                {operation.message}
            </DialogContentText>
          </DialogContent>
          {(operation.type === "token_jwt" && !operation.status) &&
            <DialogActions style={{justifyContent: 'center'}}>
                <Button> <a href = "sistema/sair">Voltar para o login</a> </Button>
            </DialogActions>  
          }
        </Dialog>
      </div>  
    )

}