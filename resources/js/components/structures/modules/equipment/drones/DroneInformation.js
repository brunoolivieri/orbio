import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Grid, Typography } from '@mui/material';
// Custom
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
// Libs
import moment from 'moment/moment';

export const DroneInformation = React.memo((props) => {

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
                <DialogTitle>DRONE ID: {props.record.id} | INFORMAÇÕES</DialogTitle>

                <DialogContent>

                    <Typography component={'p'} mb={1}>Dados básicos.</Typography>

                    <Grid container columns={12} spacing={1} mb={1}>

                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                defaultValue={props.record.name}
                                label="Nome"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                defaultValue={props.record.manufacturer}
                                label="Manufaturador"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                defaultValue={props.record.model}
                                label="Model"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                defaultValue={props.record.record_number}
                                label="Nome"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                defaultValue={props.record.serial_number}
                                label="Número serial"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                defaultValue={props.record.observation}
                                label="Observação"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={3}>
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

                        <Grid item xs={3}>
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

                        <Grid item xs={3}>
                            <TextField
                                margin="dense"
                                defaultValue={props.record.weight}
                                label="Peso"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Typography component={'p'} mb={1}>Ordens de serviço vinculadas: {}</Typography>

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} variant="contained">Fechar</Button>
                </DialogActions>
            </Dialog>
        </>
    )

});