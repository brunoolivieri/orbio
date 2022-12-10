import * as React from 'react';
// Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, IconButton, Alert, LinearProgress, Divider } from '@mui/material';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
// Custom
import axios from '../../../../../../services/AxiosApi';
import { useAuthentication } from '../../../../../context/InternalRoutesAuth/AuthenticationContext';

const initialDisplayAlert = { display: false, type: "", message: "" };

export const DeleteEquipment = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();
    const [selectedIds, setSelectedIds] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [displayAlert, setDisplayAlert] = React.useState(initialDisplayAlert);
    const [loading, setLoading] = React.useState(false);

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
        requestServerOperation();
    }

    const requestServerOperation = () => {
        axios.delete(`/api/equipments-module-equipment/delete`, {
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

    // ============================================================================== STRUCTURES - MUI ============================================================================== //

    return (
        <>
            <Tooltip title="Editar">
                <IconButton onClick={handleClickOpen} disabled={!AuthData.data.user_powers["6"].profile_powers.read == 1}>
                    <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["6"].profile_powers.read == 1 ? "#00713A" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>DELEÇÃO DE EQUIPAMENTOS</DialogTitle>
                <Divider />

                <DialogContent>

                    <DialogContentText mb={2}>
                        {selectedIds.length > 1 ? `As ${selectedIds.length} baterias selecionadas serão deletadas` : "A bateria selecionada será deletada"}. A remoção, no entanto, não é permanente e pode ser desfeita.
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