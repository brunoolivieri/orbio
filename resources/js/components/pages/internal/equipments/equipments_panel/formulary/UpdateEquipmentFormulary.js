import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, styled, FormHelperText, Grid, Divider } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-solid-svg-icons';
// Custom
import { DatePicker } from '../../../../../shared/date_picker/DatePicker';
import axios from '../../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../../utils/FormValidation';
import { useAuth } from '../../../../../context/Auth';
// Moment
import moment from 'moment';

const Input = styled('input')({
    display: 'none',
});

const initialFieldError = { image: false, name: false, manufacturer: false, model: false, record_number: false, serial_number: false, weight: false, observation: false, purchase_date: false };
const initialFieldErrorMessage = { image: "", name: "", manufacturer: "", model: "", record_number: "", serial_number: "", weight: "", observation: "", purchase_date: "" };
const initialDisplatAlert = { display: false, type: "", message: "" };

export const UpdateEquipment = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();
    
    const [controlledInput, setControlledInput] = React.useState({
        id: props.record.id,
        name: props.record.name,
        manufacturer: props.record.manufacturer,
        model: props.record.model,
        record_number: props.record.record_number,
        serial_number: props.record.serial_number,
        weight: props.record.weight,
        observation: props.record.observation,
        purchase_date: props.record.purchase_date
    });
    const [fieldError, setFieldError] = React.useState(initialFieldError);
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
    const [loading, setLoading] = React.useState(false);
    const [uploadedImage, setUploadedImage] = React.useState(null);
    const [open, setOpen] = React.useState(false);
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

        let nameValidation = FormValidation(controlledInput.name, 3);
        let manufacturerValidation = FormValidation(controlledInput.manufacturer, 3);
        let modelValidation = FormValidation(controlledInput.model);
        let recordNumberValidation = FormValidation(controlledInput.record_number);
        let serialNumberValidation = FormValidation(controlledInput.serial_number);
        let weightValidation = FormValidation(controlledInput.weight);
        let observationValidation = FormValidation(controlledInput.observation, 3);
        let purchaseValidation = controlledInput.purchase_date ? { error: false, message: "" } : { error: true, message: "A data da compra precisa ser informada" };

        setFieldError({
            image: false,
            name: nameValidation.error,
            manufacturer: manufacturerValidation.error,
            model: modelValidation.error,
            record_number: recordNumberValidation.error,
            serial_number: serialNumberValidation.error,
            weight: weightValidation.error,
            observation: observationValidation.error,
            purchase_date: purchaseValidation.error
        });

        setFieldErrorMessage({
            image: "",
            name: nameValidation.message,
            manufacturer: manufacturerValidation.message,
            model: modelValidation.message,
            record_number: recordNumberValidation.message,
            serial_number: serialNumberValidation.message,
            weight: weightValidation.message,
            observation: observationValidation.message,
            purchase_date: purchaseValidation.message
        });

        return !(nameValidation.error || manufacturerValidation.error || modelValidation.error || recordNumberValidation.error || serialNumberValidation.error || weightValidation.error || observationValidation.error || purchaseValidation.error);
    }

    function requestServerOperation() {
        const formData = new FormData();
        formData.append("name", controlledInput.name);
        formData.append("manufacturer", controlledInput.manufacturer);
        formData.append("model", controlledInput.model);
        formData.append("record_number", controlledInput.record_number);
        formData.append("serial_number", controlledInput.serial_number);
        formData.append("weight", controlledInput.weight);
        formData.append("observation", controlledInput.observation);
        formData.append("purchase_date", moment(controlledInput.purchase_date).format('YYYY-MM-DD'));
        formData.append('_method', 'PATCH');

        if (uploadedImage !== null) {
            formData.append("image", uploadedImage);
        }

        axios.post(`/api/equipments-module-equipment/${controlledInput.id}`, formData)
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
            record_number: { error: false, message: null },
            serial_number: { error: false, message: null },
            weight: { error: false, message: null },
            observation: { error: false, message: null },
            purchase_date: { error: false, message: null }
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
            record_number: request_errors.record_number.error,
            serial_number: request_errors.serial_number.error,
            weight: request_errors.weight.error,
            observation: request_errors.observation.error,
            purchase_date: request_errors.purchase_date.error
        });

        setFieldErrorMessage({
            image: request_errors.image.message,
            name: request_errors.name.message,
            manufacturer: request_errors.manufacturer.message,
            model: request_errors.model.message,
            record_number: request_errors.record_number.message,
            serial_number: request_errors.serial_number.message,
            weight: request_errors.weight.message,
            observation: request_errors.observation.message,
            purchase_date: request_errors.purchase_date.message
        });
    }

    function handleUploadedImage(event) {
        const uploaded_file = event.currentTarget.files[0];
        if (uploaded_file && uploaded_file.type.startsWith('image/')) {
            htmlImage.current.src = "";
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
                <IconButton onClick={handleClickOpen} disabled={!user.user_powers["6"].profile_powers.read == 1}>
                    <FontAwesomeIcon icon={faPen} color={user.user_powers["6"].profile_powers.read == 1 ? "#00713A" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>ATUALIZAÇÃO DE EQUIPAMENTO</DialogTitle>
                <Divider />

                <DialogContent>

                    <Grid container spacing={1}>

                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                margin="dense"
                                label="ID do equipamento"
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
                                id="name"
                                name="name"
                                helperText={fieldErrorMessage.name}
                                error={fieldError.name}
                                value={controlledInput.name}
                                onChange={handleInputChange}
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
                                id="manufacturer"
                                name="manufacturer"
                                helperText={fieldErrorMessage.manufacturer}
                                error={fieldError.manufacturer}
                                value={controlledInput.manufacturer}
                                onChange={handleInputChange}
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
                                id="model"
                                name="model"
                                helperText={fieldErrorMessage.model}
                                error={fieldError.model}
                                value={controlledInput.model}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
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
                                value={controlledInput.record_number}
                                onChange={handleInputChange}
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
                                id="serial_number"
                                name="serial_number"
                                helperText={fieldErrorMessage.serial_number}
                                error={fieldError.serial_number}
                                value={controlledInput.serial_number}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
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
                                value={controlledInput.weight}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
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
                                value={controlledInput.observation}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} mt={1}>
                            <DatePicker
                                setControlledInput={setControlledInput}
                                controlledInput={controlledInput}
                                name={"purchase_date"}
                                label={"Data da compra"}
                                error={fieldError.purchase_date}
                                value={controlledInput.purchase_date}
                            />
                            <FormHelperText error>{fieldErrorMessage.purchase_date}</FormHelperText>
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
                        <img ref={htmlImage} width={"190px"} style={{ borderRadius: 10 }} src={props.record.image_url}></img>
                    </Box>

                </DialogContent>

                {(!loading && displayAlert.display) &&
                    <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                }

                {loading && <LinearProgress />}

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" disabled={loading} variant="contained" onClick={handleSubmit}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
});