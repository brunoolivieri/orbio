import React, { useState, StrictMode } from 'react';
import ReactDOM from 'react-dom';
// Material UI
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// Custom
import { AuthProvider } from './components/context/InternalRoutesAuth/AuthenticationContext';
// Libs
import { ReactRoutes } from "./routes/ReactRouter";
import { SnackbarProvider } from 'notistack';

export default function Index() {

  const [colorMode, setColorMode] = useState("light");

  const theme = createTheme({
    palette: {
      setter: setColorMode,
      previousValue: colorMode,
      mode: colorMode
    }
  });

  return (
    <>
      <StrictMode>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3}>
              <ReactRoutes />
            </SnackbarProvider>
          </ThemeProvider>
        </AuthProvider>
      </StrictMode>
    </>
  );
}

if (document.getElementById('root')) {

  ReactDOM.render(<Index />, document.getElementById('root'));
}
