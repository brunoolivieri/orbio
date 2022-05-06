// React
import * as React from 'react';
// Custom
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { CreateOrderFormulary } from "../../../../structures/modules/orders/CreateOrderFormulary";
import { UpdateOrderFormulary } from "../../../../structures/modules/orders/UpdateOrderFormulary";
import { DeleteOrderFormulary } from "../../../../structures/modules/orders/DeleteOrderFormulary";
import { BadgeIcon } from "../../../../structures/badge_icon/BadgeIcon";
// MaterialUI
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
import { InputAdornment } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
// Libs
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
  const [panelData, setPanelData] = React.useState({status: {loading: true, success: false, error: false}, response: {records: "", total_records: null, records_per_page: null, total_pages: null}});

  // State dos parâmetros do carregamento dos dados - define os parâmetros do SELECT do backend
  const [paginationParams, setPaginationParams] = React.useState({page: 1, limit: 10, where: 0, total_records: 0});

  // State do registro selecionado
  // O valor do checkbox de cada registro é o seu índice da estrutura de dados original retornada do servidor
  // Quando um registro é selecionado, aqui é salvo seu índice, e o modal de update e delete são renderizados
  // Os modais recebem o elemento do array da resposta do servidor cujo índice é igual ao salvo aqui 
  const [selectedRecordIndex, setSelectedRecordIndex] = React.useState(null);

  // Context do snackbar
  const { enqueueSnackbar } = useSnackbar();

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    /**
     * Hook use useEffect para carregar os dados da tabela de acordo com os valores da paginação
     * 
     */
     React.useEffect(() => {

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

  function handleClickRadio(event, row){
    //console.log(event.target.value)

    if (event.target.value === selectedRecordIndex) {
      setSelectedRecordIndex(null);
    } else if(event.target.value != selectedRecordIndex){
      //console.log(panelData.response.records[selectedRecordIndex])
      //console.log(panelData.response.records[event.target.value])
      setSelectedRecordIndex(event.target.value);
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
            {selectedRecordIndex == null && 
              <Tooltip title="Selecione um registro para editar">
                <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? false : true}>
                  <FontAwesomeIcon icon={faPenToSquare} color={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size = "sm"/>
                </IconButton>
              </Tooltip>
            }

            {/* O modal é renderizado apenas quando um registro já foi selecionado */}
            {(panelData.response.records != null && selectedRecordIndex != null) && 
              <UpdateOrderFormulary record = {panelData.response.records[selectedRecordIndex]} record_setter = {setSelectedRecordIndex} /> 
            }
          </Grid>

          <Grid item>
            {selectedRecordIndex == null && 
              <Tooltip title="Selecione um registro para excluir">
              <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? false : true} >
                  <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? "#007937" : "#808991"} size = "sm"/>
              </IconButton>
              </Tooltip>
            }

            {/* O modal é renderizado apenas quando um registro já foi selecionado */}
            {(panelData.response.records != null && selectedRecordIndex != null) && 
              <DeleteOrderFormulary record = {panelData.response.records[selectedRecordIndex]} record_setter = {setSelectedRecordIndex} />
            }
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
              disableunderline: 1,
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
            value={selectedRecordIndex} 
          >

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500 }} aria-label="customized table">
                  <TableHead>
                  <TableRow>
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell align="center">Status</StyledTableCell>
                      <StyledTableCell align="center">Planos de Vôo</StyledTableCell>
                      <StyledTableCell align="center">NumOS</StyledTableCell>
                      <StyledTableCell align="center">Criador</StyledTableCell>
                      <StyledTableCell align="center">Piloto</StyledTableCell>
                      <StyledTableCell align="center">Cliente</StyledTableCell>
                      <StyledTableCell align="center">Observação</StyledTableCell>
                      <StyledTableCell align="center">Data do início</StyledTableCell>
                      <StyledTableCell align="center">Data do fim</StyledTableCell>
                  </TableRow>
                  </TableHead>
                  <TableBody className = "tbody">
                    {(!panelData.status.loading && panelData.status.success && !panelData.status.error) &&
                      panelData.response.records.length > 0 &&
                      panelData.response.records.map((row, index) => (
                        <TableRow key={row.order_id}>
                        <TableCell><FormControlLabel value={index} control={<Radio onClick={(e) => {handleClickRadio(event)}} />} label={row.order_id} /></TableCell>
                        <TableCell align="center">{row.order_status === 1 ? <Chip label={"Ativo"} color={"success"} variant="outlined" /> : <Chip label={"Inativo"} color={"error"} variant="outlined" />}</TableCell>
                        <TableCell align="center">
                          <BadgeIcon number = {row.flight_plans.length} color = {"primary"} /> 
                        </TableCell>
                        <TableCell align="center">{row.numOS}</TableCell> 
                        <TableCell align="center">
                          {row.creator.id == 0 ? <Chip label={"Sem dados"} variant="outlined" /> : (row.creator.status == 1 ? <Chip label={row.creator.name} color={"success"} variant="outlined"/> : <Chip label={row.creator.name} color={"error"} variant="outlined"/>)}
                        </TableCell>
                        <TableCell align="center">
                          {row.pilot.id == 0 ? <Chip label={"Sem dados"} variant="outlined"/> : (row.pilot.status == 1 ? <Chip label={row.pilot.name} color={"success"} variant="outlined"/> : <Chip label={row.pilot.name} color={"error"} variant="outlined"/>)}
                        </TableCell>
                        <TableCell align="center">
                          {row.client.ids == 0 ? <Chip label={"Sem dados"} variant="outlined"/> : (row.client.status == 1 ? <Chip label={row.client.name} color={"success"} variant="outlined"/> : <Chip label={row.client.name} color={"error"} variant="outlined"/>)}
                        </TableCell>
                        <TableCell align="center">{row.order_note}</TableCell>
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