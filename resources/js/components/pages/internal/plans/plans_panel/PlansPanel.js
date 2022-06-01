// React
import * as React from 'react';
// Custom
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { UpdatePlanFormulary } from "../../../../structures/modules/plans/UpdatePlanFormulary";
import { DeletePlanFormulary } from "../../../../structures/modules/plans/DeletePlanFormulary";
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
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { Link } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TablePagination from '@mui/material/TablePagination';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
// Outros
import { useSnackbar } from 'notistack';

const StyledHeadTableCell = styled(TableCell)({
  color: '#fff',
  fontWeight: 700
});


export function PlansPanel() {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

  // Context da snackbar
  const { enqueueSnackbar } = useSnackbar();

  // State do carregamento dos dados
  // Enquanto for false, irá aparecer "carregando" no painel
  const [panelData, setPanelData] = React.useState({ status: { loading: true, success: false, error: false }, response: { records: "", total_records: null, records_per_page: null, total_pages: null } });

  // State dos parâmetros do carregamento dos dados - define os parâmetros do SELECT do backend
  const [paginationParams, setPaginationParams] = React.useState({ page: 1, limit: 10, where: 0, total_records: 0 });

  // State do registro selecionado
  // Quando um registro é selecionado, seu índice é salvo nesse state
  // Os modais de update e delete são renderizados e recebem panelData.response.records[selectedRecordIndex]
  const [selectedRecordIndex, setSelectedRecordIndex] = React.useState(null);

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  /**
   * Hook use useEffect para carregar os dados da tabela de acordo com os valores da paginação
   * 
   */
  React.useEffect(() => {

    if (!paginationParams.where) {

      requestToGetAllFlightPlans();

    } else {

      requestToGetSearchedFlightPlans();

    }

  }, [paginationParams]);

  /**
  * Carregamento de todos os registros de planos de vôo
  * 
  */
  function requestToGetAllFlightPlans() {

    // Essa variável recebe: limit clause, where clause and the page number
    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

    AxiosApi.get(`/api/plans-module?args=${select_query_params}`)
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

          handleOpenSnackbar("Nenhum registro de plano de vôo encontrado!", "error");

        } else {

          handleOpenSnackbar("Erro no carregamento dos dados do painel de planos de vôo!", "error");

          console.log(error.message);

          setPanelData({ status: { loading: false, success: false, error: true }, response: null });

        }

      });


  }

  /**
 * Carregamento dos registros de planos de vôo compátiveis com a pesquisa realizada
 * 
 */
  function requestToGetSearchedFlightPlans() {

    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

    AxiosApi.get(`/api/plans-module/show?args=${select_query_params}`)
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
            handleOpenSnackbar(`Foram encontrados ${response.data.total_records_founded} planos de vôo`, "success");
          } else {
            handleOpenSnackbar(`Foi encontrado ${response.data.total_records_founded} plano de vôo`, "success");
          }

        }

      })
      .catch(function (error) {

        if (error.response.status == 404) {

          handleOpenSnackbar("Nenhum registro de plano de vôo encontrado!", "error");

        } else {

          handleOpenSnackbar("Erro no carregamento dos dados do painel de planos de vôo!", "error");

          console.log(error.message);

          setPanelData({ status: { loading: false, success: false, error: true }, response: null });

        }

      });

  }

  /**
  * Função para processar a alteração da página da tabela
  * 
  */
  const handleTablePageChange = (_event, value) => {

    setPaginationParams({
      page: value + 1,
      limit: paginationParams.limit,
      where: paginationParams.where
    });

  };

  /**
   * Função para processar a pesquisa de planos de vôo no input de pesquisa
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

  function handleClickRadio(event) {

    if (event.target.value === selectedRecordIndex) {
      setSelectedRecordIndex(null);
    } else if (event.target.value != selectedRecordIndex) {
      setSelectedRecordIndex(event.target.value);
    }

  }

  const handleChangeRowsPerPage = (event) => {

    setPaginationParams({
      page: 1,
      limit: event.target.value,
      where: paginationParams.where
    });

  };

  /**
   * Função para processar o download do arquivo com as coordenadas do plano de vôo
   * 
   */
  function handleDownloadFlightPlan(filename) {

    const module_middleware = `${AuthData.data.id}.${2}.${"ler"}`;

    AxiosApi.get(`/api/plans-module-download/${filename}?auth=${module_middleware}`, null, {
      responseType: 'blob'
    })
      .then(function (response) {

        if (response.status === 200) {

          handleOpenSnackbar(`Download realizado com sucesso! Arquivo: ${filename}`, "success");

          // Download do arquivo com o conteúdo retornado do servidor
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${filename}`); //or any other extension
          document.body.appendChild(link);
          link.click();

        }

      })
      .catch(function () {

        handleOpenSnackbar(`O download não foi realizado! Arquivo: ${filename}`, "error");

      });

  }

  function handleOpenSnackbar(text, variant) {

    enqueueSnackbar(text, { variant });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //


  return (
    <>
      <Grid container spacing={1} alignItems="center" mb={1}>
        <Grid item>
          <Tooltip title="Novo Plano">
            <Link href={`/sistema/mapa?userid=${AuthData.data.id}`} target="_blank">
              <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.ler == 1 ? false : true}>
                <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["2"].profile_powers.ler == 1 ? "#00713A" : "#808991"} size="sm" />
              </IconButton>
            </Link>
          </Tooltip>
        </Grid>

        <Grid item>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro para editar">
              <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.escrever == 1 ? false : true}>
                <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["2"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {/* O modal é renderizado apenas quando um registro já foi selecionado */}
          {(panelData.response.records != null && selectedRecordIndex != null) &&
            <UpdatePlanFormulary record={panelData.response.records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro para excluir">
              <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.escrever == 1 ? false : true} >
                <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["2"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {/* O modal é renderizado apenas quando um registro já foi selecionado */}
          {(panelData.response.records != null && selectedRecordIndex != null) &&
            <DeletePlanFormulary record={panelData.response.records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
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
            placeholder={"Pesquisar plano por ID"}
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
                  <StyledHeadTableCell>ID</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Visualizar</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Arquivo</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Relatório</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Status</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Incidente</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Descrição</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Data criação</StyledHeadTableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tbody">
                {(!panelData.status.loading && panelData.status.success && !panelData.status.error) &&
                  panelData.response.records.map((row, index) => (
                    <TableRow key={row.plan_id} >
                      <TableCell><FormControlLabel value={index} control={<Radio onClick={(event) => { handleClickRadio(event) }} />} label={row.plan_id} /></TableCell>
                      <TableCell align="center">
                        <Link href={`/sistema/mapa?file=${row.plan_file}`} target="_blank">
                          <Tooltip title="Ver plano">
                            <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.ler == 1 ? false : true}>
                              <FontAwesomeIcon icon={faEye} color={AuthData.data.user_powers["2"].profile_powers.ler == 1 ? "#00713A" : "#808991"} size="sm" />
                            </IconButton>
                          </Tooltip>
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Baixar plano">
                          <IconButton onClick={() => handleDownloadFlightPlan(row.plan_file)} disabled={AuthData.data.user_powers["2"].profile_powers.ler == 1 ? false : true}>
                            <FontAwesomeIcon icon={faFileArrowDown} size="sm" color={AuthData.data.user_powers["2"].profile_powers.ler == 1 ? "#007937" : "#808991"} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        {row.report_id != null ?
                          <Tooltip title="Ver relatório">
                            <IconButton>
                              <FontAwesomeIcon icon={faFilePdf} color="#00713A" />
                            </IconButton>
                          </Tooltip>
                          :
                          <IconButton disabled>
                            <FontAwesomeIcon icon={faFilePdf} color="#808991" />
                          </IconButton>
                        }
                      </TableCell>
                      <TableCell align="center">{row.plan_status === 1 ? <Chip label={"Ativo"} color={"success"} variant="outlined" /> : <Chip label={"Inativo"} color={"error"} variant="outlined" />}</TableCell>
                      <TableCell align="center">{row.incident_id == null ? "Sem dados" : row.incident_id}</TableCell>
                      <TableCell align="center">{row.plan_description}</TableCell>
                      <TableCell align="center">{row.created_at}</TableCell>
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