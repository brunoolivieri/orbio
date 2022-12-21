import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, DialogContentText, Alert, LinearProgress, List, ListItem, ListItemText, ListSubheader, Divider } from '@mui/material';
// Custom
import { useAuthentication } from '../../../../../context/InternalRoutesAuth/AuthenticationContext';
import { DroneConnectionConfig } from '../modal/DroneConnectionConfig';
import { DroneLogsList } from '../modal/DroneLogsList';
import axios from '../../../../../../services/AxiosApi';
// Fonts awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const initialConnection = { ssid: "EMBRAPA-BV", ip: "201.49.23.53", ssh_port: 22, http_port: 3000 };
const initialDisplatAlert = { display: false, type: "", message: "" };

export const CreateLog = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [connection, setConnection] = React.useState(initialConnection);
    const [setLogs] = React.useState([]);
    const [selectedLogs, setSelectedLogs] = React.useState([]);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleSubmit() {

        setLoading(true);

        const ip = connection.ip;
        const http_port = connection.http_port;

        axios.post(`/api/plans-module-logs?ip=${ip}&http_port=${http_port}`, {
            logs: selectedLogs
        })
            .then(function (response) {
                props.reloadTable((old) => !old);
                setDisplayAlert({ display: true, type: "success", message: response.data.message });
                setTimeout(() => {
                    handleClose();
                }, 2000);
            })
            .catch(function (error) {
                setDisplayAlert({ display: true, type: "error", message: error.response.data.message });
            })
            .finally(() => {
                setLoading(false);
            })
    }

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setDisplayAlert({ display: false, type: "", message: "" });
        setLogs([]);
        setSelectedLogs([]);
        setOpen(false);
    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Tooltip title="Novo Log">
                <IconButton onClick={handleClickOpen} disabled={!AuthData.data.user_powers["4"].profile_powers.write == 1}>
                    <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["4"].profile_powers.write == 1 ? "#00713A" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>DOWNLOAD DE LOG</DialogTitle>
                <Divider />

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

                {loading && <LinearProgress />}

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" disabled={selectedLogs.length === 0 || loading} variant="contained" onClick={handleSubmit}>Salvar</Button>
                </DialogActions>

            </Dialog >
        </>
    );
});
