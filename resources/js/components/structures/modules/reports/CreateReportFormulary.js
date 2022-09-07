// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
// Custom
import AxiosApi from '../../../../services/AxiosApi';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../utils/FormValidation';
import { DroneConnectionConfig } from '../../modals/dialog/DroneConnectionConfig';
import { DroneLogsList } from '../../modals/fullscreen/DroneLogsList';
// Fonts awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Outros
import moment from 'moment';

const Input = styled('input')({
  display: 'none',
});

export const CreateReportFormulary = React.memo(({ ...props }) => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [open, setOpen] = React.useState(false);

  const [connection, setConnection] = React.useState({ ssid: "EMBRAPA-BV", ip: "201.49.23.53", ssh_port: 22, http_port: 3000 });
  const [setLogs] = React.useState([{}]);
  const [selectedLog, setSelectedLog] = React.useState(null);

  const [errorDetected, setErrorDetected] = React.useState({ flight_start_date: false, flight_end_date: false, flight_log: false, report_note: false }); // State para o efeito de erro - true ou false
  const [errorMessage, setErrorMessage] = React.useState({ flight_start_date: "", flight_end_date: "", flight_log: "", report_note: "" }); // State para a mensagem do erro - objeto com mensagens para cada campo
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
  const [disabledButton, setDisabledButton] = React.useState(true);
  const [startDate, setStartDate] = React.useState(moment());
  const [endDate, setEndDate] = React.useState(moment());


  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  React.useEffect(() => {

  }, []);

  const handleLogSubmit = (e) => {
    e.preventDefault();
  }

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setErrorDetected({ flight_start_date: false, flight_end_date: false, flight_log: false, report_note: false });
    setErrorMessage({ flight_start_date: "", flight_end_date: "", flight_log: "", report_note: "" });
    setDisplayAlert({ display: false, type: "", message: "" });
    setDisabledButton(false);
    setOpen(false);
  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //

  return (
    <>

      <Tooltip title="Carregar log">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["4"].profile_powers.write == 1 ? false : true}>
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["4"].profile_powers.write == 1 ? "#00713A" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
        <DialogTitle>DOWNLOAD DE LOG</DialogTitle>

        <Box component="form" noValidate onSubmit={handleLogSubmit} >

          <DialogContent>

            <DialogContentText sx={{ mb: 2 }}>
              A conexão deve ser realizada com o drone, e em seguida um dos logs disponíveis deve ser selecionado.
            </DialogContentText>

            <Box sx={{ display: 'flex' }}>
              <Box>
                <DroneLogsList
                  source={connection}
                  setLogs={setLogs}
                  setSelectedLog={setSelectedLog}
                />
              </Box>
              <Box sx={{ ml: 1 }}>
                <DroneConnectionConfig
                  data={connection}
                  setConnection={setConnection}
                />
              </Box>
            </Box>

            <TextField
              type="text"
              margin="dense"
              label="Log selecionado"
              fullWidth
              variant="outlined"
              name="log"
              disabled={true}
            />

          </DialogContent>

          {displayAlert.display &&
            <Alert severity={displayAlert.type} variant="filled">{displayAlert.message}</Alert>
          }

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={selectedLog == null} variant="contained">Salvar Log</Button>
          </DialogActions>

        </Box>

      </Dialog >
    </>
  );
});
