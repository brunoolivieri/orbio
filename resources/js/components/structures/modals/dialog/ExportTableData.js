// React
import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Alert, IconButton, Grid, FormControl, InputLabel, MenuItem, Select, Tooltip, Typography } from '@mui/material';
// Custom
//import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
// Fonts awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
// Lib
//import axios from '../../../../services/AxiosApi';

const initialControlledInput = {
    option: 'all'
}

export const ExportTableData = React.memo((props) => {

    // ============================================================================== STATES  ============================================================================== //

    //const { AuthData } = useAuthentication();
    const [open, setOpen] = React.useState(false);
    const [source, setSource] = React.useState(props.source);
    const [controlledInput, setControlledInput] = React.useState(initialControlledInput);
    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

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
        console.log('EXPORT OPTION: ' + controlledInput.option)
    }

    function handleChange(event) {
        setControlledInput({ ...controlledInput, [event.target.name]: event.target.value });
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
                <DialogContent>

                    <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
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

                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button variant='contained' onClick={handleExport}>EXPORTAR</Button>
                </DialogActions>

            </Dialog >
        </>
    );
})