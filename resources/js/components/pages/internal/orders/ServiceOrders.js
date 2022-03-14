// IMPORTAÇÃO DOS COMPONENTES DO MATERIAL UI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from "@mui/system";
import AssessmentIcon from '@mui/icons-material/Assessment';

// IMPORTAÇÃO DOS COMPONENTES PERSONALIZADOS
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { useEffect } from "react";

export function ServiceOrders(){

    // Atualização do state global da páginação 
    const {actualPage, setActualPage}= usePagination();

    /*
    * Atualização do state global da página atual
    */
    useEffect(() => {
        
        setActualPage("ORDENS DE SERVIÇO");

    })



    return(

        <>
        <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden' }}>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
        >
          <Toolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <SearchIcon color="inherit" sx={{ display: 'block' }} />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  placeholder="Pesquisar"
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: 'default' },
                  }}
                  variant="standard"
                />
              </Grid>
              <Grid item>
                { /* <Tooltip title="Reload">
                  <IconButton>
                    <RefreshIcon color="inherit" sx={{ display: 'block' }} />
                  </IconButton>
                </Tooltip> */}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Box sx={{ my: 3, mx: 2 }} color="text.secondary">

          ORDERS TABLE
        
        </Box>
    </Paper>
        </>
    )
}