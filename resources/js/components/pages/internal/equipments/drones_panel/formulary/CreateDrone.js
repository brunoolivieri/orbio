import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, styled, Divider } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-solid-svg-icons';
// Custom
import axios from '../../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../../utils/FormValidation';
import { useAuth } from '../../../../../context/Auth';

const Input = styled('input')({
    display: 'none',
});

const initialFormData = { name: "", manufacturer: "", model: "", record_number: "", serial_number: "", weight: "", observation: "" };
const fieldError = { error: false, message: "" };
const initialFormError = { image: fieldError, name: fieldError, manufacturer: fieldError, model: fieldError, record_number: fieldError, serial_number: fieldError, weight: fieldError, observation: fieldError };
const initialDisplayAlert = { display: false, type: "", message: "" };


export const CreateDrone = React.memo((props) => {

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
        setFormData(initialFormData);
        setFormError(initialFormError);
        setDisplayAlert(initialDisplayAlert);
        setLoading(false);
        setOpen(false);
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
            }
        }

        setFormError(validation);

        return !(validation.name.error || validation.manufacturer.error || validation.record_number.error || validation.serial_number.error || validation.weight.error || validation.observation.error || validation.image.error);
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

        try {

            const response = await axios.post("/api/equipments-module-drone", formData_);
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

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Tooltip title="Novo drone">
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
                <DialogTitle>CADASTRO DE DRONE</DialogTitle>
                <Divider />

                <DialogContent>

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

                    <TextField
                        type="text"
                        margin="dense"
                        label="Número do registro"
                        fullWidth
                        variant="outlined"
                        required
                        name="record_number"
                        value={formData.record_number}
                        onChange={handleInputChange}
                        helperText={formError.record_number.message}
                        error={formError.record_number.error}
                    />

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

                    <TextField
                        type="text"
                        margin="dense"
                        label="Peso (KG)"
                        fullWidth
                        variant="outlined"
                        required
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        helperText={formError.weight.message}
                        error={formError.weight.error}
                    />

                    <TextField
                        type="text"
                        margin="dense"
                        label="Observação"
                        fullWidth
                        variant="outlined"
                        required
                        name="observation"
                        value={formData.observation}
                        onChange={handleInputChange}
                        helperText={formError.observation.message}
                        error={formError.observation.error}
                        sx={{ mb: 2 }}
                    />

                    <Box sx={{ mt: 2, mb: 2, display: 'flex' }}>
                        <label htmlFor="contained-button-file">
                            <Input accept=".png, .jpg, .svg" id="contained-button-file" type="file" name="image" enctype="multipart/form-data" onChange={handleUploadedImage} />
                            <Button variant="contained" component="span" color={fieldError.image ? "error" : "primary"} startIcon={<FontAwesomeIcon icon={faFile} color={"#fff"} size="sm" />}>
                                {formError.image.error ? formError.image.message : "Escolher imagem"}
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
                    <Button type="submit" disabled={loading} variant="contained" onClick={handleSubmit}>Confirmar</Button>
                </DialogActions>

            </Dialog>
        </>
    )
});