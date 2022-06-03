import React from 'react';
// Material UI
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
// Custom
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { useEffect } from "react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export function Dashboard() {

  const { setActualPage } = usePagination();

  useEffect(() => {

    setActualPage("DASHBOARD");

  }, []);

  return (
    <Paper sx={{ maxWidth: "95%", margin: 'auto', overflow: 'hidden', borderRadius: 5, padding: 3 }}>

      <Toolbar>
        <Grid container spacing={2} columns={12}>
          <Grid item xs={12} md={6} lg={6}>
            <Item>ITEM A</Item>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Item>ITEM B</Item>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Item>ITEM C</Item>
          </Grid>
        </Grid>
      </Toolbar>
    </Paper>
  )
}