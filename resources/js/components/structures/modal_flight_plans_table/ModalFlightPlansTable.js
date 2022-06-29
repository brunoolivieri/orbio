// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Divider } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IconButton } from '@mui/material';
// Axios
import AxiosApi from "../../../services/AxiosApi";
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


export const ModalFlightPlansTable = React.memo(() => {

    const [loading, setLoading] = React.useState({ loading: true, error: false });
    const [options, setOptions] = React.useState([]);
    const [selectedOptions, setSelectedOptions] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {

        AxiosApi.get("/api/load-flight_plans")
            .then(function (response) {

                setLoading({ loading: false, error: false });
                setOptions(response.data);

            })
            .catch(function () {

                setLoading({ loading: false, error: true });
                setOptions([]);

            });
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickRadio = (event) => {

        let selectedOptionsUpdated = [];

        options.map((record) => {
            if (record.id == event.currentTarget.value) {

                event.currentTarget.checked = false;
                selectedOptionsUpdated = selectedOptions.filter((option_id) => option_id != event.currentTarget.value)

            }
        });

        setSelectedOptions(selectedOptionsUpdated);

    }

    const handleSearch = (event) => {
        console.log(event.currentTarget.value)
    }

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen}>
                {"SELECIONAR PLANOS DE VOO"}
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth={'xl'}>
                <DialogTitle>{"SELEÇÃO DE PLANOS DE VOO"}</DialogTitle>
                <Divider />

                <DialogContent>
                    <TextField
                        fullWidth
                        placeholder={"Pesquisar plano por ID e nome"}
                        variant="outlined"
                        id="search_input"
                        size="small"
                        sx={{ bottom: "8px" }}
                        InputProps={{
                            startAdornment:
                                <InputAdornment position="start">
                                    <IconButton onClick={handleSearch}>
                                        <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" />
                                    </IconButton>
                                </InputAdornment>,
                            disableunderline: 1,
                            sx: { fontSize: 'default' },
                        }}
                    />
                    {
                        (loading && options.length == 0) ?
                            <>
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                            </>
                            :
                            <>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell align="center">Nome</TableCell>
                                                <TableCell align="center">Arquivo</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                            {options.map((record, index) =>
                                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell><FormControlLabel value={record.id} control={<Radio onClick={(e) => { handleClickRadio(e) }} />} /></TableCell>
                                                    <TableCell align="center">{record.coordinates.split(".")[0]}</TableCell>
                                                    <TableCell align="center">{record.coordinates}</TableCell>
                                                </TableRow>
                                            )}

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleClose} variant="contained">Confirmar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
});