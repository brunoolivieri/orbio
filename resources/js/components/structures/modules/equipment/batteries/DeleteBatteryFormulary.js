// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
// Custom
import AxiosApi from '../../../../../services/AxiosApi';
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';

export const DeleteBatteryFormulary = React.memo(({ ...props }) => {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    const { AuthData } = useAuthentication();

    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

    const [disabledButton, setDisabledButton] = React.useState(false);

    const [open, setOpen] = React.useState(false);

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setDisplayAlert({ display: false, type: "", message: "" });
        setDisabledButton(false);
        setOpen(false);
    };

    const handleDroneRegistrationSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        setDisabledButton(true);

        requestServerOperation(data);

    }

    const requestServerOperation = (data) => {

        AxiosApi.delete(`/api/equipments-module-battery/${data.get("id")}`)
            .then(function () {

                successServerResponseTreatment();

            })
            .catch(function (error) {

                errorServerResponseTreatment(error.response.data);

            });

    }

    const successServerResponseTreatment = () => {

        setDisplayAlert({ display: true, type: "success", message: "Operação realizada com sucesso!" });

        setTimeout(() => {

            props.reload_table();
            setDisabledButton(false);
            handleClose();

        }, 2000);

    }

    const errorServerResponseTreatment = (response_data) => {

        setDisabledButton(false);

        let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
        setDisplayAlert({ display: true, type: "error", message: error_message });

    }

    return (
        <>
            <Tooltip title="Editar">
                <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["6"].profile_powers.write == 1 ? false : true}>
                    <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["6"].profile_powers.write == 1 ? "#00713A" : "#808991"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
                <DialogTitle>DELEÇÃO DE BATERIA | ID: {props.record.battery_id}</DialogTitle>

                <Box component="form" noValidate onSubmit={handleDroneRegistrationSubmit} >

                    <DialogContent>

                        <TextField
                            type="text"
                            margin="dense"
                            label="ID da bateria"
                            fullWidth
                            variant="outlined"
                            required
                            id="id"
                            name="id"
                            defaultValue={props.record.id}
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                        <TextField
                            type="text"
                            margin="dense"
                            label="Nome"
                            fullWidth
                            variant="outlined"
                            required
                            id="name"
                            name="name"
                            defaultValue={props.record.name}
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                        <TextField
                            type="text"
                            margin="dense"
                            label="Fabricante"
                            fullWidth
                            variant="outlined"
                            required
                            id="manufacturer"
                            name="manufacturer"
                            defaultValue={props.record.manufacturer}
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                        <TextField
                            type="text"
                            margin="dense"
                            label="Modelo"
                            fullWidth
                            variant="outlined"
                            required
                            id="model"
                            name="model"
                            defaultValue={props.record.model}
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                        <TextField
                            type="text"
                            margin="dense"
                            label="Número Serial"
                            fullWidth
                            variant="outlined"
                            required
                            id="serial_number"
                            name="serial_number"
                            defaultValue={props.record.serial_number}
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                    </DialogContent>

                    {displayAlert.display &&
                        <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                    }

                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" disabled={disabledButton} variant="contained">Confirmar deleção</Button>
                    </DialogActions>

                </Box>

            </Dialog>
        </>
    )

});