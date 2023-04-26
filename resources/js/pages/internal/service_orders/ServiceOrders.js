import * as React from 'react';
import { Tooltip, IconButton, Grid, TextField, InputAdornment, Box, Chip } from "@mui/material";
import { useSnackbar } from 'notistack';
import { DataGrid, ptBR } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import moment from 'moment';
import { CreateServiceOrder } from './Formulary/service-order/CreateServiceOrder';
import { UpdateServiceOrder } from './Formulary/service-order/UpdateServiceOrder';
import { DeleteServiceOrder } from './Formulary/service-order/DeleteServiceOrder';
import { ServiceOrderInformation } from './Formulary/service-order/ServiceOrderInformation';
import { ExportTableData } from '../../../components/modals/dialog/ExportTableData';
import { TableToolbar } from '../../../components/table_toolbar/TableToolbar';
import { useAuth } from '../../../context/Auth';
import { usePage } from '../../../context/PageContext';
import axios from '../../../services/AxiosApi';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'status',
        headerName: 'Status',
        width: 150,
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
        field: 'number',
        headerName: 'Número',
        width: 150,
        sortable: true,
        editable: false,
    },
    {
        field: 'creator',
        headerName: 'Criador',
        sortable: true,
        editable: false,
        flex: 1,
        minWidth: 200,
        renderCell: (data) => {
            function chipStyle(is_deleted, status) {
                const label = data.row.users.creator.name;
                if (is_deleted === 1) {
                    return { label: label, color: "error", variant: "contained" };
                } else if (is_deleted === 0) {
                    return status ? { label: label, color: "success", variant: "outlined" } : { label: label, color: "error", variant: "outlined" }
                }
            }

            const chip_style = chipStyle(data.row.users.creator.deleted, data.row.users.creator.status);

            return (
                <Chip {...chip_style} />
            )
        }
    },
    {
        field: 'pilot',
        headerName: 'Piloto',
        sortable: true,
        editable: false,
        flex: 1,
        minWidth: 200,
        renderCell: (data) => {
            function chipStyle(status) {
                const label = data.row.users.pilot.name;
                return status ? { label: label, color: "success", variant: "outlined" } : { label: label, color: "error", variant: "outlined" };
            }

            const chip_style = chipStyle(data.row.users.pilot.status);

            return (
                <Chip {...chip_style} />
            )
        }
    },
    {
        field: 'client',
        headerName: 'Cliente',
        sortable: true,
        editable: false,
        flex: 1,
        minWidth: 200,
        renderCell: (data) => {
            function chipStyle(status) {
                const label = data.row.users.client.name;
                return status ? { label: label, color: "success", variant: "outlined" } : { label: label, color: "error", variant: "outlined" };
            }

            const chip_style = chipStyle(data.row.users.client.status);

            return (
                <Chip {...chip_style} />
            )
        }
    },
    {
        field: 'start_date',
        headerName: 'Inicio',
        sortable: true,
        editable: false,
        width: 150,
        valueGetter: (data) => {
            return data.row.start_date ? moment(data.row.start_date).format("DD/MM/YYYY") : "---"
        }
    },
    {
        field: 'end_date',
        headerName: 'Fim',
        sortable: true,
        editable: false,
        width: 150,
        valueGetter: (data) => {
            return data.row.end_date ? moment(data.row.end_date).format("DD/MM/YYYY") : "---"
        }
    },
    {
        field: 'report',
        headerName: 'Relatório',
        sortable: false,
        editable: false,
        width: 150,
        renderCell: (data) => {
            const { enqueueSnackbar } = useSnackbar();
            function handleDownloadReport(report_filename) {
                axios.get("api/action/reports/download/" + report_filename,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        responseType: 'blob'
                    })
                    .then(function (response) {
                        enqueueSnackbar("O relatório foi exportado com sucesso!", { variant: "success" });
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `${report_filename}`);
                        document.body.appendChild(link);
                        link.click();
                    })
                    .catch(function (error) {
                        console.log(error.message)
                        enqueueSnackbar("A exportação do relatório falhou!", { variant: "error" });
                    });
            }

            if (data.row.finished) {
                return (
                    <Tooltip title="Download">
                        <IconButton onClick={() => handleDownloadReport(data.row.report_filename)}>
                            <FontAwesomeIcon icon={faFileArrowDown} size="sm" color="#007937" />
                        </IconButton>
                    </Tooltip>
                )
            } else {
                return (
                    <IconButton>
                        <FontAwesomeIcon icon={faFileArrowDown} size="sm" color="#E0E0E0" />
                    </IconButton>
                )
            }
        }
    },
    {
        field: 'deleted_at',
        headerName: 'Deleção',
        sortable: true,
        editable: false,
        hide: true,
        width: 150,
        valueGetter: (data) => {
            return data.row.deleted_at ? moment(data.row.deleted_at).format("DD/MM/YYYY") : null
        }
    }
];

