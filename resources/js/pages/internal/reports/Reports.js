import * as React from 'react';
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
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { CreateReport } from './formulary/report/CreateReport';
import { UpdateReport } from './formulary/report/UpdateReport';
import { DeleteReport } from './formulary/report/DeleteReport';
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
    editable: false
  },
  {
    field: 'service_order',
    headerName: 'Ordem de serviço',
    flex: 1,
    minWidth: 150,
    sortable: true,
    editable: false,
    valueGetter: (data) => {
      return data.row.service_order.number
    }
  },
  {
    field: 'observation',
    headerName: 'Observação',
    sortable: true,
    editable: false,
    flex: 1,
    minWidth: 200
  },
  {
    field: 'created_at',
    headerName: 'Criado em',
    sortable: true,
    editable: false,
    minWidth: 150
  },
  {
    field: 'export',
    headerName: 'Exportar',
    sortable: true,
    editable: false,
    minWidth: 150,
    renderCell: (data) => {
      const { enqueueSnackbar } = useSnackbar();

      function handleDownloadReport(report) {
        axios.get("api/module/action/reports/download/" + report.file,
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
            link.setAttribute('download', `${report.file}`); //or any other extension
            document.body.appendChild(link);
            link.click();
          })
          .catch(function (error) {
            console.log(error.message)
            enqueueSnackbar("A exportação do relatório falhou!", { variant: "error" });
          });
      }

      return (
        <Tooltip title={"Download"}>
          <IconButton onClick={() => handleDownloadReport(data.row)}>
            <FontAwesomeIcon icon={faFileArrowDown} size="sm" color={"#007937"} />
          </IconButton>
        </Tooltip>
      )
    }
  }
];

export function Reports() {

  // ============================================================================== STATES ============================================================================== //

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { setPageIndex } = usePage();
  const [records, setRecords] = React.useState([]);
  const [perPage, setPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [search, setSearch] = React.useState("0");
  const [selectedRecords, setSelectedRecords] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [reload, setReload] = React.useState(false);

  // ============================================================================== FUNCTIONS ============================================================================== //

  React.useEffect(() => {
    setPageIndex(4);
    setLoading(true);
    setRecords([]);
    setSelectedRecords([]);
    fetchRecords();
  }, [reload]);

  function fetchRecords() {

    axios.get(`api/module/reports?limit=${perPage}&search=${search}&page=${currentPage}`)
      .then(function (response) {
        setRecords(response.data.records);
        setTotalRecords(response.data.total_records);

        if (response.data.total_records > 1) {
          handleOpenSnackbar(`Foram encontrados ${response.data.total_records} relatórios`, "success");
        } else {
          handleOpenSnackbar(`Foi encontrado ${response.data.total_records} relatório`, "success");
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

  function isRowSelectable() {
    return Boolean(user.user_powers["4"].profile_powers.write);
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
            <CreateReport reloadTable={setReload} />
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
            <UpdateReport record={selectedRecords[0]} reloadTable={setReload} />
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
            <DeleteReport records={selectedRecords} reloadTable={setReload} />
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
          {user.user_powers["4"].profile_powers.read == 1 &&
            <ExportTableData type="RELATÓRIOS" source={"/api/module/reports/table-export"} />
          }

          {!user.user_powers["4"].profile_powers.read == 1 &&
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
            placeholder={"Pesquisar um incidente por id"}
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
          className='shadow-sm outline-none'
          sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell, .MuiDataGrid-columnHeader:focus-within": {
              outline: "none !important",
            }
          }}
        />
      </Box>
    </Box>
  );
}