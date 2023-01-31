import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, styled, FormHelperText, Divider, Grid } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-solid-svg-icons';
// Moment
import moment from 'moment';
// Custom
import { DatePicker } from '../../../../../shared/date_picker/DatePicker';
import axios from '../../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../../utils/FormValidation';
import { useAuth } from '../../../../../context/Auth';

const Input = styled('input')({
    display: 'none',
});

const initialFieldError = { image: false, name: false, manufacturer: false, model: false, serial_number: false, last_charge: false };
const initialFieldErrorMessage = { image: "", name: "", manufacturer: "", model: "", serial_number: "", last_charge: "" };
const initialDisplatAlert = { display: false, type: "", message: "" };

export const UpdateBattery = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();
    const [open, setOpen] = React.useState(false);
    const [controlledInput, setControlledInput] = React.useState({ id: props.record.id, name: props.record.name, manufacturer: props.record.manufacturer, model: props.record.model, serial_number: props.record.serial_number, last_charge: props.record.last_charge });
    const [fieldError, setFieldError] = React.useState(initialFieldError);
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
    const [loading, setLoading] = React.useState(false);
    const [uploadedImage, setUploadedImage] = React.useState(null);
    const htmlImage = React.useRef();

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setFieldError(initialFieldError);
        setFieldErrorMessage(initialFieldErrorMessage);
        setDisplayAlert(initialDisplatAlert);
        setLoading(false);
        setOpen(false);
    }

    function handleSubmit() {
        if (formValidation()) {
            setLoading(true);
            requestServerOperation();
        }
    }

    function formValidation() {
        const nameValidation = FormValidation(controlledInput.name, 3);
        const manufacturerValidation = FormValidation(controlledInput.manufacturer, 3);
        const modelValidation = FormValidation(controlledInput.model);
        const serialNumberValidation = FormValidation(controlledInput.serial_number);
        const lastChargeValidation = controlledInput.last_charge ? { error: false, message: "" } : { error: true, message: "A data da última carga precisa ser informada" };

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

    function requestServerOperation() {

        const formData = new FormData();
        formData.append("name", controlledInput.name);
        formData.append("manufacturer", controlledInput.manufacturer);
        formData.append("model", controlledInput.model);
        formData.append("serial_number", controlledInput.serial_number);
        formData.append("last_charge", moment(controlledInput.last_charge).format('YYYY-MM-DD'));
        formData.append('_method', 'PATCH');

        if (uploadedImage !== null) {
            formData.append("image", uploadedImage);
        }

        axios.post(`/api/equipments-module-battery/${controlledInput.id}`, formData)
            .then(function (response) {
                successResponse(response);
            })
            .catch(function (error) {
                errorResponse(error.response);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    function successResponse(response) {
        setDisplayAlert({ display: true, type: "success", message: response.data.message });
        setTimeout(() => {
            props.reloadTable((old) => !old);
            handleClose();
        }, 2000);
    }

    function errorResponse(response) {
        setDisplayAlert({ display: true, type: "error", message: response.data.message });

        let request_errors = {
            image: { error: false, message: null },
            name: { error: false, message: null },
            manufacturer: { error: false, message: null },
            model: { error: false, message: null },
            serial_number: { error: false, message: null },
            last_charge: { error: false, message: null }
        }

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

    function handleUploadedImage(event) {
        const uploaded_file = event.currentTarget.files[0];
        if (uploaded_file && uploaded_file.type.startsWith('image/')) {
            htmlImage.current.src = URL.createObjectURL(uploaded_file);
            setUploadedImage(event.target.files[0]);
        }
    }

    function handleInputChange(event) {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Tooltip title="Editar">
                <IconButton onClick={handleClickOpen} disabled={!user.user_powers["6"].profile_powers.write == 1}>
                    <FontAwesomeIcon icon={faPen} color={user.user_powers["6"].profile_powers.write == 1 ? "#00713A" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>ATUALIZAÇÃO DE BATERIA</DialogTitle>
                <Divider />

                <DialogContent>
                    <Grid container spacing={1}>

                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                margin="dense"
                                label="ID da bateria"
                                fullWidth
                                variant="outlined"
                                required
                                id="id"
                                name="id"
                                value={controlledInput.id}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                margin="dense"
                                label="Nome"
                                fullWidth
                                variant="outlined"
                                required
                                name="name"
                                onChange={handleInputChange}
                                helperText={fieldErrorMessage.name}
                                error={fieldError.name}
                                value={controlledInput.name}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                margin="dense"
                                label="Fabricante"
                                fullWidth
                                variant="outlined"
                                required
                                name="manufacturer"
                                onChange={handleInputChange}
                                helperText={fieldErrorMessage.manufacturer}
                                error={fieldError.manufacturer}
                                value={controlledInput.manufacturer}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                margin="dense"
                                label="Modelo"
                                fullWidth
                                variant="outlined"
                                required
                                name="model"
                                onChange={handleInputChange}
                                helperText={fieldErrorMessage.model}
                                error={fieldError.model}
                                value={controlledInput.model}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                margin="dense"
                                label="Número Serial"
                                fullWidth
                                variant="outlined"
                                required
                                name="serial_number"
                                onChange={handleInputChange}
                                helperText={fieldErrorMessage.serial_number}
                                error={fieldError.serial_number}
                                value={controlledInput.serial_number}
                            />
                        </Grid>

                        <Grid item xs={12} mt={1}>
                            <DatePicker
                                setControlledInput={setControlledInput}
                                controlledInput={controlledInput}
                                name={"last_charge"}
                                label={"Data da última carga"}
                                error={fieldError.last_charge}
                                value={controlledInput.last_charge}
                            />
                            <FormHelperText error>{fieldErrorMessage.last_charge}</FormHelperText>
                        </Grid>

                    </Grid>

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

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button disabled={loading} variant="contained" onClick={handleSubmit}>Confirmar</Button>
                </DialogActions>

            </Dialog>
        </>
    )
});