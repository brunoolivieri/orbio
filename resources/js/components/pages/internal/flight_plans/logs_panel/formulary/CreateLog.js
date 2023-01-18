import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, DialogContentText, Alert, Stack, LinearProgress, List, ListItem, ListItemText, ListSubheader, Divider } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
// Custom
import { LogImageConfig } from '../modal/LogImageConfig';
import { useAuthentication } from '../../../../../context/InternalRoutesAuth/AuthenticationContext';
import axios from '../../../../../../services/AxiosApi';
// Fonts awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const initialDisplatAlert = { display: false, type: "", message: "" };
const kmlRegex = /^(?!.*\.tlog\.kml$).*\.kml$/;

export const CreateLog = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [selectedLogs, setSelectedLogs] = React.useState([]);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleSubmit() {

        setLoading(true);

        const formData = new FormData();

        selectedLogs.forEach((file) => {
            formData.append("files[]", file);
        })

        axios.post(`/api/plans-module-logs`, formData)
            .then(function (response) {
                successResponse(response);
            })
            .catch(function (error) {
                setDisplayAlert({ display: true, type: "error", message: error.response.data.message });
            })
            .finally(() => {
                setLoading(false);
            })
    }

    function successResponse(response) {
        setDisplayAlert({ display: true, type: "success", message: response.data.message });
        setTimeout(() => {
            props.reloadTable((old) => !old);
            setOpen(false);
        }, 2000);
    }

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setDisplayAlert({ display: false, type: "", message: "" });
        setSelectedLogs([]);
        setOpen(false);
    }

    async function handleUploadLog(event) {

        const files = event.currentTarget.files;

        // Filter .tlog.kml files
        const tlogKmlFiles = Array.from(files).filter((file) => !kmlRegex.test(file.name));
        // Filter .kml files
        let kmlFiles = Array.from(files).filter((file) => kmlRegex.test(file.name));

        if (tlogKmlFiles.length > 0) {

            const formData = new FormData();

            tlogKmlFiles.forEach((file) => {
                formData.append("files[]", file);
            })

            const response = await axios.post("api/kml-conversion", formData);

            console.log(response.data)

        }

        /*
        const selected_logs = Array.from(event.currentTarget.files);
        setSelectedLogs(selected_logs);
        */

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
                <DialogTitle>UPLOAD DE LOG</DialogTitle>
                <Divider />

                <DialogContent>

                    <DialogContentText sx={{ mb: 2 }}>
                        Texto
                    </DialogContentText>

                    <Box mt={1}>
                        <Button variant="contained" component="label">
                            Upload de log
                            <input hidden accept="image/*" multiple type="file" onChange={handleUploadLog} />
                        </Button>
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
                                {selectedLogs.map((logfile, index) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <Stack direction="row" spacing={1}>

                                                {!kmlRegex.test(logfile.name) &&
                                                    <CircularProgress />
                                                }

                                                <LogImageConfig log={logfile} is_valid={kmlRegex.test(logfile.name)} />

                                            </Stack>
                                        }
                                    >
                                        <ListItemText primary={logfile.name} secondary={'Tamanho: ' + logfile.size} />
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
