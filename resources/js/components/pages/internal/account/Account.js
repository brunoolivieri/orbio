// React
import * as React from 'react';
// Custom
import { BasicDataPanel } from "./basic_data_panel/BasicDataPanel";
import { ComplementaryDataPanel } from "./complementary_data_panel/ComplementaryDataPanel";
import { AccountConfiguration } from './account_configuration/AccountConfiguration';
import AxiosApi from "../../../../services/AxiosApi";
import { useAuthentication } from "../../../context/InternalRoutesAuth/AuthenticationContext";
import { Switcher } from "../../../structures/switcher/Switcher";
// Material UI
import Paper from '@mui/material/Paper';
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from 'notistack';

export function Account({ ...props }) {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const { AuthData } = useAuthentication();

  // State para alternância do painel de administrador
  const [actualPanel, setActualPanel] = React.useState("basic");

  // State para recarregar o formulário
  const [reloadForm, setReloadForm] = React.useState(false);

  // State para os valores dos campos editáveis 
  const [accountData, setAccountData] = React.useState({ status: false, error: false, data: { basic: [], complementary: [], sessions: [] } });

  // Snackbar
  const { enqueueSnackbar } = useSnackbar();

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  React.useEffect(() => {
    props.setPage("MINHA CONTA");
  }, []);

  React.useEffect(() => {

    // Get the user atualized data
    AxiosApi.get(`/api/user-account-data?user_id=${AuthData.data.id}`, {
      access: AuthData.data.access
    })
      .then(function (response) {

        setAccountData({
          status: true,
          error: false,
          data: {
            basic: {
              name: response.data["0"].nome,
              email: response.data["0"].email,
              profile: AuthData.data.profile,
              last_access: AuthData.data.last_access,
              last_update: AuthData.data.last_update
            },
            complementary: {
              complementary_data_id: AuthData.data.user_complementary_data.complementary_data_id,
              address_id: AuthData.data.user_address_data.user_address_id,
              habANAC: response.data["0"].habANAC,
              cpf: response.data["0"].CPF,
              cnpj: response.data["0"].CNPJ,
              telephone: response.data["0"].telefone,
              cellphone: response.data["0"].celular,
              razaoSocial: response.data["0"].razaoSocial,
              nomeFantasia: response.data["0"].nomeFantasia,
              logradouro: response.data["0"].logradouro,
              numero: response.data["0"].numero,
              cep: response.data["0"].cep,
              cidade: response.data["0"].cidade,
              estado: response.data["0"].estado,
              complemento: response.data["0"].complemento
            },
            sessions: response.data["0"].active_sessions
          }
        });

      })
      .catch(function () {

        handleOpenSnackbar("Erro! Os dados do perfil não foram carregados.", "error");

      });

  }, [reloadForm]);

  function handleOpenSnackbar(text, variant) {

    enqueueSnackbar(text, { variant });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

  return (
    <>
      <Paper sx={{ maxWidth: '95%', margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs>
            {/* Cabeçalho do painel principal - botões para alternância dos paineis */}
            <Switcher panelStateSetter={setActualPanel} options={[{ page: "basic", title: "básico", icon: "" }, { page: "complementary", title: "complementar", icon: "" }, { page: "account_configuration", title: "configurações" }]} />
          </Grid>
        </Grid>

        <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

          {accountData.status ? (actualPanel === "basic" ? <BasicDataPanel {...accountData.data.basic} reload_state={reloadForm} reload_setter={setReloadForm} />
            : (actualPanel === "complementary" ? <ComplementaryDataPanel {...accountData.data.complementary} reload_state={reloadForm} reload_setter={setReloadForm} />
              : <AccountConfiguration data={accountData.data.sessions} reload_state={reloadForm} reload_setter={setReloadForm} />))
            : "CARREGANDO"
          }

        </Box>

      </Paper>
    </>






  )
}