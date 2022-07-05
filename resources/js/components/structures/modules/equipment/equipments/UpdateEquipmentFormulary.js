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
// Moment
import moment from 'moment';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-solid-svg-icons';
// Custom
import { DateTimeInput } from '../../../date_picker/DateTimeInput';
import AxiosApi from '../../../../../services/AxiosApi';
import { FormValidation } from '../../../../../utils/FormValidation';
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';

const Input = styled('input')({
    display: 'none',
});

export const UpdateEquipmentFormulary = React.memo(({ ...props }) => {

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

    const [fieldError, setFieldError] = React.useState({ image: false, name: false, manufacturer: false, model: false, record_number: false, serial_number: false, weight: false, observation: false, purchase_date: false });

    const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ image: "", name: "", manufacturer: "", model: "", record_number: "", serial_number: "", weight: "", observation: "", purchase_date: "" });

    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

    const [loading, setLoading] = React.useState(false);

    const [uploadedImage, setUploadedImage] = React.useState(null);

    const [open, setOpen] = React.useState(false);

    const [purchaseDate, setPurchaseDate] = React.useState(moment());

    const htmlImage = React.useRef();

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setFieldError({ image: false, name: false, manufacturer: false, model: false, record_number: false, serial_number: false, weight: false, observation: false, purchase_date: false });
        setFieldErrorMessage({ image: "", name: "", manufacturer: "", model: "", record_number: "", serial_number: "", weight: "", observation: "", purchase_date: "" });
        setDisplayAlert({ display: false, type: "", message: "" });
        setLoading(false);
        setOpen(false);
    }

    const handleEquipmentUpdateSubmit = (event) => {
        event.preventDefault();

        if (formularyDataValidate()) {

            setLoading(true);
            requestServerOperation();

        }

    }

    const formularyDataValidate = () => {

        let nameValidation = FormValidation(controlledInput.name, 3);
        let manufacturerValidation = FormValidation(controlledInput.manufacturer, 3);
        let modelValidation = FormValidation(controlledInput.model);
        let recordNumberValidation = FormValidation(controlledInput.record_number);
        let serialNumberValidation = FormValidation(controlledInput.serial_number);
        let weightValidation = FormValidation(controlledInput.weight);
        let observationValidation = FormValidation(controlledInput.observation, 3);
        let purchaseValidation = purchaseDate == null ? { error: true, message: "A data da compra precisa ser informada" } : { error: false, message: "" }

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
        formData.append("purchase_date", moment(purchaseDate).format('YYYY-MM-DD hh:mm:ss'));
        formData.append('_method', 'PATCH');

        AxiosApi.post(`/api/equipments-module-equipment/${controlledInput.id}`, formData)
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
            record_number: { error: false, message: null },
            serial_number: { error: false, message: null },
            weight: { error: false, message: null },
            observation: { error: false, message: null },
            purchase_date: { error: false, message: null }
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

    const handleInputChange = (event) => {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }

    const handleUploadedImage = (event) => {

        const uploaded_file = event.currentTarget.files[0];

        if (uploaded_file && uploaded_file.type.startsWith('image/')) {

            htmlImage.current.src = "";
            htmlImage.current.src = URL.createObjectURL(uploaded_file);

            setUploadedImage(event.target.files[0]);
        }

    }

    return (
        <>
            <Tooltip title="Editar">
                <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["6"].profile_powers.read == 1 ? false : true}>
                    <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["6"].profile_powers.read == 1 ? "#00713A" : "#808991"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
                <DialogTitle>ATUALIZAÇÃO | ID: {props.record.id}</DialogTitle>

                <Box component="form" noValidate onSubmit={handleEquipmentUpdateSubmit} >

                    <DialogContent>

                        <TextField
                            type="text"
                            margin="dense"
                            label="ID do equipamento"
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

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <DateTimeInput
                                event={setPurchaseDate}
                                label={"Data da compra"}
                                helperText={fieldErrorMessage.purchase_date}
                                error={fieldError.purchase_date}
                                defaultValue={props.record.purchase_date}
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
                            <img ref={htmlImage} width={"190px"} style={{ borderRadius: 10 }} src={props.record.image_url}></img>
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