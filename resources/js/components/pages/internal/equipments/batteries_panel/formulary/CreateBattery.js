import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, styled, FormHelperText, Divider, Grid } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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

const initialFormData = { image: "", name: "", manufacturer: "", model: "", serial_number: "", last_charge: moment() };
const fieldError = { error: false, message: "" };
const initialFormError = { name: fieldError, manufacturer: fieldError, model: fieldError, serial_number: fieldError, last_charge: fieldError, image: fieldError };
const initialDisplatAlert = { display: false, type: "", message: "" };

export const CreateBattery = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();

    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState(initialFormData);
    const [formError, setFormError] = React.useState(initialFormError);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
    const [loading, setLoading] = React.useState(false);
    const [uploadedImage, setUploadedImage] = React.useState(null);
    const htmlImage = React.useRef();

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
        setLoading(false);
        setFormData(initialFormData);
        setFormError(initialFormError);
    }

    function handleSubmit() {
        if (!formSubmissionValidation()) return '';
        setLoading(true);
        requestServer();

    }

    function formSubmissionValidation() {

        let validation = Object.assign({}, initialFormError);

        for (let field in formData) {
            if (field === "name") {
                validation[field] = FormValidation(formData[field], 3, 255, null, "Nome");
            } else if (field === "manufacturer") {
                validation[field] = FormValidation(formData[field], 3, 255, null, "Fabricante");
            } else if (field === "model") {
                validation[field] = FormValidation(formData[field], 3, 255, null, "Modelo");
            } else if (field === "serial_number") {
                validation[field] = FormValidation(formData[field], 3, 255, null, "Número serial");
            } else if (field === "last_charge") {
                validation[field] = formData[field] ? { error: false, message: "" } : { error: true, message: "Informe a data da última carga" };
            } else if (field === "image") {
                validation[field] = uploadedImage === null ? { error: true, message: "Selecione uma imagem" } : { error: false, message: "" };
            }
        }

        setFormError(validation);

        return !(validation.name.error || validation.manufacturer.error || validation.model.error || validation.serial_number.error || validation.last_charge.error || validation.image.error);
    }

    async function requestServer() {

        const formData_ = new FormData();
        formData_.append("name", formData.name);
        formData_.append("manufacturer", formData.manufacturer);
        formData_.append("model", formData.model);
        formData_.append("serial_number", formData.serial_number);
        formData_.append("last_charge", moment(formData.last_charge).format('YYYY-MM-DD'));
        formData_.append("image", uploadedImage);

        try {

            const response = await axios.post("/api/equipments-module-battery", formData_);
            successResponse(response);

        } catch (error) {
            errorResponse(error.response);
        } finally {
            setLoading(false);
        }

    }

    const successResponse = (response) => {
        setDisplayAlert({ display: true, type: "success", message: response.data.message });
        setTimeout(() => {
            props.reloadTable((old) => !old);
            handleClose();
        }, 2000);
    }

    function errorResponse(response) {
        setDisplayAlert({ display: true, type: "error", message: response.data.message });

        let response_errors = {}

        for (let field in response.data.errors) {
            response_errors[field] = {
                error: true,
                message: response.data.errors[field][0]
            }
        }

        setFormError(response_errors);
    }

    function handleUploadedImage(event) {
        const uploaded_file = event.currentTarget.files[0];
        if (uploaded_file && uploaded_file.type.startsWith('image/')) {
            htmlImage.current.src = URL.createObjectURL(uploaded_file);
            setUploadedImage(uploaded_file);
        }
    }

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
    }

    // ============================================================================== STRUCTURES - MUI ============================================================================== //

    return (
        <>
            <Tooltip title="Nova bateria">
                <IconButton onClick={handleClickOpen} disabled={!user.user_powers["6"].profile_powers.write == 1}>
                    <FontAwesomeIcon icon={faPlus} color={user.user_powers["6"].profile_powers.write == 1 ? "#00713A" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>CADASTRO DE BATERIA</DialogTitle>
                <Divider />

                <DialogContent>

                    <Grid container spacing={1}>

                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                margin="dense"
                                label="Nome"
                                fullWidth
                                variant="outlined"
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                helperText={formError.name.message}
                                error={formError.name.error}
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
                                value={formData.manufacturer}
                                onChange={handleInputChange}
                                helperText={formError.manufacturer.message}
                                error={formError.manufacturer.error}
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
                                value={formData.model}
                                onChange={handleInputChange}
                                helperText={formError.model.message}
                                error={formError.model.error}
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
                                value={formData.serial_number}
                                onChange={handleInputChange}
                                helperText={formError.serial_number.message}
                                error={formError.serial_number.error}
                            />
                        </Grid>

                        <Grid item xs={12} mt={1}>
                            <DatePicker
                                setControlledInput={setFormData}
                                controlledInput={formData}
                                name={"last_charge"}
                                label={"Data da última carga"}
                                error={fieldError.last_charge}
                                value={formData.last_charge}
                            />
                            <FormHelperText error>{formError.last_charge.error}</FormHelperText>
                        </Grid>

                    </Grid>

                    <Box sx={{ mt: 2, display: 'flex' }}>
                        <label htmlFor="contained-button-file">
                            <Input accept=".png, .jpg, .svg" id="contained-button-file" type="file" name="image" enctype="multipart/form-data" onChange={handleUploadedImage} />
                            <Button variant="contained" component="span" color={fieldError.image ? "error" : "primary"} startIcon={<FontAwesomeIcon icon={faFile} color={"#fff"} size="sm" />}>
                                {fieldError.image ? formError.image.message : "Escolher imagem"}
                            </Button>
                        </label>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <img ref={htmlImage} width={"190px"} style={{ borderRadius: 10 }} />
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