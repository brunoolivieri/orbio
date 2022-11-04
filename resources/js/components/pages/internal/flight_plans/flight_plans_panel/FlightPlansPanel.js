// React
import * as React from 'react';
// Material UI
import { Table, Link, Badge, TableBody, TableCell, TableContainer, TableHead, Tooltip, IconButton, Grid, TextField, styled, TableRow, Paper, Stack, InputAdornment, Radio, RadioGroup, FormControlLabel, FormControl, TablePagination, Menu, MenuItem, Checkbox } from "@mui/material";
import { useSnackbar } from 'notistack';
import ErrorIcon from '@mui/icons-material/Error';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
// Custom
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import axios from "../../../../../services/AxiosApi";
import { UpdatePlanFormulary } from "../../../../structures/modules/flight_plans/UpdatePlanFormulary";
import { DeletePlanFormulary } from "../../../../structures/modules/flight_plans/DeletePlanFormulary";
import LinearProgress from '@mui/material/LinearProgress';
// Outros
import moment from 'moment';

const StyledHeadTableCell = styled(TableCell)({
  color: '#fff',
  fontWeight: 700
});

const initialPagination = { total_records: 0, records_per_page: 0, total_pages: 0 };
const initialPaginationConfig = { page: 1, limit: 10, order_by: "id", search: 0, total_records: 0, filter: 0 };

