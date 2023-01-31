// React
import * as React from 'react';
// Mui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { DialogTitle } from '@mui/material';
import Box from '@mui/material/Box';

export const ModalInformative = React.memo(({ ...props }) => {

    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        setTimeout(() => {
            handleClose();
        }, 2000)
    }, [])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth={'xs'}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{ style: { borderRadius: 15 } }}
        >
            <DialogTitle sx={{ textAlign: "center" }}>{props.title.toUpperCase()}</DialogTitle>

            <DialogContent>

                <Box sx={{ margin: "auto", mt: 3, width: "max-content" }} justifyContent="center" >
                    <img src={props.image} width={100} />
                </Box>

                <DialogContentText id="alert-dialog-description">
                    {props.message}
                </DialogContentText>

            </DialogContent>
        </Dialog>
    );

});
