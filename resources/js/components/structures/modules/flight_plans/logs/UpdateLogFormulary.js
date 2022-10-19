// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Custom
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../../utils/FormValidation';
import AxiosApi from '../../../../../services/AxiosApi';
import { SelectExternalData } from '../../../input_select/SelectExternalData';

export const UpdateLogFormulary = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();
    const [open, setOpen] = React.useState(false);
    const [controlledInput, setControlledInput] = React.useState({
        id: props.record.id, name: props.record.name,
        flight_plan_id: props.record.flight_plan != null ? props.record.flight_plan.id : "0",
        service_order_id: props.record.service_order != null ? props.record.service_order.id : "0"
    });
    const [fieldError, setFieldError] = React.useState({ name: false, flight_plan_id: false });
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ name: "", flight_plan_id: "" });
    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
    const [loading, setLoading] = React.useState(false);

    // Select Inputs
    const [serviceOrdersByFlightPlan, setServiceOrdersByFlightPlan] = React.useState([]);
    const [flightPlans, setFlightPlans] = React.useState([]);
    const [selectedFlightPlan, setSelectedFlightPlan] = React.useState("0");
    const [selectedServiceOrder, setSelectedServiceOrder] = React.useState("0");

    // ============================================================================== FUNCTIONS ============================================================================== //

    const handleClickOpen = () => {
        setOpen(true);
        setLoading(false);
        setFieldError({ name: false });
        setFieldErrorMessage({ name: "" });
        setDisplayAlert({ display: false, type: "", message: "" });

        AxiosApi.get("/api/load-flight-plans", {
        })
            .then(function (response) {
                setFlightPlans(response.data);
                setSelectedFlightPlan("0");
                setSelectedServiceOrder("0");
            })
            .catch(function (error) {
                setLoading(false);
                errorServerResponseTreatment(error.response);
            });
    }

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {

        const url = "/api/load-service-orders-by-flight-plan?flight_plan_id=" + selectedFlightPlan;

        AxiosApi.get(url, {
        })
            .then(function (response) {
                setServiceOrdersByFlightPlan(response.data);
            })
            .catch(function (error) {
                setLoading(false);
                errorServerResponseTreatment(error.response);
            });

    }, [selectedFlightPlan]);

    const handleSubmitOperation = (event) => {
        event.preventDefault();

        if (submitedDataValidate()) {

            setLoading(true);
            requestServerOperation();

        }

    }

    const submitedDataValidate = () => {

        const nameValidate = FormValidation(controlledInput.name, 3, null, null, null);
        const flight_plan_validate = selectedFlightPlan != "0" ? { error: false, message: "" } : { error: true, message: "Selecione um plano de voo" };
        const service_order_validate = selectedServiceOrder != "0" ? { error: false, message: "" } : { error: true, message: "Selecione uma ordem de serviço" };

        setFieldError({ name: nameValidate.error, flight_plan_id: flight_plan_validate.error, service_order_id: service_order_validate.error });
        setFieldErrorMessage({ name: nameValidate.message, flight_plan_id: flight_plan_validate.message, service_order_id: service_order_validate.message });

        return !(nameValidate.error || flight_plan_validate.error || service_order_validate.error);

    }

    const requestServerOperation = () => {

        const data = {
            id: controlledInput.id,
            name: controlledInput.name,
            flight_plan_id: controlledInput.flight_plan_id,
            service_order_id: controlledInput.service_order_id
        }

        AxiosApi.patch(`/api/plans-module-logs/${controlledInput.id}`, data)
            .then(function () {

                setLoading(false);
                successServerResponseTreatment();

            })
            .catch(function (error) {

                setLoading(false);
                errorServerResponseTreatment(error.response.data);

            });

    }

    const successServerResponseTreatment = () => {

        setDisplayAlert({ display: true, type: "success", message: "Operação realizada com sucesso!" });

        setTimeout(() => {

            props.record_setter(null);
            props.reload_table();
            setLoading(false);
            handleClose();

        }, 2000);

    }

    const errorServerResponseTreatment = (response_data) => {

        let error_message = response_data.message ? response_data.message : "Erro do servidor!";
        setDisplayAlert({ display: true, type: "error", message: error_message });

        // Definição dos objetos de erro possíveis de serem retornados pelo validation do Laravel
        let input_errors = {
            name: { error: false, message: null },
            flight_plan_id: { error: false, message: null },
            service_order_id: { error: false, message: null }
        }

        // Coleta dos objetos de erro existentes na response
        for (let prop in response_data.errors) {

            input_errors[prop] = {
                error: true,
                message: response_data.errors[prop][0]
            }

        }

        setFieldError({
            name: input_errors.name.error,
            flight_plan_id: input_errors.flight_plan_id.error,
            service_order_id: input_errors.service_order_id.error
        });

        setFieldErrorMessage({
            name: input_errors.name.message,
            flight_plan_id: input_errors.flight_plan_id.message,
            service_order_id: input_errors.service_order_id.message
        });

    }

    const handleInputChange = (event) => {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }

    // ============================================================================== STRUCTURES - MUI ============================================================================== //

    return (
        <>

            <Tooltip title="Editar">
                <IconButton disabled={AuthData.data.user_powers["4"].profile_powers.write == 1 ? false : true} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["4"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>ATUALIZAÇÃO | RELATÓRIO (ID: {props.record.report_id})</DialogTitle>

                <Box component="form" noValidate onSubmit={handleSubmitOperation} >

                    <DialogContent>

                        <Grid item container spacing={1}>

                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="id"
                                    name="id"
                                    label="ID"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    defaultValue={props.record.id}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} mb={1}>
                                <TextField
                                    margin="dense"
                                    label="Nome customizado"
                                    type="text"
                                    fullWidth
                                    name="name"
                                    variant="outlined"
                                    value={controlledInput.name}
                                    onChange={handleInputChange}
                                    helperText={fieldErrorMessage.name}
                                    error={fieldError.name}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <SelectExternalData
                                    label_text={"Plano de voo"}
                                    primary_key={"id"}
                                    key_content={"name"}
                                    setter={setSelectedFlightPlan}
                                    options={flightPlans}
                                    error={fieldError.flight_plan_id}
                                    value={selectedFlightPlan}
                                />
                                <FormHelperText error>{fieldErrorMessage.flight_plan_id}</FormHelperText>
                            </Grid>

                            <Grid item xs={6}>
                                <SelectExternalData
                                    label_text={"Ordem de serviço"}
                                    primary_key={"id"}
                                    key_content={"number"}
                                    setter={setSelectedServiceOrder}
                                    options={serviceOrdersByFlightPlan}
                                    error={fieldError.service_order_id}
                                    value={selectedServiceOrder}
                                />
                                <FormHelperText error>{fieldErrorMessage.service_order_id}</FormHelperText>
                            </Grid>

                        </Grid>

                    </DialogContent>

                    {displayAlert.display &&
                        <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                    }

                    {loading && <LinearProgress />}

                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" disabled={loading} variant="contained">Confirmar</Button>
                    </DialogActions>

                </Box>

            </Dialog>

        </>

    );

});