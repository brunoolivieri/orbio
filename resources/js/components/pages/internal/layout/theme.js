import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    components: {
        MuiDivider: {
            styleOverrides: {
                root: {
                    backgroundColor: '#f0f0f0',
                },
            },
        },
        typography: {
            fontFamily: ['Open Sans', 'sans-serif'],
            h1: {
                fontWeight: 500
            }
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    fontWeight: 600
                },
            }
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: "#007937",
                    color: "#fff"
                }
            }
        },
        MuiTableCell: {
            fontSize: 14
        },
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(8px)'
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                root: {
                    backdropFilter: "blur(5px)",
                    backgroundColor: 'rgba(0,0,0,0.8)'
                }
            }
        }
    }
});