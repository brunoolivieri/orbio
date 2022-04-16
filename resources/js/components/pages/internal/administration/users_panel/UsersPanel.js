// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect, useState } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { CreateUserFormulary } from "../../../../structures/modules/administration/users_administration/CreateUserFormulary";
import { UpdateUserFormulary } from "../../../../structures/modules/administration/users_administration/UpdateUserFormulary";
import { DeleteUserFormulary } from "../../../../structures/modules/administration/users_administration/DeleteUserFormulary";

// IMPORTAÇÃO DOS COMPONENTES PARA O MATERIAL UI
import { Table } from "@mui/material";
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { InputAdornment } from "@mui/material";
import { Checkbox } from "@mui/material";
import { Box } from "@mui/system";

// IMPORTAÇÃO DOS ÍCONES DO FONTS AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const StyledHeadTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#004994",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export function UsersPanel(){

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const {AuthData} = useAuthentication();
  
  // State do carregamento dos dados
  // Enquanto for false, irá aparecer "carregando" no painel
  const [panelData, setPanelData] = useState({status: {loading: true, success: false, error: false}, response: {records: "", total_records: null, records_per_page: null, total_pages: null}});

  // State dos parâmetros do carregamento dos dados - define os parâmetros do SELECT do backend
  const [paginationParams, setPaginationParams] = useState({page: 1, limit: 10, where: 0, total_records: 0});

  // Serve modificar o ícone de refresh da tabela
  const [refreshPanel, setRefreshPanel] = useState(false);

  // State da linha selecionada
  const [actualSelectedRecord, setActualSelectedRecord] = useState({dom: null, data_cells: null});

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  /**
   * Hook use useEffect para carregar os dados da tabela de acordo com os valores da paginação
   * Esses valores são: limit, where e número da página atual
   * 
   */
    useEffect(() => {

      const module_middleware = `${AuthData.data.id}.${1}.${"ler"}`;

      if(!paginationParams.where){

        requestToGetAllUsers(module_middleware);

      }else{

        requestToGetSearchedUsers(module_middleware);

      }

  },[paginationParams]);


  /**
   * Carregamento de todos os registros de usuário
   * 
   */
  function requestToGetAllUsers(module_middleware){

    // This receives: limit clause, where clause and the page number
    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

    AxiosApi.get(`/api/admin-module-user?args=${select_query_params}&auth=${module_middleware}`)
    .then(function (response) {

      if(response.status === 200){

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

      console.log(error.message);

      setPanelData({status: {loading: false, success: false, error: true}, response: "ERRO NO CARREGAMENTO DOS REGISTROS"});

    });

  }

  /**
   * Carregamento dos registros de usuários compátiveis com a pesquisa realizada
   * 
   */
  function requestToGetSearchedUsers(module_middleware){

    // Essa variável recebe: limit clause, where clause and the page number
    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

    AxiosApi.get(`/api/admin-module-user/show?args=${select_query_params}&auth=${module_middleware}`)
      .then(function (response) {

        if(response.status === 200){

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

      }).catch(function (error) {

        console.log(error.message);

        setPanelData({status: {loading: false, success: false, error: true}, response: "ERRO NO CARREGAMENTO DOS REGISTROS"});
  
      });

  }

  /**
   * Função para processar a alteração da página da tabela
   * paginationParams é a dependência do useEffect
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
   * Função para processar a pesquisa de usuários no input de pesquisa
   * O state do parâmetro de paginação é alterado, o useEffect é chamado, e a requisição AXIOS ocorre com outra configuração
   * 
   */
  function handleSearchSubmit(event){
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
  function reloadTable(){

    setPanelData({status: {loading: true, success: false, error: false}, response: {records: "", total_records: null, records_per_page: null, total_pages: null}});
    
    setPaginationParams({
      page: 1,
      limit: paginationParams.limit, 
      where: 0
    });

  }

  function handleClickOnCheckbox(event, record_clicked){
  
    // If already exists a selected record, and its equal to the clicked
    // The actual selected row is unmarked
    if(actualSelectedRecord.dom != null && (actualSelectedRecord.data_cells.user_id == record_clicked.user_id)){
      //console.log("uncheck selected row");

      actualSelectedRecord.dom.childNodes[0].checked = false;
      setActualSelectedRecord({dom: null, data_cells: null});
    
    // If already exists a selected record, and its different from the clicked
    // The actual selected row is unmarked, and the new clicked one becomes the selected row
    }else if(actualSelectedRecord.dom != null && (actualSelectedRecord.data_cells.user_id != record_clicked.user_id)){
      //console.log("change selected row")

      actualSelectedRecord.dom.childNodes[0].checked = false;
      setActualSelectedRecord({dom: event.currentTarget, data_cells: record_clicked});
    
    // If not exists a selected record
    // The clicked row becomes the selected row
    }else if(actualSelectedRecord.dom == null){
      //console.log("check row")

      setActualSelectedRecord({dom: event.currentTarget, data_cells: record_clicked});

    }

  }
  

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

  return(

    <>
      <Grid container spacing={1} alignItems="center">

        <Grid item>
          <CreateUserFormulary />
        </Grid>

        <Grid item>
          <UpdateUserFormulary selected_record = {{dom: actualSelectedRecord.dom, data_cells: actualSelectedRecord.data_cells}} /> 
        </Grid>

        <Grid item>
          <DeleteUserFormulary selected_record = {{dom: actualSelectedRecord.dom, data_cells: actualSelectedRecord.data_cells}} />
        </Grid>

        <Grid item>
          <Tooltip title="Reload">
            <IconButton onClick = {reloadTable}>
              <FontAwesomeIcon icon={faArrowRotateRight} size = "sm" id = "reload_icon" />
            </IconButton>
          </Tooltip>  
        </Grid>

        <Grid item xs>
          <TextField
            fullWidth
            placeholder={"Pesquisar um usuário por ID, nome, email e perfil"}
            InputProps={{
              startAdornment: 
              <InputAdornment position="start">
                <IconButton onClick={handleSearchSubmit}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} size = "sm" />
                </IconButton>
              </InputAdornment>,
              disableUnderline: true,
              sx: { fontSize: 'default' },
            }}
            variant="outlined"
            id = "search_input"
          />
        </Grid>
        
        {/* Geração da paginação */}
        {(!panelData.status.loading && panelData.status.success && !panelData.status.error) && 
        <Grid item>
          <Stack spacing={2}>
            <Pagination count={panelData.response.total_pages} shape="rounded" page={paginationParams.page} onChange={handleTablePageChange} />
          </Stack>
        </Grid>  
        }

      </Grid>

      <Box sx={{ mt: 1 }} >

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledHeadTableCell></StyledHeadTableCell>
                <StyledHeadTableCell>ID</StyledHeadTableCell>
                <StyledHeadTableCell align="center">Nome</StyledHeadTableCell>
                <StyledHeadTableCell align="center">Email</StyledHeadTableCell>
                <StyledHeadTableCell align="center">Status</StyledHeadTableCell>
                <StyledHeadTableCell align="center">Perfil</StyledHeadTableCell>
                <StyledHeadTableCell align="center">Criação da conta</StyledHeadTableCell>
                <StyledHeadTableCell align="center">Última atualização</StyledHeadTableCell>
                <StyledHeadTableCell align="center">Último acesso</StyledHeadTableCell>
              </TableRow>
            </TableHead>
            <TableBody className = "tbody">
            {(!panelData.status.loading && panelData.status.success && !panelData.status.error) && 
              panelData.response.records.map((row) => (
                <TableRow key={row.user_id}>
                  <TableCell align="center"><Checkbox inputProps={{ 'aria-label': 'controlled' }} onClick={(event) => {handleClickOnCheckbox(event, row)}} /></TableCell>
                  <TableCell component="th" scope="row">{row.user_id}</TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.email}</TableCell> 
                  <TableCell align="center">{<Chip label={row.status_badge[0]} color={row.status_badge[1]} variant="outlined" />}</TableCell>
                  <TableCell align="center">{row.profile_name}</TableCell>
                  <TableCell align="center">{row.created_at}</TableCell>
                  <TableCell align="center">{row.updated_at}</TableCell>
                  <TableCell align="center">{row.last_access}</TableCell>
                </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

      </Box>
    </>
  )
}