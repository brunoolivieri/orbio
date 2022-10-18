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
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import ReportIcon from '@mui/icons-material/Report';
import { Link } from "@mui/material";
// Axios
import AxiosApi from '../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
// Auth
//import { useAuthentication } from '../../../context/InternalRoutesAuth/AuthenticationContext';
import moment from 'moment';

const StyledHeadTableCell = styled(TableCell)({
    color: '#fff',
    fontWeight: 700
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const FlightPlansForServiceOrderModal = React.memo((props) => {

    const [open, setOpen] = React.useState(false);
    const [records, setRecords] = React.useState([]);
    const [pagination, setPagination] = React.useState({ total_records: 0, records_per_page: 0, total_pages: 0 });
    const [paginationConfig, setPaginationConfig] = React.useState({ page: 1, limit: 10, order_by: "id", search: 0, total_records: 0, filter: 0 });
    const [loading, setLoading] = React.useState(true);
    const [selectedFlightPlans, setSelectedFlightPlans] = React.useState(props.flightPlans);
    const [searchField, setSearchField] = React.useState("");

    React.useEffect(() => {
        serverLoadRecords();
    }, [paginationConfig]);

    const serverLoadRecords = () => {

        const limit = paginationConfig.limit;
        const search = paginationConfig.search;
        const page = paginationConfig.page;
        const order_by = paginationConfig.order_by;
        const filter = paginationConfig.filter;

        let http_request = "api/load-flight-plans-service-order?";
        if (props.serviceOrderId != null) {
            http_request += `service_order=${props.serviceOrderId}&`;
        }
        http_request += `limit=${limit}&search=${search}&page=${page}&order_by=${order_by}&filter=${filter}`;

        AxiosApi.get(http_request)
            .then(function (response) {

                setLoading(false);

                if (response.data.total_records > 0) {
                    setRecords(response.data.records);
                    setPagination({ total_records: response.data.total_records, records_per_page: response.data.records_per_page, total_pages: response.data.total_pages });
                }

            })
            .catch(function (error) {

                console.log(error)

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

    const handleSearchSubmit = (event) => {
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

        setSelectedFlightPlans([]);

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

    const handleClickRecord = (flight_plan) => {

        // Percorrer os selecionados
        // Verificar o que é igual ao clicado  e retirar
        // Se nenhum for, adicionar

        let selected_flight_plans_clone = [...selectedFlightPlans];

        // Filtered array wouldnt have the item with id equal to the selected
        let filtered_selections = selected_flight_plans_clone.filter((item) => item.id != flight_plan.id);

        // If no items were removed
        if (filtered_selections.length === selected_flight_plans_clone.length) {

            // So the item is not selected and needs to be saved
            selected_flight_plans_clone.push({ id: flight_plan.id, name: flight_plan.name, drone_id: "0", battery_id: "0", equipment_id: "0" });

        } else {

            // So the item already exists and needs to be unsaved
            const index_to_remove = selected_flight_plans_clone.filter((item, index) => { if (item.id === flight_plan.id) return index; });
            selected_flight_plans_clone.splice(index_to_remove, 1);

        }

        setSelectedFlightPlans(selected_flight_plans_clone);
        props.setFlightPlans(selected_flight_plans_clone);

    }

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedFlightPlans([]);
        props.setFlightPlans([]);
    }

    const handleCommit = () => {
        setOpen(false);
    }

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                {"Planos de voo disponíveis: " + (records.length - selectedFlightPlans.length)}
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
                        <Button autoFocus color="primary" onClick={handleCommit} variant="contained">
                            Salvar
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
                                placeholder={"Pesquisar plano por id e nome"}
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
                                    <StyledHeadTableCell align="center">Criador</StyledHeadTableCell>
                                    <StyledHeadTableCell align="center">Criação</StyledHeadTableCell>
                                    <StyledHeadTableCell align="center">Nome</StyledHeadTableCell>
                                    <StyledHeadTableCell align="center">Arquivo</StyledHeadTableCell>
                                    <StyledHeadTableCell align="center">Ver</StyledHeadTableCell>
                                    <StyledHeadTableCell align="center">Incidente</StyledHeadTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(!loading && records.length > 0) &&
                                    records.map((flight_plan, index) => (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell><FormControlLabel label={flight_plan.id} control={<Checkbox value={flight_plan.id} onChange={() => { handleClickRecord(flight_plan) }} checked={selectedFlightPlans.find((item) => item.id === flight_plan.id)} />} /></TableCell>
                                            <TableCell align="center">{flight_plan.creator.name}</TableCell>
                                            <TableCell align="center">{moment(flight_plan.created_at).format("DD/MM/YYYY")}</TableCell>
                                            <TableCell align="center">{flight_plan.name}</TableCell>
                                            <TableCell align="center">{flight_plan.file}</TableCell>
                                            <TableCell align="center">
                                                <Link href={`/internal/map?file=${flight_plan.file}`} target="_blank">
                                                    <Tooltip title="Ver plano">
                                                        <IconButton>
                                                            <FontAwesomeIcon icon={faEye} color="#00713A" size="sm" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Link>
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: flight_plan.incident === 1 ? '#00713A' : '#808991' }}>{<ReportIcon />}</TableCell>
                                        </TableRow>
                                    ))
                                }

                                {(!loading && records.length == 0) &&
                                    <p>Nenhum plano de voo encontrado.</p>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>

                </DialogContent>

            </Dialog>
        </div>
    );
});
