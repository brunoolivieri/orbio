// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect, useState } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { UpdateDeleteReportFormulary } from "../../../../structures/modules/reports/UpdateDeleteReportFormulary";
import { CreateReportFormulary } from "../../../../structures/modules/reports/CreateReportFormulary";
import { MapModal } from "../../../../structures/modules/planos/MapModal";

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

export function PlansPanel(){

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
     * Os dados carregados preenchem uma página de acordo com um offset e um limit 
     * O offset trabalha junto com o valor da página e define o primeiro registro da página, enquanto o limit define o último
     * O atributo do switch case define qual o caso de carregamento para a paginação // Os casos são: todos os dados existentes, ou todos os dados pesquisados
     * Dados pesquisados também podem vir em páginas e a sua paginação também implica em alterar o offset da paginação, e consequentemente em ativar o useEffect (porque é uma dependência)
     * Além disso, para pesquisar todos os dados e alguns dados, métodos diferentes do mesmo controlador Laravel são utilizados - ou seja, não pode ser utilizada a mesma chamada AXIOS
     * 
     */
     useEffect(() => {

        // Dados para o middleware de autenticação 
        let logged_user_id = AuthData.data.id;
        let module_id = 2;
        let module_action = "ler";
 
       switch(paginationParams.where[0]){
 
         case false:
 
          // Parâmetros do SELECT
           let pagination_params = `${paginationParams.offset}/${paginationParams.limit}`;
 
           AxiosApi.get(`/api/plans-module?args=${pagination_params}&auth=${logged_user_id}.${module_id}.${module_action}`, {
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
 
           // Parâmetros do SELECT
           let query_arguments = `${paginationParams.where[1]}.${paginationParams.offset}.${paginationParams.limit}`;
 
           AxiosApi.get(`/api/plans-module/plans?args=${query_arguments}&auth=${logged_user_id}.${module_id}.${module_action}`, {
             access: AuthData.data.access
             })
             .then(function (response) {
     
               if(response.status === 200){
 
                 // Os dados do painel são atualizados, recebendo o retorno da pesquisa realizada
                 setPanelData({status: true, error: false, response: response.data.records, total_pages: response.data.total_pages});
       
               }else{
                 
                 // Se a pesquisa falhar
                 //setSearchError({error: true});
       
               }
     
             })
             .catch(function (error) {
               
               // Se a pesquisa falhar
               //setSearchError({error: true}); 
     
           });
 
         break;
 
     }
 
   },[paginationParams]);

   /**
   * Função para processar a alteração da página da tabela
   * 
   */
  const handleTablePageChange = (event, value) => {

    // Varia a página selecionada no mecanismo
    setPage(value);

    let newOffset = value === 1 ? 0 : value*paginationParams.limit - paginationParams.limit;

    // Variam os dados da tabela 
    setPaginationParams({offset: newOffset, limit: paginationParams.limit, where: [paginationParams.where[0],paginationParams.where[1]]});

  };

  /**
   * Função para processar a pesquisa de usuários no input de pesquisa
   * O state do parâmetro de paginação é alterado, o useEffect é chamado, e a requisição AXIOS ocorre com outra configuração
   * 
   */
   function handleSearchSubmit(event, offset){
    event.preventDefault();

      let value_searched = window.document.getElementById("reports_panel_search_input").value;

      setPage(1);
      setPaginationParams({offset: 0, limit: paginationParams.limit, where: [true, value_searched]});

  }

  function reloadTable(){

    setPage(1);
    setPaginationParams({offset: 0, limit: paginationParams.limit, where: [false, ""]});
    setPanelData({status: false, response: "", total_pages: 0});

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

  
    return (
        <>
        <Grid container spacing={1} alignItems="center">

          <Grid item>
            {/* Formulário de criação de usuário */}
            <CreateReportFormulary />
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
              placeholder={"Pesquisar plano por ID"}
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: 'default' },
              }}
              variant="standard"
              id = "reports_panel_search_input"
            />
          </Grid>
          
          {/* Mecanismo de paginação - depende dos dados retornados pelo servidor */}
          {/* Se o total de registros for múltiplo de 10, o total de páginas será esse número dividido por 10. Exemplo: 20 registros = 2 páginas */}
          {/* Se o total de registros não for múltiplo de 10, o total de páginas será esse número mais 10, dividido por 10 e convertido para o maior inteiro mais próximo. Exemplo: 11 páginas = 2 páginas (ao invés de 1,1) */}
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
                    <StyledTableCell align="center">Relatório</StyledTableCell>
                    <StyledTableCell align="center">Incidente</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                    <StyledTableCell align="center">Arquivo</StyledTableCell>
                    <StyledTableCell align="center">Descrição</StyledTableCell>
                    <StyledTableCell align="center">Data criação</StyledTableCell>
                    <StyledTableCell align="center">Última atualização</StyledTableCell>
                    <StyledTableCell align="center">Visualizar</StyledTableCell>
                    <StyledTableCell align="center">Editar</StyledTableCell>
                    <StyledTableCell align="center">Excluir</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody className = "tbody">
                    {/* Geração das linhas da tabela de usuários - depende dos dados retornados pelo servidor */}
                    {/* A função map() serve para percorrer arrays - neste caso, um array de objetos */}
                    {(panelData.status && !panelData.error) && 
                        panelData.response.map((row) => (
                          <StyledTableRow key={row.plan_id}>
                            <StyledTableCell>{row.plan_id}</StyledTableCell>
                            <StyledTableCell align="center">{row.report_id}</StyledTableCell>
                            <StyledTableCell align="center">{row.incident_id == null ? "Sem dados" : row.incident_id}</StyledTableCell>
                            <StyledTableCell align="center">{row.plan_status}</StyledTableCell> 
                            <StyledTableCell align="center">{row.plan_file}</StyledTableCell>
                            <StyledTableCell align="center">{row.plan_description}</StyledTableCell>
                            <StyledTableCell align="center">{moment(row.created_at).format('DD-MM-YYYY hh:mm')}</StyledTableCell>
                            <StyledTableCell align="center">{row.updated_at == null ? "Sem dados" : moment(row.updated_at).format('DD-MM-YYYY hh:mm')}</StyledTableCell>
                            <StyledTableCell align="center"><MapModal data = {row} /></StyledTableCell>
                            <StyledTableCell align="center">Editar</StyledTableCell>
                            <StyledTableCell align="center">Excluir</StyledTableCell>     
                          </StyledTableRow>
                        ))}    
                </TableBody>
            </Table>
        </TableContainer> 
      </>
    );
}