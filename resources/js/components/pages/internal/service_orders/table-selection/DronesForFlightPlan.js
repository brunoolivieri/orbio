import * as React from 'react';
import DroneIcon from "../../../../assets/images/Icons/drone.png";
import { Tooltip, IconButton, Grid, TextField, InputAdornment, Box, Dialog, DialogContent, Button, AppBar, Toolbar, Slide } from "@mui/material";
import { DataGrid, ptBR } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { ModalImage } from '../../../../shared/modals/dialog/ModalImage';
import { TableToolbar } from '../../../../shared/table_toolbar/TableToolbar';
import axios from '../../../../../services/AxiosApi';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'image',
        headerName: 'Image',
        width: 130,
        sortable: false,
        editable: false,
        renderCell: (data) => {
            return (
                <ModalImage image_url={data.row.image_url} />
            )
        }
    },
    {
        field: 'name',
        headerName: 'Nome',
        flex: 1,
        minWidth: 200,
        sortable: true,
        editable: false,
    },
    {
        field: 'manufacturer',
        headerName: 'Fabricante',
        sortable: true,
        editable: false,
        flex: 1,
        minWidth: 200
    },
    {
        field: 'model',
        headerName: 'Modelo',
        sortable: true,
        editable: false,
        flex: 1,
        minWidth: 200
    },
    {
        field: 'record_number',
        headerName: 'Nº registro',
        sortable: true,
        editable: false,
        flex: 1,
        minWidth: 130
    },
    {
        field: 'serial_number',
        headerName: 'Nº serial',
        sortable: true,
        editable: false,
        flex: 1,
        minWidth: 130
    },
    {
        field: 'weight',
        headerName: 'Peso',
        sortable: true,
        editable: false,
        width: 100
    },
    {
        field: 'observation',
        headerName: 'Observação',
        sortable: true,
        editable: false,
        flex: 1,
        minWidth: 200
    },
];

export const DronesForFlightPlan = React.memo((props) => {

    // ============================================================================== STATES ============================================================================== //

    const [records, setRecords] = React.useState([]);
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [search, setSearch] = React.useState("0");
    const [selectionModel, setSelectionModel] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [reload, setReload] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {
        setLoading(true);
        setRecords([]);
        fetchRecords();
    }, [reload]);

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
        setSearch();
    }

    async function fetchRecords() {
        try {

            const response = await axios.get(`api/module/equipments-drone?limit=${perPage}&search=${search}&page=${currentPage}`);

            setRecords(response.data.records);
            setTotalRecords(response.data.total_records);

            if (response.data.total_records > 0) {
                setSelectionModel(() => {
                    return response.data.records.map((drone) => {
                        if (String(drone.id) === String(props.current.drone_id)) {
                            return drone.id;
                        }
                    });
                });
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
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
        let new_selection_id = 0;
        if (newSelectedIds.length === 1) {
            new_selection_id = newSelectedIds;
        } else if (newSelectedIds.length > 1) {
            new_selection_id = newSelectedIds[newSelectedIds.length - 1];
        }

        setSelectionModel(new_selection_id);
    }

    async function handleSave() {
        const execute = async () => {

            const selectedFlightPlansUpdated = props.selectedFlightPlans.map((flight_plan) => {
                if (flight_plan.id != props.current.id) {
                    return flight_plan;
                } else {
                    return { ...flight_plan, drone_id: selectionModel }
                }
            });

            // Sort array by flight plan ID
            props.setSelectedFlightPlans(() => selectedFlightPlansUpdated.sort((a, b) => a.id - b.id));

        }

        await execute();
        setOpen(false);
    }

    return (
        <>
            <Tooltip title="Drone">
                <IconButton onClick={handleOpen}>
                    <img src={DroneIcon} width="20px" />
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
    );
});
