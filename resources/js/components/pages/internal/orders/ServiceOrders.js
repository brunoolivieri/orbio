import * as React from 'react';
// Material UI
import Paper from '@mui/material/Paper';
import { Box } from "@mui/system";
// Custom
import { usePagination } from "../../../context/Pagination/PaginationContext";
import { useEffect } from "react";
import { OrdersPanel } from './orders_panel/OrdersPanel';

export function ServiceOrders() {

    const { setActualPage } = usePagination();

    useEffect(() => {
        setActualPage("ORDENS DE SERVIÇO");
    });

    return (
        <>
            <Paper sx={{ maxWidth: "90%", margin: 'auto', overflow: 'hidden', borderRadius: "10px" }}>
                <Box sx={{ my: 3, mx: 2 }} color="text.secondary">
                    <OrdersPanel />
                </Box>
            </Paper>
        </>
    );
}