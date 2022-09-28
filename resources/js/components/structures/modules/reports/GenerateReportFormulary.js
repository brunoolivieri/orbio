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
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
// Custom
import { AutoCompleteState } from '../../input_select/AutoCompleteState';
import { AutoCompleteCity } from '../../input_select/AutoCompleteCity';
import { GenericSelect } from '../../input_select/GenericSelect';
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import { ReportBuilder } from '../../report_builder/ReportBuilder';
import { DatePicker } from "../../date_picker/DatePicker";

export const GenerateReportFormulary = React.memo((props) => {

  // API - states and cities: https://servicodados.ibge.gov.br/api/docs/localidades#api-Municipios-municipiosGet
  // API - weather: 

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [open, setOpen] = React.useState(false);
  const [displayAlert, setDisplayAlert] = React.useState({ display: false, type: "", message: "" });
  const [controlledInput, setControlledInput] = React.useState({ name: '', client: '', farm: '', area: '', date: props.record.datetime, number: '', product: '', responsible: '', temperature: '', humidity: '', wind: '' });
  const [fieldError, setFieldError] = React.useState({ name: false, client: false, state: false, city: false, farm: false, area: false, date: false, number: false, product: false, responsible: false, temperature: false, humidity: false, wind: false });
  const [fieldErrorMessage, setFieldErrorMessage] = React.useState({ name: '', client: '', state: '', city: '', farm: '', area: '', date: '', number: '', product: '', responsible: '', temperature: '', humidity: '', wind: '' });
  const [selectedState, setSelectedState] = React.useState(null);
  const [selectedCity, setSelectedCity] = React.useState(null);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

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

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA ============================================================================== //

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
        <Box component="form" noValidate>

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
                  />
                </Grid>

                <Grid item xs={4}>
                  <GenericSelect
                    label_text={"Cliente"}
                    data_source={"/api/load-users?where=profile_id.4"}
                    primary_key={"id"}
                    key_content={"name"}
                    error={fieldError.client}
                    name={"client"}
                    value={controlledInput.client}
                    setControlledInput={setControlledInput}
                    controlledInput={controlledInput}
                  />
                </Grid>

                <Grid item xs={4}>
                  <AutoCompleteState
                    label={"Estados"}
                    source={"https://servicodados.ibge.gov.br/api/v1/localidades/estados"}
                    primary_key={"id"}
                    key_text={"sigla"}
                    error={fieldError.state}
                    name={"state"}
                    setSelectedState={setSelectedState}
                    setControlledInput={setControlledInput}
                    controlledInput={controlledInput}
                  />
                </Grid>

                <Grid item xs={4}>
                  {(selectedState != null) &&
                    <AutoCompleteCity
                      label={"Cidades"}
                      source={"https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + selectedState + "/municipios"}
                      primary_key={"id"}
                      key_text={"nome"}
                      error={fieldError.city}
                      name={"city"}
                      setSelectedCity={setSelectedCity}
                      setControlledInput={setControlledInput}
                      controlledInput={controlledInput}
                    />
                  }
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
                    helperText={fieldErrorMessage.date}
                    error={fieldError.date}
                    value={controlledInput.date}
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
                    name="product"
                    label="Ovos/Ha"
                    fullWidth
                    variant="outlined"
                    onChange={handleInputChange}
                    helperText={fieldErrorMessage.product}
                    error={fieldError.product}
                    value={controlledInput.product}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="responsible"
                    label="Responsável"
                    fullWidth
                    variant="outlined"
                    onChange={handleInputChange}
                    helperText={fieldErrorMessage.responsible}
                    error={fieldError.responsible}
                    value={controlledInput.responsible}
                  />
                </Grid>
              </Grid>

            </Box>

            <Box>

              <Typography component={'p'} mb={1}>Informe a data e região para buscar os dados climáticos.</Typography>

              <Grid container spacing={2} columns={13}>
                <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Tooltip title="Delete">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    id="name"
                    name="name"
                    label="Temperatura (Cº)"
                    fullWidth
                    variant="outlined"
                    helperText={fieldErrorMessage.temperature}
                    error={fieldError.temperature}
                    value={controlledInput.temperature}
                    inputProps={{
                      readOnly: true
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    id="email"
                    name="email"
                    label="Umidade"
                    fullWidth
                    variant="outlined"
                    helperText={fieldErrorMessage.humidity}
                    error={fieldError.humidity}
                    value={controlledInput.humidity}
                    inputProps={{
                      readOnly: true
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    id="email"
                    name="email"
                    label="Vento (Km/h)"
                    fullWidth
                    helperText={fieldErrorMessage.wind}
                    error={fieldError.wind}
                    value={controlledInput.wind}
                    inputProps={{
                      readOnly: true
                    }}
                  />
                </Grid>
              </Grid>

            </Box>

          </DialogContent>

          {displayAlert.display &&
            <Alert severity={displayAlert.type} variant="filled">{displayAlert.message}</Alert>
          }

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <ReportBuilder />
            <Button type="submit" variant="contained">Confirmar</Button>
          </DialogActions>

        </Box>


      </Dialog >
    </>

  );

});