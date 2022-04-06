// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect, useState } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { UpdateDeleteUserFormulary } from "../../../../structures/modules/administration/users_administration/UpdateDeleteUserFormulary";
import { CreateUserFormulary } from "../../../../structures/modules/administration/users_administration/CreateUserFormulary";

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
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { Badge } from "@mui/material";

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#101F33",
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

    // This receives: limit clause, where clause and the page number
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

      let value_searched = window.document.getElementById("users_panel_search_input").value;

      setPaginationParams({
        page: 1,
        limit: paginationParams.limit, 
        where: value_searched
      });

  }

  function reloadTable(){

    setPanelData({status: {loading: true, success: false, error: false}, response: {records: "", total_records: null, records_per_page: null, total_pages: null}});
    
    setPaginationParams({
      page: 1,
      limit: paginationParams.limit, 
      where: 0
    });

  }
  

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

  return(

    <>
      <Grid container spacing={1} alignItems="center">

        <Grid item>
          {/* Formulário de criação de usuário */}
          <CreateUserFormulary />
        </Grid>

        <Grid item>
          <Tooltip title="Reload">
            <IconButton onClick = {reloadTable}>
              {/* O recarregamento dos dados é a alteração do valor das dependências do useEffect que realiza uma requisição AXIOS */}

              {refreshPanel == true ? 
              <Badge color="primary" variant="dot">
                <RefreshIcon color="inherit" sx={{ display: 'block' }} onClick = {() => { setRefreshPanel(false) }} />
              </Badge>
              : 
              <RefreshIcon color="inherit" sx={{ display: 'block' }} />
              }
    
            </IconButton>
          </Tooltip>  
        </Grid>
        <Grid item>
          <Tooltip title="Pesquisar">
            <IconButton onClick={handleSearchSubmit}>
              <SearchIcon sx={{ display: 'block' }} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            placeholder={"Pesquisar um usuário por ID, nome, email e perfil"}
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: 'default' },
            }}
            variant="standard"
            id = "users_panel_search_input"
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
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="customized table">
                <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell align="center">Nome</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Perfil</StyledTableCell>
                  <StyledTableCell align="center">Criação da conta</StyledTableCell>
                  <StyledTableCell align="center">Última atualização</StyledTableCell>
                  <StyledTableCell align="center">Último acesso</StyledTableCell>
                  <StyledTableCell align="center">Editar</StyledTableCell>
                  <StyledTableCell align="center">Excluir</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody className = "tbody">
                {(!panelData.status.loading && panelData.status.success && !panelData.status.error) && 
                    panelData.response.records.map((row) => (
                      <StyledTableRow key={row.user_id}>
                        <StyledTableCell component="th" scope="row">{row.user_id}</StyledTableCell>
                        <StyledTableCell align="center">{row.name}</StyledTableCell>
                        <StyledTableCell align="center">{row.email}</StyledTableCell> {}
                        <StyledTableCell align="center">{<Chip label={row.status_badge[0]} color={row.status_badge[1]} variant="outlined" />}</StyledTableCell>
                        <StyledTableCell align="center">{row.profile_name}</StyledTableCell>
                        <StyledTableCell align="center">{row.created_at}</StyledTableCell>
                        <StyledTableCell align="center">{row.updated_at}</StyledTableCell>
                        <StyledTableCell align="center">{row.last_access}</StyledTableCell>
                        <StyledTableCell align="center"><UpdateDeleteUserFormulary data = {row} operation = {"update"} refresh_setter = {setRefreshPanel} /></StyledTableCell>
                        <StyledTableCell align="center"><UpdateDeleteUserFormulary data = {row} operation = {"delete"} refresh_setter = {setRefreshPanel} /></StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
  )
}