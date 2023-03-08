import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, styled, Divider, Grid, Stack } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Moment
import moment from 'moment';
// Custom
import { DatePicker } from '../../../../../shared/date_picker/DatePicker';
import axios from '../../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../../utils/FormValidation';
import { useAuth } from '../../../../../context/Auth';
import { ImageListSelection } from '../../../../../shared/modals/dialog/ImageListSelection';

const Input = styled('input')({
    display: 'none',
});

const fieldError = { error: false, message: "" };
const initialFormError = { name: fieldError, manufacturer: fieldError, model: fieldError, serial_number: fieldError, last_charge: fieldError, observation: fieldError };
const initialDisplayAlert = { display: false, type: "", message: "" };

export const UpdateBattery = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({ id: props.record.id, name: props.record.name, manufacturer: props.record.manufacturer, model: props.record.model, serial_number: props.record.serial_number, last_charge: props.record.last_charge });
    const [formError, setFormError] = React.useState(initialFormError);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
    const [loading, setLoading] = React.useState(false);
    const [image, setImage] = React.useState(null);
    const htmlImage = React.useRef();

    const is_authorized = !!user.user_powers["5"].profile_powers.write;

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
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
            if (field != "last_charge" && field != "image") {
                validation[field] = FormValidation(formData[field], 3, 255);
            }
        }

        validation["last_charge"] = formData["last_charge"] ? { error: false, message: "" } : { error: true, message: "Informe a data da última carga" };

        setFormError(validation);

        return !(validation.name.error || validation.manufacturer.error || validation.model.error || validation.serial_number.error || validation.last_charge.error || validation.observation.error);
    }

    async function requestServer() {

        const formData_ = new FormData();
        formData_.append("name", formData.name);
        formData_.append("manufacturer", formData.manufacturer);
        formData_.append("model", formData.model);
        formData_.append("serial_number", formData.serial_number);
        formData_.append("last_charge", moment(formData.last_charge).format('YYYY-MM-DD'));
        formData_.append("observation", formData.observation);
        formData_.append('_method', 'PATCH');

        if (image) {
            formData_.append("image", image);
        }

        try {
            const response = await axios.post(`api/module/equipments-battery/${formData.id}`, formData_);
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
        if (response.status === 422) {
            setDisplayAlert({ display: true, type: "error", message: "Dados inválidos!" });
            let response_errors = Object.assign({}, initialFormError);
            for (let field in response.data.errors) {
                response_errors[field] = {
                    error: true,
                    message: response.data.errors[field][0]
                }
            }
            setFormError(response_errors);
        } else {
            setDisplayAlert({ display: true, type: "error", message: response.data.message });
        }
    }

    function handleUploadedImage(event) {
        const uploaded_file = event.currentTarget.files[0];
        if (uploaded_file && uploaded_file.type.startsWith('image/')) {
            setDisplayAlert(initialDisplayAlert);
            htmlImage.current.src = "";
            htmlImage.current.src = URL.createObjectURL(uploaded_file);
            setImage(event.target.files[0]);
        } else {
            setDisplayAlert({ display: true, type: "error", message: "Formato de arquivo inválido." });
        }
    }

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Tooltip title="Editar">
                <IconButton onClick={handleClickOpen} disabled={!is_authorized}>
                    <FontAwesomeIcon icon={faPen} color={is_authorized ? "#00713A" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="xl"
            >
                <DialogTitle>ATUALIZAÇÃO DE BATERIA</DialogTitle>
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
                                onChange={handleInputChange}
                                helperText={formError.name.message}
                                error={formError.name.error}
                                value={formData.name}
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
                                label="Número Serial"
                                fullWidth
                                variant="outlined"
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

                        <Grid item xs={12} mt={1}>
                            <DatePicker
                                label={"Data da carga"}
                                name={"last_charge"}
                                value={formData.last_charge}
                                setFormData={setFormData}
                                formData={formData}
                                errorMessage={formError.last_charge.message}
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
                        <ImageListSelection
                            fetch_from={"api/action/module/equipments-battery"}
                        />
                    </Stack>

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