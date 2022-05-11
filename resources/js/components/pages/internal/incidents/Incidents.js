import React from 'react';
// Material UI
import Paper from '@mui/material/Paper';
import { Box } from "@mui/system";
// Custom
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { useEffect } from "react";
import { IncidentsPanel } from './incidents_panel/IncidentsPanel';

export function Incidents() {

  const { setActualPage } = usePagination();

  useEffect(() => {
    setActualPage("INCIDENTES");
  });

  return (
    <>
      <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', borderRadius: "10px" }}>
        <Box sx={{ my: 3, mx: 2 }} color="text.secondary">
          <IncidentsPanel />
        </Box>
      </Paper>
    </>
  );
}