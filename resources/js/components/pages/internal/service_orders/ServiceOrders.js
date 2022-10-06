import * as React from 'react';
// Material UI
import Paper from '@mui/material/Paper';
import { Box } from "@mui/system";
// Custom
import { ServiceOrdersPanel } from './service_orders_panel/ServiceOrdersPanel';
import { usePage } from '../../../context/PageContext';

export const ServiceOrders = () => {

    const { setPageIndex } = usePage();

    React.useEffect(() => {
        setPageIndex(3);
    }, []);

    return (
        <>
            <Paper sx={{ maxWidth: "100%", margin: 'auto', overflow: 'hidden' }}>
                <Box sx={{ my: 3, mx: 2 }} color="text.secondary">
                    <ServiceOrdersPanel />
                </Box>
            </Paper>
        </>
    );
}