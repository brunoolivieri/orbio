import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
// Custom
import { FormValidation } from '../../../../utils/FormValidation';

export const DroneConnectionConfig = React.memo((props) => {

    const [open, setOpen] = React.useState(false);
    const [controlledInput, setControlledInput] = React.useState({ ssid: props.data.ssid, ip: props.data.ip, ssh_port: props.data.ssh_port, http_port: props.data.http_port });
    const [fieldError, setFieldError] = React.useState({ ssid: false, ip: false, ssh_port: false, http_port: false });
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ ssid: null, ip: null, ssh_port: null, http_port: null });

    const handleSave = (e) => {
        e.preventDefault();

        if (formularyDataValidate()) {

            props.setConnection(controlledInput);

        }


    }

    const formularyDataValidate = () => {

        const ssidValidation = FormValidation(controlledInput.ssid);
        const ipValidation = FormValidation(controlledInput.ip);
        const sshPortValidation = FormValidation(controlledInput.ssh_port);
        const httpPortValidation = FormValidation(controlledInput.http_port);

        setFieldError({
            ssid: props.data.ssid,
            ip: props.data.ip,
            ssh_port: props.data.ssh_port,
            http_port: props.data.http_port
        });

        setFieldErrorMessage({
            ssid: props.data.ssid,
            ip: props.data.ip,
            ssh_port: props.data.ssh_port,
            http_port: props.data.http_port
        });

        return !(ssidValidation.error || ipValidation.error || sshPortValidation.error || httpPortValidation.error);

    }

    const handleInputChange = (event) => {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <Tooltip title="Configurações">
                <IconButton onClick={handleClickOpen}>
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>CONFIGURAÇÕES DE CONEXÃO</DialogTitle>
                <DialogContent>

                    <DialogContentText sx={{ mb: 2 }}>
                        Defina os dados para realizar a conexão com o drone.
                    </DialogContentText>

                    <Box component="form" noValidate onSubmit={handleSave} >

                        <TextField
                            autoFocus
                            margin="dense"
                            id="ssid"
                            label="SSID"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={controlledInput.ssid}
                            onChange={handleInputChange}
                            helperText={fieldErrorMessage.ssid}
                            error={fieldError.ssid}
                        />

                        <TextField
                            autoFocus
                            margin="dense"
                            id="ip"
                            label="IP"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={controlledInput.ip}
                            onChange={handleInputChange}
                            helperText={fieldErrorMessage.ip}
                            error={fieldError.ip}
                        />

                        <TextField
                            autoFocus
                            margin="dense"
                            id="ssh_port"
                            label="SSH Port"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={controlledInput.ssh_port}
                            onChange={handleInputChange}
                            helperText={fieldErrorMessage.ssh_port}
                            error={fieldError.ssh_port}
                        />

                        <TextField
                            autoFocus
                            margin="dense"
                            id="http_port"
                            label="HTTP Port"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={controlledInput.http_port}
                            onChange={handleInputChange}
                            helperText={fieldErrorMessage.http_port}
                            error={fieldError.http_port}
                        />

                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleClose}>Salvar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
});
