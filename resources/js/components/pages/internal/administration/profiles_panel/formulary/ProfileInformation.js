import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Grid, Divider } from '@mui/material';
// Custom
import { useAuth } from '../../../../../context/Auth';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
// Lib
import moment from 'moment/moment';

export const ProfileInformation = React.memo((props) => {

    const { user } = useAuth();
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
                <IconButton disabled={user.user_powers["1"].profile_powers.write == 1 ? false : true} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faCircleInfo} color={user.user_powers["1"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>ATUALIZAÇÃO DE PERFIL</DialogTitle>
                <Divider />

                <DialogContent>

                    <Grid container columns={12} spacing={1}>

                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                defaultValue={props.record.name}
                                label="Nome do perfil"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={5}>
                            <TextField
                                margin="dense"
                                defaultValue={moment(props.record.created_at).format("DD/MM/YYYY")}
                                label="Criado em"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={5}>
                            <TextField
                                margin="dense"
                                defaultValue={moment(props.record.updated_at).format("DD/MM/YYYY")}
                                label="Atualizado em"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={2}>
                            <TextField
                                margin="dense"
                                defaultValue={props.record.total_users}
                                label="Usuários vinculados"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                    </Grid>

                </DialogContent>

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose} variant="contained">Fechar</Button>
                </DialogActions>
            </Dialog>
        </>
    )

});