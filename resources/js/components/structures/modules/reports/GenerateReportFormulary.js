// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Alert, IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import LinearProgress from '@mui/material/LinearProgress';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
// Custom
import { GenericSelect } from '../../input_select/GenericSelect';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { DatePicker } from "../../date_picker/DatePicker";
import { ReportDocumentVisualization, ReportDocument } from "../../../structures/report_builder/ReportBuilder";
// Lib
import AxiosApi from '../../../../services/AxiosApi';


export const GenerateReportFormulary = React.memo((props) => {

    // ============================================================================== STATES AND VARIABLES ============================================================================== //

    const { AuthData } = useAuthentication();
    const [loading, setLoading] = React.useState(false);
    const [weatherLoading, setWeatherLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
    const [controlledInput, setControlledInput] = React.useState(
        {
            name: '',
            client: '0',
            state: props.record.flight_plan.localization.state,
            city: props.record.flight_plan.localization.city,
            farm: '',
            area: '',
            date: props.record.log.datetime,
            number: '',
            dosage: '',
            provider: '',
            responsible: '0',
            temperature: '',
            humidity: '',
            wind: ''
        });

    const [fieldError, setFieldError] = React.useState({ name: false, client: false, state: false, city: false, farm: false, area: false, date: false, number: false, dosage: false, responsible: false, provider: false, temperature: false, humidity: false, wind: false });
    const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ name: '', client: '', state: '', city: '', farm: '', area: '', date: '', number: '', dosage: '', responsible: '', provider: '', temperature: '', humidity: '', wind: '' });

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {
        if (controlledInput.temperature == '' && controlledInput.humidity == '' && controlledInput.wind == '') {
            handleLoadWeather();
        }
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {

        setDisplayAlert({ display: false, type: "", message: "" });

        setOpen(false);

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

    const handleReportGenerate = (e) => {
        e.preventDefault();

        /*AxiosApi.post("api/export-report-pdf", controlledInput)
            .then((response) => {

                const base64PDF = response.data;

                let bin = atob(base64PDF);
                let obj = document.createElement('object');
                obj.style.width = '100%';
                obj.style.height = '842pt';
                obj.type = 'application/pdf';
                obj.data = 'data:application/pdf;base64,' + base64PDF;
                document.body.appendChild(obj);

                // Insert a link that allows the user to download the PDF file
                let link = document.createElement('a');
                link.innerHTML = 'Download PDF file';
                link.download = 'file.pdf';
                link.href = 'data:application/octet-stream;base64,' + base64PDF;
                document.body.appendChild(link);
                link.click();

            })
            .catch(function (error) {

                console.log(error);
                errorServerRequestTreatment(error.response);

            });*/

    }

    const errorServerRequestTreatment = (response) => {

        const error_message = response.data.message ? response.data.message : "Erro do servidor";
        setDisplayAlert({ display: true, type: "error", message: error_message });

        // Errors by key that can be returned from backend validation
        let request_errors = {
            name: { error: false, message: null },
            client: { error: false, message: null },
            state: { error: false, message: null },
            city: { error: false, message: null },
            farm: { error: false, message: null },
            area: { error: false, message: null },
            date: { error: false, message: null },
            number: { error: false, message: null },
            dosage: { error: false, message: null },
            temperature: { error: false, message: null },
            humidity: { error: false, message: null },
            wind: { error: false, message: null },
            provider: { error: false, message: null },
            responsible: { error: false, message: null }
        }

        // Get errors by their key 
        for (let prop in response.data.errors) {

            request_errors[prop] = {
                error: true,
                message: response.data.errors[prop][0]
            }

        }

        setFieldError({
            name: request_errors.name.error,
            client: request_errors.client.error,
            state: request_errors.state.error,
            city: request_errors.city.error,
            farm: request_errors.farm.error,
            area: request_errors.area.error,
            date: request_errors.date.error,
            number: request_errors.number.error,
            dosage: request_errors.dosage.error,
            temperature: request_errors.temperature.error,
            humidity: request_errors.humidity.error,
            wind: request_errors.wind.error,
            provider: request_errors.provider.error,
            responsible: request_errors.responsible.error
        });

        setFieldErrorMessage({
            name: request_errors.name.message,
            client: request_errors.client.message,
            city: request_errors.city.message,
            farm: request_errors.farm.message,
            area: request_errors.area.message,
            date: request_errors.date.message,
            number: request_errors.number.message,
            dosage: request_errors.dosage.message,
            temperature: request_errors.temperature.message,
            humidity: request_errors.humidity.message,
            wind: request_errors.wind.message,
            provider: request_errors.provider.message,
            responsible: request_errors.responsible.message
        });
    }

    // ============================================================================== STRUCTURE ============================================================================== //

    return (
        <>

            <Tooltip title="Gerar relatório">
                <IconButton disabled={AuthData.data.user_powers["4"].profile_powers.read == 1 ? false : true} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faFileCirclePlus} size="sm" color={AuthData.data.user_powers["4"].profile_powers.read == 1 ? "green" : "#808991"} />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: 15 } }} fullWidth>
                <DialogTitle>GERAÇÃO DE RELATÓRIO</DialogTitle>

                {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
                <Box component="form" noValidate onSubmit={handleReportGenerate}>

                    <DialogContent>

                        <Box mb={2}>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        id="name"
                                        name="name"
                                        label="Nome do relatório"
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleInputChange}
                                        value={controlledInput.name}
                                        error={fieldError.name}
                                        helperText={fieldErrorMessage.name}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        id="name"
                                        name="state"
                                        label="Estado"
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleInputChange}
                                        value={controlledInput.state}
                                        error={fieldError.state}
                                        helperText={fieldErrorMessage.state}
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
                                        error={fieldError.city}
                                        helperText={fieldErrorMessage.city}
                                        inputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        name="farm"
                                        label="Fazenda"
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleInputChange}
                                        helperText={fieldErrorMessage.farm}
                                        error={fieldError.farm}
                                        value={controlledInput.farm}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Box mb={2}>

                            <Grid container spacing={2}>
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
                                    <GenericSelect
                                        label_text={"Responsável (piloto)"}
                                        data_source={"/api/load-users?where=profile_id.3"}
                                        primary_key={"name"}
                                        key_content={"name"}
                                        error={fieldError.responsible}
                                        name={"responsible"}
                                        value={controlledInput.responsible}
                                        setControlledInput={setControlledInput}
                                        controlledInput={controlledInput}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <GenericSelect
                                        label_text={"Cliente"}
                                        data_source={"/api/load-users?where=profile_id.4"}
                                        primary_key={"name"}
                                        key_content={"name"}
                                        error={fieldError.client}
                                        name={"client"}
                                        value={controlledInput.client}
                                        setControlledInput={setControlledInput}
                                        controlledInput={controlledInput}
                                    />
                                </Grid>

                                <Grid item xs={12}>
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

                        </Box>

                        <Box>

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
                                        value={weatherLoading ? "Carregando" : controlledInput.temperature}
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
                                        value={weatherLoading ? "Carregando" : controlledInput.humidity}
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
                                        value={weatherLoading ? "Carregando" : controlledInput.wind}
                                        inputProps={{
                                            readOnly: true
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>

                        </Box>

                    </DialogContent>

                    {displayAlert.display &&
                        <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                    }

                    {loading && <LinearProgress />}

                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <ReportDocumentVisualization data={controlledInput} />
                        <Button type="submit" variant='contained'>Exportar</Button>
                    </DialogActions>

                </Box>


            </Dialog >
        </>

    );

});