import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton } from '@mui/material';
// Custom
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export const ProfileInformation = React.memo((props) => {

    const { AuthData } = useAuthentication();
    const [open, setOpen] = React.useState(false);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <>
            <Tooltip title="Info">
                <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faCircleInfo} color={AuthData.data.user_powers["1"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>PERFIL | INFORMAÇÕES</DialogTitle>

                <DialogContent>

                    <TextField
                        margin="dense"
                        defaultValue={props.record.profile_id}
                        label="ID do perfil"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                        InputProps={{
                            readOnly: true
                        }}
                    />

                    <TextField
                        margin="dense"
                        defaultValue={props.record.profile_name}
                        label="Nome do perfil"
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            readOnly: true
                        }}
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} variant="contained">Fechar</Button>
                </DialogActions>
            </Dialog>
        </>
    )

});