import * as React from 'react';
// MUI
import { Tooltip, IconButton, Grid, TextField, InputAdornment, Box, Chip } from "@mui/material";
import { useSnackbar } from 'notistack';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
// Custom
import { CreateDrone } from './formulary/CreateDrone';
import { UpdateDrone } from './formulary/UpdateDrone';
import { DeleteDrone } from './formulary/DeleteDrone';
import { DroneInformation } from './formulary/DroneInformation';
import { ExportTableData } from '../../../../components/modals/dialog/ExportTableData';
import { TableToolbar } from '../../../../components/table_toolbar/TableToolbar';
import { ModalImage } from '../../../../components/modals/dialog/ModalImage';
import { useAuth } from '../../../../context/Auth';
import axios from '../../../../services/AxiosApi';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'status',
        headerName: 'Status',
        minWidth: 130,
        sortable: true,
        editable: false,
        renderCell: (data) => {

            function chipStyle(badge) {
                return { label: badge.label, color: badge.color, variant: "outlined" };
            }

            const chip_style = chipStyle(data.row.status_badge);

            return (
                <Chip {...chip_style} />
            )
        }
    },
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

export function Drones() {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();
    const [records, setRecords] = React.useState([]);
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [search, setSearch] = React.useState("0");
    const [selectedRecords, setSelectedRecords] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [reload, setReload] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const is_authorized_to_read = !!user.user_powers["5"].profile_powers.read;

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {
        setLoading(true);
        setRecords([]);
        setSelectedRecords([]);
        fetchRecords();
    }, [reload]);

    async function fetchRecords() {
        try {
            const response = await axios.get(`api/module/equipments-drone?limit=${perPage}&search=${search}&page=${currentPage}`);
            setRecords(response.data.records);
            setTotalRecords(response.data.total_records);
            enqueueSnackbar(`Drones encontrados: ${response.data.total_records}`, { variant: "success" });
        } catch (error) {
            enqueueSnackbar(error.response.data.message, { variant: "error" });
        } finally {
            setLoading(false);
        }
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

    function handleSelection(newSelectedIds) {
        // newSelectedIds always bring all selections
        const newSelectedRecords = records.filter((record) => {
            if (newSelectedIds.includes(record.id)) {
                return record;
            }
        })
        setSelectedRecords(newSelectedRecords);
    }

    function isRowSelectable() {
        return Boolean(user.user_powers["5"].profile_powers.write);
    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <>
            <Grid container spacing={1} alignItems="center" mb={1}>
                <Grid item>
                    {selectedRecords.length > 0 &&
                        <IconButton>
                            <FontAwesomeIcon icon={faPlus} color={"#E0E0E0"} size="sm" />
                        </IconButton>
                    }

                    {selectedRecords.length === 0 &&
                        <CreateDrone reloadTable={setReload} />
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
                        <UpdateDrone record={selectedRecords[0]} reloadTable={setReload} />
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
                        <DeleteDrone records={selectedRecords} reloadTable={setReload} />
                    }
                </Grid>

                <Grid item>
                    <Tooltip title="Informações adicionais">
                        <IconButton>
                            <FontAwesomeIcon icon={faCircleInfo} color="#E0E0E0" size="sm" />
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item>
                    {is_authorized_to_read &&
                        <ExportTableData type="DRONES" source={"/api/module/equipments-drone/table-export"} />
                    }

                    {!is_authorized_to_read &&
                        <IconButton disabled>
                            <FontAwesomeIcon icon={faFileCsv} color="#E0E0E0" size="sm" />
                        </IconButton>
                    }
                </Grid>

                <Grid item>
                    <Tooltip title="Carregar">
                        <IconButton onClick={() => setReload((old) => !old)}>
                            <FontAwesomeIcon icon={faArrowsRotate} size="sm" id="reload_icon" color='#007937' />
                        </IconButton>
                    </Tooltip>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        placeholder={"Pesquisar um incidente por ID"}
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
                className="h-[500px] w-full"
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
                    isRowSelectable={isRowSelectable}
                    experimentalFeatures={{ newEditingApi: true }}
                    onPageSizeChange={(newPageSize) => handleChangeRowsPerPage(newPageSize)}
                    onSelectionModelChange={handleSelection}
                    onPageChange={(newPage) => handleChangePage(newPage + 1)}
                    rowCount={totalRecords}
                    localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                    components={{
                        Toolbar: TableToolbar,
                    }}
                    className='shadow-sm outline-none'
                    sx={{
                        "&.MuiDataGrid-root .MuiDataGrid-cell, .MuiDataGrid-columnHeader:focus-within": {
                            outline: "none !important",
                        }
                    }}
                />
            </Box>
        </>
    )
}