import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, DialogContentText, Alert, Stack, LinearProgress, List, ListItem, ListItemText, ListSubheader, Divider } from '@mui/material';
import DangerousIcon from '@mui/icons-material/Dangerous';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// Custom
import { LogImageGeneration } from '../modal/LogImageGeneration';
import { LogImageVisualization } from '../modal/LogImageVisualization';
import { useAuth } from '../../../../../context/Auth';
import axios from '../../../../../../services/AxiosApi';
// Fonts awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const initialDisplayAlert = { display: false, type: "", message: "" };

export const CreateLog = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [logs, setLogs] = React.useState([]);
    const [alert, setAlert] = React.useState(initialDisplayAlert);

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleSubmit() {

        if (!checkIfAllValidLogsHaveImages()) {
            return;
        }

        setLoading(true);

        const formData = new FormData();
        logs.forEach((log) => {

            if (log.verification.to_save) {

                // Create KML file
                const log_content = log.contents;
                const log_type = "application/xml";
                const blob = new Blob([log_content], { type: log_type });
                const logFile = new File([blob], log.filename, { type: log_type });

                formData.append("files[]", logFile);

                if (log.verification.is_valid) {
                    // Creating file through dataURL instead of blob - for test
                    const arr = log.image.dataURL.split(",");
                    const mime = arr[0].match(/:(.*?);/)[1];
                    const bstr = atob(arr[1]);
                    let n = bstr.length;
                    const u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    const image = new File([u8arr], log.image.fileNameImg, { type: mime });
                    formData.append("images[]", image);
                }
            }
        });

        requestServer(formData);
    }

    async function requestServer(formData) {
        try {
            const response = await axios.post("api/module/flight-plans-logs", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            successResponse(response);
        } catch (error) {
            setAlert({ display: true, type: "error", message: error.response.data.message });
        } finally {
            setLoading(false);
        }
    }

    function checkIfAllValidLogsHaveImages() {

        let validation = logs.reduce((acm, log) => {
            return acm && (Boolean(log.verification.is_valid) && Boolean(log.image));
        }, true);

        if (!validation) {
            setAlert({ display: true, type: "error", message: "Todos os logs válidos devem ter imagens." });
        }

        return validation;
    }

    function successResponse(response) {
        setAlert({ display: true, type: "success", message: response.data.message });
        setTimeout(() => {
            props.reloadTable((old) => !old);
            handleClose();
        }, 2000);
    }

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setAlert(initialDisplayAlert);
        setLogs([]);
        setOpen(false);
    }

    async function handleUploadLog(event) {

        const files = Array.from(event.currentTarget.files);
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files[]", file);
        });

        try {

            const response = await axios.post("api/action/flight-plans-logs/processing-uploads", formData);
            setLogs(response.data);

        } catch (e) {
            console.log(e);
            setAlert({ display: true, type: "error", message: e.response.data.message });
        }

    }

    // ============================================================================== JSX ============================================================================== //

    return (
        <>
            <Tooltip title="Novo Log">
                <IconButton onClick={handleClickOpen} disabled={!user.user_powers["4"].profile_powers.write == 1}>
                    <FontAwesomeIcon icon={faPlus} color={user.user_powers["4"].profile_powers.write == 1 ? "#00713A" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>UPLOAD DE LOG</DialogTitle>
                <Divider />

                <DialogContent>

                    <DialogContentText sx={{ mb: 2 }}>
                        Upload de arquivos de log de vôo no formato .kml ou .tlog.kmz. Certifique-se de gerar uma imagem para cada um que for processado com sucesso clicando no ícone de imagem.
                    </DialogContentText>

                    <Box mt={1}>
                        <Button variant="contained" component="label">
                            Upload de log
                            <input hidden accept="image/*" multiple type="file" onChange={handleUploadLog} />
                        </Button>
                    </Box>

                    {logs.length > 0 &&
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
                                <ListSubheader sx={{ bgcolor: '#1976D2', color: '#fff', fontWeight: 'bold' }}>{"Logs selecionados: " + logs.length}</ListSubheader>
                                {logs.map((log, index) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <Stack direction="row" spacing={1}>

                                                {log.verification.is_valid ?
                                                    <>
                                                        {/* Icon */}
                                                        <Tooltip title={log.verification.message}>
                                                            <IconButton>
                                                                <CheckCircleIcon color="success" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {/* Image generation map*/}
                                                        <LogImageGeneration actual_log={log} logs={logs} setLogs={setLogs} />
                                                        {/* Image visualization */}
                                                        {log.image &&
                                                            <LogImageVisualization actual_log={log} />
                                                        }
                                                    </>
                                                    :
                                                    <Tooltip title={log.verification.message}>
                                                        <IconButton>
                                                            <DangerousIcon color="error" />
                                                        </IconButton>
                                                    </Tooltip>
                                                }

                                            </Stack>
                                        }
                                    >
                                        <ListItemText primary={`Nome: ${log.filename}`} secondary={`Tamanho: ${log.size}`} />
                                    </ListItem>
                                ))}
                            </ul>

                        </List>
                    }

                </DialogContent>

                {alert.display &&
                    <Alert severity={alert.type}>{alert.message}</Alert>
                }

                {loading && <LinearProgress />}

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" disabled={logs.length === 0 || loading} variant="contained" onClick={handleSubmit}>Salvar</Button>
                </DialogActions>

            </Dialog >
        </>
    );
});
