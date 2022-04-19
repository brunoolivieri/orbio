// IMPORTAÇÃO DOS COMPONENTES REACT
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { useEffect } from "react";

export function Configurations(){

    const {actualPage, setActualPage}= usePagination();

    /*
    * Atualização do state global da página atual
    */
    useEffect(() => {
      
      setActualPage("CONFIGURAÇÕES");
  
    })

    return(
        <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', borderRadius: "10px" }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
      </AppBar>
      <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">

        CONFIGURAÇÕES

      </Typography>
    </Paper>
    )
}