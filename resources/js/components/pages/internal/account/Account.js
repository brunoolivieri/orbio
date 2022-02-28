// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect } from "react";
import { useState } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { BasicDataPanel } from "./basic_data_panel/BasicDataPanel";
import { ComplementaryDataPanel } from "./complementary_data_panel/ComplementaryDataPanel";
import { SwitchPanelAccount } from "../../../structures/administration_page/switch_panel/SwitchPanelAccount";
import AxiosApi from "../../../../services/AxiosApi";
import { useAuthentication } from "../../../context/InternalRoutesAuth/AuthenticationContext";

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import { AppBar } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";

export function Account(){

// ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // Utilizador do state global da páginação 
    const {actualPage, setActualPage}= usePagination();

    // State para alternância do painel de administrador
    const [actualPanel, setActualPanel] = useState("basic");

    // State para recarregar o formulário
    const [reloadForm, setReloadForm] = useState(false);

    // State para os valores dos campos editáveis 
    const [formularyData, setFormularyData] = useState({status: false}); 

// ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    useEffect(() => {

      setActualPage("MINHA CONTA");

    },[])

    /*
    * Atualização do state global da página atual
    */
    useEffect(() => {
      
      // Comunicação com o backend
      // Para recuperação dos dados que formam o painel de gerenciamento de usuários
      AxiosApi.get(`/api/user-account-data?user_id=${AuthData.data.id}`, {
        access: AuthData.data.access
        })
        .then(function (response) {
  
            if(response.status === 200){

              setFormularyData({
                status: true, 
                error: false,
                userid: AuthData.data.id,
                complementary_data_id: AuthData.data.user_complementary_data.complementary_data_id,
                address_id: AuthData.data.user_address_data.user_address_id,
                name: response.data.data["0"].nome, 
                email: response.data.data["0"].email,
                password: AuthData.data.senha,
                profile: AuthData.data.profile,
                last_access: AuthData.data.last_access,
                last_update: AuthData.data.last_update,
                habANAC: response.data.data["0"].habANAC, 
                cpf: response.data.data["0"].CPF, 
                cnpj: response.data.data["0"].CNPJ, 
                telephone: response.data.data["0"].telefone, 
                cellphone: response.data.data["0"].celular, 
                razaoSocial: response.data.data["0"].razaoSocial, 
                nomeFantasia: response.data.data["0"].nomeFantasia,
                logradouro: response.data.data["0"].logradouro,
                numero: response.data.data["0"].numero,
                cep: response.data.data["0"].cep,
                cidade: response.data.data["0"].cidade,
                estado: response.data.data["0"].estado,
                complemento: response.data.data["0"].complemento
              });
  
            }else{
  
              // ALERTA DE ERRO
  
            }    
  
        })
        .catch(function (error) {
  
          // ALERTA DE ERRO
  
        });
  
    },[reloadForm])

// ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    return(
      <>
        <Paper sx={{ maxWidth: 1500, margin: 'auto', overflow: 'hidden' }}>
          <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
          >
            <Toolbar>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs>
                  {/* Cabeçalho do painel principal - botões para alternância dos paineis */}
                  <SwitchPanelAccount panelStateSetter = {setActualPanel} /> 
                </Grid>
              </Grid>
            </Toolbar>
            </AppBar>
          <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

            {/* VARIAÇÃO DOS PAINÉIS - BÁSICO E COMPLEMENTAR */}
            {formularyData.status ? (actualPanel === "basic" ? <BasicDataPanel {...formularyData} reload_state = {reloadForm} reload_setter = {setReloadForm} /> 
            : <ComplementaryDataPanel {...formularyData} reload_state = {reloadForm} reload_setter = {setReloadForm} /> ) : "CARREGANDO" }
            
          </Box>
        </Paper>
    </>

    

    

  
    )
}