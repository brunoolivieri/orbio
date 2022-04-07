// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect, useState } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import {CreateIncidentFormulary} from "../../../../structures/modules/incidents/CreateIncidentFormulary";
import {UpdateDeleteIncidentFormulary} from "../../../../structures/modules/incidents/UpdateDeleteIncidentFormulary";

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
import { Badge } from "@mui/material";

// IMPORTAÇÃO DE BIBLIOTECAS EXTERNAS
import moment from 'moment';

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

export function IncidentsPanel(){

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // State da paginação da tabela e função de alteração
    const [page, setPage] = useState(1);

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // State do carregamento dos dados
    // Enquanto for false, irá aparecer "carregando" no painel
    const [panelData, setPanelData] = useState({status: false, response: "", total_pages: 0});

    // State dos parâmetros de paginação - define como os dados serão carregados de acordo com a página
    const [paginationParams, setPaginationParams] = useState({offset: 0, limit: 10, where: [false, ""]});

    // State que serve de dependência para o useEffect do AXIOS
    // Serve para recarregar o painel
    const [refreshPanel, setRefreshPanel] = useState(false);

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    /**
     * Hook use useEffect para carregar os dados da tabela de acordo com os valores da paginação
     * 
     */
     useEffect(() => {

        let logged_user_id = AuthData.data.id;
        let module_id = 5;
        let module_action = "ler";
 
       switch(paginationParams.where[0]){
 
         case false:
 
           let pagination_params = `${paginationParams.offset}/${paginationParams.limit}`;
 
           AxiosApi.get(`/api/incidents-module?args=${pagination_params}&auth=none`, {
             })
             .then(function (response) {
     
               if(response.status === 200){
 
                 setPanelData({status: true, error: false, response: response.data.records, total_pages: response.data.total_pages});
       
               }else{
       
                 setPanelData({status: true, error: true, response: response.data.error});
       
               }
     
             })
             .catch(function (error) {
     
               setPanelData({status: true, error: true, response: "ERRO NO CARREGAMENTO DOS REGISTROS DE RELATÓRIOS."});
     
           });
 
         break;
       
         case true:
 
           let query_arguments = `${paginationParams.where[1]}.${paginationParams.offset}.${paginationParams.limit}`;
 
           AxiosApi.get(`/api/incidents-module/incidents?args=${query_arguments}&auth=none`, {
             access: AuthData.data.access
             })
             .then(function (response) {
     
               if(response.status === 200){

                 setPanelData({status: true, error: false, response: response.data.records, total_pages: response.data.total_pages});
       
               }
     
             })
 
         break;
 
     }
 
   },[paginationParams]);

   /**
   * Função para processar a alteração da página da tabela
   * 
   */
  const handleTablePageChange = (event, value) => {

    setPage(value);

    let newOffset = value === 1 ? 0 : value*paginationParams.limit - paginationParams.limit;

    setPaginationParams({offset: newOffset, limit: paginationParams.limit, where: [paginationParams.where[0],paginationParams.where[1]]});

  };

  /**
   * Função para processar a pesquisa de usuários no input de pesquisa
   * O state do parâmetro de paginação é alterado, o useEffect é chamado, e a requisição AXIOS ocorre com outra configuração
   * 
   */
   function handleSearchSubmit(event, offset){
    event.preventDefault();

      let value_searched = window.document.getElementById("incidents_search_input").value;

      setPage(1);
      setPaginationParams({offset: 0, limit: paginationParams.limit, where: [true, value_searched]});

  }

  function reloadTable(){

    setPage(1);
    setPaginationParams({offset: 0, limit: paginationParams.limit, where: [false, ""]});
    setPanelData({status: false, response: "", total_pages: 0});

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return(
        <>
        <Grid container spacing={1} alignItems="center">

          <Grid item>
              <CreateIncidentFormulary />
          </Grid>

          <Grid item>
            <Tooltip title="Reload">
              <IconButton onClick = {reloadTable}>

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
                placeholder={"Pesquisar incidente por ID"}
                InputProps={{
                disableUnderline: true,
                sx: { fontSize: 'default' },
                }}
                variant="standard"
                id = "incidents_search_input"
            />
          </Grid>

          {panelData.status && 
          <Grid item>
            <Stack spacing={2}>
                <Pagination count={panelData.total_pages} shape="rounded" page={page} onChange={handleTablePageChange} />
            </Stack>
          </Grid>  
          }

        </Grid>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
              <TableHead>
              <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell align="center">Tipo do incidente</StyledTableCell>
                  <StyledTableCell align="center">Descrição</StyledTableCell>
                  <StyledTableCell align="center">Data do incidente</StyledTableCell>
                  <StyledTableCell align="center">Editar</StyledTableCell>
                  <StyledTableCell align="center">Excluir</StyledTableCell>
              </TableRow>
              </TableHead>
              <TableBody className = "tbody">
                  {(panelData.status && !panelData.error) && 
                      panelData.response.map((row) => (
                          <StyledTableRow key={row.incident_id}>
                          <StyledTableCell>{row.incident_id}</StyledTableCell>
                          <StyledTableCell align="center">{row.incident_type}</StyledTableCell>
                          <StyledTableCell align="center">{row.description}</StyledTableCell> 
                          <StyledTableCell align="center">{moment(row.incident_date).format('DD-MM-YYYY hh:mm')}</StyledTableCell>
                          <StyledTableCell align="center"><UpdateDeleteIncidentFormulary data ={row} operation={"update"} refresh_setter = {setRefreshPanel} /></StyledTableCell>
                          <StyledTableCell align="center"><UpdateDeleteIncidentFormulary data ={row} operation = {"delete"} refresh_setter = {setRefreshPanel} /></StyledTableCell>     
                          </StyledTableRow>
                      ))}    
              </TableBody>
          </Table>
        </TableContainer> 
      </>
    );
}