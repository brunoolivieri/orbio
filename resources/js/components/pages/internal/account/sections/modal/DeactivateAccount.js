import * as React from 'react';
// Mui
import { Divider, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useSnackbar } from 'notistack';
// Custom
import { useAuth } from '../../../../../context/Auth';
import axios from '../../../../../../services/AxiosApi';

export function DeactivateAccountModal() {

    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    async function handleSave() {
        try {
            await axios.delete(`api/myprofile/deactivation/${user.id}`);
            await axios.post("api/logout");
        } catch (error) {
            enqueueSnackbar(error.response.message, { variant: "error" });
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <>
            <Button variant="contained" color="error" onClick={() => setOpen(true)}>
                Desativar conta
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>
                    CONFIRMAR DESATIVAÇÃO
                </DialogTitle>
                <Divider />

                <DialogContent>
                    <DialogContentText>
                        A sua conta será desativada imediatamente. Ela não será excluída e poderá ser recuperada posteriormente. Enquanto estiver inativa seu acesso não será possível.
                    </DialogContentText>
                </DialogContent>

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button color="error" variant="contained" disabled={loading} onClick={handleSave}>Desativar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}