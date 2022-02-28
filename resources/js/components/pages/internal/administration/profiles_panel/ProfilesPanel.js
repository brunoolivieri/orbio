// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect, useState } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { CreateProfileFormulary } from "../../../../structures/administration_page/profiles_administration/CreateProfileFormulary";
import { UpdateDeleteFormulary } from "../../../../structures/administration_page/profiles_administration/UpdateDeleteFormulary";

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
    const {AuthData, setAuthData} = useAuthentication();

    // State da paginação da tabela e função de alteração
    const [page, setPage] = useState(1);

    // State do carregamento dos dados 
    // Status true indica que os dados foram carregados, e false que não foram
    const [panelData, setPanelData] = useState({status: false, response: ""});

    // State dos parâmetros de paginação - define como os dados serão carregados de acordo com a página
    const [paginationParams, setPaginationParams] = useState({offset: 0, limit: 10, where: [false, ""]});

    // State que serve de dependência para o useEffect do AXIOS
    // Serve para recarregar o painel
    const [refreshPanel, setRefreshPanel] = useState(false);

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    /**
     * Função para processar a alteração da página da tabela
     * 
     */
     const handleTablePageChange = (event, value) => {

      // Varia a página selecionada no mecanismo
      setPage(value);

      // Na alteração da página, as alterações são desfeitas
      setAlterationsCounter(0);

      let newOffset = value === 1 ? 0 : (value*paginationParams.limit - paginationParams.limit);

      // Variam os dados da tabela 
      setPaginationParams({offset: newOffset, limit: paginationParams.limit, where: [paginationParams.where[0],paginationParams.where[1]]});

    };

    /**
     * Função para processar a pesquisa de usuários no input de pesquisa
     * 
     */
    function handleSearchSubmit(event, offset){
      event.preventDefault();

        let value_searched = window.document.getElementById("profiles_panel_search_input").value;

        setPage(1);
        setPaginationParams({offset: 0, limit: paginationParams.limit, where: [true, value_searched]});

    }

    function reloadTable(){

      setPage(1);
      setPaginationParams({offset: 0, limit: paginationParams.limit, where: [false, ""]});
      setPanelData({status: false, response: ""});

    }

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

        let userid = AuthData.data.id;
        let module_id = 1;
        let action = "ler";

      switch(paginationParams.where[0]){

        // Carregamento de todos os dados considerando o offset e limit
        case false:

          // Parâmetros do caso de carregamento
          let pagination_params = `${paginationParams.offset}|${paginationParams.limit}`;

          // Comunicação com o backend
          // Para recuperação dos dados que formam o painel de gerenciamento de perfis
          AxiosApi.get(`/api/admin-module?panel=profiles_panel&args=${pagination_params}&auth=${userid}/${module_id}/${action}`, {
            access: AuthData.data.access
            })
            .then(function (response) {
    
              if(response.status === 200){

                setPanelData({status: true, error: false, response: response.data.records, total_pages: response.data.total_pages});
      
              }else{
      
                setPanelData({status: true, error: true, response: response.data.error});
      
              }
    
            })
            .catch(function (error) {
    
              setPanelData({status: true, error: true, response: "ERRO NO CARREGAMENTO DOS REGISTROS DE USUÁRIOS."});
    
          });

        break;
        
        // Carregamento dos dados pesquisados considerando o offset e limit
        case true:

          // Parâmetros do caso de carregamento
          let query_arguments = `${'profiles_panel'}|${paginationParams.where[1]}|${paginationParams.offset}|${paginationParams.limit}`;

          // Comunicação com o backend
          AxiosApi.get(`/api/admin-module/${query_arguments}?auth=${userid}/${module_id}/${action}`, {
            })
            .then(function (response) {
    
              if(response.data.status){

                // Os dados do painel são atualizados, recebendo o retorno da pesquisa realizada
                setPanelData({status: true, error: false, response: response.data.records, total_pages: response.data.total_pages});
      
              }
    
            })
            .catch(function (error) {
              
              // Se a pesquisa falhar
              //setSearchError({error: true}); 
    
          });

        break;

      }

    },[paginationParams]);
  

    // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return(

      <>
        <Grid container spacing={1} alignItems="center">

          <Grid item>
            {/* Formulário de criação de usuário */}
            <CreateProfileFormulary />
          </Grid>

          <Grid item>
            <Tooltip title="Reload">
              <IconButton onClick = {reloadTable}>

                {/* O recarregamento dos dados é a alteração do valor das dependências do useEffect que realiza uma requisição com AXIOS */}
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
              placeholder={"Pesquisar por nome do perfil"}
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: 'default' },
              }}
              variant="standard"
              id = "profiles_panel_search_input"
            />
          </Grid>

          {/* Mecanismo de paginação - depende dos dados retornados pelo servidor */}
          {/* Se o total de registros for múltiplo de 10, o total de páginas será esse número dividido por 10. Exemplo: 20 registros = 2 páginas */}
          {/* Se o total de registros não for múltiplo de 10, o total de páginas será esse número mais 10, dividido por 10 e convertido para o maior inteiro mais próximo. Exemplo: 11 páginas = 2 páginas (ao invés de 1,1) */}
          {(panelData.status && !panelData.error) && 
          <Grid item>
            <Stack spacing={2}>
              <Pagination count={panelData.total_pages} shape="rounded" page={page} onChange={handleTablePageChange} />
            </Stack>
          </Grid>  
          }

        </Grid>

        <Box id = "profiles_table_formulary" noValidate sx={{ mt: 1 }} >

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                          <StyledTableCell align="center">Nome</StyledTableCell>
                          <StyledTableCell align="center">Administração</StyledTableCell>
                          <StyledTableCell align="center">Planos de voo</StyledTableCell>
                          <StyledTableCell align="center">Ordens de serviço</StyledTableCell>
                          <StyledTableCell align="center">Relatórios</StyledTableCell>
                          <StyledTableCell align="center">Editar</StyledTableCell>
                          <StyledTableCell align="center">Excluir</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className = "tbody">
                        {/* Geração das linhas da tabela de perfis- depende dos dados retornados pelo servidor */}
                        {/* A função map() serve para percorrer arrays - neste caso, um array de objetos */}
                        {(panelData.status && !panelData.error) && 
                            panelData.response.map((row) => ( 
                              <StyledTableRow key={row.profile_id}>
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
                                <StyledTableCell align="center"><UpdateDeleteFormulary data = {row} operation = {"update"} refresh_setter = {setRefreshPanel} /></StyledTableCell>
                                <StyledTableCell align="center"><UpdateDeleteFormulary data = {row} operation = {"delete"} refresh_setter = {setRefreshPanel} /></StyledTableCell>
                              </StyledTableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
          </Box>
            
      </>
    )
}