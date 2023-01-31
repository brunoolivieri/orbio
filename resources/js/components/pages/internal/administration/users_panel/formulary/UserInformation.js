import * as React from 'react';
// Material UI
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, IconButton, Grid, Typography, Divider } from '@mui/material';
// Custom
import { useAuth } from '../../../../../context/Auth';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
// Libs
import moment from 'moment/moment';

export const UserInformation = React.memo((props) => {

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
                <IconButton disabled={user.data.user_powers["1"].profile_powers.write == 1 ? false : true} onClick={handleClickOpen}>
                    <FontAwesomeIcon icon={faCircleInfo} color={user.data.user_powers["1"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{ style: { borderRadius: 15 } }}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>USUÁRIO ID: {props.record.id} | INFORMAÇÕES</DialogTitle>
                <Divider />

                <DialogContent>

                    <Typography component={'p'} mb={1}>Dados básicos.</Typography>

                    <Grid container columns={12} spacing={1} mb={1}>

                        <Grid item xs={12} md={6}>
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

                        <Grid item xs={12} md={6}>
                            <TextField
                                margin="dense"
                                defaultValue={props.record.email}
                                label="Email"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
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

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                margin="dense"
                                defaultValue={props.record.profile.name}
                                label="Perfil"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={3}>
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

                        <Grid item xs={12} sm={3}>
                            <TextField
                                margin="dense"
                                defaultValue={moment(props.record.updated_at).format("DD/MM/YYYY")}
                                label="Criado em"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                    </Grid>

                    {(props.record.status && props.record.documents) &&
                        <>
                            <Typography component={'p'} mb={1}>Dados documentais.</Typography>

                            <Grid container columns={12} spacing={1} mb={1}>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        defaultValue={props.record.documents.cpf}
                                        label="CPF"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        defaultValue={props.record.documents.cnpj}
                                        label="CNPJ"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        defaultValue={props.record.documents.telephone}
                                        label="Telefone"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        defaultValue={props.record.documents.cellphone}
                                        label="Celular"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        defaultValue={props.record.documents.company_name}
                                        label="Razão Social"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        defaultValue={props.record.documents.trading_name}
                                        label="Nome fantasia"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        defaultValue={''}
                                        label="Licença ANAC"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>

                            </Grid>

                            <Typography component={'p'} mb={1}>Dados de endereço.</Typography>

                            <Grid container columns={12} spacing={1} mb={1}>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        defaultValue={''}
                                        label="Cidade"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        defaultValue={''}
                                        label="Estado"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        defaultValue={''}
                                        label="Número"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        defaultValue={''}
                                        label="Endereço"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        defaultValue={''}
                                        label="Complemento"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Typography component={'p'} mb={1}>Ordens de serviço vinculadas: {props.record.service_order.length}</Typography>

                            {props.record.service_order.length > 0 &&
                                <Grid item xs={12} md={6}>
                                    <Button variant="contained">Visualizar</Button>
                                </Grid>
                            }
                        </>
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