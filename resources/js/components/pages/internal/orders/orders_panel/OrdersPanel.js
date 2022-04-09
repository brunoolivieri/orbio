// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect, useState } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { CreateOrderFormulary } from "../../../../structures/modules/orders/CreateOrderFormulary";
import { UpdateDeleteOrderFormulary } from "../../../../structures/modules/orders/UpdateDeleteOrderFormulary";

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
import Chip from '@mui/material/Chip';

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

export function OrdersPanel(){

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
     * 
     */
     useEffect(() => {

      const module_middleware = `${AuthData.data.id}.${3}.${"ler"}`;

      if(!paginationParams.where){

        requestToGetAllServiceOrders(module_middleware);

      }else{

        requestToGetSearchedServiceOrders(module_middleware);

      }
 
   },[paginationParams]);

   /**
   * Carregamento de todos os registros de ordens de serviço
   * 
   */
  function requestToGetAllServiceOrders(module_middleware){

   // Essa variável recebe: limit clause, where clause and the page number
   const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;
 
    AxiosApi.get(`/api/orders-module?args=${select_query_params}&auth=${module_middleware}`)
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
   * Carregamento dos registros de ordens de serviço compátiveis com a pesquisa realizada
   * 
   */
   function requestToGetSearchedServiceOrders(module_middleware){

    // Essa variável recebe: limit clause, where clause and the page number
    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;
 
    AxiosApi.get(`/api/orders-module/show?args=${select_query_params}&auth=${module_middleware}`)
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
   * Função para processar a pesquisa de ordens de serviço no input de pesquisa
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

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return(
        <>
        <Grid container spacing={1} alignItems="center">

            <Grid item>
            {/* Botão para abrir o formulário */}
                <CreateOrderFormulary />
            </Grid>

        <Grid item>
        <Tooltip title="Reload">
            <IconButton onClick = {reloadTable}>
            {/* O recarregamento dos dados é a alteração do valor das dependências do useEffect que realiza uma requisição AXIOS */}

            {refreshPanel ? 
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
            placeholder={"Pesquisar ordem por ID"}
            InputProps={{
            disableUnderline: true,
            sx: { fontSize: 'default' },
            }}
            variant="standard"
            id = "search_input"
        />
        </Grid>

        {/* Mecanismo de paginação - depende dos dados retornados pelo servidor */}
        {/* Se o total de registros for múltiplo de 10, o total de páginas será esse número dividido por 10. Exemplo: 20 registros = 2 páginas */}
        {/* Se o total de registros não for múltiplo de 10, o total de páginas será esse número mais 10, dividido por 10 e convertido para o maior inteiro mais próximo. Exemplo: 11 páginas = 2 páginas (ao invés de 1,1) */}
        {(!panelData.status.loading && panelData.status.success && !panelData.status.error) && 
        <Grid item>
        <Stack spacing={2}>
            <Pagination count={panelData.total_pages} shape="rounded" page={paginationParams.page} onChange={handleTablePageChange} />
        </Stack>
        </Grid>  
        }

        </Grid>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
            <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Plano de Vôo</StyledTableCell>
                <StyledTableCell align="center">numOS</StyledTableCell>
                <StyledTableCell align="center">Criador</StyledTableCell>
                <StyledTableCell align="center">Piloto</StyledTableCell>
                <StyledTableCell align="center">Cliente</StyledTableCell>
                <StyledTableCell align="center">Observação</StyledTableCell>
                <StyledTableCell align="center">Data da criação</StyledTableCell>
                <StyledTableCell align="center">Última atualização</StyledTableCell>
                <StyledTableCell align="center">Data do inicio</StyledTableCell>
                <StyledTableCell align="center">Data do fim</StyledTableCell>
                <StyledTableCell align="center">Editar</StyledTableCell>
                <StyledTableCell align="center">Excluir</StyledTableCell>
            </TableRow>
            </TableHead>
            <TableBody className = "tbody">
              {(!panelData.status.loading && panelData.status.success && !panelData.status.error) && 
                panelData.response.records.map((row) => (
                    <StyledTableRow key={row.order_id}>
                    <StyledTableCell>{row.order_id}</StyledTableCell>
                    <StyledTableCell align="center">{row.order_status === 1 ? <Chip label={"Ativo"} color={"success"} variant="outlined" /> : <Chip label={"Inativo"} color={"error"} variant="outlined" />}</StyledTableCell>
                    <StyledTableCell align="center">{row.flight_plan_id}</StyledTableCell>
                    <StyledTableCell align="center">{row.numOS}</StyledTableCell> 
                    <StyledTableCell align="center">{row.creator_name}</StyledTableCell>
                    <StyledTableCell align="center">{row.pilot_name}</StyledTableCell>
                    <StyledTableCell align="center">{row.client_name}</StyledTableCell>
                    <StyledTableCell align="center">{row.order_note}</StyledTableCell>
                    <StyledTableCell align="center">{row.created_at}</StyledTableCell>
                    <StyledTableCell align="center">{row.updated_at}</StyledTableCell>
                    <StyledTableCell align="center">{moment(row.order_start_date).format('DD-MM-YYYY hh:mm')}</StyledTableCell>
                    <StyledTableCell align="center">{moment(row.order_end_date).format('DD-MM-YYYY hh:mm')}</StyledTableCell>
                    <StyledTableCell align="center"><UpdateDeleteOrderFormulary data ={row} operation={"update"} refresh_setter = {setRefreshPanel} /></StyledTableCell>
                    <StyledTableCell align="center"><UpdateDeleteOrderFormulary data ={row} operation = {"delete"} refresh_setter = {setRefreshPanel} /></StyledTableCell>     
                    </StyledTableRow>
                ))}    
            </TableBody>
        </Table>
        </TableContainer> 
        </>
    );
}