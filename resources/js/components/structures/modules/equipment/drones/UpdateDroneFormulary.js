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
import LinearProgress from '@mui/material/LinearProgress';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-solid-svg-icons';
// Custom
import AxiosApi from '../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../utils/FormValidation';
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';

const Input = styled('input')({
    display: 'none',
});

export const UpdateDroneFormulary = React.memo(({ ...props }) => {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    const { AuthData } = useAuthentication();

    const [controlledInput, setControlledInput] = React.useState({
        id: props.record.id,
        name: props.record.name,
        manufacturer: props.record.manufacturer,
        model: props.record.model,
        record_number: props.record.record_number,
        serial_number: props.record.serial_number,
        weight: props.record.weight,
        observation: props.record.observation
    });

    const [fieldError, setFieldError] = React.useState({ image: false, name: false, manufacturer: false, model: false, record_number: false, serial_number: false, weight: false, observation: false });
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ image: "", name: "", manufacturer: "", model: "", record_number: "", serial_number: "", weight: "", observation: "" });

    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

    const [loading, setLoading] = React.useState(false);

    const [open, setOpen] = React.useState(false);

    const [uploadedImage] = React.useState(null);

    const htmlImage = React.useRef();

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setFieldError({ image: false, name: false, manufacturer: false, model: false, record_number: false, serial_number: false, weight: false, observation: false });
        setFieldErrorMessage({ image: "", name: "", manufacturer: "", model: "", record_number: "", serial_number: "", weight: "", observation: "" });
        setDisplayAlert({ display: false, type: "", message: "" });
        setLoading(false);
        setOpen(false);
    }

    const handleDroneUpdateSubmit = (event) => {
        event.preventDefault();

        if (formularyDataValidation()) {

            setLoading(false);
            requestServerOperation();

        }

    }

    const handleUploadedImage = (event) => {

        const uploaded_file = event.currentTarget.files[0];

        if (uploaded_file && uploaded_file.type.startsWith('image/')) {

            htmlImage.current.src = "";
            htmlImage.current.src = URL.createObjectURL(uploaded_file);

            setControlledInput({ ...controlledInput, ["image"]: uploaded_file });
        }

    }

    const formularyDataValidation = () => {

        let nameValidation = FormValidation(controlledInput.name, 3, null, null, null);
        let manufacturerValidation = FormValidation(controlledInput.manufacturer, 3, null, null, null);
        let modelValidation = FormValidation(controlledInput.model, null, null, null, null);
        let recordNumberValidation = FormValidation(controlledInput.record_number, null, null, null, null);
        let serialNumberValidation = FormValidation(controlledInput.serial_number, null, null, null, null);
        let weightValidation = FormValidation(controlledInput.weight, null, null, null, null);
        let observationValidation = FormValidation(controlledInput.observation, 3, null, null, null);
        let imageValidation = uploadedImage == null ? { error: true, message: "Uma imagem precisa ser selecionada" } : { error: false, message: "" };

        setFieldError({
            image: imageValidation.error,
            name: nameValidation.error,
            manufacturer: manufacturerValidation.error,
            model: modelValidation.error,
            record_number: recordNumberValidation.error,
            serial_number: serialNumberValidation.error,
            weight: weightValidation.error,
            observation: observationValidation.error
        });


        setFieldErrorMessage({
            image: imageValidation.message,
            name: nameValidation.message,
            manufacturer: manufacturerValidation.message,
            model: modelValidation.message,
            record_number: recordNumberValidation.message,
            serial_number: serialNumberValidation.message,
            weight: weightValidation.message,
            observation: observationValidation.message
        });

        return !(nameValidation.error || manufacturerValidation.error || modelValidation.error || recordNumberValidation.error || serialNumberValidation.error || weightValidation.error || observationValidation.error || imageValidation.error);

    }

    const requestServerOperation = () => {

        const formData = new FormData();
        formData.append("name", controlledInput.name);
        formData.append("manufacturer", controlledInput.manufacturer);
        formData.append("model", controlledInput.model);
        formData.append("record_number", controlledInput.record_number);
        formData.append("serial_number", controlledInput.serial_number);
        formData.append("weight", controlledInput.weight);
        formData.append("observation", controlledInput.observation);
        formData.append("image", uploadedImage);

        AxiosApi.post(`/api/equipments-module-drone`, formData)
            .then(function (response) {
                setLoading(false);
                successServerResponseTreatment(response);
            })
            .catch(function (error) {
                setLoading(false);
                errorServerResponseTreatment(error.response);
            });
    }

    function successServerResponseTreatment(response) {

        setDisplayAlert({ display: true, type: "success", message: response.data.message });

        setTimeout(() => {
            props.record_setter(null);
            props.reload_table();
            setLoading(false);
            handleClose();
        }, 2000);

    }

    function errorServerResponseTreatment(response) {

        const error_message = response.data.message ? response.data.message : "Erro do servidor";
        setDisplayAlert({ display: true, type: "error", message: error_message });

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let request_errors = {
            image: { error: false, message: null },
            name: { error: false, message: null },
            manufacturer: { error: false, message: null },
            model: { error: false, message: null },
            record_number: { error: false, message: null },
            serial_number: { error: false, message: null },
            weight: { error: false, message: null },
            observation: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
        for (let prop in response.data.errors) {

            request_errors[prop] = {
                error: true,
                message: response.data.errors[prop][0]
            }

        }

        setFieldError({
            image: request_errors.image.error,
            name: request_errors.name.error,
            manufacturer: request_errors.manufacturer.error,
            model: request_errors.model.error,
            record_number: request_errors.record_number.error,
            serial_number: request_errors.serial_number.error,
            weight: request_errors.weight.error,
            observation: request_errors.observation.error
        });

        setFieldErrorMessage({
            image: request_errors.image.message,
            name: request_errors.name.message,
            manufacturer: request_errors.manufacturer.message,
            model: request_errors.model.message,
            record_number: request_errors.record_number.message,
            serial_number: request_errors.serial_number.message,
            weight: request_errors.weight.message,
            observation: request_errors.observation.message
        });

    }

    const handleInputChange = (event) => {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }

    return (
        <>
            <Tooltip title="Editar">
                <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["6"].profile_powers.write == 1 ? false : true}>
                    <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["6"].profile_powers.write == 1 ? "#00713A" : "#808991"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
                <DialogTitle>ATUALIZAÇÃO | ID: {props.record.id}</DialogTitle>

                <Box component="form" noValidate onSubmit={handleDroneUpdateSubmit} >

                    <DialogContent>

                        <TextField
                            type="text"
                            margin="dense"
                            label="ID do drone"
                            fullWidth
                            variant="outlined"
                            required
                            id="id"
                            name="id"
                            helperText={fieldErrorMessage.name}
                            error={fieldError.name}
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
                            helperText={fieldErrorMessage.name}
                            error={fieldError.name}
                            defaultValue={props.record.name}
                            onChange={handleInputChange}
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
                            helperText={fieldErrorMessage.manufacturer}
                            error={fieldError.manufacturer}
                            defaultValue={props.record.manufacturer}
                            onChange={handleInputChange}
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
                            helperText={fieldErrorMessage.model}
                            error={fieldError.model}
                            defaultValue={props.record.model}
                            onChange={handleInputChange}
                        />

                        <TextField
                            type="text"
                            margin="dense"
                            label="Número do registro"
                            fullWidth
                            variant="outlined"
                            required
                            id="record_number"
                            name="record_number"
                            helperText={fieldErrorMessage.record_number}
                            error={fieldError.record_number}
                            defaultValue={props.record.record_number}
                            onChange={handleInputChange}
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
                            helperText={fieldErrorMessage.serial_number}
                            error={fieldError.serial_number}
                            defaultValue={props.record.serial_number}
                            onChange={handleInputChange}
                        />

                        <TextField
                            type="text"
                            margin="dense"
                            label="Peso (KG)"
                            fullWidth
                            variant="outlined"
                            required
                            id="weight"
                            name="weight"
                            helperText={fieldErrorMessage.weight}
                            error={fieldError.weight}
                            defaultValue={props.record.weight}
                            onChange={handleInputChange}
                        />

                        <TextField
                            type="text"
                            margin="dense"
                            label="Observação"
                            fullWidth
                            variant="outlined"
                            required
                            id="observation"
                            name="observation"
                            helperText={fieldErrorMessage.observation}
                            error={fieldError.observation}
                            defaultValue={props.record.observation}
                            onChange={handleInputChange}
                        />

                        <Box sx={{ mt: 2, display: 'flex' }}>
                            <label htmlFor="contained-button-file">
                                <Input accept=".png, .jpg, .svg" id="contained-button-file" multiple type="file" name="flight_log_file" onChange={handleUploadedImage} />
                                <Button variant="contained" component="span" color={fieldError.image ? "error" : "primary"} startIcon={<FontAwesomeIcon icon={faFile} color={"#fff"} size="sm" />}>
                                    {fieldError.image ? fieldErrorMessage.image : "Escolher imagem"}
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

                    {loading && <LinearProgress />}

                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" disabled={loading} variant="contained">Confirmar atualização</Button>
                    </DialogActions>

                </Box>

            </Dialog>
        </>
    )
});