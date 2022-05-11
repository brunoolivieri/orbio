// React
import * as React from 'react';
// Custom
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { CreateIncidentFormulary } from "../../../../structures/modules/incidents/CreateIncidentFormulary";
import { UpdateIncidentFormulary } from "../../../../structures/modules/incidents/UpdateIncidentFormulary";
import { DeleteIncidentFormulary } from "../../../../structures/modules/incidents/DeleteIncidentFormulary";
// Material UI
import { Table } from "@mui/material";
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
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
import Alert from '@mui/material/Alert';
import { InputAdornment } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TablePagination from '@mui/material/TablePagination';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
// Outros
import moment from 'moment';
import { useSnackbar } from 'notistack';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0F408F",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export function IncidentsPanel() {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

  // State do carregamento dos dados
  // Enquanto for false, irá aparecer "carregando" no painel
  const [panelData, setPanelData] = React.useState({ status: { loading: true, success: false, error: false }, response: { records: "", total_records: null, records_per_page: null, total_pages: null } });

  // State dos parâmetros do carregamento dos dados - define os parâmetros do SELECT do backend
  const [paginationParams, setPaginationParams] = React.useState({ page: 1, limit: 10, where: 0, total_records: 0 });

  // State do registro selecionado
  // Quando um registro é selecionado, seu índice é salvo nesse state
  // Os modais de update e delete são renderizados e recebem panelData.response.records[selectedRecordIndex]
  const [selectedRecordIndex, setSelectedRecordIndex] = React.useState(null);

  // Context do snackbar
  const { enqueueSnackbar } = useSnackbar();

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  /**
   * Hook use useEffect para carregar os dados da tabela de acordo com os valores da paginação
   * 
   */
  React.useEffect(() => {

    const module_middleware = `${AuthData.data.id}.${5}.${"ler"}`;

    if (!paginationParams.where) {

      requestToGetAllIncidents(module_middleware);

    } else {

      requestToGetSearchedIncidents(module_middleware);

    }

  }, [paginationParams]);

  /**
  * Carregamento de todos os registros de incidentes
  * 
  */
  function requestToGetAllIncidents(module_middleware) {

    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

    AxiosApi.get(`/api/incidents-module?args=${select_query_params}&auth=${module_middleware}`)
      .then(function (response) {

        if (response.status === 200) {

          setPanelData({
            status: {
              loading: false,
              success: true,
              error: false
            },
            response: {
              records: response.data.records,
              total_records: response.data.total_records_founded,
              records_per_page: response.data.records_per_page,
              total_pages: response.data.total_pages
            }
          });

        }

      })
      .catch(function (error) {

        if (error.response.status == 404) {

          handleOpenSnackbar("Nenhum registro de incidente encontrado!", "error");

        } else {

          handleOpenSnackbar("Erro no carregamento dos dados do painel de incidentes!", "error");

          console.log(error.message);

          setPanelData({ status: { loading: false, success: false, error: true }, response: null });

        }

      });

  }

  /**
  * Carregamento dos registros de incidentes compátiveis com a pesquisa realizada
  * 
  */
  function requestToGetSearchedIncidents(module_middleware) {

    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

    AxiosApi.get(`/api/incidents-module/show?args=${select_query_params}&auth=${module_middleware}`)
      .then(function (response) {

        if (response.status === 200) {

          setPanelData({
            status: {
              loading: false,
              success: true,
              error: false
            },
            response: {
              records: response.data.records,
              total_records: response.data.total_records_founded,
              records_per_page: response.data.records_per_page,
              total_pages: response.data.total_pages
            }
          });

          if (response.data.total_records_founded > 1) {
            handleOpenSnackbar(`Foram encontrados ${response.data.total_records_founded} incidentes`, "success");
          } else {
            handleOpenSnackbar(`Foi encontrado ${response.data.total_records_founded} incidente`, "success");
          }

        }

      })
      .catch(function (error) {

        if (error.response.status == 404) {

          handleOpenSnackbar("Nenhum registro de incidente encontrado!", "error");

        } else {

          handleOpenSnackbar("Erro no carregamento dos dados do painel de incidentes!", "error");

          console.log(error.message);

          setPanelData({ status: { loading: false, success: false, error: true }, response: null });

        }

      });

  }

  /**
  * Função para processar a alteração da página da tabela
  * 
  */
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

  /**
   * Função para processar a pesquisa de incidentes no input de pesquisa
   * O state do parâmetro de paginação é alterado, o useEffect é chamado, e a requisição AXIOS ocorre com outra configuração
   * 
   */
  function handleSearchSubmit(event) {
    event.preventDefault();

    let value_searched = window.document.getElementById("search_input").value;

    setPaginationParams({
      page: 1,
      limit: paginationParams.limit,
      where: value_searched
    });

  }

  /**
   * Função para processar o recarregamento dos dados da tabela
   * 
   */
  function reloadTable() {

    setPanelData({ status: { loading: true, success: false, error: false }, response: { records: "", total_records: null, records_per_page: null, total_pages: null } });

    setPaginationParams({
      page: 1,
      limit: paginationParams.limit,
      where: 0
    });

  }

  function handleClickRadio(event) {

    if (event.target.value === selectedRecordIndex) {
      setSelectedRecordIndex(null);
    } else if (event.target.value != selectedRecordIndex) {
      setSelectedRecordIndex(event.target.value);
    }

  }

  function handleOpenSnackbar(text, variant) {

    enqueueSnackbar(text, { variant });

  };

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - MATERIAL UI ============================================================================== //

  return (
    <>
      <Grid container spacing={1} alignItems="center" mb={1}>

        <Grid item>
          <CreateIncidentFormulary reload_table={reloadTable} />
        </Grid>

        <Grid item>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro para editar">
              <IconButton disabled={AuthData.data.user_powers["5"].profile_powers.escrever == 1 ? false : true}>
                <FontAwesomeIcon icon={faPenToSquare} color={AuthData.data.user_powers["5"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {(panelData.response.records != null && selectedRecordIndex != null) &&
            <UpdateIncidentFormulary record={panelData.response.records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro para excluir">
              <IconButton disabled={AuthData.data.user_powers["5"].profile_powers.escrever == 1 ? false : true} >
                <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["5"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {(panelData.response.records != null && selectedRecordIndex != null) &&
            <DeleteIncidentFormulary record={panelData.response.records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          <Tooltip title="Reload">
            <IconButton onClick={reloadTable}>
              <FontAwesomeIcon icon={faArrowRotateRight} size="sm" id="reload_icon" />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item xs>
          <TextField
            fullWidth
            placeholder={"Pesquisar incidente por ID"}
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

        {(!panelData.status.loading && panelData.status.success && !panelData.status.error) &&
          <Grid item>
            <Stack spacing={2}>
              <TablePagination
                labelRowsPerPage="Linhas por página: "
                component="div"
                count={panelData.response.total_records}
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
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell align="center">Tipo do incidente</StyledTableCell>
                  <StyledTableCell align="center">Descrição</StyledTableCell>
                  <StyledTableCell align="center">Data do incidente</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tbody">
                {(!panelData.status.loading && panelData.status.success && !panelData.status.error) &&
                  panelData.response.records.map((row, index) => (
                    <TableRow key={row.incident_id}>
                      <TableCell><FormControlLabel value={index} control={<Radio onClick={(event) => { handleClickRadio(event) }} />} label={row.incident_id} /></TableCell>
                      <TableCell align="center">{row.incident_type}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                      <TableCell align="center">{moment(row.incident_date).format('DD-MM-YYYY hh:mm')}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {(!panelData.status.loading && !panelData.status.success && panelData.status.error) &&
              <Alert severity="error" sx={{ display: "flex", justifyContent: "center" }}>{panelData.response}</Alert>
            }

          </TableContainer>
        </RadioGroup>
      </FormControl>
    </>
  );
}