// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import LinearProgress from '@mui/material/LinearProgress';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { DroneConnectionConfig } from '../../modals/dialog/DroneConnectionConfig';
import { DroneLogsList } from '../../modals/fullscreen/DroneLogsList';
import AxiosApi from '../../../../services/AxiosApi';
// Fonts awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export const CreateReportFormulary = React.memo(() => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [open, setOpen] = React.useState(false);
  const [downloadLoading, setDownloadLoading] = React.useState(false);
  const [connection, setConnection] = React.useState({ ssid: "EMBRAPA-BV", ip: "201.49.23.53", ssh_port: 22, http_port: 3000 });
  const [setLogs] = React.useState([]);
  const [selectedLogs, setSelectedLogs] = React.useState([]);
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  const handleDownloadLogs = (e) => {
    e.preventDefault();

    setDownloadLoading(true);

    const ip = connection.ip;
    const http_port = connection.http_port;

    AxiosApi.post(`api/download-selected-logs?ip=${ip}&http_port=${http_port}`, {
      logs: selectedLogs
    })
      .then(function (response) {

        setDownloadLoading(false);
        setDisplayAlert({ display: true, type: "success", message: response.data.message });

        setTimeout(() => {
          handleClose();
        }, 2000);

      })
      .catch(function (error) {

        console.log(error)
        setDownloadLoading(false);
        const error_message = error.response.data.message ? error.response.data.message : "Erro do servidor";
        setDisplayAlert({ display: true, type: "error", message: error_message });

      });
  }

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

      <Tooltip title="Novo Log">
        <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["4"].profile_powers.write == 1 ? false : true}>
          <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["4"].profile_powers.write == 1 ? "#00713A" : "#808991"} size="sm" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
        <DialogTitle>DOWNLOAD DE LOG</DialogTitle>

        <Box component="form" noValidate onSubmit={handleDownloadLogs} >

          <DialogContent>

            <DialogContentText sx={{ mb: 2 }}>
              A conexão deve ser realizada com o drone, e em seguida os logs disponíveis poderão ser selecionados de acordo com os seus critérios.
            </DialogContentText>

            {/* Modals */}
            <Box sx={{ display: 'flex' }}>
              <Box>
                <DroneLogsList
                  source={connection}
                  setLogs={setLogs}
                  selectedLogs={selectedLogs}
                  setSelectedLogs={setSelectedLogs}
                />
              </Box>
              <Box sx={{ ml: 1 }}>
                <DroneConnectionConfig
                  data={connection}
                  setConnection={setConnection}
                />
              </Box>
            </Box>

            {selectedLogs.length > 0 &&
              <List
                sx={{
                  maxWidth: '100%',
                  minWidth: '100%',
                  bgcolor: '#F5F5F5',
                  position: 'relative',
                  overflow: 'auto',
                  maxHeight: 200,
                  '& ul': { padding: 0 },
                  mt: 2
                }}
                subheader={<li />}
              >
                <ul>
                  <ListSubheader sx={{ bgcolor: '#1976D2', color: '#fff', fontWeight: 'bold' }}>{"Logs selecionados: " + selectedLogs.length}</ListSubheader>
                  {selectedLogs.map((log_name, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={log_name} />
                    </ListItem>
                  ))}
                </ul>

              </List>
            }

          </DialogContent>

          {displayAlert.display &&
            <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
          }

          {downloadLoading && <LinearProgress />}

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={selectedLogs.length === 0 || downloadLoading} variant="contained">Download</Button>
          </DialogActions>

        </Box>

      </Dialog >
    </>
  );
});
