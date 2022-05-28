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
import styled from '@emotion/styled';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-solid-svg-icons';
// Moment
import moment from 'moment';
// Custom
import { DateTimeInput } from '../../../date_picker/DateTimeInput';
import AxiosApi from '../../../../../services/AxiosApi';
import FormValidation from "../../../../../utils/FormValidation";
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';

const Input = styled('input')({
    display: 'none',
});

export const UpdateBatteryFormulary = React.memo(({ ...props }) => {

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

    // States dos inputs de data
    const [chargeDate, setChargeDate] = React.useState(moment());

    // State of uploaded image
    const [uploadedImage, setUploadedImage] = React.useState(null);

    // Referencia ao componente de imagem
    const htmlImage = React.useRef();

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

        if (formValidate(data)) {

            setDisabledButton(true);

            requestServerOperation(data);

        }

    }

    function handleUploadedImage(event) {

        const uploaded_file = event.currentTarget.files[0];

        if (uploaded_file && uploaded_file.type.startsWith('image/')) {

            htmlImage.current.src = "";
            htmlImage.current.src = URL.createObjectURL(uploaded_file);

            setUploadedImage(uploaded_file);
        }

    }

    /*
    * Rotina 2
    */
    function formValidate(formData) {

        let nameValidation = FormValidation(formData.get("name"), 3, null, null, null);
        let manufacturerValidation = FormValidation(formData.get("manufacturer"), 3, null, null, null);
        let modelValidation = FormValidation(formData.get("model"), null, null, null, null);
        let serialNumberValidation = FormValidation(formData.get("serial_number"), null, null, null, null);
        let lastChargeValidation = chargeDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data" };
        let imageValidation = uploadedImage == null ? { error: true, message: "Uma imagem precisa ser selecionada" } : { error: false, message: "" };

        setErrorDetected({
            image: imageValidation.error,
            name: nameValidation.error,
            manufacturer: manufacturerValidation.error,
            model: modelValidation.error,
            serial_number: serialNumberValidation.error,
            last_charge: lastChargeValidation.error
        });


        setErrorMessage({
            image: imageValidation.message,
            name: nameValidation.message,
            manufacturer: manufacturerValidation.message,
            model: modelValidation.message,
            serial_number: serialNumberValidation.message,
            last_charge: lastChargeValidation.message
        });

        if (nameValidation.error || manufacturerValidation.error || modelValidation.error || serialNumberValidation.error || lastChargeValidation.error || imageValidation.error) {

            return false;

        } else {

            return true;

        }

    }


    /*
    * Rotina 3
    */
    function requestServerOperation(data) {

        const image = uploadedImage == null ? props.record.image : uploadedImage;

        data.append("image", image);
        data.append("last_charge", moment(chargeDate).format('YYYY-MM-DD hh:mm:ss'));

        AxiosApi.post(`/api/equipments-module-battery/${data.get("battery_id")}`, data)
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

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let input_errors = {
            image: { error: false, message: null },
            name: { error: false, message: null },
            manufacturer: { error: false, message: null },
            model: { error: false, message: null },
            serial_number: { error: false, message: null },
            last_charge: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
        for (let prop in response_data.errors) {

            input_errors[prop] = {
                error: true,
                message: response_data.errors[prop][0]
            }

        }

        setErrorDetected({
            image: input_errors.image.error,
            name: input_errors.name.error,
            manufacturer: input_errors.manufacturer.error,
            model: input_errors.model.error,
            serial_number: input_errors.serial_number.error,
            last_charge: input_errors.last_charge.error
        });

        setErrorMessage({
            image: input_errors.image.message,
            name: input_errors.name.message,
            manufacturer: input_errors.manufacturer.message,
            model: input_errors.model.message,
            serial_number: input_errors.serial_number.message,
            last_charge: input_errors.last_charge.error
        });

    }

    return (
        <>
            <Tooltip title="Editar">
                <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["6"].profile_powers.escrever == 1 ? false : true}>
                    <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["6"].profile_powers.escrever == 1 ? "#00713A" : "#808991"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
                <DialogTitle>CADASTRO DE BATERIA | ID: {props.record.battery_id}</DialogTitle>

                <Box component="form" noValidate onSubmit={handleDroneRegistrationSubmit} >

                    <DialogContent>

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

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <DateTimeInput
                                event={setChargeDate}
                                label={"Data da última carga"}
                                helperText={errorMessage.last_charge}
                                error={errorDetected.last_charge}
                                defaultValue={props.record.last_charge}
                                operation={"create"}
                                read_only={false}
                            />
                        </Box>

                        <Box sx={{ mt: 2, display: 'flex' }}>
                            <label htmlFor="contained-button-file">
                                <Input accept=".png, .jpg, .svg" id="contained-button-file" multiple type="file" name="flight_log_file" onChange={handleUploadedImage} />
                                <Button variant="contained" component="span" color={errorDetected.image ? "error" : "primary"} startIcon={<FontAwesomeIcon icon={faFile} color={"#fff"} size="sm" />}>
                                    {errorDetected.image ? errorMessage.image : "Escolher imagem"}
                                </Button>
                            </label>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <img ref={htmlImage} style={{ borderRadius: 10, width: "190px" }} src={props.record.image_url}></img>
                        </Box>

                    </DialogContent>

                    {displayAlert.display &&
                        <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                    }

                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" disabled={disabledButton} variant="contained">Confirmar atualização</Button>
                    </DialogActions>

                </Box>

            </Dialog>
        </>
    )

});