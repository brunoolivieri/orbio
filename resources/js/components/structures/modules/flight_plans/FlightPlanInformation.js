import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Grid, Typography } from '@mui/material';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
// Libs
import moment from 'moment/moment';

export const FlightPlanInformation = React.memo((props) => {

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
                <IconButton disabled={!AuthData.data.user_powers["2"].profile_powers.write == 1} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faCircleInfo} color={AuthData.data.user_powers["2"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>PLANO DE VOO ID: {props.record.id} | INFORMAÇÕES</DialogTitle>

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
                                defaultValue={props.record.creator.name}
                                label="Criador"
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
                                defaultValue={moment(props.record.created_at).format("DD/MM/YYYY")}
                                label="Criado em"
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
                                defaultValue={props.record.localization.state}
                                label="Estado"
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
                                defaultValue={props.record.localization.city}
                                label="Cidade"
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
                                defaultValue={props.record.total_logs}
                                label="Logs"
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
                                defaultValue={props.record.total_incidents}
                                label="Incidentes"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Typography component={'p'} mb={1}>Ordens de serviço vinculadas: {props.record.service_orders.length}</Typography>

                    {props.record.service_orders.length > 0 &&
                        <Grid item xs={12} md={6}>
                            <Button variant="contained">Visualizar</Button>
                        </Grid>
                    }

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} variant="contained">Fechar</Button>
                </DialogActions>
            </Dialog>
        </>
    )

});