import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress,  Grid, TextField, Divider } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Custom
import { useAuth } from '../../../../../context/Auth';
import { FormValidation } from '../../../../../../utils/FormValidation';
import axios from '../../../../../../services/AxiosApi';

const initialFieldError = { name: false, flight_plan_id: false };
const initialFieldErrorMessage = { name: "", flight_plan_id: "" };
const initialDisplatAlert = { display: false, type: "", message: "" };

export const UpdateLog = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();
    const [open, setOpen] = React.useState(false);
    const [controlledInput, setControlledInput] = React.useState({ id: props.record.id, name: props.record.name });
    const [fieldError, setFieldError] = React.useState(initialFieldError);
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
    const [loading, setLoading] = React.useState(false);

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleClickOpen() {
        setOpen(true);
        setLoading(false);
        setFieldError(initialFieldError);
        setFieldErrorMessage(initialFieldErrorMessage);
        setDisplayAlert(initialDisplatAlert);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleSubmit() {
        if (formValidation()) {
            setLoading(true);
            requestServerOperation();
        }
    }

    function formValidation() {
        const nameValidate = FormValidation(controlledInput.name, 3, null, null, null);

        setFieldError({ name: nameValidate.error });
        setFieldErrorMessage({ name: nameValidate.message });

        return !(nameValidate.error);
    }

    function requestServerOperation() {

        let data = {
            name: controlledInput.name
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

    function successResponse(response) {
        setDisplayAlert({ display: true, type: "success", message: response.data.message });
        setTimeout(() => {
            props.reloadTable((old) => !old);
            setLoading(false);
            handleClose();
        }, 2000);
    }

    function errorResponse(response) {
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

    function handleInputChange(e) {
        setControlledInput({ ...controlledInput, [e.target.name]: e.currentTarget.value });
    }

    // ============================================================================== STRUCTURES - MUI ============================================================================== //

    return (
        <>

            <Tooltip title="Editar">
                <IconButton disabled={!user.user_powers["2"].profile_powers.write == 1} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faPen} color={user.user_powers["2"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>ATUALIZAÇÃO DE LOG</DialogTitle>
                <Divider />

                <DialogContent>

                    <Grid item container spacing={1}>

                        <Grid item xs={12} hidden>
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

                        <Grid item xs={12}>
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

                    </Grid>

                </DialogContent>

                {displayAlert.display &&
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
    );
});