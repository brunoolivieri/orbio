import * as React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Divider, IconButton, Tooltip } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export function LogImageVisualization(props) {

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <Tooltip title="Visualizar">
                <IconButton onClick={handleOpen}>
                    <RemoveRedEyeIcon />
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                fullWidth
                maxWidth="md"
            >
                <DialogContent>
                    <img style={{ borderRadius: 2, width: "100%", height: "100%" }} src={props.actual_log.image.dataURL} />
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleClose} variant="contained">Fechar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}