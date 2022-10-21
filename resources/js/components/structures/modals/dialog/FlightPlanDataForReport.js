// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
// Custom
import { DatePicker } from "../../date_picker/DatePicker";
// Lib
import AxiosApi from '../../../../services/AxiosApi';
import moment from 'moment';

const initialFieldError = {
    area: false,
    date: false,
    number: false,
    dosage: false,
    responsible: false,
    provider: false,
    temperature: false,
    humidity: false,
    wind: false
}

const initialFieldErrorMessage = {
    area: '',
    date: '',
    number: '',
    dosage: '',
    responsible: '',
    provider: '',
    temperature: '',
    humidity: '',
    wind: ''
}

export const FlightPlanDataForReport = React.memo((props) => {

    // ============================================================================== STATES  ============================================================================== //

    const [loading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [controlledInput, setControlledInput] = React.useState(props.current.data);
    const [fieldError, setFieldError] = React.useState(initialFieldError);
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState(initialFieldErrorMessage);
    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
    const [weatherLoading, setWeatherLoading] = React.useState(false);

    // ============================================================================== FUNCTIONS ============================================================================== //

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setDisplayAlert({ display: false, type: "", message: "" });
        setOpen(false);
    }

    const handleSave = () => {

        // Must be 10
        let cont_validated_inputs = 0;

        for (let key in controlledInput) {
            if (key != 'completed' && key != 'date') {
                if (controlledInput[key].length > 0) {
                    cont_validated_inputs++;
                }
            } else if (key != 'completed' && key === 'date') {
                if (moment(controlledInput[key]).format('YYYY-MM-DD').length > 0) {
                    cont_validated_inputs++;
                }
            }
        }

        // Clone from original flightPlans array to modify it
        let flight_plans_data_clone = [...props.flightPlans];

        // If form was completed or not
        if (cont_validated_inputs != 10) {
            controlledInput.completed = false;
        } else {
            controlledInput.completed = true;
        }

        flight_plans_data_clone[props.current.array_index] = controlledInput;
        console.log(flight_plans_data_clone);
        props.setFlightPlans(flight_plans_data_clone);
        handleClose();

    }

    const handleInputChange = (event) => {
        setControlledInput({ ...controlledInput, [event.target.name]: event.currentTarget.value });
    }

    const handleLoadWeather = () => {

        setWeatherLoading(true);

        const state = controlledInput.state;
        const city = controlledInput.city;

        AxiosApi.get(`api/get-weather-data?state=${state}&city=${city}`)
            .then((response) => {

                setWeatherLoading(false);

                const temperature = response.data.temperature;
                const humidity = response.data.humidity;
                const wind = response.data.wind_speedy.split(" ")[0];

                setControlledInput({ ...controlledInput, ['temperature']: temperature, ['humidity']: humidity, ['wind']: wind });

            })
            .catch(function (error) {

                setWeatherLoading(false);
                console.log(error);

            });
    }


    // ============================================================================== STRUCTURES - MUI ============================================================================== //

    return (
        <>

            <IconButton edge="end" onClick={handleClickOpen}>
                <SettingsIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>{`PLANO DE VOO | ID: ${controlledInput.id}`}</DialogTitle>
                <DialogContent>

                    <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>

                        <Grid item xs={6}>
                            <TextField
                                id="name"
                                name="state"
                                label="Estado"
                                fullWidth
                                variant="outlined"
                                onChange={handleInputChange}
                                value={controlledInput.state}
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                id="name"
                                name="city"
                                label="Cidade"
                                fullWidth
                                variant="outlined"
                                onChange={handleInputChange}
                                value={controlledInput.city}
                                inputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                name="area"
                                label="Área total aplicada"
                                fullWidth
                                variant="outlined"
                                onChange={handleInputChange}
                                helperText={fieldErrorMessage.area}
                                error={fieldError.area}
                                value={controlledInput.area}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <DatePicker
                                name="date"
                                label="Data da aplicação"
                                inputFormat="dd/MM/yyyy hh:mm"
                                helperText={fieldErrorMessage.date}
                                error={fieldError.date}
                                value={controlledInput.date}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                name="number"
                                label="Número da aplicação"
                                fullWidth
                                variant="outlined"
                                onChange={handleInputChange}
                                helperText={fieldErrorMessage.number}
                                error={fieldError.number}
                                value={controlledInput.number}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                name="dosage"
                                label="Dosagem"
                                fullWidth
                                variant="outlined"
                                onChange={handleInputChange}
                                helperText={fieldErrorMessage.dosage}
                                error={fieldError.dosage}
                                value={controlledInput.dosage}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                name="responsible"
                                label="Responsável (piloto)"
                                fullWidth
                                variant="outlined"
                                onChange={handleInputChange}
                                helperText={fieldErrorMessage.number}
                                error={fieldError.number}
                                value={controlledInput.responsible}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                name="provider"
                                label="Fornecedor"
                                fullWidth
                                variant="outlined"
                                onChange={handleInputChange}
                                helperText={fieldErrorMessage.provider}
                                error={fieldError.provider}
                                value={controlledInput.provider}
                            />
                        </Grid>
                    </Grid>

                    <Typography component={'p'} mb={3}>Para buscar os dados climáticos informe o estado, cidade e data.</Typography>

                    <Grid container spacing={2} columns={13}>
                        <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Tooltip title="Carregar clima">
                                <IconButton onClick={() => handleLoadWeather()}>
                                    <SearchIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                label="Temperatura (Cº)"
                                fullWidth
                                variant="outlined"
                                helperText={fieldErrorMessage.temperature}
                                error={fieldError.temperature}
                                value={controlledInput.temperature}
                                inputProps={{
                                    readOnly: true
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                label="Umidade"
                                fullWidth
                                variant="outlined"
                                helperText={fieldErrorMessage.humidity}
                                error={fieldError.humidity}
                                value={controlledInput.humidity}
                                inputProps={{
                                    readOnly: true
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                label="Vento (Km/h)"
                                fullWidth
                                helperText={fieldErrorMessage.wind}
                                error={fieldError.wind}
                                value={controlledInput.wind}
                                inputProps={{
                                    readOnly: true
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                </DialogContent>

                {displayAlert.display &&
                    <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                }

                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button variant='contained' onClick={handleSave}>Salvar</Button>
                </DialogActions>

            </Dialog >
        </>
    );
})