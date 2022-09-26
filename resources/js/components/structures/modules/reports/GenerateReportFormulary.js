// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Alert, DialogContentText, Divider } from '@mui/material';
import { IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';

export const GenerateReportFormulary = React.memo(() => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [open, setOpen] = React.useState(false);
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {

    setDisplayAlert({ display: false, type: "", message: "" });

    setOpen(false);

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //

  return (
    <>

      <Tooltip title="Gerar relatório">
        <IconButton disabled={AuthData.data.user_powers["4"].profile_powers.read == 1 ? false : true} onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faFileCirclePlus} size="sm" color={AuthData.data.user_powers["4"].profile_powers.read == 1 ? "green" : "#808991"} />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }} fullWidth>
        <DialogTitle>GERAÇÃO DE RELATÓRIO</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate>

          <DialogContent>

            <Box mb={2}>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="name"
                    name="name"
                    label="Nome do relatório"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    id="email"
                    name="email"
                    label="Cliente"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    id="email"
                    name="email"
                    label="Região"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    id="email"
                    name="email"
                    label="Fazenda"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>

            <Box mb={2}>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="name"
                    name="name"
                    label="Área total aplicada"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    id="email"
                    name="email"
                    label="Data da aplicação"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    id="email"
                    name="email"
                    label="Número da aplicação"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    id="email"
                    name="email"
                    label="Ovos/Ha"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>

            </Box>

            <Box>

              <Typography component={'p'} mb={1}>Informe a data da aplicação para carregar os dados climáticos.</Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="name"
                    name="name"
                    label="Temperatura (Cº)"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    id="email"
                    name="email"
                    label="Umidade"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    id="email"
                    name="email"
                    label="Velocidade do vento (Km/h)"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    id="email"
                    name="email"
                    label="Responsável"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>

            </Box>

          </DialogContent>

          {displayAlert.display &&
            <Alert severity={displayAlert.type} variant="filled">{displayAlert.message}</Alert>
          }

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">Visualizar</Button>
            <Button type="submit" variant="contained">Confirmar e salvar</Button>
          </DialogActions>

        </Box>


      </Dialog>
    </>

  );

});