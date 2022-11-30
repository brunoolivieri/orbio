import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Grid, Typography, Divider } from '@mui/material';
// Custom
import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
// Libs
import moment from 'moment/moment';

export const ServiceOrderInformation = React.memo((props) => {

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
                <IconButton disabled={!AuthData.data.user_powers["3"].profile_powers.write == 1} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faCircleInfo} color={AuthData.data.user_powers["3"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>ORDEM DE SERVIÇO ID: {props.record.id} | INFORMAÇÕES</DialogTitle>
                <Divider />

                <DialogContent>

                    <Typography component={'p'} mb={1}>Dados básicos.</Typography>

                    <Grid container columns={12} spacing={1} mb={1}>

                        <Grid item xs={12} md={4}>
                            <TextField
                                margin="dense"
                                defaultValue={props.record.number}
                                label="Número"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
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

                        <Grid item xs={12} md={4}>
                            <TextField
                                margin="dense"
                                defaultValue={props.record.status ? "Ativo" : "Inativo"}
                                label="Status"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <TextField
                                margin="dense"
                                defaultValue={moment(props.record.start_date).format("DD/MM/YYYY")}
                                label="Data inicial"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <TextField
                                margin="dense"
                                defaultValue={moment(props.record.end_date).format("DD/MM/YYYY")}
                                label="Data final"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Typography component={'p'} mb={1}>Planos de voo vinculados: {props.record.flight_plans.length}</Typography>

                    {props.record.flight_plans.length > 0 &&
                        <Grid item xs={12} md={6}>
                            <Button variant="contained">Visualizar</Button>
                        </Grid>
                    }

                </DialogContent>

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose} variant="contained">Fechar</Button>
                </DialogActions>
            </Dialog>
        </>
    )

});