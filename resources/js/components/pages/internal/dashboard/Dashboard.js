import React from 'react';
// Material UI
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
// Custom
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { useEffect } from "react";

export function Dashboard() {

  const { setActualPage } = usePagination();

  useEffect(() => {

    setActualPage("DASHBOARD");

  }, []);

  return (
    <Paper sx={{ maxWidth: "95%", margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>
      
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
            </Grid>
          </Grid>
        </Toolbar>
      <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">

        PAINEL DA DASHBOARD

      </Typography>
    </Paper>
  )
}