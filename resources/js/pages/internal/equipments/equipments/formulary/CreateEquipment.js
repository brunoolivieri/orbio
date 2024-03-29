import * as React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, styled, Grid, Divider, Stack } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DatePicker } from '../../../../../components/date_picker/DatePicker';
import { FormValidation } from '../../../../../utils/FormValidation';
import axios from '../../../../../services/AxiosApi';
import { useAuth } from '../../../../../context/Auth';
import moment from 'moment';

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
            if (field != "image" && field != "purchase_date") {
                validation[field] = FormValidation(formData[field]);
            }
        }

        validation["image"] = image === null ? { error: true, message: "Selecione uma imagem" } : { error: false, message: "" };
        validation["purchase_date"] = formData.purchase_date ? { error: false, message: "" } : { error: true, message: "Informe a data da compra" };

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
        formData_.append("image", image);
        formData_.append("purchase_date", moment(formData.purchase_date).format('YYYY-MM-DD'));

        try {
            const response = await axios.post("api/module/equipments", formData_);
            successResponse(response);
        } catch (error) {
            console.log(error.message);
            setCanSave(true);
            errorResponse(error.response);
        } finally {
            setLoading(false);
        }

    }

    function successResponse(response) {
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
        const file = event.currentTarget.files[0];
        if (file && file.type.startsWith('image/')) {
            setAlert(initialDisplayAlert);
            htmlImage.current.src = URL.createObjectURL(file);
            setImage(event.target.files[0]);
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
            <Tooltip title="Nova bateria">
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
                                label="Número do registro"
                                fullWidth
                                variant="outlined"
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
                                name="observation"
                                onChange={handleInputChange}
                                helperText={formError.observation.message}
                                error={formError.observation.error}
                                value={formData.observation}
                            />
                        </Grid>

                        <Grid item xs={12} mt={1}>
                            <DatePicker
                                label={"Compra"}
                                name={"puchase_date"}
                                value={formData.purchase_date}
                                setFormData={setFormData}
                                formData={formData}
                                errorMessage={formError.purchase_date.message}
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
                        <img ref={htmlImage} width={"190px"} style={{ borderRadius: 10 }}></img>
                    </Box>

                </DialogContent>

                {(!loading && alert.display) &&
                    <Alert severity={alert.type}>{alert.message}</Alert>
                }

                {loading && <LinearProgress />}

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button disabled={!canSave} variant="contained" onClick={handleSubmit}>Confirmar</Button>
                </DialogActions>

            </Dialog>
        </>
    )
});