// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect, useState } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { UpdateDeleteProfileFormulary } from "../../../../structures/modules/administration/profiles_administration/UpdateDeleteProfileFormulary";
import { CreateProfileFormulary } from "../../../../structures/modules/administration/profiles_administration/CreateProfileFormulary";

// IMPORTAÇÃO DOS COMPONENTES PARA O MATERIAL UI
import { Table } from "@mui/material";
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
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

export function ProfilesPanel(){

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
     * 
     */
    function handleSearchSubmit(event){
      event.preventDefault();

        let value_searched = window.document.getElementById("profiles_panel_search_input").value;

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

    /**
     * Hook use useEffect para carregar os dados da tabela de acordo com os valores da paginação
     * 
     */
     useEffect(() => {

      const module_middleware = `${AuthData.data.id}.${1}.${"ler"}`;

      if(!paginationParams.where){

        requestToGetAllProfiles(module_middleware);

      }else{

        requestToGetSearchedProfiles(module_middleware);

      }

    },[paginationParams]);

    /**
   * Carregamento de todos os registros de usuário
   * 
   */
    function requestToGetAllProfiles(module_middleware){

     // This receives: limit clause, where clause and the page number
    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

      AxiosApi.get(`/api/admin-module-profile?args=${select_query_params}&auth=${module_middleware}`)
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
    function requestToGetSearchedProfiles(module_middleware){

      // This receives: limit clause, where clause and the page number
      const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

      AxiosApi.get(`/api/admin-module-profile/show?args=${select_query_params}&auth=${module_middleware}`)
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

      });

    }
  

    // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return(

      <>
        <Grid container spacing={1} alignItems="center">

          <Grid item>
            <CreateProfileFormulary />
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
              placeholder={"Pesquisar por id ou nome do perfil"}
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: 'default' },
              }}
              variant="standard"
              id = "profiles_panel_search_input"
            />
          </Grid>

          {(panelData.status && !panelData.error) && 
          <Grid item>
            <Stack spacing={2}>
              <Pagination count={panelData.total_pages} shape="rounded" page={paginationParams.page} onChange={handleTablePageChange} />
            </Stack>
          </Grid>  
          }

        </Grid>

        <Box id = "profiles_table_formulary" noValidate sx={{ mt: 1 }} >

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                      <StyledTableCell align="center">ID</StyledTableCell>
                        <StyledTableCell align="center">Nome</StyledTableCell>
                        <StyledTableCell align="center">Administração</StyledTableCell>
                        <StyledTableCell align="center">Planos de voo</StyledTableCell>
                        <StyledTableCell align="center">Ordens de serviço</StyledTableCell>
                        <StyledTableCell align="center">Relatórios</StyledTableCell>
                        <StyledTableCell align="center">Incidentes</StyledTableCell>
                        <StyledTableCell align="center">Editar</StyledTableCell>
                        <StyledTableCell align="center">Excluir</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className = "tbody">
                        {/* Geração das linhas da tabela de perfis- depende dos dados retornados pelo servidor */}
                        {/* A função map() serve para percorrer arrays - neste caso, um array de objetos */}
                        {(!panelData.status.loading && panelData.status.success && !panelData.status.error) && 
                            panelData.response.records.map((row) => ( 
                              <StyledTableRow key={row.profile_id}>
                                 <StyledTableCell align="center">{row.profile_id}</StyledTableCell>
                                <StyledTableCell align="center">{row.profile_name}</StyledTableCell>
                                <StyledTableCell align="center">
                                  <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked={row.modules["1"].profile_powers.ler === 1 ? true : false} disabled size="small" />} label="Ler" />
                                    <FormControlLabel control={<Checkbox defaultChecked={row.modules["1"].profile_powers.escrever === 1 ? true : false} disabled size="small" />} label="Escrever" />
                                  </FormGroup>   
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked={row.modules["2"].profile_powers.ler === 1 ? true : false} disabled size="small" />} label="Ler" />
                                    <FormControlLabel control={<Checkbox defaultChecked={row.modules["2"].profile_powers.escrever === 1 ? true : false} disabled size="small" />} label="Escrever" />
                                  </FormGroup>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked={row.modules["3"].profile_powers.ler === 1 ? true : false} disabled size="small" />} label="Ler" />
                                    <FormControlLabel control={<Checkbox defaultChecked={row.modules["3"].profile_powers.escrever === 1 ? true : false} disabled size="small" />} label="Escrever" />
                                  </FormGroup> 
                                </StyledTableCell>
                                <StyledTableCell align="center">   
                                  <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked={row.modules["4"].profile_powers.ler === 1 ? true : false} disabled size="small" />} label="Ler" />
                                    <FormControlLabel control={<Checkbox defaultChecked={row.modules["4"].profile_powers.escrever === 1 ? true : false} disabled size="small" />} label="Escrever" />
                                  </FormGroup>
                                </StyledTableCell>
                                <StyledTableCell align="center">   
                                  <FormGroup>
                                    <FormControlLabel control={<Checkbox defaultChecked={row.modules["5"].profile_powers.ler === 1 ? true : false} disabled size="small" />} label="Ler" />
                                    <FormControlLabel control={<Checkbox defaultChecked={row.modules["5"].profile_powers.escrever === 1 ? true : false} disabled size="small" />} label="Escrever" />
                                  </FormGroup>
                                </StyledTableCell>
                                <StyledTableCell align="center"><UpdateDeleteProfileFormulary data = {row} operation = {"update"} refresh_setter = {setRefreshPanel} /></StyledTableCell>
                                <StyledTableCell align="center"><UpdateDeleteProfileFormulary data = {row} operation = {"delete"} refresh_setter = {setRefreshPanel} /></StyledTableCell>
                              </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
          </Box>
            
      </>
    )
}