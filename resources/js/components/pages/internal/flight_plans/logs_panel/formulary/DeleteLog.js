import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Divider, DialogContentText } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
// Custom
import { useAuth } from '../../../../../context/Auth';
import axios from '../../../../../../services/AxiosApi';

const initialDisplatAlert = { display: false, type: "", message: "" };

export const DeleteLog = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();
    const [selectedIds, setSelectedIds] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplatAlert);
    const [loading, setLoading] = React.useState(false);

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleClickOpen() {
        setOpen(true);
        const ids = props.records.map((item) => item.id);
        setSelectedIds(ids);
    }

    function handleClose() {
        setDisplayAlert({ display: false, type: "", message: "" });
        setOpen(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        requestServerOperation();
    }

    function requestServerOperation() {
        axios.delete(`/api/plans-module-logs/delete`, {
            data: {
                ids: selectedIds
            }
        })
            .then(function (response) {
                successResponse(response);
            })
            .catch(function (error) {
                errorResponse(error.response.data);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    function successResponse(response) {
        setDisplayAlert({ display: true, type: "success", message: response.data.message });
        setTimeout(() => {
            props.reloadTable((old) => !old);
            handleClose();
        }, 2000);
    }

    function errorResponse(response) {
        setDisplayAlert({ display: true, type: "error", message: response.data.message });
    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Tooltip title="Deletar">
                <IconButton disabled={!user.user_powers["2"].profile_powers.write == 1} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faTrashCan} color={user.user_powers["2"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>DELEÇÃO DE LOG</DialogTitle>
                <Divider />

                <DialogContent>

                    <DialogContentText mb={2}>
                        {selectedIds.length > 1 ? `Os ${selectedIds.length} logs selecionados serão deletados` : `O log selecionado será deletado`}. A remoção, no entanto, não é permanente e pode ser desfeita.
                    </DialogContentText>

                </DialogContent>

                {displayAlert.display &&
                    <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                }

                {loading && <LinearProgress />}

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit" disabled={loading} variant="contained" color="error" onClick={handleSubmit}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
});