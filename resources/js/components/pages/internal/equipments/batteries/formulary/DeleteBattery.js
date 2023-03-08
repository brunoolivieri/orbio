import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Divider } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
// Custom
import axios from '../../../../../../services/AxiosApi';
import { useAuth } from '../../../../../context/Auth';

const initialDisplayAlert = { display: false, type: "", message: "" };

export const DeleteBattery = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();
    const [selectedIds, setSelectedIds] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
    const [loading, setLoading] = React.useState(false);

    const is_authorized = !!user.user_powers["5"].profile_powers.write;

    // ============================================================================== FUNCTIONS ============================================================================== //

    function handleClickOpen() {
        setOpen(true);
        const ids = props.records.map((item) => item.id);
        setSelectedIds(ids);
    }

    function handleClose() {
        setDisplayAlert(initialDisplayAlert);
        setLoading(false);
        setOpen(false);
    }

    function handleSubmit() {
        setLoading(true);
        requestServer();
    }

    async function requestServer() {
        try {
            const response = await axios.delete("api/module/equipments-battery/delete", {
                data: {
                    ids: selectedIds
                }
            });
            successResponse(response);
        } catch (error) {
            errorResponse(error.response);
        } finally {
            setLoading(false);
        }
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

    // ============================================================================== STRUCTURES - MUI ============================================================================== //

    return (
        <>
            <Tooltip title="Editar">
                <IconButton onClick={handleClickOpen} disabled={!is_authorized}>
                    <FontAwesomeIcon icon={faTrashCan} color={is_authorized ? "#00713A" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>DELEÇÃO DE BATERIAS</DialogTitle>
                <Divider />

                <DialogContent>
                    <DialogContentText mb={2}>
                        As baterias selecionadas serão deletadas. A remoção não é permanente e pode ser desfeita.
                    </DialogContentText>
                </DialogContent>

                {displayAlert.display &&
                    <Alert severity={displayAlert.type}>{displayAlert.message}</Alert>
                }

                {loading && <LinearProgress />}

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button disabled={loading} variant="contained" color="error" onClick={handleSubmit}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
});