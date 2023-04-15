import * as React from "react";
// MUI
import { Tooltip, IconButton, Grid, TextField, Box, InputAdornment, FormGroup, Chip, FormControlLabel, Checkbox } from "@mui/material";
import { DataGrid, ptBR } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
// Others
import moment from 'moment';
// Custom
import { CreateProfile } from "./formulary/CreateProfile";
import { UpdateProfile } from "./formulary/UpdateProfile";
import { DeleteProfile } from "./formulary/DeleteProfile";
import { ProfileInformation } from "./formulary/ProfileInformation";
import { ExportTableData } from '../../../../components/modals/dialog/ExportTableData';
import { TableToolbar } from '../../../../components/table_toolbar/TableToolbar';
import { useAuth } from '../../../../context/Auth';
import axios from "../../../../services/AxiosApi";

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
    field: 'name',
    headerName: 'Nome',
    flex: 1,
    minWidth: 200,
    sortable: true,
    editable: false,
  },
  {
    field: 'administration',
    headerName: 'Administração',
    sortable: false,
    editable: false,
    flex: 1,
    minWidth: 200,
    renderCell: (data) => {
      return (
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={Boolean(data.row.modules[0].read == 1)} disabled size="small" />} label="Ler" />
          <FormControlLabel control={<Checkbox checked={Boolean(data.row.modules[0].write == 1)} disabled size="small" />} label="Escrever" />
        </FormGroup>
      )
    }
  },
  {
    field: 'flight_plan',
    headerName: 'Plano de voo',
    sortable: false,
    editable: false,
    flex: 1,
    minWidth: 200,
    renderCell: (data) => {
      return (
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={Boolean(data.row.modules[1].read == 1)} disabled size="small" />} label="Ler" />
          <FormControlLabel control={<Checkbox checked={Boolean(data.row.modules[1].write == 1)} disabled size="small" />} label="Escrever" />
        </FormGroup>
      )
    }
  },
  {
    field: 'service_order',
    headerName: 'Ordens de serviço',
    sortable: false,
    editable: false,
    flex: 1,
    minWidth: 200,
    renderCell: (data) => {
      return (
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={Boolean(data.row.modules[2].read == 1)} disabled size="small" />} label="Ler" />
          <FormControlLabel control={<Checkbox checked={Boolean(data.row.modules[2].write == 1)} disabled size="small" />} label="Escrever" />
        </FormGroup>
      )
    }
  },
  {
    field: 'reports',
    headerName: 'Relatórios',
    sortable: false,
    editable: false,
    flex: 1,
    minWidth: 200,
    renderCell: (data) => {
      return (
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={Boolean(data.row.modules[3].read == 1)} disabled size="small" />} label="Ler" />
          <FormControlLabel control={<Checkbox checked={Boolean(data.row.modules[3].write == 1)} disabled size="small" />} label="Escrever" />
        </FormGroup>
      )
    }
  },
  {
    field: 'equipments',
    headerName: 'Equipamentos',
    sortable: false,
    editable: false,
    flex: 1,
    minWidth: 200,
    renderCell: (data) => {
      return (
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={Boolean(data.row.modules[4].read == 1)} disabled size="small" />} label="Ler" />
          <FormControlLabel control={<Checkbox checked={Boolean(data.row.modules[4].write == 1)} disabled size="small" />} label="Escrever" />
        </FormGroup>
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
];

export function Profiles() {

  // ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [records, setRecords] = React.useState([]);
  const [perPage, setPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [search, setSearch] = React.useState("0");
  const [selectedRecords, setSelectedRecords] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [reload, setReload] = React.useState(false);

  const is_authorized_to_read = !!user.user_powers["1"].profile_powers.read;

  // ============================================================================== FUNCTIONS ============================================================================== //

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

  async function fetchRecords() {
    try {
      const response = await axios.get(`api/module/administration-profile?limit=${perPage}&search=${search}&page=${currentPage}`);
      setRecords(response.data.records);
      setTotalRecords(response.data.total_records);
      enqueueSnackbar(`Perfis encontrados: ${response.data.total_records}`, { variant: "success" });
    } catch (error) {
      console.log(error)
      enqueueSnackbar(error.response.data.message, { variant: "error" });
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
    // newSelectedIds always bring all selections
    const newSelectedRecords = records.filter((record) => {
      if (newSelectedIds.includes(record.id)) {
        return record;
      }
    })
    setSelectedRecords(newSelectedRecords);
  }

  function isRowSelectable() {
    return Boolean(user.user_powers["1"].profile_powers.write);
  }

  function canDelete() {
    if (selectedRecords.length > 0) {
      return selectedRecords.reduce((acm, record) => acm && ![1, 2, 3, 4, 5].includes(record.id), true);
    }
    return false;
  }

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          {selectedRecords.length > 0 &&
            <IconButton>
              <FontAwesomeIcon icon={faPlus} color={"#E0E0E0"} size="sm" />
            </IconButton>
          }

          {selectedRecords.length === 0 &&
            <CreateProfile reloadTable={setReload} />
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
            <UpdateProfile record={selectedRecords[0]} reloadTable={setReload} />
          }
        </Grid>

        <Grid item>
          {(selectedRecords.length === 0 || (selectedRecords.length > 0 && !canDelete())) &&
            <Tooltip title="Selecione um registro">
              <IconButton>
                <FontAwesomeIcon icon={faTrashCan} color={"#E0E0E0"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {(!loading && selectedRecords.length > 0 && canDelete()) &&
            <DeleteProfile records={selectedRecords} reloadTable={setReload} />
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
          {is_authorized_to_read == 1 &&
            <ExportTableData type="PERFIS" source={"/api/profiles/export"} />
          }

          {!is_authorized_to_read == 1 &&
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
            placeholder={"Pesquisar perfil por id"}
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
          isRowSelectable={isRowSelectable}
          rowHeight={100}
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
    </>
  )
}