export function ServiceOrders() {

    // ============================================================================== STATES ============================================================================== //

    const { user } = useAuth();
    const { setPageIndex } = usePage();
    const [records, setRecords] = React.useState([]);
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [search, setSearch] = React.useState("0");
    const [selectedRecords, setSelectedRecords] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [reload, setReload] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const is_authorized_to_read = !!user.user_powers["3"].profile_powers.read;
    const is_authorized_to_write = !!user.user_powers["3"].profile_powers.write;

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {
        setPageIndex(3);
        setLoading(true);
        setRecords([]);
        setSelectedRecords([]);
        fetchRecords();
    }, [reload]);

    function fetchRecords() {
        axios.get(`api/module/service-orders?limit=${perPage}&search=${search}&page=${currentPage}`)
            .then(function (response) {
                setRecords(response.data.records);
                setTotalRecords(response.data.total_records);
                enqueueSnackbar(`Ordens de serviço encontradas: ${response.data.total_records}`, { variant: "success" });
            })
            .catch(function (error) {
                enqueueSnackbar(error.response.data.message, { variant: "error" });
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
        // To save entire record by its ID
        const newSelectedRecords = records.filter((record) => {
            if (newSelectedIds.includes(record.id)) {
                return record;
            }
        })
        setSelectedRecords(newSelectedRecords);
    }

    function isRowSelectable() {
        return Boolean(is_authorized_to_write);
    }

    // ============================================================================== STRUCTURES ============================================================================== //

    return (
        <Box padding={2}>
            <Grid container spacing={1} alignItems="center" mb={1}>
                <Grid item>
                    {selectedRecords.length > 0 &&
                        <IconButton>
                            <FontAwesomeIcon icon={faPlus} color={"#E0E0E0"} size="sm" />
                        </IconButton>
                    }

                    {selectedRecords.length === 0 &&
                        <CreateServiceOrder reloadTable={setReload} />
                    }
                </Grid>

                <Grid item>
                    {(selectedRecords.length === 0 || selectedRecords.length > 1 || selectedRecords[0].finished) &&
                        <Tooltip title="Selecione um registro">
                            <IconButton>
                                <FontAwesomeIcon icon={faPen} color={"#E0E0E0"} size="sm" />
                            </IconButton>
                        </Tooltip>
                    }

                    {(!loading && selectedRecords.length === 1 && !selectedRecords[0].finished) &&
                        <UpdateServiceOrder record={selectedRecords[0]} reloadTable={setReload} />
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
                        <DeleteServiceOrder records={selectedRecords} reloadTable={setReload} />
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
                        <ExportTableData type="ORDENS DE SERVIÇO" source={"/api/module/service-orders/table-export"} />
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
                        placeholder={"Pesquisar ordem por id, número ou nome dos usuários envolvidos"}
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
                    checkboxSelection
                    disableSelectionOnClick
                    paginationMode='server'
                    experimentalFeatures={{ newEditingApi: true }}
                    isRowSelectable={isRowSelectable}
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
        </Box>
    );
}