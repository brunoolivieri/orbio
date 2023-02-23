import * as React from 'react';
// Material UI
import { Tooltip, IconButton, Grid, TextField, InputAdornment, Box, Dialog, DialogContent, Button, AppBar, Toolbar, Slide } from "@mui/material";
import { DataGrid, ptBR } from '@mui/x-data-grid';
import ReportIcon from '@mui/icons-material/Report';
import CloseIcon from '@mui/icons-material/Close';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
// Axios
import axios from '../../../../../services/AxiosApi';
// Moment
import moment from 'moment';
// Custom
import { CreateIncident } from "../formulary/incident/CreateIncident";
import { UpdateIncident } from '../formulary/incident/UpdateIncident';
import { DeleteIncident } from '../formulary/incident/DeleteIncident';
import { TableToolbar } from '../../../../shared/table_toolbar/TableToolbar';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'type',
        headerName: 'Tipo',
        minWidth: 150,
        sortable: true,
        editable: false,
    },
    {
        field: 'description',
        headerName: 'Descrição',
        flex: 1,
        minWidth: 200,
        sortable: true,
        editable: false,
    },
    {
        field: 'date',
        headerName: 'Data',
        minWidth: 150,
        headerAlign: 'left',
        sortable: true,
        editable: false,
        valueGetter: (data) => {
            return moment(data.row.date).format("DD/MM/YYYY")
        }
    }
];

export const IncidentsForServiceOrderFlightPlan = React.memo((props) => {

    const [records, setRecords] = React.useState([]);
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [search, setSearch] = React.useState("0");
    const [selectedRecords, setSelectedRecords] = React.useState([]);
    const [selectionModel, setSelectionModel] = React.useState([]); // For grid controll
    const [loading, setLoading] = React.useState(true);
    const [reload, setReload] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {

        let is_mounted = true;
        if (!is_mounted) return '';

        setLoading(true);
        setRecords([]);
        setSelectedRecords([]);
        fetchRecords();

        return () => {
            is_mounted = false;
        }

    }, [reload]);

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function fetchRecords() {

        axios.get(`api/action/service-order/incidents?service_order_id=${props.serviceOrderId}&flight_plan_id=${props.current.id}&limit=${perPage}&search=${search}&page=${currentPage}`)
            .then(function (response) {
                setRecords(response.data.records);
                setTotalRecords(response.data.total_records);
            })
            .catch(function (error) {
                console.log(error)
                setRecords([]);
            })
            .finally(() => {
                setLoading(false);
            });

    }

    function handleChangePage(newPage) {
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

    function handleSelection(newSelectedIds) {
        setSelectionModel(newSelectedIds);
        const newSelectedRecords = records.filter((record) => {
            if (newSelectedIds.includes(record.id)) {
                return record;
            }
        });
        setSelectedRecords(newSelectedRecords);
    }

    return (
        <>
            <Tooltip title="Incidentes">
                <IconButton onClick={handleOpen}>
                    <ReportIcon />
                </IconButton>
            </Tooltip>
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
                        <Button autoFocus color="primary" onClick={handleClose} variant="contained">
                            Salvar
                        </Button>
                    </Toolbar>
                </AppBar>

                <DialogContent>
                    <Grid container columns={12} spacing={1} alignItems="center">

                        <Grid item>
                            {selectedRecords.length > 0 &&
                                <IconButton>
                                    <FontAwesomeIcon icon={faPlus} color={"#E0E0E0"} size="sm" />
                                </IconButton>
                            }

                            {selectedRecords.length === 0 &&
                                <CreateIncident reloadTable={setReload} serviceOrderId={props.serviceOrderId} flightPlanId={props.current.id} />
                            }
                        </Grid>

                        <Grid item>
                            {(selectedRecords.length === 0 || selectedRecords.length > 1) &&
                                <Tooltip title="Selecione um registro">
                                    <IconButton>
                                        <FontAwesomeIcon icon={faPen} color={"#E0E0E0"} size="sm" />
                                    </IconButton>
                                </Tooltip>
                            }

                            {(!loading && selectedRecords.length === 1) &&
                                <UpdateIncident record={selectedRecords[0]} reloadTable={setReload} />
                            }
                        </Grid>

                        <Grid item>
                            {(selectedRecords.length === 0) &&
                                <Tooltip title="Selecione um registro">
                                    <IconButton>
                                        <FontAwesomeIcon icon={faTrashCan} color={"#E0E0E0"} size="sm" />
                                    </IconButton>
                                </Tooltip>
                            }

                            {(!loading && selectedRecords.length > 0) &&
                                <DeleteIncident records={selectedRecords} reloadTable={setReload} />
                            }
                        </Grid>

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
                                placeholder={"Pesquisar log por nome ou id"}
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
                            selectionModel={selectionModel}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            rowHeight={70}
                            checkboxSelection
                            disableSelectionOnClick
                            paginationMode='server'
                            experimentalFeatures={{ newEditingApi: true }}
                            onPageSizeChange={(newPageSize) => handleChangeRowsPerPage(newPageSize)}
                            onSelectionModelChange={handleSelection}
                            onPageChange={(newPage) => handleChangePage(newPage + 1)}
                            rowCount={totalRecords}
                            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                            components={{
                                Toolbar: TableToolbar,
                            }}
                            sx={{
                                "&.MuiDataGrid-root .MuiDataGrid-cell, .MuiDataGrid-columnHeader:focus-within": {
                                    outline: "none !important",
                                },
                                '& .super-app-theme--header': {
                                    color: '#222'
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
                                }
                            }}
                        />
                    </Box>

                </DialogContent>
            </Dialog>
        </>
    )
});