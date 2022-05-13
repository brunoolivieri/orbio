// React
import * as React from "react";
// Custom
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { CreateProfileFormulary } from "../../../../structures/modules/administration/profiles_administration/CreateProfileFormulary";
import { UpdateProfileFormulary } from "../../../../structures/modules/administration/profiles_administration/UpdateProfileFormulary";
import { DeleteProfileFormulary } from "../../../../structures/modules/administration/profiles_administration/DeleteProfileFormulary";
// Material UI
import { Table } from "@mui/material";
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { InputAdornment } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import { useSnackbar } from 'notistack';
import TablePagination from '@mui/material/TablePagination';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const StyledHeadTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0F408F",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export function ProfilesPanel() {

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

  // State da deleção permitida
  const [deleteAvailable] = React.useState(true);

  // context do snackbar
  const { enqueueSnackbar } = useSnackbar();

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  /**
   * Função para processar a alteração da página da tabela
   * paginationParams é a dependência do useEffect
   * 
   */
  const handleTablePageChange = (event, value) => {

    setPaginationParams({
      page: value + 1,
      limit: paginationParams.limit,
      where: paginationParams.where
    });

  };

  /**
   * Função para processar a pesquisa de usuários no input de pesquisa
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

  function reloadTable() {

    setPanelData({ status: { loading: true, success: false, error: false }, response: { records: "", total_records: null, records_per_page: null, total_pages: null } });

    setPaginationParams({
      page: 1,
      limit: paginationParams.limit,
      where: 0
    });

  }

  /**
   * Hook use useEffect para carregar os dados da tabela de acordo com os valores da paginação
   * 
   */
  React.useEffect(() => {

    const module_middleware = `${AuthData.data.id}.${1}.${"ler"}`;

    if (!paginationParams.where) {

      requestToGetAllProfiles(module_middleware);

    } else {

      requestToGetSearchedProfiles(module_middleware);

    }

  }, [paginationParams]);

  /**
 * Carregamento de todos os registros de usuário
 * 
 */
  function requestToGetAllProfiles(module_middleware) {

    // This receives: limit clause, where clause and the page number
    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

    AxiosApi.get(`/api/admin-module-profile?args=${select_query_params}&auth=${module_middleware}`)
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

          handleOpenSnackbar("Nenhum registro de perfil encontrado!", "error");

        } else {

          handleOpenSnackbar("Erro no carregamento dos dados do painel de perfis!", "error");

          console.log(error.message);

          setPanelData({ status: { loading: false, success: false, error: true }, response: null });

        }

      });


  }

  /**
  * Carregamento dos registros de usuários compátiveis com a pesquisa realizada
  * 
  */
  function requestToGetSearchedProfiles(module_middleware) {

    // This receives: limit clause, where clause and the page number
    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

    AxiosApi.get(`/api/admin-module-profile/show?args=${select_query_params}&auth=${module_middleware}`)
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
            handleOpenSnackbar(`Foram encontrados ${response.data.total_records_founded} perfis`, "success");
          } else {
            handleOpenSnackbar(`Foi encontrado ${response.data.total_records_founded} perfil`, "success");
          }

        }

      }).catch((error) => {

        if (error.response.status == 404) {

          handleOpenSnackbar("Nenhum registro de perfil encontrado!", "error");

        } else {

          handleOpenSnackbar("Erro no carregamento dos dados do painel de perfis!", "error");

          console.log(error.message);

          setPanelData({ status: { loading: false, success: false, error: true }, response: null });

        }

      });

  }

  const handleChangeRowsPerPage = (event) => {

    setPaginationParams({
      page: 1,
      limit: event.target.value,
      where: paginationParams.where
    });

  };

  function handleClickRadio(event) {

    if (event.target.value === selectedRecordIndex) {
      setSelectedRecordIndex(null);
    } else if (event.target.value != selectedRecordIndex) {
      setSelectedRecordIndex(event.target.value);
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
          <CreateProfileFormulary reload_table={reloadTable} />
        </Grid>

        <Grid item>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro para editar">
              <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? false : true}>
                <FontAwesomeIcon icon={faPenToSquare} color={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {/* O modal é renderizado apenas quando um registro já foi selecionado */}
          {(panelData.response.records != null && selectedRecordIndex != null) &&
            <UpdateProfileFormulary record={panelData.response.records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
          }
        </Grid>

        <Grid item hidden={!deleteAvailable}>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro para excluir">
              <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? false : true} >
                <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {/* O modal é renderizado apenas quando um registro já foi selecionado */}
          {(panelData.response.records != null && selectedRecordIndex != null) &&
            <DeleteProfileFormulary record={panelData.response.records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
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
            placeholder={"Pesquisar perfil por ID"}
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

        {(panelData.status && !panelData.error) &&
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
                  <StyledHeadTableCell align="center">Nome</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Administração</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Planos de voo</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Ordens de serviço</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Relatórios</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Incidentes</StyledHeadTableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tbody">
                {(!panelData.status.loading && panelData.status.success && !panelData.status.error) &&
                  panelData.response.records.map((row, index) => (
                    <TableRow key={row.profile_id}>
                      <TableCell><FormControlLabel value={index} control={<Radio onClick={(e) => { handleClickRadio(e) }} />} label={row.profile_id} /></TableCell>
                      <TableCell align="center">{row.profile_name}</TableCell>
                      <TableCell align="center">
                        <FormGroup>
                          <FormControlLabel control={<Checkbox defaultChecked={row.modules["1"].profile_powers.ler == 1 ? true : false} disabled size="small" />} label="Ler" />
                          <FormControlLabel control={<Checkbox defaultChecked={row.modules["1"].profile_powers.escrever == 1 ? true : false} disabled size="small" />} label="Escrever" />
                        </FormGroup>
                      </TableCell>
                      <TableCell align="center">
                        <FormGroup>
                          <FormControlLabel control={<Checkbox defaultChecked={row.modules["2"].profile_powers.ler == 1 ? true : false} disabled size="small" />} label="Ler" />
                          <FormControlLabel control={<Checkbox defaultChecked={row.modules["2"].profile_powers.escrever == 1 ? true : false} disabled size="small" />} label="Escrever" />
                        </FormGroup>
                      </TableCell>
                      <TableCell align="center">
                        <FormGroup>
                          <FormControlLabel control={<Checkbox defaultChecked={row.modules["3"].profile_powers.ler == 1 ? true : false} disabled size="small" />} label="Ler" />
                          <FormControlLabel control={<Checkbox defaultChecked={row.modules["3"].profile_powers.escrever == 1 ? true : false} disabled size="small" />} label="Escrever" />
                        </FormGroup>
                      </TableCell>
                      <TableCell align="center">
                        <FormGroup>
                          <FormControlLabel control={<Checkbox defaultChecked={row.modules["4"].profile_powers.ler == 1 ? true : false} disabled size="small" />} label="Ler" />
                          <FormControlLabel control={<Checkbox defaultChecked={row.modules["4"].profile_powers.escrever == 1 ? true : false} disabled size="small" />} label="Escrever" />
                        </FormGroup>
                      </TableCell>
                      <TableCell align="center">
                        <FormGroup>
                          <FormControlLabel control={<Checkbox defaultChecked={row.modules["5"].profile_powers.ler == 1 ? true : false} disabled size="small" />} label="Ler" />
                          <FormControlLabel control={<Checkbox defaultChecked={row.modules["5"].profile_powers.escrever == 1 ? true : false} disabled size="small" />} label="Escrever" />
                        </FormGroup>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

        </RadioGroup>
      </FormControl>

    </>
  )
}