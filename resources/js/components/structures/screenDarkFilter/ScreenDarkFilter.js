import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'; // Spinner de loading

// ==== Importação do Modal informativo ==== //
import { InformativeModal } from "../informative_modal/InformativeModal";

export function ScreenDarkFilter({...operation}) {

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        {operation.type === "loading" ? <CircularProgress color="inherit" /> : <InformativeModal {...operation} />}
      </Backdrop>
    </div>
  );
}
