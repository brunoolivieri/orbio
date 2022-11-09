import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Box, Alert, LinearProgress, FormHelperText, Grid, TextField } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Custom
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../../utils/FormValidation';
import axios from '../../../../../services/AxiosApi';
import { SelectExternalData } from '../../../input_select/SelectExternalData';

const initialFieldError = { name: false, flight_plan_id: false };
const initialFieldErrorMessage = { name: "", flight_plan_id: "" };
const initialDisplatAlert = { display: false, type: "", message: "" };

export const UpdateLogFormulary = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();
    const [open, setOpen] = React.useState(false);
    const [controlledInput, setControlledInput] = React.useState({ id: props.record.id, name: props.record.name });
    const [fieldError, setFieldError] = React.useState(initialFieldError);
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
    const [loading, setLoading] = React.useState(false);

    // Select Inputs
    const [serviceOrdersByFlightPlan, setServiceOrdersByFlightPlan] = React.useState([]);
    const [flightPlans, setFlightPlans] = React.useState([]);
    const [selectedFlightPlan, setSelectedFlightPlan] = React.useState("");
    const [selectedServiceOrder, setSelectedServiceOrder] = React.useState("");

    // ============================================================================== FUNCTIONS ============================================================================== //

    const handleClickOpen = () => {
        setOpen(true);
        setLoading(false);
        setFieldError(initialFieldError);
        setFieldErrorMessage(initialFieldErrorMessage);
        setDisplayAlert(initialDisplatAlert);

        axios.get("/api/load-flight-plans", {
        })
            .then(function (response) {
                setFlightPlans(response.data);
                setSelectedFlightPlan(props.record.flight_plan.id);
                setSelectedServiceOrder(props.record.service_order.id);
            })
            .catch(function (error) {
                setLoading(false);
                errorResponse(error.response);
            });
    }

    const handleClose = () => {
        setOpen(false);
    }

    React.useEffect(() => {
        const url = "/api/load-service-orders-by-flight-plan?flight_plan_id=" + selectedFlightPlan;
        axios.get(url, {
        })
            .then(function (response) {
                setServiceOrdersByFlightPlan(response.data);
            })
            .catch(function (error) {
                setLoading(false);
                errorResponse(error.response);
            });
    }, [selectedFlightPlan]);

    const handleSubmitOperation = (event) => {
        event.preventDefault();
        if (formValidation()) {
            setLoading(true);
            requestServerOperation();
        }
    }

    const formValidation = () => {
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
            flight_plan_id: selectedFlightPlan,
            service_order_id: selectedServiceOrder
        }
        axios.patch(`/api/plans-module-logs/${controlledInput.id}`, data)
            .then(function (response) {
                setLoading(false);
                successResponse(response);
            })
            .catch(function (error) {
                setLoading(false);
                errorResponse(error.response);
            });
    }

    const successResponse = (response) => {
        setDisplayAlert({ display: true, type: "success", message: response.data.message });
        setTimeout(() => {
            props.record_setter(null);
            props.reload_table();
            setLoading(false);
            handleClose();
        }, 2000);
    }

    const errorResponse = (response) => {
        setDisplayAlert({ display: true, type: "error", message: response.data.message });

        let input_errors = {
            name: { error: false, message: null },
            flight_plan_id: { error: false, message: null },
            service_order_id: { error: false, message: null }
        }

        for (let prop in response.data.errors) {
            input_errors[prop] = {
                error: true,
                message: response.data.errors[prop][0]
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
                <IconButton disabled={!AuthData.data.user_powers["2"].profile_powers.write == 1} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["2"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>ATUALIZAÇÃO DO LOG</DialogTitle>
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