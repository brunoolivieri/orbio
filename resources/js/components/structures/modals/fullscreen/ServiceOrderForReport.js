// React
import * as React from 'react';
// MaterialUI
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
import Chip from '@mui/material/Chip';
import { InputAdornment } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Badge from '@mui/material/Badge';
import TablePagination from '@mui/material/TablePagination';
import ErrorIcon from '@mui/icons-material/Error';
import MapIcon from '@mui/icons-material/Map';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
// Custom
import AxiosApi from '../../../../services/AxiosApi';
// Libs
import moment from 'moment';
import { useSnackbar } from 'notistack';

const resetParentControlledInput = {
    name: '',
    client: '0',
    state: '',
    city: '',
    farm: '',
    area: '',
    date: '',
    number: '',
    dosage: '',
    provider: '',
    responsible: '0',
    temperature: '',
    humidity: '',
    wind: ''
};

const StyledHeadTableCell = styled(TableCell)({
    color: '#fff',
    fontWeight: 700
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const ServiceOrderForReport = React.memo((props) => {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [records, setRecords] = React.useState([]);
    const [pagination, setPagination] = React.useState({ total_records: 0, records_per_page: 0, total_pages: 0 });
    const [paginationConfig, setPaginationConfig] = React.useState({ page: 1, limit: 10, order_by: "id", search: 0, total_records: 0, filter: 0 });
    const [selectedRecordID, setSelectedRecordID] = React.useState(null);
    const [searchField, setSearchField] = React.useState("");

    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    React.useEffect(() => {
        serverLoadRecords();
    }, [paginationConfig]);

    function serverLoadRecords() {

        const limit = paginationConfig.limit;
        const search = paginationConfig.search;
        const page = paginationConfig.page;
        const order_by = paginationConfig.order_by;
        const filter = paginationConfig.filter;

        AxiosApi.get(`/api/orders-module?limit=${limit}&search=${search}&page=${page}&order_by=${order_by}&filter=${filter}`)
            .then(function (response) {

                setLoading(false);
                setRecords(response.data.records);
                setPagination({ total_records: response.data.total_records, records_per_page: response.data.records_per_page, total_pages: response.data.total_pages });

                if (response.data.total_records > 1) {
                    handleOpenSnackbar(`Foram encontrados ${response.data.total_records} ordem de serviço`, "success");
                } else {
                    handleOpenSnackbar(`Foi encontrado ${response.data.total_records} ordens de serviço`, "success");
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

        setSelectedRecordID(null);

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

    const handleClickRadio = (service_order) => {

        const service_order_id = service_order.id;

        if (service_order_id === selectedRecordID) {

            setSelectedRecordID(null);
            props.setServiceOrder(null);
            props.setControlledInput(resetParentControlledInput);

        } else if (service_order_id != selectedRecordID) {

            setSelectedRecordID(service_order_id);
            props.setServiceOrder(service_order);
            props.setControlledInput({
                name: '',
                client: service_order.users.client.name,
                state: service_order.flight_plans[0].localization.state,
                city: service_order.flight_plans[0].localization.city,
                farm: '',
                area: '',
                date: moment(),
                number: '',
                dosage: '',
                provider: '',
                responsible: service_order.users.pilot.name,
                temperature: '',
                humidity: '',
                wind: ''
            });
        }

    }

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedRecordID(null);
        props.setServiceOrder(null);
    }

    const handleCommit = () => {
        setOpen(false);
    }

    const handleOpenSnackbar = (text, variant) => {
        enqueueSnackbar(text, { variant });
    }

    // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - MATERIAL UI ============================================================================== //

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen} color={selectedRecordID ? "success" : "primary"}>
                {selectedRecordID ? "Ordem de serviço selecionada" : "Selecionar ordem de serviço"}
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

                    <Grid container spacing={1} alignItems="center" mb={1}>

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
                                placeholder={"Pesquisar ordem por ID"}
                                onChange={(e) => setSearchField(e.currentTarget.value)}
                                InputProps={{
                                    startAdornment:
                                        <InputAdornment position="start">
                                            <IconButton onClick={handleSearchSubmit}>
                                                <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" />
                                            </IconButton>
                                        </InputAdornment>,
                                    sx: { fontSize: 'default' }
                                }}
                                variant="outlined"
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

                    <FormControl fullWidth>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={selectedRecordID}
                        >
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 500 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledHeadTableCell>ID</StyledHeadTableCell>
                                            <StyledHeadTableCell align="center">Status</StyledHeadTableCell>
                                            <StyledHeadTableCell align="center">Planos de Voo</StyledHeadTableCell>
                                            <StyledHeadTableCell align="center">Número</StyledHeadTableCell>
                                            <StyledHeadTableCell align="center">Criador</StyledHeadTableCell>
                                            <StyledHeadTableCell align="center">Piloto</StyledHeadTableCell>
                                            <StyledHeadTableCell align="center">Cliente</StyledHeadTableCell>
                                            <StyledHeadTableCell align="center">Descrição</StyledHeadTableCell>
                                            <StyledHeadTableCell align="center">Duração (dias)</StyledHeadTableCell>
                                            <StyledHeadTableCell align="center">Incidentes</StyledHeadTableCell>
                                            <StyledHeadTableCell align="center">Relatório</StyledHeadTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="tbody">
                                        {(!loading && records.length > 0) &&
                                            records.map((service_order) => (
                                                <TableRow key={service_order.id}>
                                                    <TableCell><FormControlLabel value={service_order.id} control={<Radio onClick={() => { handleClickRadio(service_order) }} />} label={service_order.id} /></TableCell>
                                                    <TableCell align="center">{service_order.status == 1 ? <Chip label={"Ativo"} color={"success"} variant="outlined" /> : <Chip label={"Inativo"} color={"error"} variant="outlined" />}</TableCell>
                                                    <TableCell align="center">
                                                        {service_order.flight_plans.length === 0 ?
                                                            <MapIcon color="disabled" />
                                                            :
                                                            <Badge badgeContent={service_order.flight_plans.length} color="success">
                                                                <MapIcon color="action" />
                                                            </Badge>
                                                        }
                                                    </TableCell>
                                                    <TableCell align="center">{service_order.number}</TableCell>
                                                    <TableCell align="center">
                                                        {service_order.users.creator.deleted === 1 ? <Chip label={"Desabilitado"} color={"error"} variant="outlined" /> : <Chip label={service_order.users.creator.name} color={"success"} variant="outlined" />}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {service_order.users.pilot.deleted === 1 ? <Chip label={"Desabilitado"} color={"error"} variant="outlined" /> : <Chip label={service_order.users.pilot.name} color={"success"} variant="outlined" />}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {service_order.users.client.deleted === 1 ? <Chip label={"Desabilitado"} color={"error"} variant="outlined" /> : <Chip label={service_order.users.client.name} color={"success"} variant="outlined" />}
                                                    </TableCell>
                                                    <TableCell align="center">{service_order.observation}</TableCell>
                                                    <TableCell align="center">{moment(service_order.end_date).diff(moment(service_order.start_date), 'days')}</TableCell>
                                                    <TableCell align="center">
                                                        {service_order.incidents === 0 ?
                                                            <ErrorIcon color="disabled" />
                                                            :
                                                            <Badge badgeContent={service_order.incidents} color="success">
                                                                <ErrorIcon color="action" />
                                                            </Badge>
                                                        }
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {service_order.report != null ?
                                                            <Tooltip title="Ver relatório">
                                                                <IconButton>
                                                                    <FontAwesomeIcon icon={faFilePdf} color={service_order.report ? "#00713A" : "#E0E0E0"} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            :
                                                            <IconButton disabled>
                                                                <FontAwesomeIcon icon={faFilePdf} color="#E0E0E0" />
                                                            </IconButton>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </RadioGroup>
                    </FormControl>
                    {loading && <LinearProgress color="success" />}
                </DialogContent>
            </Dialog>
        </>
    );
});