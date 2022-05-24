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
import styled from '@emotion/styled';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faFile } from '@fortawesome/free-solid-svg-icons';
// Custom
import AxiosApi from '../../../../../services/AxiosApi';
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';

const Input = styled('input')({
    display: 'none',
});

export const DeleteBatteryFormulary = React.memo(({ ...props }) => {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const { AuthData } = useAuthentication();

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = React.useState({ image: false, name: false, manufacturer: false, model: false, serial_number: false, last_charge: false });
    const [errorMessage, setErrorMessage] = React.useState({ image: "", name: "", manufacturer: "", model: "", serial_number: "", last_charge: false });

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = React.useState(false);

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Função para abrir o modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Função para fechar o modal
    const handleClose = () => {
        setErrorDetected({ image: false, name: false, manufacturer: false, model: false, serial_number: false, last_charge: false });
        setErrorMessage({ image: "", name: "", manufacturer: "", model: "", serial_number: "", last_charge: "" });
        setDisplayAlert({ display: false, type: "", message: "" });
        setDisabledButton(false);
        setOpen(false);
    };

    /*
    * Rotina 1
    */
    function handleDroneRegistrationSubmit(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        setDisabledButton(true);

        requestServerOperation(data);

    }

    function handleUploadedImage(event) {

        console.log(event.value)

    }


    /*
    * Rotina 3
    */
    function requestServerOperation(data) {

        // Dados para o middleware de autenticação 
        const logged_user_id = AuthData.data.id;
        const module_id = 6;
        const module_action = "escrever";

        AxiosApi.post(`/api/equipments-module-battery`, {
            auth: `${logged_user_id}.${module_id}.${module_action}`,
            image: "",
            name: data.get("name"),
            manufacturer: data.get("manufacturer"),
            model: data.get("model"),
            serial_number: data.get("serial_number"),
            last_charge: data.get("last_charge")
        })
            .then(function () {

                successServerResponseTreatment();

            })
            .catch(function (error) {

                errorServerResponseTreatment(error.response.data);

            });

    }

    /*
    * Rotina 3A
    */
    function successServerResponseTreatment() {

        setDisplayAlert({ display: true, type: "success", message: "Operação realizada com sucesso!" });

        setTimeout(() => {

            props.reload_table();
            setDisabledButton(false);
            handleClose();

        }, 2000);

    }

    /*
    * Rotina 3B
    */
    function errorServerResponseTreatment(response_data) {

        setDisabledButton(false);

        let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
        setDisplayAlert({ display: true, type: "error", message: error_message });

    }

    return (
        <>
            <Tooltip title="Editar">
                <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["6"].profile_powers.escrever == 1 ? false : true}>
                    <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["6"].profile_powers.escrever == 1 ? "#00713A" : "#808991"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
                <DialogTitle>DELEÇÃO DE BATERIA | ID: {props.record.battery_id}</DialogTitle>

                {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
                <Box component="form" noValidate onSubmit={handleDroneRegistrationSubmit} >

                    <DialogContent>

                        <DialogContentText sx={{ mb: 3 }}>
                            Formulário para criação de uma bateria.
                        </DialogContentText>

                        <Box sx={{ mb: 3 }}>
                            <label htmlFor="contained-button-file">
                                <Input accept=".png, .jpg, .svg" id="contained-button-file" multiple type="file" name="flight_log_file" onChange={handleUploadedImage} />
                                <Button variant="contained" component="span" color={errorDetected.image ? "error" : "primary"} startIcon={<FontAwesomeIcon icon={faFile} color={"#fff"} size="sm" />}>
                                    {errorDetected.image ? errorMessage.image : "Escolher imagem"}
                                </Button>
                            </label>
                        </Box>

                        <TextField
                            type="text"
                            margin="dense"
                            label="ID da bateria"
                            fullWidth
                            variant="outlined"
                            required
                            id="battery_id"
                            name="battery_id"
                            defaultValue={props.record.battery_id}
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
                            helperText={errorMessage.name}
                            error={errorDetected.name}
                            defaultValue={props.record.name}
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
                            helperText={errorMessage.manufacturer}
                            error={errorDetected.manufacturer}
                            defaultValue={props.record.manufacturer}
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
                            helperText={errorMessage.model}
                            error={errorDetected.model}
                            defaultValue={props.record.model}
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
                            helperText={errorMessage.serial_number}
                            error={errorDetected.serial_number}
                            defaultValue={props.record.serial_number}
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