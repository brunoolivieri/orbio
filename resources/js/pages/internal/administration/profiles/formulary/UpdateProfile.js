import * as React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Grid, FormLabel, Checkbox, FormGroup, FormControlLabel, Divider, DialogContentText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FormValidation } from '../../../../../utils/FormValidation';
import { useAuth } from '../../../../../context/Auth';
import axios from '../../../../../services/AxiosApi';

const initialFormError = { name: { error: false, message: "" } }
const initialDisplayAlert = { display: false, type: "", message: "" };

export const UpdateProfile = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();
    const [formData, setFormData] = React.useState({ id: props.record.id, name: props.record.name, undelete: false });
    const [formError, setFormError] = React.useState(initialFormError);
    const [alert, setAlert] = React.useState(initialDisplayAlert);
    const [loading, setLoading] = React.useState(false);
    const [canSave, setCanSave] = React.useState(true);
    const [open, setOpen] = React.useState(false);

    const is_authorized = user.user_powers["1"].profile_powers.write;

    // Privileges selection function reducer
    function privilegesReducer(actual_state, action) {
        let cloneState = Object.assign({}, actual_state);
        cloneState[action.module][action.privilege] = action.new_value;
        return cloneState;
    }

    // Privileges reducer
    const [privileges, dispatchPrivileges] = React.useReducer(privilegesReducer, {
        "1": { read: props.record.modules[0].read == 1 ? true : false, write: props.record.modules[0].write == 1 ? true : false },
        "2": { read: props.record.modules[1].read == 1 ? true : false, write: props.record.modules[1].write == 1 ? true : false },
        "3": { read: props.record.modules[2].read == 1 ? true : false, write: props.record.modules[2].write == 1 ? true : false },
        "4": { read: props.record.modules[3].read == 1 ? true : false, write: props.record.modules[3].write == 1 ? true : false },
        "5": { read: props.record.modules[4].read == 1 ? true : false, write: props.record.modules[4].write == 1 ? true : false }
    });

    // Access data function reducer
    function accessDataReducer(actual_state, action) {
        let cloneState = Object.assign({}, actual_state);
        cloneState[action.field] = action.new_value ? 1 : 0;
        return cloneState;
    }

    // Access data reducer
    const [accessData, dispatchAccessData] = React.useReducer(accessDataReducer, {
        address: props.record.access_data.address,
        anac_license: props.record.access_data.anac_license,
        cpf: props.record.access_data.cpf,
        cnpj: props.record.access_data.cnpj,
        telephone: props.record.access_data.telephone,
        cellphone: props.record.access_data.cellphone,
        company_name: props.record.access_data.company_name,
        trading_name: props.record.access_data.trading_name
    });

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
        validation["name"] = FormValidation(formData["name"], 3, 255);
        setFormError(validation);
        return !(validation.name.error);
    }

    async function requestServer() {
        try {
            const response = await axios.patch(`api/module/administration-profile/${formData.id}`, {
                name: formData.name,
                privileges: privileges,
                access_data: accessData,
                undelete: formData.undelete
            });
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
            setLoading(false);
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

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

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
                <DialogTitle>ATUALIZAÇÃO DE PERFIL</DialogTitle>
                <Divider />

                <DialogContent>

                    <Grid container spacing={1} mb={2}>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                value={formData.name}
                                name="name"
                                label="Nome"
                                fullWidth
                                variant="outlined"
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

                    <DialogContentText>
                        Selecione abaixo o poder de acesso do perfil aos módulos existentes.
                    </DialogContentText>

                    <Grid container sx={{ mt: 2, mb: 2 }} spacing={1} alignItems="left">
                        <Grid item>
                            <FormLabel component="legend">Admin</FormLabel>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={privileges["1"].read} onChange={(event) => { dispatchPrivileges({ module: "1", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                <FormControlLabel control={<Checkbox checked={privileges["1"].write} onChange={(event) => { dispatchPrivileges({ module: "1", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                            </FormGroup>
                        </Grid>

                        <Grid item>
                            <FormLabel component="legend">Planos</FormLabel>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={privileges["2"].read} onChange={(event) => { dispatchPrivileges({ module: "2", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                <FormControlLabel control={<Checkbox checked={privileges["2"].write} onChange={(event) => { dispatchPrivileges({ module: "2", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                            </FormGroup>
                        </Grid>

                        <Grid item>
                            <FormLabel component="legend">Ordens</FormLabel>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={privileges["3"].read} onChange={(event) => { dispatchPrivileges({ module: "3", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                <FormControlLabel control={<Checkbox checked={privileges["3"].write} onChange={(event) => { dispatchPrivileges({ module: "3", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                            </FormGroup>
                        </Grid>

                        <Grid item>
                            <FormLabel component="legend">Relatórios</FormLabel>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={privileges["4"].read} onChange={(event) => { dispatchPrivileges({ module: "4", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                <FormControlLabel control={<Checkbox checked={privileges["4"].write} onChange={(event) => { dispatchPrivileges({ module: "4", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                            </FormGroup>
                        </Grid>

                        <Grid item>
                            <FormLabel component="legend">Equipamentos</FormLabel>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={privileges["5"].read} onChange={(event) => { dispatchPrivileges({ module: "5", privilege: "read", new_value: event.currentTarget.checked }) }} />} label="Ler" />
                                <FormControlLabel control={<Checkbox checked={privileges["5"].write} onChange={(event) => { dispatchPrivileges({ module: "5", privilege: "write", new_value: event.currentTarget.checked }) }} />} label="Escrever" />
                            </FormGroup>
                        </Grid>
                    </Grid>

                    <DialogContentText>
                        Selecione abaixo os dados que serão requisitados aos usuários vinculados a esse perfil.
                    </DialogContentText>

                    <Grid container sx={{ mt: 2 }} spacing={1} alignItems="left">

                        <Grid item xs={12} lg={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={accessData["address"]} onChange={(event) => { dispatchAccessData({ field: "address", new_value: event.currentTarget.checked }) }} />} label="Endereço" />
                            </FormGroup>
                        </Grid>

                        <Grid item xs={12} lg={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={accessData["anac_license"]} onChange={(event) => { dispatchAccessData({ field: "anac_license", new_value: event.currentTarget.checked }) }} />} label="Licença Anac" />
                            </FormGroup>
                        </Grid>

                        <Grid item xs={12} lg={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={accessData["cpf"]} onChange={(event) => { dispatchAccessData({ field: "cpf", new_value: event.currentTarget.checked }) }} />} label="CPF" />
                            </FormGroup>
                        </Grid>

                        <Grid item xs={12} lg={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={accessData["cnpj"]} onChange={(event) => { dispatchAccessData({ field: "cnpj", new_value: event.currentTarget.checked }) }} />} label="CNPJ" />
                            </FormGroup>
                        </Grid>

                        <Grid item xs={12} lg={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={accessData["telephone"]} onChange={(event) => { dispatchAccessData({ field: "telephone", new_value: event.currentTarget.checked }) }} />} label="Telefone" />
                            </FormGroup>
                        </Grid>

                        <Grid item xs={12} lg={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={accessData["cellphone"]} onChange={(event) => { dispatchAccessData({ field: "cellphone", new_value: event.currentTarget.checked }) }} />} label="Celular" />
                            </FormGroup>
                        </Grid>

                        <Grid item xs={12} lg={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={accessData["company_name"]} onChange={(event) => { dispatchAccessData({ field: "company_name", new_value: event.currentTarget.checked }) }} />} label="Razão Social" />
                            </FormGroup>
                        </Grid>

                        <Grid item xs={12} lg={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={accessData["trading_name"]} onChange={(event) => { dispatchAccessData({ field: "trading_name", new_value: event.currentTarget.checked }) }} />} label="Nome fantasia" />
                            </FormGroup>
                        </Grid>
                    </Grid>

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
    );
});