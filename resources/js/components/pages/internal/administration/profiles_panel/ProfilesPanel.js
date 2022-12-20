import * as React from "react";
// Material UI
import { Tooltip, IconButton, Grid, TextField, Box, InputAdornment, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { DataGrid, ptBR } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
// Custom
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import axios from "../../../../../services/AxiosApi";
import { CreateProfile } from "./formulary/CreateProfile";
import { UpdateProfile } from "./formulary/UpdateProfile";
import { DeleteProfile } from "./formulary/DeleteProfile";
import { ProfileInformation } from "./formulary/ProfileInformation";
import { ExportTableData } from "../../../../shared/modals/dialog/ExportTableData";
import { TableToolbar } from "../../../../shared/table_toolbar/TableToolbar";

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
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
          <FormControlLabel control={<Checkbox defaultChecked={data.row.modules[0].read == 1} disabled size="small" />} label="Ler" />
          <FormControlLabel control={<Checkbox defaultChecked={data.row.modules[0].write == 1} disabled size="small" />} label="Escrever" />
        </FormGroup>
      )
    }
  },
  {
    field: 'flight_plan',
    headerName: 'Plano de voo',
    type: 'number',
    headerAlign: 'left',
    sortable: false,
    editable: false,
    flex: 1,
    minWidth: 200,
    renderCell: (data) => {
      return (
        <FormGroup>
          <FormControlLabel control={<Checkbox defaultChecked={data.row.modules[1].read == 1} disabled size="small" />} label="Ler" />
          <FormControlLabel control={<Checkbox defaultChecked={data.row.modules[1].write == 1} disabled size="small" />} label="Escrever" />
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
          <FormControlLabel control={<Checkbox defaultChecked={data.row.modules[2].read == 1} disabled size="small" />} label="Ler" />
          <FormControlLabel control={<Checkbox defaultChecked={data.row.modules[2].write == 1} disabled size="small" />} label="Escrever" />
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
          <FormControlLabel control={<Checkbox defaultChecked={data.row.modules[3].read == 1} disabled size="small" />} label="Ler" />
          <FormControlLabel control={<Checkbox defaultChecked={data.row.modules[3].write == 1} disabled size="small" />} label="Escrever" />
        </FormGroup>
      )
    }
  },
  {
    field: 'incidents',
    headerName: 'Incidentes',
    sortable: false,
    editable: false,
    flex: 1,
    minWidth: 200,
    renderCell: (data) => {
      return (
        <FormGroup>
          <FormControlLabel control={<Checkbox defaultChecked={data.row.modules[4].read == 1} disabled size="small" />} label="Ler" />
          <FormControlLabel control={<Checkbox defaultChecked={data.row.modules[4].write == 1} disabled size="small" />} label="Escrever" />
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
          <FormControlLabel control={<Checkbox defaultChecked={data.row.modules[5].read == 1} disabled size="small" />} label="Ler" />
          <FormControlLabel control={<Checkbox defaultChecked={data.row.modules[5].write == 1} disabled size="small" />} label="Escrever" />
        </FormGroup>
      )
    }
  },
];

export function ProfilesPanel() {

  // ============================================================================== STATES ============================================================================== //

  const { AuthData } = useAuthentication();

  const [records, setRecords] = React.useState([]);
  const [perPage, setPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [search, setSearch] = React.useState("0");
  const [selectedRecords, setSelectedRecords] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [reload, setReload] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  // ============================================================================== FUNCTIONS ============================================================================== //

  React.useEffect(() => {
    setLoading(true);
    setRecords([]);
    setSelectedRecords([]);
    fetchRecords();
  }, [reload]);

  function fetchRecords() {

    axios.get(`/api/admin-module-profile?limit=${perPage}&search=${search}&page=${currentPage}`)
      .then(function (response) {
        setRecords(response.data.records);
        setTotalRecords(response.data.total_records);

        if (response.data.total_records > 1) {
          handleOpenSnackbar(`Foram encontrados ${response.data.total_records} perfis`, "success");
        } else {
          handleOpenSnackbar(`Foi encontrado ${response.data.total_records} perfil`, "success");
        }
      })
      .catch(function (error) {
        handleOpenSnackbar(error.response.data.message, "error");
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

  function handleSelection(newSelectedIds) {
    // newSelectedIds always bring all selections
    const newSelectedRecords = records.filter((record) => {
      if (newSelectedIds.includes(record.id)) {
        return record;
      }
    })
    setSelectedRecords(newSelectedRecords);
  }

  function handleOpenSnackbar(text, variant) {
    enqueueSnackbar(text, { variant });
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
          {(selectedRecords.length === 0) &&
            <Tooltip title="Selecione um registro">
              <IconButton>
                <FontAwesomeIcon icon={faTrashCan} color={"#E0E0E0"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {(!loading && selectedRecords.length > 0) &&
            <DeleteProfile records={selectedRecords} reloadTable={setReload} />
          }
        </Grid>

        <Grid item>
          {(selectedRecords.length === 0 || selectedRecords.length > 1) &&
            <IconButton>
              <FontAwesomeIcon icon={faCircleInfo} color="#E0E0E0" size="sm" />
            </IconButton>
          }

          {(selectedRecords.length === 1) &&
            <ProfileInformation record={selectedRecords[0]} />
          }
        </Grid>

        <Grid item>
          {AuthData.data.user_powers["1"].profile_powers.read == 1 &&
            <ExportTableData type="PERFIS" source={"/api/profiles/export"} />
          }

          {!AuthData.data.user_powers["1"].profile_powers.read == 1 &&
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
            placeholder={"Pesquisar perfil por ID"}
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