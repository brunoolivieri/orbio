import { createTheme } from '@mui/material';

export const theme = createTheme({
    MuiDivider: {
        styleOverrides: {
            root: {
                backgroundColor: '#f0f0f0',
            },
        },
    },
    typography: {
        fontFamily: 'Public Sans, sans-serif',
        h1: {
            fontWeight: 500
        }
    },
    MuiListItemText: {
        fontWeight: 700       
    }
});