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
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';
// Moment
import moment from 'moment';
// Custom
import { DateTimeInput } from '../../../date_picker/DateTimeInput';
import { FormValidation } from '../../../../../utils/FormValidation';
import AxiosApi from '../../../../../services/AxiosApi';
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';

const Input = styled('input')({
    display: 'none',
});

export const CreateEquipmentFormulary = React.memo(({ ...props }) => {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    const { AuthData } = useAuthentication();

    const [errorDetected, setErrorDetected] = React.useState({ image: false, name: false, manufacturer: false, model: false, record_number: false, serial_number: false, weight: false, observation: false, purchase_date: false });
    const [errorMessage, setErrorMessage] = React.useState({ image: "", name: "", manufacturer: "", model: "", record_number: "", serial_number: "", weight: "", observation: "", purchase_date: "" });

    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

    const [disabledButton, setDisabledButton] = React.useState(false);

    const [open, setOpen] = React.useState(false);

    const [purchaseDate, setPurchaseDate] = React.useState(moment());

    const [uploadedImage, setUploadedImage] = React.useState(null);

    const htmlImage = React.useRef();

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setErrorDetected({ image: false, name: false, manufacturer: false, model: false, record_number: false, serial_number: false, weight: false, observation: false, purchase_date: false });
        setErrorMessage({ image: "", name: "", manufacturer: "", model: "", record_number: "", serial_number: "", weight: "", observation: "", purchase_date: "" });
        setDisplayAlert({ display: false, type: "", message: "" });
        setDisabledButton(false);
        setOpen(false);
    };

    const handleEquipmentRegistrationSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        if (formularyDataValidate(data)) {

            setDisabledButton(true);

            requestServerOperation(data);

        }

    }

    const formularyDataValidate = (formData) => {

        let nameValidation = FormValidation(formData.get("name"), 3, null, null, null);
        let manufacturerValidation = FormValidation(formData.get("manufacturer"), 3, null, null, null);
        let modelValidation = FormValidation(formData.get("model"), null, null, null, null);
        let recordNumberValidation = FormValidation(formData.get("record_number"), null, null, null, null);
        let serialNumberValidation = FormValidation(formData.get("serial_number"), null, null, null, null);
        let weightValidation = FormValidation(formData.get("weight"), null, null, null, null);
        let observationValidation = FormValidation(formData.get("observation"), 3, null, null, null);
        let imageValidation = uploadedImage == null ? { error: true, message: "Uma imagem precisa ser selecionada" } : { error: false, message: "" };
        let purchaseValidation = purchaseDate == null ? { error: true, message: "A data da compra precisa ser informada" } : { error: false, message: "" }

        setErrorDetected({
            image: imageValidation.error,
            name: nameValidation.error,
            manufacturer: manufacturerValidation.error,
            model: modelValidation.error,
            record_number: recordNumberValidation.error,
            serial_number: serialNumberValidation.error,
            weight: weightValidation.error,
            observation: observationValidation.error,
            purchase_date: purchaseValidation.error
        });

        setErrorMessage({
            image: imageValidation.message,
            name: nameValidation.message,
            manufacturer: manufacturerValidation.message,
            model: modelValidation.message,
            record_number: recordNumberValidation.message,
            serial_number: serialNumberValidation.message,
            weight: weightValidation.message,
            observation: observationValidation.message,
            purchase_date: purchaseValidation.message
        });

        return !(nameValidation.error || manufacturerValidation.error || modelValidation.error || recordNumberValidation.error || serialNumberValidation.error || weightValidation.error || observationValidation.error || purchaseValidation.error || imageValidation.error);

    }

    const requestServerOperation = (data) => {

        data.append("image", uploadedImage);
        data.append("purchase_date", moment(purchaseDate).format('YYYY-MM-DD hh:mm:ss'));

        AxiosApi.post(`/api/equipments-module-equipment`, data)
            .then(function (response) {

                successServerResponseTreatment(response);

            })
            .catch(function (error) {

                errorServerResponseTreatment(error.response);

            });

    }

    const successServerResponseTreatment = (response) => {

        setDisplayAlert({ display: true, type: "success", message: response.data.message });

        setTimeout(() => {

            props.reload_table();
            setDisabledButton(false);
            handleClose();

        }, 2000);

    }

    const errorServerResponseTreatment = (response) => {

        setDisabledButton(false);

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

        setErrorDetected({
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

        setErrorMessage({
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

    const handleUploadedImage = (event) => {

        const file = event.currentTarget.files[0];

        if (file && file.type.startsWith('image/')) {

            htmlImage.current.src = URL.createObjectURL(file);

            setUploadedImage(event.target.files[0]);
        }

    }

    return (
        <>
            <Tooltip title="Nova bateria">
                <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["6"].profile_powers.write == 1 ? false : true}>
                    <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["6"].profile_powers.write == 1 ? "#00713A" : "#808991"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
                <DialogTitle>CADASTRO DE EQUIPAMENTO</DialogTitle>

                <Box component="form" noValidate onSubmit={handleEquipmentRegistrationSubmit} >

                    <DialogContent>

                        <TextField
                            type="text"
                            margin="dense"
                            label="Nome"
                            fullWidth
                            variant="outlined"
                            required
                            id="name"
                            name="name"
                            helperText={errorMessage.name}
                            error={errorDetected.name}
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
                            helperText={errorMessage.manufacturer}
                            error={errorDetected.manufacturer}
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
                            helperText={errorMessage.model}
                            error={errorDetected.model}
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
                            helperText={errorMessage.record_number}
                            error={errorDetected.record_number}
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
                            helperText={errorMessage.serial_number}
                            error={errorDetected.serial_number}
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
                            helperText={errorMessage.weight}
                            error={errorDetected.weight}
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
                            helperText={errorMessage.observation}
                            error={errorDetected.observation}
                        />

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <DateTimeInput
                                event={setPurchaseDate}
                                label={"Data da compra"}
                                helperText={errorMessage.purchase_date}
                                error={errorDetected.purchase_date}
                                defaultValue={moment()}
                                operation={"create"}
                                read_only={false}
                            />
                        </Box>

                        <Box sx={{ mt: 2, display: 'flex' }}>
                            <label htmlFor="contained-button-file">
                                <Input accept=".png, .jpg, .svg" id="contained-button-file" multiple type="file" name="flight_log_file" onChange={handleUploadedImage} />
                                <Button variant="contained" component="span" color={errorDetected.image ? "error" : "primary"} startIcon={<FontAwesomeIcon icon={faFile} color={"#fff"} size="sm" />}>
                                    {errorDetected.image ? errorMessage.image : "Escolher imagem"}
                                </Button>
                            </label>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <img ref={htmlImage} width={"190px"} style={{ borderRadius: 10 }}></img>
                        </Box>

                    </DialogContent>

                    {displayAlert.display &&
                        <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                    }

                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" disabled={disabledButton} variant="contained">Criar equipamento</Button>
                    </DialogActions>

                </Box>

            </Dialog>
        </>
    )

});