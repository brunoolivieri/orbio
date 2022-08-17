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
import { DateTimeSingle } from '../../../date_picker/DateTimeSingle';
import AxiosApi from '../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../utils/FormValidation';
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import LinearProgress from '@mui/material/LinearProgress';

const Input = styled('input')({
    display: 'none',
});

export const UpdateBatteryFormulary = React.memo((props) => {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    const { AuthData } = useAuthentication();

    const [controlledInput, setControlledInput] = React.useState({ id: props.record.id, name: props.record.name, manufacturer: props.record.manufacturer, model: props.record.model, serial_number: props.record.serial_number, last_charge: props.record.last_charge, image: "" });

    const [fieldError, setFieldError] = React.useState({ name: false, manufacturer: false, model: false, serial_number: false, last_charge: false, image: false });
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ name: "", manufacturer: "", model: "", serial_number: "", last_charge: "", image: "" });

    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

    const [loading, setLoading] = React.useState(false);

    const [uploadedImage, setUploadedImage] = React.useState(null);

    const [open, setOpen] = React.useState(false);

    const [chargeDate, setChargeDate] = React.useState(moment());

    const htmlImage = React.useRef();

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setFieldError({ name: false, manufacturer: false, model: false, serial_number: false, last_charge: false, image: false });
        setFieldErrorMessage({ name: "", manufacturer: "", model: "", serial_number: "", last_charge: "", image: "" });
        setDisplayAlert({ display: false, type: "", message: "" });
        setControlledInput({ name: "", manufacturer: "", model: "", serial_number: "", last_charge: "" });
        setLoading(false);
        setOpen(false);
    }

    const handleBatteryUpdateSubmit = (event) => {
        event.preventDefault();

        if (formularyDataValidation()) {

            setLoading(true);
            requestServerOperation();

        }

    }

    const formularyDataValidation = () => {

        let nameValidation = FormValidation(controlledInput.name, 3);
        let manufacturerValidation = FormValidation(controlledInput.manufacturer, 3);
        let modelValidation = FormValidation(controlledInput.model);
        let serialNumberValidation = FormValidation(controlledInput.serial_number);
        let lastChargeValidation = chargeDate == null ? { error: true, message: "A data da última carga precisa ser informada" } : { error: false, message: "" };

        setFieldError({
            image: false,
            name: nameValidation.error,
            manufacturer: manufacturerValidation.error,
            model: modelValidation.error,
            serial_number: serialNumberValidation.error,
            last_charge: lastChargeValidation.error
        });


        setFieldErrorMessage({
            image: "",
            name: nameValidation.message,
            manufacturer: manufacturerValidation.message,
            model: modelValidation.message,
            serial_number: serialNumberValidation.message,
            last_charge: lastChargeValidation.message
        });

        return !(nameValidation.error || manufacturerValidation.error || modelValidation.error || serialNumberValidation.error || lastChargeValidation.error);

    }

    const requestServerOperation = () => {

        const formData = new FormData();
        formData.append("name", controlledInput.name);
        formData.append("manufacturer", controlledInput.manufacturer);
        formData.append("model", controlledInput.model);
        formData.append("serial_number", controlledInput.serial_number);
        formData.append("last_charge", moment(chargeDate).format('YYYY-MM-DD hh:mm:ss'));
        formData.append('_method', 'PATCH');

        if (uploadedImage !== null) {
            formData.append("image", uploadedImage);
        }

        AxiosApi.post(`/api/equipments-module-battery/${controlledInput.id}`, formData)
            .then(function (response) {

                setLoading(false);
                successServerResponseTreatment(response);

            })
            .catch(function (error) {

                setLoading(false);
                errorServerResponseTreatment(error.response);

            });

    }

    const successServerResponseTreatment = (response) => {

        setDisplayAlert({ display: true, type: "success", message: response.data.message });

        setTimeout(() => {
            props.reload_table();
            setLoading(false);
            handleClose();
        }, 2000);

    }

    const errorServerResponseTreatment = (response) => {

        const error_message = response.data.message ? response.data.message : "Erro do servidor";
        setDisplayAlert({ display: true, type: "error", message: error_message });

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let request_errors = {
            image: { error: false, message: null },
            name: { error: false, message: null },
            manufacturer: { error: false, message: null },
            model: { error: false, message: null },
            serial_number: { error: false, message: null },
            last_charge: { error: false, message: null }
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
            serial_number: request_errors.serial_number.error,
            last_charge: request_errors.last_charge.error
        });

        setFieldErrorMessage({
            image: request_errors.image.message,
            name: request_errors.name.message,
            manufacturer: request_errors.manufacturer.message,
            model: request_errors.model.message,
            serial_number: request_errors.serial_number.message,
            last_charge: request_errors.last_charge.error
        });

    }

    const handleUploadedImage = (event) => {

        const uploaded_file = event.currentTarget.files[0];

        if (uploaded_file && uploaded_file.type.startsWith('image/')) {

            htmlImage.current.src = URL.createObjectURL(uploaded_file);

            setUploadedImage(event.target.files[0]);
        }

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

                <Box component="form" noValidate onSubmit={handleBatteryUpdateSubmit} >

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

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <DateTimeSingle
                                event={setChargeDate}
                                label={"Data da última carga"}
                                helperText={fieldErrorMessage.last_charge}
                                error={fieldError.last_charge}
                                defaultValue={props.record.last_charge}
                                operation={"create"}
                                read_only={false}
                            />
                        </Box>

                        <Box sx={{ mt: 2, display: 'flex' }}>
                            <label htmlFor="contained-button-file">
                                <Input accept=".png, .jpg, .svg" id="contained-button-file" multiple type="file" name="image" onChange={handleUploadedImage} />
                                <Button variant="contained" component="span" color={fieldError.image ? "error" : "primary"} startIcon={<FontAwesomeIcon icon={faFile} color={"#fff"} size="sm" />}>
                                    {fieldError.image ? fieldErrorMessage.image : "Escolher imagem"}
                                </Button>
                            </label>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <img ref={htmlImage} style={{ borderRadius: 10, width: "190px" }} src={props.record.image_url}></img>
                        </Box>

                    </DialogContent>

                    {(!loading && displayAlert.display) &&
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