// React
import * as React from 'react';
import ReactDOM from 'react-dom';
// Material UI
import CssBaseline from '@mui/material/CssBaseline';
// Custom
import { AuthProvider } from './context/Auth';
import { PageProvider } from './context/PageContext';
// Libs
import { MainRoutes } from "./routes/index";
import { SnackbarProvider } from 'notistack';

export default function Index() {

  return (
    <PageProvider>
      <AuthProvider>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <MainRoutes />
        </SnackbarProvider>
      </AuthProvider>
    </PageProvider>
  );
}

if (document.getElementById('root')) {
  ReactDOM.render(<Index />, document.getElementById('root'));
}