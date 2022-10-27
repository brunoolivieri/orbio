// React
import * as React from 'react';
import ReactDOM from 'react-dom';
// Material UI
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// Custom
import { AuthProvider } from './components/context/InternalRoutesAuth/AuthenticationContext';
import { PageProvider } from './components/context/PageContext';
// Libs
import { MainRoutes } from "./routes/index";
import { SnackbarProvider } from 'notistack';
// Theme
import { theme } from './components/pages/internal/layout/theme';

export default function Index() {

  return (
    <>
      <React.StrictMode>
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
      </React.StrictMode>
    </>
  );
}

if (document.getElementById('root')) {
  ReactDOM.render(<Index />, document.getElementById('root'));
}
