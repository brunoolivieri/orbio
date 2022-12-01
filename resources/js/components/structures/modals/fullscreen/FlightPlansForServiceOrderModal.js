import * as React from 'react';
// Material UI
import { Link, Tooltip, IconButton, Grid, TextField, InputAdornment, Box, Dialog, DialogContent, Button, AppBar, Toolbar, Slide } from "@mui/material";
import { DataGrid, ptBR } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
// Axios
import axios from '../../../../services/AxiosApi';
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
        valueGetter: (data) => {
            return data.row.total_service_orders
        }
    },
    {
        field: 'incidents',
        headerName: 'Incidentes',
        sortable: true,
        editable: false,
        width: 150,
        valueGetter: (data) => {
            return data.row.total_incidents
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
    const [controlledSelection, setControlledSelection] = React.useState([]); // For grid controll
    const [loading, setLoading] = React.useState(true);
    const [reload, setReload] = React.useState(false);
    const [open, setOpen] = React.useState();

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {
        setLoading(true);
        setRecords([]);
        fetchRecords();
    }, [reload]);

    function fetchRecords() {


        let http_request = "api/load-flight-plans-service-order?";
        if (props.serviceOrderId != null) {
            http_request += `service_order=${props.serviceOrderId}&`;
        }
        http_request += `limit=${perPage}&search=${search}&page=${currentPage}`;

        axios.get(http_request)
            .then(function (response) {

                setRecords(response.data.records);
                setTotalRecords(response.data.total_records);
                // Set default selections if exists
                setControlledSelection(() => {
                    return response.data.records.filter((item) => item.selected).map((item) => item.id)
                });

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

    const handleSelection = (newSelectedIds) => {

        // Save only ids for grid controll
        setControlledSelection(newSelectedIds);

    }

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setControlledSelection([]);
        props.setSelectedFlightPlans([]);
    }

    const handleSave = () => {
        setOpen(false);

        const newSelectedIds = controlledSelection;

        // Find unchanged selections to preserve data - get entire record
        let preserved_selections = [];
        if (props.selectedFlightPlans.length > 0) {
            preserved_selections = props.selectedFlightPlans.filter((props_record) => {
                if (newSelectedIds.includes(props_record.id)) {
                    return props_record;
                }
            });
        }

        // Get entire flight plan data record by ID - just for new selections
        const newSelectedFlightPlans = records.filter((record) => {
            // Record ID must exists in newSelectedIds and not in preserved_selections ids array
            if (newSelectedIds.includes(record.id) && !preserved_selections.map((item) => item.id).includes(record.id)) {
                return record;
            }
        })

        const newSelectedFlightPlansWithEquipments = newSelectedFlightPlans.map((item) => {
            return { ...item, drone_id: "0", battery_id: "0", equipment_id: "0" };
        })


        props.setSelectedFlightPlans([...newSelectedFlightPlansWithEquipments, ...preserved_selections]);
    }

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                {"Planos de voo disponíveis: " + (records.length - props.selectedFlightPlans.length)}
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
                        <Button autoFocus color="primary" onClick={handleSave} variant="contained">
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
                            selectionModel={controlledSelection}
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
