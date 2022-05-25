/* eslint-disable react/react-in-jsx-scope */
// React
import * as React from 'react';
// Material UI
import { Table } from "@mui/material";
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
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { InputAdornment } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
// Custom
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { CreateReportFormulary } from "../../../../structures/modules/reports/CreateReportFormulary";
import { UpdateReportFormulary } from "../../../../structures/modules/reports/UpdateReportFormulary";
import { DeleteReportFormulary } from "../../../../structures/modules/reports/DeleteReportFormulary";
import { GenerateReportFormulary } from "../../../../structures/modules/reports/GenerateReportFormulary";
// Outros
import moment from 'moment';
import { useSnackbar } from 'notistack';

const StyledHeadTableCell = styled(TableCell)({
  color: '#fff',
  fontWeight: 700
});


export function ReportsPanel() {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

  // State do carregamento dos dados
  // Enquanto for false, irá aparecer "carregando" no painel
  const [panelData, setPanelData] = React.useState({ status: { loading: true, success: false, error: false }, response: { records: "", total_records: null, records_per_page: null, total_pages: null } });

  // State dos parâmetros do carregamento dos dados - define os parâmetros do SELECT do backend
  const [paginationParams, setPaginationParams] = React.useState({ page: 1, limit: 10, where: 0, total_records: 0 });

  // State da linha selecionada
  const [actualSelectedRecord, setActualSelectedRecord] = React.useState({ dom: null, data_cells: null });

  // Context do snackbar
  const { enqueueSnackbar } = useSnackbar();

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  /**
   * Hook use useEffect para carregar os dados da tabela de acordo com os valores da paginação
   * 
   */
  React.useEffect(() => {

    const module_middleware = `${AuthData.data.id}.${4}.${"ler"}`;

    if (!paginationParams.where) {

      requestToGetAllReports(module_middleware);

    } else {

      requestToGetSearchedReports(module_middleware);

    }

  }, [paginationParams]);

  /**
   * Carregamento de todos os registros de relatórios
   * 
   */
  function requestToGetAllReports(module_middleware) {

    // Essa variável recebe: limit clause, where clause and the page number
    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

    AxiosApi.get(`/api/reports-module?args=${select_query_params}&auth=${module_middleware}`)
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

          handleOpenSnackbar("Nenhum registro de relatório encontrado!", "error");

        } else {

          handleOpenSnackbar("Erro no carregamento dos dados do painel de relatórios!", "error");

          console.log(error.message);

          setPanelData({ status: { loading: false, success: false, error: true }, response: null });

        }

      });

  }

  /**
* Carregamento dos registros de relatórios compátiveis com a pesquisa realizada
* 
*/
  function requestToGetSearchedReports(module_middleware) {

    // Essa variável recebe: limit clause, where clause and the page number
    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

    AxiosApi.get(`/api/reports-module/show?args=${select_query_params}&auth=${module_middleware}`)
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
            handleOpenSnackbar(`Foram encontrados ${response.data.total_records_founded} relatórios`, "success");
          } else {
            handleOpenSnackbar(`Foi encontrado ${response.data.total_records_founded} relatório`, "success");
          }

        }

      })
      .catch(function (error) {

        if (error.response.status == 404) {

          handleOpenSnackbar("Nenhum registro de relatório encontrado!", "error");

        } else {

          handleOpenSnackbar("Erro no carregamento dos dados do painel de relatórios!", "error");

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
      page: value,
      limit: paginationParams.limit,
      where: paginationParams.where
    });

  };

  /**
   * Função para processar a pesquisa de relatórios no input de pesquisa
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

    setSelectedRecordIndex(null);

    setPanelData({ status: { loading: true, success: false, error: false }, response: { records: "", total_records: null, records_per_page: null, total_pages: null } });

    setPaginationParams({
      page: 1,
      limit: paginationParams.limit,
      where: 0
    });

  }

  function handleClickOnCheckbox(event, record_clicked) {

    // If already exists a selected record, and its equal to the clicked
    // The actual selected row is unmarked
    if (actualSelectedRecord.dom != null && (actualSelectedRecord.data_cells.user_id == record_clicked.user_id)) {

      actualSelectedRecord.dom.childNodes[0].checked = false;
      setActualSelectedRecord({ dom: null, data_cells: null });

      // If already exists a selected record, and its different from the clicked
      // The actual selected row is unmarked, and the new clicked one becomes the selected row
    } else if (actualSelectedRecord.dom != null && (actualSelectedRecord.data_cells.user_id != record_clicked.user_id)) {
      //console.log("change selected row")

      actualSelectedRecord.dom.childNodes[0].checked = false;
      setActualSelectedRecord({ dom: event.currentTarget, data_cells: record_clicked });

      // If not exists a selected record
      // The clicked row becomes the selected row
    } else if (actualSelectedRecord.dom == null) {
      //console.log("check row")

      setActualSelectedRecord({ dom: event.currentTarget, data_cells: record_clicked });

    }
  }

  function handleOpenSnackbar(text, variant) {

    enqueueSnackbar(text, { variant });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

  return (
    <>
      <Grid container spacing={1} alignItems="center" mb={1}>

        <Grid item>
          <CreateReportFormulary reload_table={reloadTable} />
        </Grid>

        <Grid item>
          <UpdateReportFormulary selected_record={{ dom: actualSelectedRecord.dom, data_cells: actualSelectedRecord.data_cells }} reload_table={reloadTable} />
        </Grid>

        <Grid item>
          <DeleteReportFormulary selected_record={{ dom: actualSelectedRecord.dom, data_cells: actualSelectedRecord.data_cells }} reload_table={reloadTable} />
        </Grid>

        <Grid item>
          <Tooltip title="Carregar">
            <IconButton onClick={reloadTable}>
              <FontAwesomeIcon icon={faArrowsRotate} size="sm" id="reload_icon" color={'#00713A'} />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item xs>
          <TextField
            fullWidth
            placeholder={"Pesquisar ordem por ID"}
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
              <Pagination count={panelData.total_pages} shape="rounded" page={paginationParams.page} onChange={handleTablePageChange} />
            </Stack>
          </Grid>
        }

      </Grid>

      <FormControl fullWidth>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          defaultChecked={false}
        >

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledHeadTableCell>ID</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Exportar</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Inicio do vôo</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Fim do vôo</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Log do vôo</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Observação</StyledHeadTableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tbody">
                {(!panelData.status.loading && panelData.status.success && !panelData.status.error) &&
                  panelData.response.records.map((row) => (
                    <TableRow key={row.report_id}>
                      <TableCell><FormControlLabel value={row.report_id} control={<Radio onClick={(event) => { handleClickOnCheckbox(event, row) }} />} label={row.report_id} /></TableCell>
                      <TableCell align="center"><GenerateReportFormulary data={row} /></TableCell>
                      <TableCell align="center">{moment(row.flight_start_date).format('DD-MM-YYYY hh:mm')}</TableCell>
                      <TableCell align="center">{moment(row.flight_end_date).format('DD-MM-YYYY hh:mm')}</TableCell>
                      <TableCell align="center">{row.flight_log}</TableCell>
                      <TableCell align="center">{row.report_note}</TableCell>
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