import * as React from 'react';
// Material UI
import Paper from '@mui/material/Paper';
import { Box } from "@mui/system";
// Custom
import { OrdersPanel } from './orders_panel/OrdersPanel';
import { usePage } from '../../../context/PageContext';

export function ServiceOrders() {

    const { setPage } = usePage();

    React.useEffect(() => {
        setPage("ORDENS DE SERVIÇO");
    }, []);

    return (
        <>
            <Paper sx={{ maxWidth: "95%", margin: 'auto', overflow: 'hidden', borderRadius: 5 }}>
                <Box sx={{ my: 3, mx: 2 }} color="text.secondary">
                    <OrdersPanel />
                </Box>
            </Paper>
        </>
    );
}