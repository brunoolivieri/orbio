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
    const [panelData, setPanelData] = React.useState({ records: [], total_records: 0, records_per_page: 0, total_pages: 0 });
    const [paginationParams, setPaginationParams] = React.useState({ page: 1, limit: 10, where: 0, total_records: 0 });
    const [selectedRecords, setSelectedRecords] = React.useState(props.defaultSelections);
    const [valueSearched, setValueSearched] = React.useState("");

    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {

        // Essa variável recebe: limit clause, where clause and the page number
        const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

        AxiosApi.get(`/api/plans-module?args=${select_query_params}`)
            .then(function (response) {

                setLoading({ loading: false, error: false });
                setPanelData({
                    records: response.data.records,
                    total_records: response.data.total_records_founded,
                    records_per_page: response.data.records_per_page,
                    total_pages: response.data.total_pages
                });

            })
            .catch(function () {

                setLoading({ loading: false, error: true });
                setPanelData({
                    records: [],
                    total_records: 0,
                    records_per_page: 0,
                    total_pages: 0
                });

            });

    }, [paginationParams]);

    const handleTablePageChange = (event, value) => {

        setPaginationParams({
            page: value + 1,
            limit: paginationParams.limit,
            where: paginationParams.where
        });

    };

    const handleSearch = () => {

        setPaginationParams({
            page: 1,
            limit: paginationParams.limit,
            where: valueSearched
        });

    }

    const handleChangeRowsPerPage = (event) => {

        setPaginationParams({
            page: 1,
            limit: event.target.value,
            where: paginationParams.where
        });

    }

    const reloadTable = () => {

        setLoading({ loading: true, error: false });
        setPanelData({ records: [], total_records: 0, records_per_page: 0, total_pages: 0 });

        setPaginationParams({
            page: 1,
            limit: paginationParams.limit,
            where: 0
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

        let selectecRecordsClone = [...selectedRecords];

        // Find if the clicked record ID is one of the already selected
        // Returns the index if exists, and -1 if not
        const indexOf = selectedRecords.indexOf(record_id);

        if (indexOf == -1) {

            // If not exists, push it
            selectecRecordsClone.push(record_id);

        } else {

            // If exists, remove it
            selectecRecordsClone.splice(indexOf);

        }

        setSelectedRecords(selectecRecordsClone);
        props.setFlightPlansSelected(selectecRecordsClone);

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
                                variant="outlined"
                                onChange={(e) => setValueSearched(e.currentTarget.value)}
                                size="small"
                                InputProps={{
                                    startAdornment:
                                        <InputAdornment position="start">
                                            <IconButton onClick={(e) => { handleSearch(e) }}>
                                                <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" />
                                            </IconButton>
                                        </InputAdornment>,
                                    disableunderline: 1,
                                    sx: { fontSize: 'default' },
                                }}
                            />
                        </Grid>

                        <Grid item>
                            <TablePagination
                                labelRowsPerPage="Linhas por página: "
                                component="div"
                                count={panelData.total_records}
                                page={paginationParams.page - 1}
                                onPageChange={handleTablePageChange}
                                rowsPerPage={paginationParams.limit}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Grid>
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
                                {(loading && panelData.records.length == 0) ?
                                    <>
                                        {"CARREGANDO..."}
                                    </>
                                    :
                                    <>

                                        {panelData.records.map((record, index) =>
                                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell><FormControlLabel label={record.id} control={<Checkbox value={record.id} onChange={(e) => { handleClickRecord(e) }} checked={selectedRecords.includes(record.id)} />} /></TableCell>
                                                <TableCell align="center">{record.coordinates}</TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleClose} variant="contained">Confirmar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
});