// React
import * as React from 'react';
// Material UI
import { TableCell, Tooltip, IconButton, Grid, TextField, styled, Chip, InputAdornment, Menu, MenuItem, Checkbox, Box } from "@mui/material";
import { useSnackbar } from 'notistack';
import { DataGrid } from '@mui/x-data-grid';
// Custom
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { CreateUserFormulary } from "../../../../structures/modules/administration/users_administration/CreateUserFormulary";
import { UpdateUserFormulary } from "../../../../structures/modules/administration/users_administration/UpdateUserFormulary";
import { DeleteUserFormulary } from "../../../../structures/modules/administration/users_administration/DeleteUserFormulary";
import { UserInformation } from '../../../../structures/modules/administration/users_administration/UserInformation';
import { ExportTableData } from '../../../../structures/modals/dialog/ExportTableData';
import LinearProgress from '@mui/material/LinearProgress';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const initialPagination = { total_records: 0, records_per_page: 0, total_pages: 0 };
const initialPaginationConfig = { page: 1, limit: 10, order_by: "id", search: 0, total_records: 0, filter: 0 };

const columns = [
  { field: 'id', headerName: 'ID', width: 90, headerClassName: 'super-app-theme--header' },
  {
    field: 'name',
    headerName: 'Nome',
    flex: 1,
    sortable: true,
    editable: false,
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    sortable: true,
    editable: false,
  },
  {
    field: 'status',
    headerName: 'Status',
    type: 'number',
    width: 150,
    headerAlign: 'left',
    sortable: true,
    editable: false,
    renderCell: (data) => {
      const status = data.row.status;
      if (status === 1) {
        return <Chip label="Ativo" color="success" variant="outlined" />
      } else {
        return <Chip label="Inativo" color="error" variant="outlined" />
      }
    }
  },
  {
    field: 'profile',
    headerName: 'Perfil',
    sortable: true,
    editable: false,
    flex: 1,
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
  },
];

