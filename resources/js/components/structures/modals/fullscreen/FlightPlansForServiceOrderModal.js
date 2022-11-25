import * as React from 'react';
// Material UI
import { Link, Tooltip, IconButton, Grid, TextField, InputAdornment, Box, Dialog, DialogContent, Button, AppBar, Toolbar, Typography, Slide } from "@mui/material";
import { DataGrid, ptBR } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
// Axios
import AxiosApi from '../../../../services/AxiosApi';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'name',
        headerName: 'Nome',
        flex: 1,
        sortable: true,
        editable: false
    },
    {
        field: 'creator',
        headerName: 'Criador',
        sortable: true,
        editable: false,
        flex: 1,
        valueGetter: (data) => {
            return data.row.creator.name;
        },
    },
    {
        field: 'created_at',
        headerName: 'Criado em',
        type: 'number',
        headerAlign: 'left',
        sortable: true,
        editable: false,
        width: 150
    },
    {
        field: 'visualization',
        headerName: 'Visualizar',
        width: 150,
        sortable: false,
        editable: false,
        renderCell: (data) => {
            return (
                <Link href={`/internal/map?file=${data.row.file}`} target="_blank">
                    <IconButton>
                        <FontAwesomeIcon icon={faEye} color={"#00713A"} size="sm" />
                    </IconButton>
                </Link>
            )
        }
    },
    {
        field: 'service_orders',
        headerName: 'Ordens de serviço',
        width: 150,
        sortable: true,
        editable: false,
        renderCell: (data) => {
            return 0;
        }
    },
    {
        field: 'incidents',
        headerName: 'Incidentes',
        sortable: true,
        editable: false,
        width: 150,
        renderCell: (data) => {
            return 0;
        }
    },
]

export const FlightPlansForServiceOrderModal = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const [records, setRecords] = React.useState([]);
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [search, setSearch] = React.useState("0");
    const [selectedRecords, setSelectedRecords] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [reload, setReload] = React.useState(false);
    const [open, setOpen] = React.useState();

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {
        setLoading(true);
        setRecords([]);
        setSelectedRecords([]);
        fetchRecords();
    }, [reload]);

    function fetchRecords() {


        let http_request = "api/load-flight-plans-service-order?";
        if (props.serviceOrderId != null) {
            http_request += `service_order=${props.serviceOrderId}&`;
        }
        http_request += `limit=${perPage}&search=${search}&page=${currentPage}`;

        AxiosApi.get(http_request)
            .then(function (response) {
                setRecords(response.data.records);
                setTotalRecords(response.data.total_records);
            })
            .catch(function (error) {
                console.log(error)
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

    const handleSelection = (record) => {

        // Percorrer os selecionados
        // Verificar o que é igual ao clicad e retirar
        // Se nenhum for, adicionar

        console.log(record)

        /*
        let selected_flight_plans_clone = [...selectedRecords];

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

        setSelectedRecords(selected_flight_plans_clone);
        props.setFlightPlans(selected_flight_plans_clone);
        */

    }

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedRecords([]);
        props.setFlightPlans([]);
    }

    const handleCommit = () => {
        setOpen(false);
    }

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                {"Planos de voo disponíveis: " + (records.length - selectedRecords.length)}
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative', bgcolor: '#fff' }}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <IconButton
                            edge="start"
                            color="primary"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Button autoFocus color="primary" onClick={handleCommit} variant="contained">
                            Salvar
                        </Button>
                    </Toolbar>
                </AppBar>

                <DialogContent>

                    <Grid container columns={12} spacing={1} alignItems="center">

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
                                placeholder={"Pesquisar plano por id e nome"}
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
                        sx={{ height: 500, width: '100%', mt: 1 }}
                    >
                        <DataGrid
                            rows={records}
                            columns={columns}
                            pageSize={perPage}
                            loading={loading}
                            page={currentPage - 1}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            checkboxSelection
                            disableSelectionOnClick
                            paginationMode='server'
                            experimentalFeatures={{ newEditingApi: true }}
                            onPageSizeChange={(newPageSize) => handleChangeRowsPerPage(newPageSize)}
                            onSelectionModelChange={handleSelection}
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
        </div>
    );
});
