import * as React from 'react';
// Mui
import { Tooltip, IconButton, Grid, TextField, Chip, InputAdornment, Box } from "@mui/material";
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
import moment from 'moment';
import { CreateUser } from './formulary/CreateUser';
import { UpdateUser } from './formulary/UpdateUser';
import { DeleteUser } from './formulary/DeleteUser';
import { UserInformation } from './formulary/UserInformation';
import { ExportTableData } from '../../../../components/modals/dialog/ExportTableData';
import { TableToolbar } from '../../../../components/table_toolbar/TableToolbar';
import { useAuth } from '../../../../context/Auth';
import axios from "../../../../services/AxiosApi";

const columns = [
  { field: 'id', headerName: 'ID', width: 90, sortable: true, editable: false },
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
    field: 'email',
    headerName: 'Email',
    flex: 1,
    minWidth: 200,
    sortable: true,
    editable: false,
  },
  {
    field: 'profile',
    headerName: 'Perfil',
    sortable: true,
    editable: false,
    width: 200,
    valueGetter: (data) => {
      return data.row.profile.name;
    },
  },
  {
    field: 'last_access',
    headerName: 'Último acesso',
    sortable: true,
    editable: false,
    width: 150,
    valueGetter: (data) => {
      return data.row.last_access ? moment(data.row.last_access).format("DD/MM/YYYY") : "---"
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

export function Users() {

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
    if (!is_mounted) {
      return;
    }

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
      const response = await axios.get(`api/module/administration-user?limit=${perPage}&search=${search}&page=${currentPage}`);
      setRecords(response.data.records);
      setTotalRecords(response.data.total_records);
      enqueueSnackbar(`Usuários encontrados: ${response.data.total_records}`, { variant: "success" });
    } catch (error) {
      console.log(error.message)
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
    const newSelectedRecords = records.filter((record) => {
      if (newSelectedIds.includes(record.id)) {
        return record;
      }
    })
    setSelectedRecords(newSelectedRecords);
  }

  function isRowSelectable(data) {
    return (data.row.id != user.id) && Boolean(user.user_powers["1"].profile_powers.write);
  }

  return (
    <>
      <Grid container gap={1} alignItems="center" mb={1}>
        <Grid item>
          {selectedRecords.length > 0 &&
            <IconButton>
              <FontAwesomeIcon icon={faPlus} color={"#E0E0E0"} size="sm" />
            </IconButton>
          }

          {selectedRecords.length === 0 &&
            <CreateUser reloadTable={setReload} />
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
            <UpdateUser record={selectedRecords[0]} reloadTable={setReload} />
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
            <DeleteUser records={selectedRecords} reloadTable={setReload} />
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
            <ExportTableData type="USUÁRIOS" source={"/api/module/administration-user/table-export"} />
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
            placeholder={"Pesquisar um usuário por id, nome, email ou perfil"}
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
          checkboxSelection
          isRowSelectable={isRowSelectable}
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