import * as React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, styled, Divider, Grid, Stack } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from '../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../utils/FormValidation';
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
    const [alert, setAlert] = React.useState(initialDisplayAlert);
    const [loading, setLoading] = React.useState(false);
    const [canSave, setCanSave] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [image, setImage] = React.useState(null);
    const htmlImage = React.useRef();

    const is_authorized = !!user.user_powers["5"].profile_powers.write;

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setFormData(initialFormData);
        setFormError(initialFormError);
        setAlert(initialDisplayAlert);
        setLoading(false);
        setCanSave(true);
        setOpen(false);
    }

    function handleSubmit() {
        if (!formSubmissionValidation()) {
            return;
        }
        setLoading(true);
        setCanSave(false);
        requestServer();
    }

    function formSubmissionValidation() {

        let validation = Object.assign({}, initialFormError);

        for (let field in formData) {
            if (field != "image") {
                validation[field] = FormValidation(formData[field]);
            }
        }

        validation["image"] = image === null ? { error: true, message: "Selecione uma imagem" } : { error: false, message: "" };

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
        formData_.append("image", image);

        try {
            const response = await axios.post("api/module/equipments-drone", formData_);
            successResponse(response);
        } catch (error) {
            console.log(error.message);
            setCanSave(true);
            errorResponse(error.response);
        } finally {
            setLoading(false);
        }

    }

    const successResponse = (response) => {
        setAlert({ display: true, type: "success", message: response.data.message });
        setTimeout(() => {
            props.reloadTable((old) => !old);
            handleClose();
        }, 2000);
    }

    function errorResponse(response) {
        if (response.status === 422) {
            setAlert({ display: true, type: "error", message: "Dados inválidos!" });
            let response_errors = Object.assign({}, initialFormError);
            for (let field in response.data.errors) {
                response_errors[field] = {
                    error: true,
                    message: response.data.errors[field][0]
                }
            }
            setFormError(response_errors);
        } else {
            setAlert({ display: true, type: "error", message: response.data.message });
        }
    }

    function handleUploadedImage(event) {
        const uploaded_file = event.currentTarget.files[0];
        if (uploaded_file && uploaded_file.type.startsWith('image/')) {
            setAlert(initialDisplayAlert);
            htmlImage.current.src = URL.createObjectURL(uploaded_file);
            setImage(uploaded_file);
        } else {
            setAlert({ display: true, type: "error", message: "Formato de arquivo inválido." });
        }
    }

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Tooltip title="Novo drone">
                <IconButton onClick={handleClickOpen} disabled={!is_authorized}>
                    <FontAwesomeIcon icon={faPlus} color={is_authorized ? "#00713A" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="xl"
            >
                <DialogTitle>CADASTRO DE DRONE</DialogTitle>
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
                                label="Número do registro"
                                fullWidth
                                variant="outlined"
                                name="record_number"
                                value={formData.record_number}
                                onChange={handleInputChange}
                                helperText={formError.record_number.message}
                                error={formError.record_number.error}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                margin="dense"
                                label="Número Serial"
                                fullWidth
                                variant="outlined"
                                name="serial_number"
                                value={formData.serial_number}
                                onChange={handleInputChange}
                                helperText={formError.serial_number.message}
                                error={formError.serial_number.error}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                margin="dense"
                                label="Peso (KG)"
                                fullWidth
                                variant="outlined"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                helperText={formError.weight.message}
                                error={formError.weight.error}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                margin="dense"
                                label="Observação"
                                fullWidth
                                variant="outlined"
                                name="observation"
                                value={formData.observation}
                                onChange={handleInputChange}
                                helperText={formError.observation.message}
                                error={formError.observation.error}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                    </Grid>

                    <Stack direction="row" spacing={2} mt={2}>
                        <label htmlFor="contained-button-file">
                            <Input accept=".png, .jpg, .svg" id="contained-button-file" type="file" name="image" enctype="multipart/form-data" onChange={handleUploadedImage} />
                            <Button variant="contained" component="span" color={fieldError.image ? "error" : "primary"} startIcon={<FileUploadIcon />}>
                                Upload de imagem
                            </Button>
                        </label>
                    </Stack>

                    <Box sx={{ mt: 2 }}>
                        <img ref={htmlImage} width={"190px"} style={{ borderRadius: 10 }} />
                    </Box>

                </DialogContent>

                {(!loading && alert.display) &&
                    <Alert severity={alert.type}>{alert.message}</Alert>
                }

                {loading && <LinearProgress />}

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" disabled={!canSave} variant="contained" onClick={handleSubmit}>Confirmar</Button>
                </DialogActions>

            </Dialog>
        </>
    )
});