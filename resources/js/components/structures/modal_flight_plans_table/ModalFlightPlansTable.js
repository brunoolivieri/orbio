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
import { Divider } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IconButton } from '@mui/material';
import styled from '@emotion/styled';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import TablePagination from '@mui/material/TablePagination';
import Stack from '@mui/material';
import { useSnackbar } from 'notistack';
import LinearProgress from '@mui/material';
// Axios
import AxiosApi from "../../../services/AxiosApi";
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

const StyledHeadTableCell = styled(TableCell)({
    color: '#fff',
    fontWeight: 700
});

export const ModalFlightPlansTable = React.memo((props) => {

    const [loading, setLoading] = React.useState({ loading: true, error: false });
    const [records, setRecords] = React.useState([]);
    const [pagination, setPagination] = React.useState({ total_records: 0, records_per_page: 0, total_pages: 0 });
    const [paginationConfig, setPaginationConfig] = React.useState({ page: 1, limit: 10, order_by: "id", search: 0, total_records: 0, filter: 0 });
    const [selectedRecords, setSelectedRecords] = React.useState(props.defaultSelections);
    const [searchField, setSearchField] = React.useState("");

    const [open, setOpen] = React.useState(false);

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {

        const limit = paginationConfig.limit;
        const search = paginationConfig.search;
        const page = paginationConfig.page;
        const order_by = paginationConfig.order_by;
        const filter = paginationConfig.filter;

        AxiosApi.get(`/api/plans-module?limit=${limit}&search=${search}&page=${page}&order_by=${order_by}&filter=${filter}`)
            .then(function (response) {

                //setLoading(false);
                //setRecords(response.data.records);
                //setPagination({ total_records: response.data.total_records, records_per_page: response.data.records_per_page, total_pages: response.data.total_pages });

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
    }, [[paginationConfig]]);

    const handleTablePageChange = (event, value) => {

        setPaginationConfig({
            page: value + 1,
            limit: paginationConfig.limit,
            order_by: "id",
            search: paginationConfig.search,
            total_records: 0,
            filter: 0
        });

    }

    const handleChangeRowsPerPage = (event) => {

        setPaginationConfig({
            page: 1,
            limit: event.target.value,
            order_by: "id",
            search: paginationConfig.search,
            total_records: 0,
            filter: 0
        });

    }

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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen}>
                {selectedRecords.length == 0 ? "SELECIONAR PLANOS DE VOO" : "PLANOS DE VOO SELECIONADOS: " + selectedRecords.length}
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth={'xl'}>
                <DialogTitle>{"PLANOS DE VOO"}</DialogTitle>
                <Divider />

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

                    <TableContainer component={Paper}>
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
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleClose} variant="contained">Confirmar</Button>
                </DialogActions>
            </Dialog>
            {loading && <LinearProgress color="success" />}
        </>
    );
});