export function UsersPanel() {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();
  const [records, setRecords] = React.useState([]);
  const [pagination, setPagination] = React.useState(initialPagination);
  const [paginationConfig, setPaginationConfig] = React.useState(initialPaginationConfig);
  const [loading, setLoading] = React.useState(true);
  const [selectedRecordIndex, setSelectedRecordIndex] = React.useState(null);
  const [searchField, setSearchField] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { enqueueSnackbar } = useSnackbar();

  // ============================================================================== FUNCTIONS ============================================================================== //

  React.useEffect(() => {
    serverLoadRecords();
  }, [paginationConfig]);

  function serverLoadRecords() {

    const limit = paginationConfig.limit;
    const search = paginationConfig.search;
    const page = paginationConfig.page;
    const order_by = paginationConfig.order_by;
    const filter = paginationConfig.filter;

    AxiosApi.get(`/api/admin-module-user?limit=${limit}&search=${search}&page=${page}&order_by=${order_by}&filter=${filter}`)
      .then(function (response) {
        setLoading(false);
        setRecords(response.data.records);
        setPagination({ total_records: response.data.total_records, records_per_page: response.data.records_per_page, total_pages: response.data.total_pages });
        if (response.data.total_records > 1) {
          handleOpenSnackbar(`Foram encontrados ${response.data.total_records} usuários`, "success");
        } else {
          handleOpenSnackbar(`Foi encontrado ${response.data.total_records} usuário`, "success");
        }
      })
      .catch(function (error) {
        handleOpenSnackbar(error.response.data.message, "error");
        setLoading(false);
        setRecords([]);
        setPagination(initialPagination);
      });

  }

  const handleTablePageChange = (event, value) => {
    setPaginationConfig({
      page: value + 1,
      limit: paginationConfig.limit,
      order_by: "id",
      search: paginationConfig.search,
      total_records: 0,
      filter: 0
    });
  };

  const handleChangeRowsPerPage = (newValue) => {
    setPaginationConfig({
      page: 1,
      limit: newValue,
      order_by: "id",
      search: paginationConfig.search,
      total_records: 0,
      filter: 0
    });
  };

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPaginationConfig({
      page: 1,
      limit: paginationConfig.limit,
      order_by: "id",
      search: searchField,
      total_records: 0,
      filter: 0
    });
  }

  function reloadTable() {
    setSelectedRecordIndex(null);

    setLoading(true);
    setRecords([]);
    setPagination({
      total_records: 0,
      records_per_page: 0,
      total_pages: 0
    });

    setPaginationConfig({
      page: 1,
      limit: paginationConfig.limit,
      order_by: "id",
      search: 0,
      total_records: 0,
      filter: 0
    });

  }

  function handleClickRadio(e) {
    if (e.target.value === selectedRecordIndex) {
      setSelectedRecordIndex(null);
    } else if (e.target.value != selectedRecordIndex) {
      setSelectedRecordIndex(e.target.value);
    }
  }

  function handleClick(e) {
    setAnchorEl(e.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }

  function handleOpenSnackbar(text, variant) {
    enqueueSnackbar(text, { variant });
  }

  // ============================================================================== STRUCTURES ============================================================================== //

  return (
    <>
      <Grid container spacing={1} alignItems="center" mb={1}>

        <Grid item>
          {selectedRecordIndex &&
            <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true}>
              <FontAwesomeIcon icon={faPlus} color={"#E0E0E0"} size="sm" />
            </IconButton>
          }

          {selectedRecordIndex === null &&
            <CreateUserFormulary reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro">
              <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true}>
                <FontAwesomeIcon icon={faPen} color={"#E0E0E0"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {(!loading && selectedRecordIndex != null) &&
            <UpdateUserFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro">
              <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true} >
                <FontAwesomeIcon icon={faTrashCan} color={"#E0E0E0"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {/* O modal é renderizado apenas quando um registro já foi selecionado */}
          {(!loading && selectedRecordIndex != null) &&
            <DeleteUserFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          {selectedRecordIndex &&
            <UserInformation record={records[selectedRecordIndex]} />
          }

          {!selectedRecordIndex &&
            <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true} >
              <FontAwesomeIcon icon={faCircleInfo} color="#E0E0E0" size="sm" />
            </IconButton>
          }
        </Grid>

        <Grid item>
          <Tooltip title="Filtros">
            <IconButton
              disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true}
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <FontAwesomeIcon icon={faFilter} color={AuthData.data.user_powers["1"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
            </IconButton>
          </Tooltip>
        </Grid>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem ><Checkbox /> Ativos </MenuItem>
          <MenuItem ><Checkbox /> Inativos </MenuItem>
          <MenuItem ><Checkbox /> Desabilitados </MenuItem>
        </Menu>

        <Grid item>
          {AuthData.data.user_powers["1"].profile_powers.read == 1 &&
            <ExportTableData type="USUÁRIOS" source={"/api/users/export"} />
          }

          {!AuthData.data.user_powers["1"].profile_powers.read == 1 &&
            <IconButton disabled>
              <FontAwesomeIcon icon={faFileCsv} color="#E0E0E0" size="sm" />
            </IconButton>
          }
        </Grid>

        <Grid item>
          <Tooltip title="Carregar">
            <IconButton onClick={reloadTable}>
              <FontAwesomeIcon icon={faArrowsRotate} size="sm" id="reload_icon" color='#007937' />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item xs>
          <TextField
            fullWidth
            placeholder={"Pesquisar um usuário por ID, nome, email e perfil"}
            onChange={(e) => setSearchField(e.currentTarget.value)}
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <IconButton onClick={handleSearchSubmit}>
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
        {
          (!loading && records.length > 0) &&
          <DataGrid
            rows={records}
            columns={columns}
            pageSize={paginationConfig.limit}
            onPageSizeChange={(newPageSize) => handleChangeRowsPerPage(newPageSize)}
            rowsPerPageOptions={[10, 25, 50, 100]}
            checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
            sx={{
              "&.MuiDataGrid-root .MuiDataGrid-cell, .MuiDataGrid-columnHeader:focus-within": {
                outline: "none !important",
              },
              '& .super-app-theme--header': {
                color: '#222'
              }
            }}
          />
        }
      </Box>



      {loading && <LinearProgress color="success" />}
    </>
  )
}