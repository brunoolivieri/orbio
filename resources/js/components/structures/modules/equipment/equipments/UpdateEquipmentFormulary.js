// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import styled from '@emotion/styled';
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

    // Utilizador do state global de autenticação
    const { AuthData } = useAuthentication();

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = React.useState({ image: false, name: false, manufacturer: false, model: false, record_number: false, serial_number: false, weight: false, observation: false, purchase_date: false });
    const [errorMessage, setErrorMessage] = React.useState({ image: "", name: "", manufacturer: "", model: "", record_number: "", serial_number: "", weight: "", observation: "", purchase_date: "" });

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = React.useState(false);

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // States dos inputs de data
    const [purchaseDate, setPurchaseDate] = React.useState(moment());

    // State of uploaded image
    const [uploadedImage, setUploadedImage] = React.useState(null);

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Função para abrir o modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Função para fechar o modal
    const handleClose = () => {
        setErrorDetected({ image: false, name: false, manufacturer: false, model: false, record_number: false, serial_number: false, weight: false, observation: false });
        setErrorMessage({ image: "", name: "", manufacturer: "", model: "", record_number: "", serial_number: "", weight: "", observation: "" });
        setDisplayAlert({ display: false, type: "", message: "" });
        setDisabledButton(false);
        setOpen(false);
    };

    /*
    * Rotina 1
    */
    function handleEquipmentUpdateSubmit(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        if (formValidate(data)) {

            setDisabledButton(true);

            requestServerOperation(data);

        }

    }

    function handleUploadedImage(event) {

        if (event.currentTarget.files && event.currentTarget.files[0]) {
            setUploadedImage(URL.createObjectURL(event.target.files[0]));
        }

    }

    /*
    * Rotina 2
    */
    function formValidate(formData) {

        let nameValidation = FormValidation(formData.get("name"), 3, null, null, null);
        let manufacturerValidation = FormValidation(formData.get("manufacturer"), 3, null, null, null);
        let modelValidation = FormValidation(formData.get("model"), null, null, null, null);
        let recordNumberValidation = FormValidation(formData.get("record_number"), null, null, null, null);
        let serialNumberValidation = FormValidation(formData.get("serial_number"), null, null, null, null);
        let weightValidation = FormValidation(formData.get("weight"), null, null, null, null);
        let observationValidation = FormValidation(formData.get("observation"), 3, null, null, null);
        let purchaseValidation = purchaseDate != null ? { error: false, message: "" } : { error: true, message: "Selecione a data" };
        let imageValidation = uploadedImage == null ? { error: true, message: "Uma imagem precisa ser selecionada" } : { error: false, message: "" };

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

        if (nameValidation.error || manufacturerValidation.error || modelValidation.error || recordNumberValidation.error || serialNumberValidation.error || weightValidation.error || observationValidation.error || purchaseValidation.error || imageValidation.error) {

            return false;

        } else {

            return true;

        }

    }


    /*
    * Rotina 3
    */
    function requestServerOperation(data) {

        // Dados para o middleware de autenticação 
        const logged_user_id = AuthData.data.id;
        const module_id = 6;
        const module_action = "escrever";

        AxiosApi.patch(`/api/equipments-module-equipment/${data.get("equipment_id")}`, {
            auth: `${logged_user_id}.${module_id}.${module_action}`,
            image: uploadedImage,
            name: data.get("name"),
            manufacturer: data.get("manufacturer"),
            model: data.get("model"),
            record_number: data.get("record_number"),
            serial_number: data.get("serial_number"),
            weight: data.get("weight"),
            observation: data.get("observation"),
            purchase_date: purchaseDate
        })
            .then(function () {

                successServerResponseTreatment();

            })
            .catch(function (error) {

                errorServerResponseTreatment(error.response.data);

            });

    }

    /*
    * Rotina 3A
    */
    function successServerResponseTreatment() {

        setDisplayAlert({ display: true, type: "success", message: "Operação realizada com sucesso!" });

        setTimeout(() => {

            props.reload_table();
            setDisabledButton(false);
            handleClose();

        }, 2000);

    }

    /*
    * Rotina 3B
    */
    function errorServerResponseTreatment(response_data) {

        setDisabledButton(false);

        let error_message = (response_data.message != "" && response_data.message != undefined) ? response_data.message : "Houve um erro na realização da operação!";
        setDisplayAlert({ display: true, type: "error", message: error_message });

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let input_errors = {
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
        for (let prop in response_data.errors) {

            input_errors[prop] = {
                error: true,
                message: response_data.errors[prop][0]
            }

        }

        setErrorDetected({
            image: input_errors.image.error,
            name: input_errors.name.error,
            manufacturer: input_errors.manufacturer.error,
            model: input_errors.model.error,
            record_number: input_errors.record_number.error,
            serial_number: input_errors.serial_number.error,
            weight: input_errors.weight.error,
            observation: input_errors.observation.error,
            purchase_date: input_errors.purchase_date.error
        });

        setErrorMessage({
            image: input_errors.image.message,
            name: input_errors.name.message,
            manufacturer: input_errors.manufacturer.message,
            model: input_errors.model.message,
            record_number: input_errors.record_number.message,
            serial_number: input_errors.serial_number.message,
            weight: input_errors.weight.message,
            observation: input_errors.observation.message,
            purchase_date: input_errors.purchase_date.message
        });

    }

    return (
        <>
            <Tooltip title="Editar">
                <IconButton onClick={handleClickOpen} disabled={AuthData.data.user_powers["6"].profile_powers.escrever == 1 ? false : true}>
                    <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["6"].profile_powers.escrever == 1 ? "#00713A" : "#808991"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }}>
                <DialogTitle>ATUALIZAÇÃO | ID: {props.record.equipment_id}</DialogTitle>

                <Box component="form" noValidate onSubmit={handleEquipmentUpdateSubmit} >

                    <DialogContent>

                        <DialogContentText sx={{ mb: 3 }}>
                            Formulário para atualização do registro do equipamento.
                        </DialogContentText>

                        <Box sx={{ mb: 3 }}>
                            <label htmlFor="contained-button-file">
                                <Input accept=".png, .jpg, .svg" id="contained-button-file" multiple type="file" name="flight_log_file" onChange={handleUploadedImage} />
                                <Button variant="contained" component="span" color={errorDetected.image ? "error" : "primary"} startIcon={<FontAwesomeIcon icon={faFile} color={"#fff"} size="sm" />}>
                                    {errorDetected.image ? errorMessage.image : "Escolher imagem"}
                                </Button>
                            </label>
                        </Box>

                        <TextField
                            type="text"
                            margin="dense"
                            label="ID do equipamento"
                            fullWidth
                            variant="outlined"
                            required
                            id="equipment_id"
                            name="equipment_id"
                            defaultValue={props.record.equipment_id}
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
                            helperText={errorMessage.name}
                            error={errorDetected.name}
                            defaultValue={props.record.name}
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
                            defaultValue={props.record.manufacturer}
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
                            defaultValue={props.record.model}
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
                            defaultValue={props.record.record_number}
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
                            helperText={errorMessage.weight}
                            error={errorDetected.weight}
                            defaultValue={props.record.weight}
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
                            defaultValue={props.record.observation}
                        />

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <DateTimeInput
                                event={setPurchaseDate}
                                label={"Data da compra"}
                                helperText={errorMessage.purchase_date}
                                error={errorDetected.purchase_date}
                                defaultValue={props.record.purchase_date}
                                operation={"create"}
                                read_only={false}
                            />
                        </Box>

                    </DialogContent>

                    {displayAlert.display &&
                        <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                    }

                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" disabled={disabledButton} variant="contained">Confirmar atualização</Button>
                    </DialogActions>

                </Box>

            </Dialog>
        </>
    )
});