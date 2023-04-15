import * as React from 'react';
// MUI
import { Tooltip, IconButton, Grid, TextField, InputAdornment, Box, Chip } from "@mui/material";
import { DataGrid, ptBR } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
// Custom
import { CreateLog } from './formulary/CreateLog';
import { UpdateLog } from './formulary/UpdateLog';
import { DeleteLog } from './formulary/DeleteLog';
import { ModalImage } from '../../../../components/modals/dialog/ModalImage';
import { useAuth } from '../../../../context/Auth';
import { ExportTableData } from '../../../../components/modals/dialog/ExportTableData';
import { TableToolbar } from '../../../../components/table_toolbar/TableToolbar';
import axios from '../../../../services/AxiosApi';
import moment from 'moment';

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
        field: 'log_image',
        headerName: 'Visualização',
        sortable: false,
        editable: false,
        minWidth: 130,
        renderCell: (data) => {
            return <ModalImage image_url={data.row.image_url} />
        }
    },
    {
        field: 'name',
        headerName: 'Nome',
        flex: 1,
        minWidth: 200,
        sortable: true,
        editable: false
    },
    {
        field: 'filename',
        headerName: 'Arquivo',
        sortable: true,
        editable: false,
        flex: 1,
        minWidth: 150
    },
    {
        field: 'service_order',
        headerName: 'Ordem de serviço',
        sortable: true,
        editable: false,
        minWidth: 250,
        renderCell: (data) => {

            function chipStyle(related_service_order) {
                if (related_service_order === null) {
                    return { label: "Nenhuma", disabled: true, variant: "outlined" };
                } else if (related_service_order != null) {
                    return { label: related_service_order.number, color: related_service_order.deleted == 1 ? "error" : "success", variant: related_service_order.deleted == 1 ? "contained" : "outlined" };
                }
            }

            const chip_style = chipStyle(data.row.service_order);

            return (
                <Chip {...chip_style} />
            )
        },
    },
    {
        field: 'export_txt',
        headerName: 'Exportar KML',
        sortable: false,
        editable: false,
        width: 150,
        renderCell: (data) => {

            const { enqueueSnackbar } = useSnackbar();

            function handleDownloadLog(filename) {
                axios.get(`api/logs-module-download/${filename}`, null, {
                    responseType: 'blob'
                })
                    .then(function (response) {
                        enqueueSnackbar(`Download realizado com sucesso! Arquivo: ${filename}`, { variant: "success" });

                        // Download forçado do arquivo com o conteúdo retornado do servidor
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `${filename}`); //or any other extension
                        document.body.appendChild(link);
                        link.click();

                    })
                    .catch((error) => {
                        console.log(error)
                        enqueueSnackbar(`O download não foi realizado! Arquivo: ${filename}`, { variant: "error" });
                    })
            }

            return (
                <IconButton onClick={() => handleDownloadLog(data.row.filename)}>
                    <FontAwesomeIcon icon={faFileArrowDown} color={"#00713A"} size="sm" />
                </IconButton>
            )
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
]

export function Logs() {

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

    const is_authorized_to_read = !!user.user_powers["2"].profile_powers.read;

    // ============================================================================== FUNCTIONS ============================================================================== //

    React.useEffect(() => {
        setLoading(true);
        setRecords([]);
        setSelectedRecords([]);
        fetchRecords();
    }, [reload]);

    function fetchRecords() {
        axios.get(`api/module/flight-plans-logs?limit=${perPage}&search=${search}&page=${currentPage}`)
            .then((response) => {
                setRecords(response.data.records);
                setTotalRecords(response.data.total_records);
                enqueueSnackbar(`Logs encontrados: ${response.data.total_records}`, { variant: "success" });
            })
            .catch((error) => {
                enqueueSnackbar(error.response.data.message, { variant: "error" });
            })
            .finally(() => {
                setLoading(false);
            })
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
        // newSelectedIds always bring all selections
        const newSelectedRecords = records.filter((record) => {
            if (newSelectedIds.includes(record.id)) {
                return record;
            }
        })
        setSelectedRecords(newSelectedRecords);
    }

    function isRowSelectable() {
        return Boolean(user.user_powers["2"].profile_powers.write);
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
                        <CreateLog reloadTable={setReload} />
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
                        <UpdateLog record={selectedRecords[0]} reloadTable={setReload} />
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
                        <DeleteLog records={selectedRecords} reloadTable={setReload} />
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
                        <ExportTableData type="LOGS" source={"/api/logs/export"} />
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
                        placeholder={"Pesquisar plano por id ou nome"}
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
        </>
    );
}