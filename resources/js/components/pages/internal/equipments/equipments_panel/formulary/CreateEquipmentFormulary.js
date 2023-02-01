import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, styled, FormHelperText, Grid, Divider } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';
// Moment
import moment from 'moment';
// Custom
import { DatePicker } from '../../../../../shared/date_picker/DatePicker';
import { FormValidation } from '../../../../../../utils/FormValidation';
import axios from '../../../../../../services/AxiosApi';
import { useAuth } from '../../../../../context/Auth';

const Input = styled('input')({
    display: 'none',
});

const initialFormData = { name: "", manufacturer: "", model: "", record_number: "", serial_number: "", weight: "", observation: "", purchase_date: moment() };
const fieldError = { error: false, message: "" };
const initialFormError = { image: fieldError, name: fieldError, manufacturer: fieldError, model: fieldError, record_number: fieldError, serial_number: fieldError, weight: fieldError, observation: fieldError, purchase_date: fieldError };
const initialDisplayAlert = { display: false, type: "", message: "" };

export const CreateEquipment = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();

    const [formData, setFormData] = React.useState(initialFormData);
    const [formError, setFormError] = React.useState(initialFormError);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [uploadedImage, setUploadedImage] = React.useState(null);
    const htmlImage = React.useRef();

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setFormError(initialFormError);
        setDisplayAlert(initialDisplayAlert);
        setOpen(false);
        setLoading(false);
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
            } else if (field === "record_number") {
                validation[field] = FormValidation(formData[field], 3, 255, null, "Número do registro");
            } else if (field === "serial_number") {
                validation[field] = FormValidation(formData[field], 3, 255, null, "Número serial");
            } else if (field === "weight") {
                validation[field] = FormValidation(formData[field], 3, 255, null, "Peso");
            } else if (field === "observation") {
                validation[field] = FormValidation(formData[field], 3, 255, null, "Observation");
            } else if (field === "image") {
                validation[field] = uploadedImage === null ? { error: true, message: "Selecione uma imagem" } : { error: false, message: "" };
            } else if (field === "purchase") {
                validation[field] = formData.purchase_date ? { error: false, message: "" } : { error: true, message: "Informe a data da compra" };
            }
        }

        setFormError(validation);

        return !(validation.name.error || validation.manufacturer.error || validation.record_number.error || validation.serial_number.error || validation.weight.error || validation.observation.error || validation.image.error || validation.purchase_date.error);

    }

    async function requestServer() {

        const formData_ = new FormData();
        formData_.append("name", formData.name);
        formData_.append("manufacturer", formData.manufacturer);
        formData_.append("model", formData.model);
        formData_.append("record_number", formData.record_number);
        formData_.append("serial_number", formData.serial_number);
        formData_.append("weight", formData.weight);
        formData_.append("observation", formData.observation);
        formData_.append("image", uploadedImage);
        formData_.append("purchase_date", moment(formData.purchase_date).format('YYYY-MM-DD'));

        try {

            const response = await axios.post("/api/equipments-module-equipment", formData_);
            successResponse(response);

        } catch (error) {
            errorResponse(error.response);
        } finally {
            setLoading(false);
        }

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
        const file = event.currentTarget.files[0];
        if (file && file.type.startsWith('image/')) {
            htmlImage.current.src = URL.createObjectURL(file);
            setUploadedImage(event.target.files[0]);
        }
    }

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

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
                <DialogTitle>CADASTRO DE EQUIPAMENTO</DialogTitle>
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
                                onChange={handleInputChange}
                                helperText={formData.name}
                                error={formError.name.error}
                                value={formError.name.message}
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
                                helperText={formError.manufacturer.message}
                                error={formError.manufacturer.error}
                                value={formData.manufacturer}
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
                                helperText={formError.model.message}
                                error={formError.model.error}
                                value={formData.model}
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
                                name="record_number"
                                onChange={handleInputChange}
                                helperText={formError.record_number.message}
                                error={formError.record_number.error}
                                value={formData.record_number}
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
                                helperText={formError.serial_number.message}
                                error={formError.serial_number.error}
                                value={formData.serial_number}
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
                                name="weight"
                                onChange={handleInputChange}
                                helperText={formError.weight.message}
                                error={formError.weight.error}
                                value={formData.weight}
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
                                name="observation"
                                onChange={handleInputChange}
                                helperText={formError.observation.message}
                                error={formError.observation.error}
                                value={formData.observation}
                            />
                        </Grid>

                        <Grid item xs={12} mt={1}>
                            <DatePicker
                                setControlledInput={setFormData}
                                controlledInput={formData}
                                name={"purchase_date"}
                                label={"Data da compra"}
                                error={formError.purchase_date.error}
                                value={formData.purchase_date}
                            />
                            <FormHelperText error>{formError.purchase_date.message}</FormHelperText>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, display: 'flex' }}>
                        <label htmlFor="contained-button-file">
                            <Input accept=".png, .jpg, .svg" id="contained-button-file" multiple type="file" name="flight_log_file" onChange={handleUploadedImage} />
                            <Button variant="contained" component="span" color={fieldError.image ? "error" : "primary"} startIcon={<FontAwesomeIcon icon={faFile} color={"#fff"} size="sm" />}>
                                {formError.image.error ? formError.image.message : "Escolher imagem"}
                            </Button>
                        </label>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <img ref={htmlImage} width={"190px"} style={{ borderRadius: 10 }}></img>
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