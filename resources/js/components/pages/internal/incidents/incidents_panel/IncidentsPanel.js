// React
import * as React from 'react';
// Custom
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { CreateIncidentFormulary } from "../../../../structures/modules/incidents/CreateIncidentFormulary";
import { UpdateIncidentFormulary } from "../../../../structures/modules/incidents/UpdateIncidentFormulary";
import { DeleteIncidentFormulary } from "../../../../structures/modules/incidents/DeleteIncidentFormulary";
import { BackdropLoading } from "../../../../structures/backdrop_loading/BackdropLoading";
// Material UI
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { InputAdornment } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TablePagination from '@mui/material/TablePagination';
import Table from '@mui/material/Table';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
// Outros
import moment from 'moment';
import { useSnackbar } from 'notistack';

const StyledHeadTableCell = styled(TableCell)({
  color: '#fff',
  fontWeight: 700
});


export const IncidentsPanel = React.memo(() => {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();

  const [records, setRecords] = React.useState([]);

  const [pagination, setPagination] = React.useState({ total_records: 0, records_per_page: 0, total_pages: 0 });

  const [paginationParams, setPaginationParams] = React.useState({ page: 1, limit: 10, where: 0, total_records: 0 });

  const [loading, setLoading] = React.useState(true);

  // State do registro selecionado
  // Quando um registro é selecionado, seu índice é salvo nesse state
  // Os modais de update e delete são renderizados e recebem panelData.response.records[selectedRecordIndex]
  const [selectedRecordIndex, setSelectedRecordIndex] = React.useState(null);

  const [searchField, setSearchField] = React.useState("");

  const { enqueueSnackbar } = useSnackbar();

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  React.useEffect(() => {

    if (!paginationParams.where) {

      requestToGetAllIncidents();

    } else {

      requestToGetSearchedIncidents();

    }

  }, [paginationParams]);

  const requestToGetAllIncidents = () => {

    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

    AxiosApi.get(`/api/incidents-module?args=${select_query_params}`)
      .then(function (response) {

        setLoading(false);
        setRecords(response.data.records);
        setPagination({ total_records: response.data.total_records_founded, records_per_page: response.data.records_per_page, total_pages: response.data.total_pages });

        if (response.data.total_records_founded > 1) {
          handleOpenSnackbar(`Foram encontrados ${response.data.total_records_founded} incidentes`, "success");
        } else {
          handleOpenSnackbar(`Foi encontrado ${response.data.total_records_founded} incidente`, "success");
        }

      })
      .catch(function (error) {

        const error_message = error.response.data.message ? error.response.data.message : "Erro do servidor";
        handleOpenSnackbar(error_message, "error");

        setLoading(false);
        setRecords([]);
        setPagination({ total_records: 0, records_per_page: 0, total_pages: 0 });

      });

  }

  const requestToGetSearchedIncidents = () => {

    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

    AxiosApi.get(`/api/incidents-module/show?args=${select_query_params}`)
      .then(function (response) {

        setLoading(false);
        setRecords(response.data.records);
        setPagination({ total_records: response.data.total_records_founded, records_per_page: response.data.records_per_page, total_pages: response.data.total_pages });

        if (response.data.total_records_founded > 1) {
          handleOpenSnackbar(`Foram encontrados ${response.data.total_records_founded} incidentes`, "success");
        } else {
          handleOpenSnackbar(`Foi encontrado ${response.data.total_records_founded} incidente`, "success");
        }

      })
      .catch(function (error) {

        const error_message = error.response.data.message ? error.response.data.message : "Erro do servidor";
        handleOpenSnackbar(error_message, "error");

        setLoading(false);
        setRecords([]);
        setPagination({ total_records: 0, records_per_page: 0, total_pages: 0 });

      });

  }

  const handleTablePageChange = (event, value) => {

    setPaginationParams({
      page: value + 1,
      limit: paginationParams.limit,
      where: paginationParams.where
    });

  };

  const handleChangeRowsPerPage = (event) => {

    setPaginationParams({
      page: 1,
      limit: event.target.value,
      where: paginationParams.where
    });

  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    setPaginationParams({
      page: 1,
      limit: paginationParams.limit,
      where: searchField
    });

  }

  const reloadTable = () => {

    setSelectedRecordIndex(null);

    setLoading(false);
    setRecords([]);
    setPagination({ total_records: 0, records_per_page: 0, total_pages: 0 });

    setPaginationParams({
      page: 1,
      limit: paginationParams.limit,
      where: 0
    });

  }

  const handleClickRadio = (event) => {

    if (event.target.value === selectedRecordIndex) {
      setSelectedRecordIndex(null);
    } else if (event.target.value != selectedRecordIndex) {
      setSelectedRecordIndex(event.target.value);
    }

  }

  const handleOpenSnackbar = (text, variant) => {

    enqueueSnackbar(text, { variant });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - MATERIAL UI ============================================================================== //

  return (
    <>
      {loading && <BackdropLoading />}
      <Grid container spacing={1} alignItems="center" mb={1}>

        <Grid item>
          <CreateIncidentFormulary reload_table={reloadTable} />
        </Grid>

        <Grid item>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro para editar">
              <IconButton disabled={AuthData.data.user_powers["5"].profile_powers.write == 1 ? false : true}>
                <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["5"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {(!loading && selectedRecordIndex != null) &&
            <UpdateIncidentFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro para excluir">
              <IconButton disabled={AuthData.data.user_powers["5"].profile_powers.write == 1 ? false : true} >
                <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["5"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {(!loading && selectedRecordIndex != null) &&
            <DeleteIncidentFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          <Tooltip title="Carregar">
            <IconButton onClick={reloadTable}>
              <FontAwesomeIcon icon={faArrowsRotate} size="sm" id="reload_icon" color='#007937' />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item xs>
          <TextField
            fullWidth
            placeholder={"Pesquisar incidente por ID"}
            onChange={(e) => setSearchField(e.currentTarget.value)}
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <IconButton onClick={handleSearchSubmit}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" />
                  </IconButton>
                </InputAdornment>,
              disableunderline: 1,
              sx: { fontSize: 'default' },
            }}
            variant="outlined"
            id="search_input"
            sx={{ borderRadius: 30 }}
          />
        </Grid>

        {(!loading && records.length > 0) &&
          <Grid item>
            <Stack spacing={2}>
              <TablePagination
                labelRowsPerPage="Linhas por página: "
                component="div"
                count={pagination.total_records}
                page={paginationParams.page - 1}
                onPageChange={handleTablePageChange}
                rowsPerPage={paginationParams.limit}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Stack>
          </Grid>
        }

      </Grid>

      <FormControl fullWidth>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          value={selectedRecordIndex}
        >

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledHeadTableCell>ID</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Tipo do incidente</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Descrição</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Data do incidente</StyledHeadTableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tbody">
                {(!loading && records.length > 0) &&
                  records.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell><FormControlLabel value={index} control={<Radio onClick={(event) => { handleClickRadio(event) }} />} label={row.id} /></TableCell>
                      <TableCell align="center">{row.type}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                      <TableCell align="center">{moment(row.date).format('DD-MM-YYYY hh:mm')}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </RadioGroup>
      </FormControl>
    </>
  );
});