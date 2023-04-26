import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Divider, DialogContentText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from '../../../../../context/Auth';
import axios from '../../../../../services/AxiosApi';

const initialDisplatAlert = { display: false, type: "", message: "" };

export const DeleteLog = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();
    const [selectedIds, setSelectedIds] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [alert, setAlert] = React.useState(initialDisplatAlert);
    const [loading, setLoading] = React.useState(false);
    const [canSave, setCanSave] = React.useState(true);

    const is_authorized = !!user.user_powers["2"].profile_powers.write;

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleClickOpen() {
        setOpen(true);
        const ids = props.records.map((item) => item.id);
        setSelectedIds(ids);
    }

    function handleClose() {
        setAlert({ display: false, type: "", message: "" });
        setCanSave(true);
        setOpen(false);
    }

    async function handleSubmit() {
        try {
            setCanSave(false);
            const response = await axios.delete("api/module/flight-plans-logs/delete", {
                data: {
                    ids: selectedIds
                }
            });
            successResponse(response);
        } catch (error) {
            console.log(error.message);
            setCanSave(true);
            errorResponse(error.response);
        } finally {
            setLoading(false);
        }
    }

    function successResponse(response) {
        setAlert({ display: true, type: "success", message: response.data.message });
        setTimeout(() => {
            props.reloadTable((old) => !old);
            handleClose();
        }, 2000);
    }

    function errorResponse(response) {
        setAlert({ display: true, type: "error", message: response.data.message });
    }

    // ============================================================================== JSX ============================================================================== //

    return (
        <>
            <Tooltip title="Deletar">
                <IconButton disabled={!is_authorized} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faTrashCan} color={is_authorized ? "#007937" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>DELEÇÃO DE LOG</DialogTitle>
                <Divider />

                <DialogContent>
                    <DialogContentText mb={2}>
                        Os logs selecionados serão deletados. A remoção não é permanente e pode ser desfeita.
                    </DialogContentText>
                </DialogContent>

                {alert.display &&
                    <Alert severity={alert.type}>{alert.message}</Alert>
                }

                {loading && <LinearProgress />}

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" disabled={!canSave} variant="contained" color="error" onClick={handleSubmit}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
});