// React
import * as React from 'react';
// MaterialUI
import { Tooltip, IconButton, Grid, TextField, InputAdornment, Box, Chip } from "@mui/material";
import { DataGrid, ptBR } from '@mui/x-data-grid';
import ErrorIcon from '@mui/icons-material/Error';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
// Custom
import axios from '../../../../services/AxiosApi';
// Libs
import { useSnackbar } from 'notistack';

const columns = [
    {
        field: 'id',
        headerName: 'ID',
        width: 90
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 100,
        sortable: true,
        editable: false,
        renderCell: (data) => {
            const status = data.row.status;
            return <Chip label={status ? "Ativo" : "Inativo"} color={status ? "success" : "error"} variant="outlined" />
        }
    },
    {
        field: 'number',
        headerName: 'Número',
        flex: 1,
        sortable: true,
        editable: false,
    },
    {
        field: 'creator',
        headerName: 'Criador',
        type: 'number',
        width: 150,
        headerAlign: 'left',
        sortable: true,
        editable: false,
        renderCell: (data) => {
            const status = data.row.users.creator.status;
            return <Chip label={data.row.users.creator.name} color={status ? "success" : "error"} variant="outlined" />
        }
    },
    {
        field: 'pilot',
        headerName: 'Piloto',
        sortable: true,
        editable: false,
        flex: 1,
        renderCell: (data) => {
            const status = data.row.users.pilot.status;
            return <Chip label={data.row.users.pilot.name} color={status ? "success" : "error"} variant="outlined" />
        }
    },
    {
        field: 'client',
        headerName: 'Cliente',
        sortable: true,
        editable: false,
        flex: 1,
        renderCell: (data) => {
            const status = data.row.users.client.status;
            return <Chip label={data.row.users.client.name} color={status ? "success" : "error"} variant="outlined" />
        }
    },
    {
        field: 'observation',
        headerName: 'Descrição',
        sortable: true,
        editable: false,
        width: 150
    },
    {
        field: 'flight_plans',
        headerName: 'Planos de voo',
        sortable: true,
        editable: false,
        width: 150,
        valueGetter: (data) => {
            return data.row.flight_plans.length;
        }
    },
    {
        field: 'total_logs',
        headerName: 'Logs',
        sortable: true,
        editable: false,
        width: 150
    }
];

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
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const ServiceOrderForReport = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const [records, setRecords] = React.useState([]);
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [search, setSearch] = React.useState("0");
    const [selectedRecordID, setSelectedRecordID] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [reload, setReload] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const { enqueueSnackbar } = useSnackbar();

    // ============================================================================== FUNCTIONS ============================================================================== //

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedRecordID([]);
        props.setServiceOrder(null);
    }

    const handleSave = () => {
        setOpen(false);
    }

    React.useEffect(() => {
        setLoading(true);
        setRecords([]);
        setSelectedRecordID([]);
        fetchRecords();
    }, [reload]);

    function fetchRecords() {

        axios.get(`api/load-service-orders-for-report?limit=${perPage}&search=${search}&page=${currentPage}`)
            .then(function (response) {

                setRecords(response.data.records);
                setTotalRecords(response.data.total_records);

                if (response.data.total_records > 1) {
                    handleOpenSnackbar(`Foram encontrados ${response.data.total_records} ordem de serviço`, "success");
                } else {
                    handleOpenSnackbar(`Foi encontrado ${response.data.total_records} ordens de serviço`, "success");
                }

            })
            .catch(function (error) {
                handleOpenSnackbar(error.response.data.message, "error");
            })
            .finally(() => {
                setLoading(false);
            })
    }

    function handleChangePage(newPage) {
        // If actual page is bigger than the new one, is a reduction of actual
        // If actual is smaller, the page is increasing
        setCurrentPage((current) => {
            return current > newPage ? (current - 1) : newPage;
        });
        setReload((old) => !old);
    }

    function handleChangeRowsPerPage(newValue) {
        setPerPage(newValue);
        setCurrentPage(1);
        setReload((old) => !old);
    }

    function handleOpenSnackbar(text, variant) {
        enqueueSnackbar(text, { variant });
    }

    function handleSelection(newSelection) {

        let new_selection_id = [];

        // In reality, the === 1 case is correct by default
        // But, in two cases the props updates are necessary, so this was made just for respect the DRY principle
        if (newSelection.length == 1 || newSelection.length > 1) {

            const new_selection_id = newSelection[newSelection.length - 1];

            // Get correspondent entire record by ID
            const new_service_order_record = records.filter((record) => {
                if (new_selection_id == record.id) {
                    return record;
                }
            })

            // ==== PROPS UPDATES ==== //

            // Get state and city based in one of the flight plans
            const service_order_state = new_service_order_record[0].flight_plans[0].localization.state;
            const service_order_city = new_service_order_record[0].flight_plans[0].localization.city;

            // Pass new service order record to parent 
            props.setServiceOrder(new_service_order_record[0]);
            props.setControlledInput({
                name: '',
                client: new_service_order_record[0].users.client.name,
                state: service_order_state,
                city: service_order_city,
                farm: '',
                responsible: new_service_order_record[0].users.pilot.name
            });

            // Get necessary data from each flight plan to use in report
            let flight_plans_for_report = [];
            flight_plans_for_report = new_service_order_record[0].flight_plans.map(flight_plan => {
                return {
                    id: flight_plan.id,
                    name: flight_plan.name,
                    city: flight_plan.localization.city,
                    state: flight_plan.localization.state,
                    date: flight_plan.logs[0].timestamp, // need to be date from main log
                    area: '',
                    number: '',
                    dosage: '',
                    responsible: new_service_order_record[0].users.pilot.name,
                    provider: '',
                    temperature: '',
                    humidity: '',
                    wind: '',
                    completed: false
                }
            });
            props.setFlightPlans(flight_plans_for_report);

            // Can be [] or [X] being X the last value selected
            setSelectedRecordID([new_selection_id]);

        } else if (newSelection.length === 0) {

            props.setServiceOrder(null);
            props.setControlledInput(resetParentControlledInput);
            props.setFlightPlansData(null);

            // Can be [] or [X] being X the last value selected
            setSelectedRecordID([new_selection_id]);

        }

    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Button variant="contained" onClick={handleOpen} color={selectedRecordID.length > 0 ? "success" : "primary"}>
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
                        <Button autoFocus color="primary" onClick={handleSave} variant="contained">
                            Salvar
                        </Button>
                    </Toolbar>
                </AppBar>

                <DialogContent>

                    <Grid container spacing={1} alignItems="center" mb={1}>

                        <Grid item>
                            <Tooltip title="Carregar">
                                <IconButton onClick={() => setReload((old) => !old)}>
                                    <FontAwesomeIcon icon={faArrowsRotate} size="sm" id="reload_icon" color='#007937' />
                                </IconButton>
                            </Tooltip>
                        </Grid>

                        <Grid item xs>
                            <TextField
                                fullWidth
                                placeholder={"Pesquisar um ordem por ID"}
                                onChange={(e) => setSearch(e.currentTarget.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") setReload((old) => !old) }}
                                InputProps={{
                                    startAdornment:
                                        <InputAdornment position="start">
                                            <IconButton onClick={() => setReload((old) => !old)}>
                                                <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" />
                                            </IconButton>
                                        </InputAdornment>,
                                    disableunderline: 1,
                                    sx: { fontSize: 'default' }
                                }}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>

                    <Box
                        sx={{ height: 500, width: '100%' }}
                    >
                        <DataGrid
                            rows={records}
                            columns={columns}
                            pageSize={perPage}
                            loading={loading}
                            page={currentPage - 1}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            rowHeight={70}
                            checkboxSelection
                            disableSelectionOnClick
                            paginationMode='server'
                            experimentalFeatures={{ newEditingApi: true }}
                            isRowSelectable={(data) => data.row.available}
                            onPageSizeChange={(newPageSize) => handleChangeRowsPerPage(newPageSize)}
                            onSelectionModelChange={handleSelection}
                            selectionModel={selectedRecordID}
                            disableMultipleSelection={true}
                            onPageChange={(newPage) => handleChangePage(newPage + 1)}
                            rowCount={totalRecords}
                            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}

                            sx={{
                                "&.MuiDataGrid-root .MuiDataGrid-cell, .MuiDataGrid-columnHeader:focus-within": {
                                    outline: "none !important",
                                },
                                '& .super-app-theme--header': {
                                    color: '#222'
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
});