// React
import * as React from 'react';
// Material UI
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export function ColorModeToggle() {

  const theme = useTheme();

  return (
    <>
      <IconButton sx={{ ml: 1 }} onClick={() => { theme.palette.setter(theme.palette.previousValue == 'dark' ? 'light' : 'dark'); }} color="inherit">
        {theme.palette.mode == 'dark' ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </>
  );

}
