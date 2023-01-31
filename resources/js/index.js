// React
import * as React from 'react';
import ReactDOM from 'react-dom';
// Material UI
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// Custom
import { AuthProvider } from './components/context/Auth';
import { PageProvider } from './components/context/PageContext';
// Libs
import { MainRoutes } from "./routes/index";
import { SnackbarProvider } from 'notistack';
// Theme
import { theme } from './components/pages/internal/layout/theme';

export default function Index() {

  return (
    <>
      <PageProvider>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3}>
              <MainRoutes />
            </SnackbarProvider>
          </ThemeProvider>
        </AuthProvider>
      </PageProvider>
    </>
  );
}

if (document.getElementById('root')) {
  ReactDOM.render(<Index />, document.getElementById('root'));
}
