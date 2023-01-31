// React
import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Alert, IconButton, Grid, FormControl, InputLabel, MenuItem, Select, Tooltip, Divider } from '@mui/material';
import { useSnackbar } from 'notistack';
// Fonts awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
// Lib
//import axios from '../../../../services/AxiosApi';

const initialControlledInput = {
    option: 'all'
}

export const ExportTableData = React.memo((props) => {

    // ============================================================================== STATES  ============================================================================== //

    const [open, setOpen] = React.useState(false);
    const [source, setSource] = React.useState(props.source);
    const [controlledInput, setControlledInput] = React.useState(initialControlledInput);
    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNCTIONS ============================================================================== //

    const handleClickOpen = () => {
        setOpen(true);
        setControlledInput(initialControlledInput);
    }

    const handleClose = () => {
        setDisplayAlert({ display: false, type: "", message: "" });
        setOpen(false);
    }

    function handleExport() {

        const url = source + "?limit=" + controlledInput.option;

        const data = {
            limit: controlledInput.option
        }

        axios.post(url, data, {
            responseType: 'blob'
        })
            .then((response) => {

                handleOpenSnackbar("Dados exportados com sucesso!", "success");

                // Create file link in browser's memory
                const blob = new Blob([response.data], {
                    type: 'application/octet-stream',
                });

                const filename = response.headers['content-disposition'].split('=')[1];

                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    let blobURL = window.URL.createObjectURL(blob);
                    let tempLink = document.createElement('a');
                    tempLink.style.display = 'none';
                    tempLink.href = blobURL;
                    tempLink.download = filename;
                    tempLink.click();
                    window.URL.revokeObjectURL(blobURL);
                }

                handleClose();
            })
            .catch((error) => {
                setDisplayAlert({ display: true, type: "error", message: error.response.data.message });
            });
    }

    function handleChange(event) {
        setControlledInput({ ...controlledInput, [event.target.name]: event.target.value });
    }

    function handleOpenSnackbar(text, variant) {
        enqueueSnackbar(text, { variant });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Tooltip title="Exportar">
                <IconButton onClick={handleClickOpen} >
                    <FontAwesomeIcon icon={faFileCsv} color="#007937" size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{props.type} | EXPORTAÇÃO</DialogTitle>
                <Divider />

                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Quantidade de registros</InputLabel>
                                <Select
                                    id="option"
                                    value={controlledInput.option}
                                    name="option"
                                    onChange={handleChange}
                                    label="Quantidade de registros"
                                >
                                    <MenuItem value={'all'}>Todos os registros</MenuItem>
                                    <MenuItem value={'10'}>10 registros</MenuItem>
                                    <MenuItem value={'25'}>25 registros</MenuItem>
                                    <MenuItem value={'50'}>50 registros</MenuItem>
                                    <MenuItem value={'100'}>100 registros</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                </DialogContent>

                {displayAlert.display &&
                    <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                }

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button variant='contained' onClick={handleExport}>EXPORTAR</Button>
                </DialogActions>

            </Dialog >
        </>
    );
})