// React
import * as React from 'react';
// Custom
import { BasicDataPanel } from "./basic_data_panel/BasicDataPanel";
import { ComplementaryDataPanel } from "./complementary_data_panel/ComplementaryDataPanel";
import { AccountConfiguration } from './account_configuration/AccountConfiguration';
import AxiosApi from "../../../../services/AxiosApi";
import { useAuthentication } from "../../../context/InternalRoutesAuth/AuthenticationContext";
import { Switcher } from "../../../structures/switcher/Switcher";
import { BackdropLoading } from "../../../structures/backdrop_loading/BackdropLoading";
// Material UI
import Paper from '@mui/material/Paper';
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from 'notistack';

export function Account({ ...props }) {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();

  const [actualPanel, setActualPanel] = React.useState("basic");

  const [reloadForm, setReloadForm] = React.useState(false);

  const [accountData, setAccountData] = React.useState({ basic: [], complementary: [], sessions: [] });

  const [loading, setLoading] = React.useState(true);

  const { enqueueSnackbar } = useSnackbar();

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  React.useEffect(() => {
    props.setPage("MINHA CONTA");
  }, []);

  React.useEffect(() => {

    AxiosApi.get(`/api/user-account-data?user_id=${AuthData.data.id}`)
      .then(function (response) {

        setLoading(false);

        setAccountData({
          basic: {
            ...response.data["0"].basic,
            profile: AuthData.data.profile,
            last_access: AuthData.data.last_access,
            last_update: AuthData.data.last_update
          },
          complementary: {
            complementary_data_id: AuthData.data.user_complementary_data.complementary_data_id,
            address_id: AuthData.data.user_address_data.user_address_id,
            ...response.data["0"].complementary,
            ...response.data["0"].address,
          },
          sessions: response.data["0"].active_sessions
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
            <Switcher panelStateSetter={setActualPanel} options={[{ page: "basic", title: "básico", icon: "" }, { page: "complementary", title: "complementar", icon: "" }, { page: "account_configuration", title: "configurações" }]} />
          </Grid>
        </Grid>

        <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

          {!(loading) && <BackdropLoading />}

          {(!loading && actualPanel === "basic") && <BasicDataPanel {...accountData.basic} reload_state={reloadForm} reload_setter={setReloadForm} />}
          {(!loading && actualPanel === "complementary") && <ComplementaryDataPanel {...accountData.complementary} reload_state={reloadForm} reload_setter={setReloadForm} />}
          {(!loading && actualPanel === "account_configuration") && <AccountConfiguration data={accountData.sessions} reload_state={reloadForm} reload_setter={setReloadForm} />}

        </Box>

      </Paper>
    </>






  )
}