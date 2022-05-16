// IMPORTAÇÃO DOS COMPONENTES REACT
import { useEffect } from "react";

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { PlansPanel } from "./plans_panel/PlansPanel";

// IMPORTAÇÃO DOS COMPONENTES MATERIALUI
import * as React from 'react';
import Paper from '@mui/material/Paper';
import { Box } from "@mui/system";

export function Plans() {

  const { setActualPage } = usePagination();

  useEffect(() => {

    setActualPage("PLANOS DE VÔO");

  }, []);

  return (
    <Paper sx={{ maxWidth: "95%", margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>
      <Box sx={{ my: 5, mx: 2 }} color="text.secondary">

        <PlansPanel />

      </Box>
    </Paper>
  )
}