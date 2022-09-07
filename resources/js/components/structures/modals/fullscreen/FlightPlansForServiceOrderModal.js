import * as React from 'react';
import { Table } from "@mui/material";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';
import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
// Axios
import AxiosApi from '../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
// Auth
//import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';

const StyledHeadTableCell = styled(TableCell)({
    color: '#fff',
    fontWeight: 700
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const FlightPlansForServiceOrderModal = (props) => {

    const [open, setOpen] = React.useState(false);

    const [records, setRecords] = React.useState([]);
    const [pagination, setPagination] = React.useState({ total_records: 0, records_per_page: 0, total_pages: 0 });
    const [paginationConfig, setPaginationConfig] = React.useState({ page: 1, limit: 10, order_by: "id", search: 0, total_records: 0, filter: 0 });
    const [loading, setLoading] = React.useState(true);
    const [selectedRecords, setSelectedRecords] = React.useState([]);
    const [searchField, setSearchField] = React.useState("");

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        serverLoadRecords();
    }, [paginationConfig]);

    const serverLoadRecords = () => {

        const limit = paginationConfig.limit;
        const search = paginationConfig.search;
        const page = paginationConfig.page;
        const order_by = paginationConfig.order_by;
        const filter = paginationConfig.filter;

        AxiosApi.get(`/api/plans-module?limit=${limit}&search=${search}&page=${page}&order_by=${order_by}&filter=${filter}`)
            .then(function (response) {

                setLoading(false);
                setRecords(response.data.records);
                setPagination({ total_records: response.data.total_records, records_per_page: response.data.records_per_page, total_pages: response.data.total_pages });

                if (response.data.total_records > 1) {
                    handleOpenSnackbar(`Foram encontrados ${response.data.total_records} planos de voo`, "success");
                } else {
                    handleOpenSnackbar(`Foi encontrado ${response.data.total_records} plano de voo`, "success");
                }

            })
            .catch(function (error) {

                const error_message = error.response.data.message ? error.response.data.message : "Erro do servidor";
                handleOpenSnackbar(error_message, "error");

                setLoading(false);
                setRecords([]);
                setPagination({ total_records: 0, records_per_page: 0, total_pages: 0 });

            });
    }

    const handleTablePageChange = (event, value) => {

        setPaginationConfig({
            page: value + 1,
            limit: paginationConfig.limit,
            order_by: "id",
            search: paginationConfig.search,
            total_records: 0,
            filter: 0
        });

    };

    const handleChangeRowsPerPage = (event) => {

        setPaginationConfig({
            page: 1,
            limit: event.target.value,
            order_by: "id",
            search: paginationConfig.search,
            total_records: 0,
            filter: 0
        });

    };

    function handleSearchSubmit(event) {
        event.preventDefault();

        setPaginationConfig({
            page: 1,
            limit: paginationConfig.limit,
            order_by: "id",
            search: searchField,
            total_records: 0,
            filter: 0
        });

    }

    const reloadTable = () => {

        setSelectedRecords([]);

        setLoading(true);
        setRecords([]);
        setPagination({
            total_records: 0,
            records_per_page: 0,
            total_pages: 0
        });

        setPaginationConfig({
            page: 1,
            limit: paginationConfig.limit,
            order_by: "id",
            search: 0,
            total_records: 0,
            filter: 0
        });

    }

    const handleClickRecord = (event) => {

        const record_id = parseInt(event.currentTarget.value);

        let selectedRecordsClone = [...selectedRecords];

        // Find if the clicked record ID is one of the already selected
        // Returns the index if exists, and -1 if not
        const indexOf = selectedRecords.indexOf(record_id);

        if (indexOf == -1) {
            // If not exists, push it
            selectedRecordsClone.push(record_id);
        } else {
            // If exists, remove it
            selectedRecordsClone.splice(indexOf);
        }

        setSelectedRecords(selectedRecordsClone);
        props.setFlightPlansSelected(selectedRecordsClone);

    }

    const handleOpenSnackbar = (text, variant) => {
        enqueueSnackbar(text, { variant });
    }

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);

        if (selectedRecords.length == 0) {
            setSelectedRecords([]);
            props.setFlightPlansSelected([]);
        }

    }

    const handleCommit = () => {
        setOpen(false);
    }

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                {selectedRecords.length == 0 ? "SELECIONAR PLANOS DE VOO" : "PLANOS DE VOO SELECIONADOS: " + selectedRecords.length}
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative', bgcolor: '#fff' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="primary"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1, color: '#1976D2' }} variant="h7" component="div">
                            {""}
                        </Typography>
                        <Button autoFocus color="primary" onClick={handleCommit}>
                            CONFIRMAR
                        </Button>
                    </Toolbar>
                </AppBar>

                <DialogContent>

                    <Grid container columns={12} spacing={1} alignItems="center">

                        <Grid item>
                            <Tooltip title="Carregar">
                                <IconButton onClick={reloadTable}>
                                    <FontAwesomeIcon icon={faArrowsRotate} size="sm" id="reload_icon" color='#007937' />
                                </IconButton>
                            </Tooltip>
                        </Grid>

                        <Grid item xs>
                            <TextField
                                fullWidth
                                placeholder={"Pesquisar plano por ID"}
                                onChange={(e) => setSearchField(e.currentTarget.value)}
                                InputProps={{
                                    startAdornment:
                                        <InputAdornment position="start">
                                            <IconButton onClick={handleSearchSubmit}>
                                                <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" />
                                            </IconButton>
                                        </InputAdornment>,
                                    disableunderline: 1,
                                    sx: { fontSize: 'default' },
                                }}
                                variant="outlined"
                                id="search_input"
                            />
                        </Grid>

                        {(!loading && records.length > 0) &&
                            <Grid item>
                                <Stack spacing={2}>
                                    <TablePagination
                                        labelRowsPerPage="Linhas por página: "
                                        component="div"
                                        count={pagination.total_records}
                                        page={paginationConfig.page - 1}
                                        onPageChange={handleTablePageChange}
                                        rowsPerPage={paginationConfig.limit}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Stack>
                            </Grid>
                        }
                    </Grid>

                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table sx={{ minWidth: 650 }} size="small">
                            <TableHead>
                                <TableRow>
                                    <StyledHeadTableCell>ID</StyledHeadTableCell>
                                    <StyledHeadTableCell align="center">Arquivo</StyledHeadTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(!loading && records.length > 0) &&
                                    records.map((row, index) => (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell><FormControlLabel label={row.id} control={<Checkbox value={row.id} onChange={(e) => { handleClickRecord(e) }} checked={selectedRecords.includes(row.id)} />} /></TableCell>
                                            <TableCell align="center">{row.coordinates_file}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </DialogContent>

            </Dialog>
        </div>
    );
}