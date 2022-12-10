// React
import * as React from 'react';
// MaterialUI
import { Tooltip, IconButton, Grid, TextField, InputAdornment, Box, Chip } from "@mui/material";
import { useSnackbar } from 'notistack';
import { DataGrid, ptBR } from '@mui/x-data-grid';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
// Custom
import { CreateOrder } from './formulary/CreateOrder';
import { UpdateOrder } from './formulary/UpdateOrder';
import { DeleteOrder } from './formulary/DeleteOrder';
import { ServiceOrderInformation } from './formulary/ServiceOrderInformation';
import { ExportTableData } from '../../../../structures/modals/dialog/ExportTableData';
import { TableToolbar } from '../../../../structures/table_toolbar/TableToolbar';
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import axios from "../../../../../services/AxiosApi";

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    sortable: true,
    editable: false,
    renderCell: (data) => {
      const status = data.row.status;
      return <Chip label={status ? "Ativo" : "Inativo"} color={status ? "success" : "error"} variant="outlined" />
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
    type: 'number',
    width: 150,
    headerAlign: 'left',
    sortable: true,
    editable: false,
    renderCell: (data) => {
      const status = data.row.users.creator.status;
      return <Chip label={data.row.users.creator.name} color={status ? "success" : "error"} variant="outlined" />
    }
  },
  {
    field: 'pilot',
    headerName: 'Piloto',
    sortable: true,
    editable: false,
    flex: 1,
    renderCell: (data) => {
      const status = data.row.users.pilot.status;
      return <Chip label={data.row.users.pilot.name} color={status ? "success" : "error"} variant="outlined" />
    }
  },
  {
    field: 'client',
    headerName: 'Cliente',
    sortable: true,
    editable: false,
    flex: 1,
    renderCell: (data) => {
      const status = data.row.users.client.status;
      return <Chip label={data.row.users.client.name} color={status ? "success" : "error"} variant="outlined" />
    }
  },
  {
    field: 'observation',
    headerName: 'Descrição',
    sortable: true,
    editable: false,
    width: 150
  },
  {
    field: 'flight_plans',
    headerName: 'Planos de voo',
    sortable: true,
    editable: false,
    width: 150,
    valueGetter: (data) => {
      return data.row.flight_plans.length;
    }
  },
  {
    field: 'total_incidents',
    headerName: 'Incidentes',
    sortable: true,
    editable: false,
    width: 100,
  },
  {
    field: 'report',
    headerName: 'Relatório',
    sortable: true,
    editable: false,
    width: 100,
    renderCell: (data) => {
      if (data.row.finished) {
        return (
          <IconButton>
            <FontAwesomeIcon icon={faFilePdf} color={"#007937"} size="sm" />
          </IconButton>
        )
      } else {
        return (
          <IconButton>
            <FontAwesomeIcon icon={faFilePdf} color={"#E0E0E0"} size="sm" />
          </IconButton>
        )
      }
    }
  },
];

export const ServiceOrdersPanel = () => {

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

    axios.get(`/api/orders-module?limit=${perPage}&search=${search}&page=${currentPage}`)
      .then(function (response) {
        setRecords(response.data.records);
        setTotalRecords(response.data.total_records);

        if (response.data.total_records > 1) {
          handleOpenSnackbar(`Foram encontrados ${response.data.total_records} ordem de serviço`, "success");
        } else {
          handleOpenSnackbar(`Foi encontrado ${response.data.total_records} ordens de serviço`, "success");
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
    // To save entire record by its ID
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
            <CreateOrder reloadTable={setReload} />
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
            <UpdateOrder record={selectedRecords[0]} reloadTable={setReload} />
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
            <DeleteOrder records={selectedRecords} reloadTable={setReload} />
          }
        </Grid>

        <Grid item>
          {(selectedRecords.length === 0 || selectedRecords.length > 1) &&
            <IconButton>
              <FontAwesomeIcon icon={faCircleInfo} color="#E0E0E0" size="sm" />
            </IconButton>
          }

          {(selectedRecords.length === 1) &&
            <ServiceOrderInformation record={selectedRecords[0]} />
          }
        </Grid>

        <Grid item>
          {AuthData.data.user_powers["3"].profile_powers.read == 1 &&
            <ExportTableData type="ORDENS DE SERVIÇO" source={"/api/service-orders/export"} />
          }

          {!AuthData.data.user_powers["3"].profile_powers.read == 1 &&
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

        <Grid item xs>
          <TextField
            fullWidth
            placeholder={"Pesquisar ordem por ID, número ou nome dos usuários envolvidos"}
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