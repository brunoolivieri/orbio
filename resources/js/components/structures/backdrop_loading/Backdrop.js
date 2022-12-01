import * as React from 'react';
import { Backdrop as MuiBackdrop } from '@mui/material/Backdrop';

export default function Backdrop() {

    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
            <MuiBackdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
            </MuiBackdrop>
        </div>
    );
}
