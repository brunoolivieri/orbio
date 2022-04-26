// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect, useState } from "react";
// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { CreateOrderFormulary } from "../../../../structures/modules/orders/CreateOrderFormulary";
import { UpdateOrderFormulary } from "../../../../structures/modules/orders/UpdateOrderFormulary";
import { DeleteOrderFormulary } from "../../../../structures/modules/orders/DeleteOrderFormulary";
import { BadgeIcon } from "../../../../structures/badge_icon/BadgeIcon";
// IMPORTAÇÃO DOS COMPONENTES PARA O MATERIAL UI
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
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import { Checkbox } from "@mui/material";
import { InputAdornment } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
// IMPORTAÇÃO DOS ÍCONES DO FONTS AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
// OUTROS
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

export function OrdersPanel(){

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const {AuthData} = useAuthentication();
  
  // State do carregamento dos dados
  // Enquanto for false, irá aparecer "carregando" no painel
  const [panelData, setPanelData] = useState({status: {loading: true, success: false, error: false}, response: {records: "", total_records: null, records_per_page: null, total_pages: null}});

  // State dos parâmetros do carregamento dos dados - define os parâmetros do SELECT do backend
  const [paginationParams, setPaginationParams] = useState({page: 1, limit: 10, where: 0, total_records: 0});

  // State da linha selecionada
  const [actualSelectedRecord, setActualSelectedRecord] = useState({dom: null, data_cells: null});

  // Context do snackbar
  const { enqueueSnackbar } = useSnackbar();

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

      if(error.response.status == 404){

        handleOpenSnackbar("Nenhum registro de ordem de serviço encontrado!", "error");

      }else{

        handleOpenSnackbar("Erro no carregamento dos dados do painel de ordens de serviço!", "error");

        console.log(error.message);

        setPanelData({status: {loading: false, success: false, error: true}, response: null});

      }

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

        if(response.data.total_records_founded > 1){
          handleOpenSnackbar(`Foram encontradas ${response.data.total_records_founded} ordens de serviços`, "success");
        }else if(response.data.total_records_founded == 1){
          handleOpenSnackbar(`Foi encontrada ${response.data.total_records_founded} ordem de serviço`, "success");
        } 

      }

    })
    .catch(function (error) {

      if(error.response.status == 404){

        handleOpenSnackbar("Nenhum registro de ordem de serviço encontrado!", "error");

      }else{

        handleOpenSnackbar("Erro no carregamento dos dados do painel de ordens de serviço!", "error");

        console.log(error.message);

        setPanelData({status: {loading: false, success: false, error: true}, response: null});

      }

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

  function handleClickOnCheckbox(event, record_clicked){
  
    // If already exists a selected record, and its equal to the clicked
    // The actual selected row is unmarked
    if(actualSelectedRecord.dom != null && (actualSelectedRecord.data_cells.user_id == record_clicked.user_id)){

      setActualSelectedRecord({dom: null, data_cells: null});
    
    // If already exists a selected record, and its different from the clicked
    // The actual selected row is unmarked, and the new clicked one becomes the selected row
    }else if(actualSelectedRecord.dom != null && (actualSelectedRecord.data_cells.user_id != record_clicked.user_id)){

      setActualSelectedRecord({dom: event.currentTarget, data_cells: record_clicked});
    
    // If not exists a selected record
    // The clicked row becomes the selected row
    }else if(actualSelectedRecord.dom == null){

      setActualSelectedRecord({dom: event.currentTarget, data_cells: record_clicked});

    }

  }

  function handleOpenSnackbar(text, variant){

    enqueueSnackbar(text, { variant });

  };

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return(
        <>
        <Grid container spacing={1} alignItems="center" mb={1}>

          <Grid item>
            <CreateOrderFormulary />
          </Grid>

          <Grid item>
            <UpdateOrderFormulary selected_record = {{dom: actualSelectedRecord.dom, data_cells: actualSelectedRecord.data_cells}} />
          </Grid>

          <Grid item>
            <DeleteOrderFormulary selected_record = {{dom: actualSelectedRecord.dom, data_cells: actualSelectedRecord.data_cells}} />
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
            placeholder={"Pesquisar ordem por ID"}
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
            sx={{borderRadius: 30}}
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
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell align="center">Status</StyledTableCell>
                      <StyledTableCell align="center">Planos de Vôo</StyledTableCell>
                      <StyledTableCell align="center">numOS</StyledTableCell>
                      <StyledTableCell align="center">Criador</StyledTableCell>
                      <StyledTableCell align="center">Piloto</StyledTableCell>
                      <StyledTableCell align="center">Cliente</StyledTableCell>
                      <StyledTableCell align="center">Observação</StyledTableCell>
                      <StyledTableCell align="center">Data da criação</StyledTableCell>
                      <StyledTableCell align="center">Última atualização</StyledTableCell>
                      <StyledTableCell align="center">Data do início</StyledTableCell>
                      <StyledTableCell align="center">Data do fim</StyledTableCell>
                  </TableRow>
                  </TableHead>
                  <TableBody className = "tbody">
                    {(!panelData.status.loading && panelData.status.success && !panelData.status.error) &&
                      panelData.response.records.length > 0 &&
                      panelData.response.records.map((row) => (
                          <TableRow key={row.order_id}>
                          <TableCell><FormControlLabel value={row.order_id} control={<Radio onClick={(event) => {handleClickOnCheckbox(event, row)}} />} label={row.order_id} /></TableCell>
                          <TableCell align="center">{row.order_status === 1 ? <Chip label={"Ativo"} color={"success"} /> : <Chip label={"Inativo"} color={"error"} />}</TableCell>
                          <TableCell align="center">
                            <BadgeIcon number = {row.flight_plans.length} color = {"primary"} /> 
                          </TableCell>
                          <TableCell align="center">{row.numOS}</TableCell> 
                          <TableCell align="center">{row.creator_name}</TableCell>
                          <TableCell align="center">{row.pilot_name}</TableCell>
                          <TableCell align="center">{row.client_name}</TableCell>
                          <TableCell align="center">{row.order_note}</TableCell>
                          <TableCell align="center">{row.created_at}</TableCell>
                          <TableCell align="center">{row.updated_at}</TableCell>
                          <TableCell align="center">{moment(row.order_start_date).format('DD-MM-YYYY hh:mm')}</TableCell>
                          <TableCell align="center">{moment(row.order_end_date).format('DD-MM-YYYY hh:mm')}</TableCell>    
                          </TableRow>
                          
                      ))}    
                  </TableBody>
              </Table>

            {(!panelData.status.loading && !panelData.status.success && panelData.status.error) && 
                <Alert severity="error" sx={{display: "flex", justifyContent: "center"}}>{panelData.response}</Alert>
            }

            </TableContainer> 

          </RadioGroup>
      </FormControl>

        </>
    );
}