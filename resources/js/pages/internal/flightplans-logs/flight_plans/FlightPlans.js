import * as React from 'react';
// Mui
import { Link, Tooltip, IconButton, Grid, TextField, InputAdornment, Box, Chip } from "@mui/material";
import { DataGrid, ptBR } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
// Fontsawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
// Other external libs
import moment from 'moment';
import JSZip from 'jszip';
// Custom
import { UpdateFlightPlan } from './formulary/UpdateFlightPlan';
import { DeleteFlightPlan } from './formulary/DeleteFlightPlan';
import { FlightPlanInformation } from './formulary/FlightPlanInformation';
import { ModalImage } from '../../../../components/modals/dialog/ModalImage';
import { ExportTableData } from '../../../../components/modals/dialog/ExportTableData';
import { TableToolbar } from '../../../../components/table_toolbar/TableToolbar';
import { useAuth } from '../../../../context/Auth';
import { generateFlightPlanPathCSV } from '../../../../utils/GenerateFlightPlanPathCSV';
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
    headerName: 'Visualização',
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
    field: 'type',
    headerName: 'Tipo',
    width: 150,
    minWidth: 130,
    sortable: true,
    editable: false
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
    field: 'creator',
    headerName: 'Criador',
    sortable: true,
    editable: false,
    flex: 1,
    minWidth: 200,
    valueGetter: (data) => {
      return data.row.creator.name;
    },
  },
  {
    field: 'created_at',
    headerName: 'Criado em',
    type: 'number',
    headerAlign: 'left',
    align: 'center',
    sortable: true,
    editable: false,
    width: 130,
    valueGetter: (data) => {
      return moment(data.row.created_at).format("DD/MM/YYYY")
    }
  },
  {
    field: 'export_txt',
    headerName: 'Exportar TXT',
    sortable: false,
    editable: false,
    width: 150,
    renderCell: (data) => {

      const { enqueueSnackbar } = useSnackbar();

      function handleDownloadFlightPlan(files_path) {

        axios.get(`/api/module/action/flight-plans/download?files=${files_path.toString()}`, {
          responseType: 'application/json'
        })
          .then(function (response) {

            const files = response.data;
            const zip = new JSZip();

            for (let filename in files) {
              // Adiciona o conteúdo do arquivo ao zip
              zip.file(`${filename}.txt`, files[filename]);
            }

            // Cria o arquivo zip e baixa-o
            zip.generateAsync({ type: "blob" }).then(function (content) {
              const url = window.URL.createObjectURL(content);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `plano_${data.row.name.toLowerCase()}.zip`);
              document.body.appendChild(link);
              link.click();
            });

          })
          .catch((error) => {
            console.log(error.message)
            enqueueSnackbar("A exportação do plano de voo falhou!", { variant: "error" });
          });

      }

      return (
        <IconButton onClick={() => handleDownloadFlightPlan(data.row.files)}>
          <FontAwesomeIcon icon={faFileArrowDown} color={"#00713A"} size="sm" />
        </IconButton>
      )
    }
  },
  {
    field: 'export_csv',
    headerName: 'Exportar CSV',
    sortable: false,
    editable: false,
    width: 150,
    renderCell: (data) => {

      const { enqueueSnackbar } = useSnackbar();

      const flight_plan_timestamp = data.row.files[0].split("/")[1];

      function handleDownloadFlightPlanAsCSV(flight_plan_csv_path, flight_plan_timestamp) {
        axios.get(`/api/module/action/flight-plans/download-csv?path=${flight_plan_csv_path}`)
          .then(function (response) {

            const file_path_csv = generateFlightPlanPathCSV(response.data, flight_plan_timestamp);
            const csvURL = URL.createObjectURL(file_path_csv.blob);

            // Download
            const link = document.createElement('a');
            link.href = csvURL;
            link.download = `${flight_plan_timestamp}.csv`;
            document.body.appendChild(link);
            link.click();

          })
          .catch((error) => {
            console.log(error.message)
            enqueueSnackbar("A exportação do plano de voo falhou!", { variant: "error" });
          });
      }

      return (
        <IconButton onClick={() => handleDownloadFlightPlanAsCSV(data.row.csv_path, flight_plan_timestamp)}>
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
];

export function FlightPlans() {

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

  const is_authorized_to_write = !!user.user_powers["2"].profile_powers.write;
  const is_authorized_to_read = !!user.user_powers["2"].profile_powers.read;

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

  function fetchRecords() {
    axios.get(`api/module/flight-plans?limit=${perPage}&search=${search}&page=${currentPage}`)
      .then(function (response) {
        setRecords(response.data.records);
        setTotalRecords(response.data.total_records);
        enqueueSnackbar(`Planos de voo encontrados: ${response.data.total_records}`, { variant: "success" });
      })
      .catch(function (error) {
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
            <Tooltip title="Novo Plano">
              <Link href={`${window.location.origin}/map`} target="_blank">
                <IconButton>
                  <FontAwesomeIcon icon={faPlus} color={is_authorized_to_write ? "#00713A" : "#E0E0E0"} size="sm" />
                </IconButton>
              </Link>
            </Tooltip>
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
            <UpdateFlightPlan record={selectedRecords[0]} reloadTable={setReload} />
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
            <DeleteFlightPlan records={selectedRecords} reloadTable={setReload} />
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
            <ExportTableData type="PLANOS DE VOO" source={"/api/module/flight-plans/table-export"} />
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
    </>
  );
}