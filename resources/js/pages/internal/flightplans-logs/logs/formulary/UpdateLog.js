import * as React from 'react';
// MUI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Grid, TextField, Divider, Checkbox, FormControlLabel } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
// Custom
import { FormValidation } from '../../../../../utils/FormValidation';
import { useAuth } from '../../../../../context/Auth';
import axios from '../../../../../services/AxiosApi';

const fieldError = { error: false, message: "" }
const initialFormError = { name: fieldError };
const initialDisplayAlert = { display: false, type: "", message: "" };

export const UpdateLog = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({ id: props.record.id, name: props.record.name, undelete: false });
    const [formError, setFormError] = React.useState(initialFormError);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
    const [loading, setLoading] = React.useState(false);

    const is_authorized = !!user.user_powers["2"].profile_powers.write;

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleClickOpen() {
        setOpen(true);
        setLoading(false);
        setFormError(initialFormError);
        setDisplayAlert(initialDisplayAlert);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleSubmit() {
        if (!formSubmissionValidation()) return '';

        setLoading(true);
        requestServer();
    }

    function formSubmissionValidation() {

        let validation = Object.assign({}, formError);
        validation["name"] = FormValidation(formData.name, 3, 255);

        setFormError(validation);

        return !(validation.name.error);
    }

    async function requestServer() {
        try {
            const response = await axios.patch(`api/module/flight-plans-logs/${formData.id}`, {
                name: formData.name,
                undelete: formData.undelete
            });
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
            setLoading(false);
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

    function handleInputChange(e) {
        setFormData({ ...formData, [e.target.name]: e.currentTarget.value });
    }

    // ============================================================================== JSX ============================================================================== //

    return (
        <>

            <Tooltip title="Editar">
                <IconButton disabled={!is_authorized} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faPen} color={is_authorized ? "#007937" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="xl"
            >
                <DialogTitle>ATUALIZAÇÃO DE LOG</DialogTitle>
                <Divider />

                <DialogContent>

                    <Grid item container spacing={1}>

                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Nome customizado"
                                type="text"
                                fullWidth
                                name="name"
                                variant="outlined"
                                value={formData.name}
                                onChange={handleInputChange}
                                helperText={formError.name.message}
                                error={formError.name.error}
                            />
                        </Grid>

                        {props.record.deleted_at &&
                            <Grid item xs={12}>
                                <FormControlLabel name="undelete" control={<Checkbox />} label="Recuperar" onChange={(e) => setFormData({ ...formData, ["undelete"]: e.target.checked })} />
                            </Grid>
                        }
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