export const FlightPlansPanel = () => {

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
    const limit = paginationConfig.limit;
    const search = paginationConfig.search;
    const page = paginationConfig.page;
    const order_by = paginationConfig.order_by;
    const filter = paginationConfig.filter;

    axios.get(`/api/plans-module?limit=${limit}&search=${search}&page=${page}&order_by=${order_by}&filter=${filter}`)
      .then(function (response) {
        setLoading(false);
        setRecords(response.data.records);
        setPagination({ total_records: response.data.total_records, records_per_page: response.data.records_per_page, total_pages: response.data.total_pages });

        if (response.data.total_records > 1) {
          handleOpenSnackbar(`Foram encontrados ${response.data.total_records} planos de voo`, "success");
        } else {
          handleOpenSnackbar(`Foi encontrado ${response.data.total_records} plano de voo`, "success");
        }
      })
      .catch(function (error) {
        handleOpenSnackbar(error.response.data.message, "error");
        setLoading(false);
        setRecords([]);
        setPagination({ total_records: 0, records_per_page: 0, total_pages: 0 });
      });
  }, [paginationConfig]);

  function handleTablePageChange(event, value) {
    setPaginationConfig({
      page: value + 1,
      limit: paginationConfig.limit,
      order_by: "id",
      search: paginationConfig.search,
      total_records: 0,
      filter: 0
    });
  }

  function handleChangeRowsPerPage(event) {
    setPaginationConfig({
      page: 1,
      limit: event.target.value,
      order_by: "id",
      search: paginationConfig.search,
      total_records: 0,
      filter: 0
    });
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
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
    setPagination(initialPagination);

    setPaginationConfig({
      page: 1,
      limit: paginationConfig.limit,
      order_by: "id",
      search: 0,
      total_records: 0,
      filter: 0
    });
  }

  function handleClickRadio(event) {
    if (event.target.value === selectedRecordIndex) {
      setSelectedRecordIndex(null);
    } else if (event.target.value != selectedRecordIndex) {
      setSelectedRecordIndex(event.target.value);
    }
  }

  function handleDownloadFlightPlan(filename) {
    axios.get(`/api/plans-module-download/${filename}`, null, {
      responseType: 'blob'
    })
      .then(function (response) {
        handleOpenSnackbar(`Download realizado com sucesso! Arquivo: ${filename}`, "success");

        // Download forçado do arquivo com o conteúdo retornado do servidor
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}`); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch(function () {
        handleOpenSnackbar(`O download não foi realizado! Arquivo: ${filename}`, "error");
      });
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
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
            <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.write == 1 ? false : true}>
              <FontAwesomeIcon icon={faPlus} color={"#E0E0E0"} size="sm" />
            </IconButton>
          }

          {selectedRecordIndex === null &&
            <Tooltip title="Novo Plano">
              <Link href={`/internal/map?userid=${AuthData.data.id}`} target="_blank">
                <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.write == 1 ? false : true}>
                  <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["2"].profile_powers.write == 1 ? "#00713A" : "#E0E0E0"} size="sm" />
                </IconButton>
              </Link>
            </Tooltip>
          }
        </Grid>

        <Grid item>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro">
              <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.write == 1 ? false : true}>
                <FontAwesomeIcon icon={faPen} color={"#E0E0E0"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {/* O modal é renderizado apenas quando um registro já foi selecionado */}
          {(!loading && selectedRecordIndex != null) &&
            <UpdatePlanFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro">
              <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.write == 1 ? false : true} >
                <FontAwesomeIcon icon={faTrashCan} color={"#E0E0E0"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {/* O modal é renderizado apenas quando um registro já foi selecionado */}
          {(!loading && selectedRecordIndex != null) &&
            <DeletePlanFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.write == 1 ? false : true} >
            <FontAwesomeIcon icon={faCircleInfo} color={selectedRecordIndex ? "#007937" : "#E0E0E0"} size="sm" />
          </IconButton>
        </Grid>

        <Grid item>
          <Tooltip title="Filtros">
            <IconButton
              disabled={AuthData.data.user_powers["2"].profile_powers.write == 1 ? false : true}
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <FontAwesomeIcon icon={faFilter} color={AuthData.data.user_powers["2"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
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
          <MenuItem ><Checkbox /> Desabilitados </MenuItem>
        </Menu>

        <Grid item>
          <Tooltip title="Exportar dados">
            <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.write == 1 ? false : true}
            >
              <FontAwesomeIcon icon={faFileCsv} color={AuthData.data.user_powers["2"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
            </IconButton>
          </Tooltip>
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
            placeholder={"Pesquisar plano por id e nome"}
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

        {(!loading && records.length > 0) &&
          <Grid item>
            <Stack spacing={2}>
              <TablePagination
                labelRowsPerPage="Linhas por página: "
                component="div"
                count={pagination.total_records}
                page={paginationConfig.page - 1}
                onPageChange={handleTablePageChange}
                rowsPerPage={paginationConfig.limit}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Stack>
          </Grid>
        }

      </Grid>

      <FormControl fullWidth>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          value={selectedRecordIndex}
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledHeadTableCell>ID</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Nome</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Descrição</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Criador</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Data criação</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Visualizar</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Ordens de serviço</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Logs</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Incidentes</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Exportar</StyledHeadTableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tbody">
                {(!loading && records.length > 0) &&
                  records.map((flight_plan, index) => (
                    <TableRow key={flight_plan.id} >
                      <TableCell><FormControlLabel value={index} control={<Radio onClick={(event) => { handleClickRadio(event) }} />} label={flight_plan.id} /></TableCell>
                      <TableCell align="center">{flight_plan.name}</TableCell>
                      <TableCell align="center">{flight_plan.description}</TableCell>
                      <TableCell align="center">{flight_plan.creator.name}</TableCell>
                      <TableCell align="center">{moment(flight_plan.created_at).format("DD/MM/YYYY")}</TableCell>
                      <TableCell align="center">
                        <Link href={`/internal/map?file=${flight_plan.file}`} target="_blank">
                          <Tooltip title="Ver plano">
                            <IconButton disabled={!AuthData.data.user_powers["2"].profile_powers.read == 1}>
                              <FontAwesomeIcon icon={faEye} color={AuthData.data.user_powers["2"].profile_powers.read == 1 ? "#00713A" : "#E0E0E0"} size="sm" />
                            </IconButton>
                          </Tooltip>
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        {flight_plan.service_orders.length === 0 ?
                          <AssignmentIcon color="disabled" />
                          :
                          <Badge badgeContent={flight_plan.service_orders.length} color="success">
                            <AssignmentIcon color="action" />
                          </Badge>
                        }
                      </TableCell>
                      <TableCell align="center">
                        {flight_plan.total_logs === 0 ?
                          <InsertDriveFileIcon color="disabled" />
                          :
                          <Badge badgeContent={flight_plan.total_logs} color="success">
                            <InsertDriveFileIcon color="action" />
                          </Badge>
                        }
                      </TableCell>
                      <TableCell align="center">
                        {flight_plan.total_incidents === 0 ?
                          <ErrorIcon color="disabled" />
                          :
                          <Badge badgeContent={flight_plan.total_incidents} color="success">
                            <ErrorIcon color="action" />
                          </Badge>
                        }
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Download">
                          <IconButton onClick={() => handleDownloadFlightPlan(flight_plan.file)} disabled={!AuthData.data.user_powers["2"].profile_powers.read == 1}>
                            <FontAwesomeIcon icon={faFileArrowDown} size="sm" color={AuthData.data.user_powers["2"].profile_powers.read == 1 ? "#007937" : "#E0E0E0"} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </RadioGroup>
      </FormControl>
      {loading && <LinearProgress color="success" />}
    </>
  );
}