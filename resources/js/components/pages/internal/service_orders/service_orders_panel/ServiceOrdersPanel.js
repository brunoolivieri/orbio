// React
import * as React from 'react';
// MaterialUI
import { Table, TableBody, TableCell, TableContainer, Badge, TableHead, Tooltip, IconButton, Grid, Chip, TextField, styled, TableRow, Paper, Stack, InputAdornment, Radio, RadioGroup, FormControlLabel, FormControl, TablePagination, Menu, MenuItem, Checkbox } from "@mui/material";
import { useSnackbar } from 'notistack';
import ErrorIcon from '@mui/icons-material/Error';
import MapIcon from '@mui/icons-material/Map';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
// Custom
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { CreateOrderFormulary } from "../../../../structures/modules/service_orders/CreateOrderFormulary";
import { UpdateOrderFormulary } from "../../../../structures/modules/service_orders/UpdateOrderFormulary";
import { DeleteOrderFormulary } from "../../../../structures/modules/service_orders/DeleteOrderFormulary";
import LinearProgress from '@mui/material/LinearProgress';
// Libs
import moment from 'moment';

const StyledHeadTableCell = styled(TableCell)({
  color: '#fff',
  fontWeight: 700
});

const initialPagination = { total_records: 0, records_per_page: 0, total_pages: 0 };
const initialPaginationConfig = { page: 1, limit: 10, order_by: "id", search: 0, total_records: 0, filter: 0 };

export const ServiceOrdersPanel = () => {

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

    AxiosApi.get(`/api/orders-module?limit=${limit}&search=${search}&page=${page}&order_by=${order_by}&filter=${filter}`)
      .then(function (response) {
        setLoading(false);
        setRecords(response.data.records);
        setPagination({ total_records: response.data.total_records, records_per_page: response.data.records_per_page, total_pages: response.data.total_pages });

        if (response.data.total_records > 1) {
          handleOpenSnackbar(`Foram encontrados ${response.data.total_records} ordem de serviço`, "success");
        } else {
          handleOpenSnackbar(`Foi encontrado ${response.data.total_records} ordens de serviço`, "success");
        }
      })
      .catch(function (error) {
        handleOpenSnackbar(error.response.data.message, "error");
        setLoading(false);
        setRecords([]);
        setPagination({ total_records: 0, records_per_page: 0, total_pages: 0 });
      });
  }

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

  function handleClickRadio(event) {
    if (event.target.value === selectedRecordIndex) {
      setSelectedRecordIndex(null);
    } else if (event.target.value != selectedRecordIndex) {
      setSelectedRecordIndex(event.target.value);
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
            <IconButton disabled={AuthData.data.user_powers["3"].profile_powers.write == 1 ? false : true}>
              <FontAwesomeIcon icon={faPlus} color={"#E0E0E0"} size="sm" />
            </IconButton>
          }

          {selectedRecordIndex === null &&
            <CreateOrderFormulary reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro">
              <IconButton disabled={AuthData.data.user_powers["3"].profile_powers.write == 1 ? false : true}>
                <FontAwesomeIcon icon={faPen} color={"#E0E0E0"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {(!loading && selectedRecordIndex != null) &&
            <UpdateOrderFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro">
              <IconButton disabled={AuthData.data.user_powers["3"].profile_powers.write == 1 ? false : true} >
                <FontAwesomeIcon icon={faTrashCan} color={"#E0E0E0"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {(!loading && selectedRecordIndex != null) &&
            <DeleteOrderFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          <IconButton disabled={AuthData.data.user_powers["3"].profile_powers.write == 1 ? false : true} >
            <FontAwesomeIcon icon={faCircleInfo} color={selectedRecordIndex ? "#007937" : "#E0E0E0"} size="sm" />
          </IconButton>
        </Grid>

        <Grid item>
          <Tooltip title="Filtros">
            <IconButton
              disabled={AuthData.data.user_powers["3"].profile_powers.write == 1 ? false : true}
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <FontAwesomeIcon icon={faFilter} color={AuthData.data.user_powers["3"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
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
          <MenuItem ><Checkbox /> Deletados </MenuItem>
        </Menu>

        <Grid item>
          <Tooltip title="Exportar dados">
            <IconButton disabled={AuthData.data.user_powers["3"].profile_powers.write == 1 ? false : true}
            >
              <FontAwesomeIcon icon={faFileCsv} color={AuthData.data.user_powers["3"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
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
            placeholder={"Pesquisar ordem por ID"}
            onChange={(e) => setSearchField(e.currentTarget.value)}
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <IconButton onClick={handleSearchSubmit}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" />
                  </IconButton>
                </InputAdornment>,
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
                  <StyledHeadTableCell align="center">Status</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Número</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Criador</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Piloto</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Cliente</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Descrição</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Duração (dias)</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Planos de Voo</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Incidentes</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Relatório</StyledHeadTableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tbody">
                {(!loading && records.length > 0) &&
                  records.map((service_order, index) => (
                    <TableRow key={service_order.id}>
                      <TableCell><FormControlLabel value={index} control={<Radio onClick={(event) => { handleClickRadio(event) }} />} label={service_order.id} /></TableCell>
                      <TableCell align="center">{service_order.status == 1 ? <Chip label={"Ativo"} color={"success"} variant="outlined" /> : <Chip label={"Inativo"} color={"error"} variant="outlined" />}</TableCell>
                      <TableCell align="center">{service_order.number}</TableCell>
                      <TableCell align="center">
                        {service_order.users.creator.deleted === 1 ? <Chip label={"Desabilitado"} color={"error"} variant="outlined" /> : <Chip label={service_order.users.creator.name} color={"success"} variant="outlined" />}
                      </TableCell>
                      <TableCell align="center">
                        {service_order.users.pilot.deleted === 1 ? <Chip label={"Desabilitado"} color={"error"} variant="outlined" /> : <Chip label={service_order.users.pilot.name} color={"success"} variant="outlined" />}
                      </TableCell>
                      <TableCell align="center">
                        {service_order.users.client.deleted === 1 ? <Chip label={"Desabilitado"} color={"error"} variant="outlined" /> : <Chip label={service_order.users.client.name} color={"success"} variant="outlined" />}
                      </TableCell>
                      <TableCell align="center">{service_order.observation}</TableCell>
                      <TableCell align="center">{moment(service_order.end_date).diff(moment(service_order.start_date), 'days')}</TableCell>
                      <TableCell align="center">
                        {service_order.flight_plans.length === 0 ?
                          <MapIcon color="disabled" />
                          :
                          <Badge badgeContent={service_order.flight_plans.length} color="success">
                            <MapIcon color="action" />
                          </Badge>
                        }
                      </TableCell>
                      <TableCell align="center">
                        {service_order.total_incidents === 0 ?
                          <ErrorIcon color="disabled" />
                          :
                          <Badge badgeContent={service_order.total_incidents} color="success">
                            <ErrorIcon color="action" />
                          </Badge>
                        }
                      </TableCell>
                      <TableCell align="center">
                        {service_order.report != null ?
                          <Tooltip title="Ver relatório">
                            <IconButton>
                              <FontAwesomeIcon icon={faFilePdf} color={service_order.report ? "#00713A" : "#E0E0E0"} />
                            </IconButton>
                          </Tooltip>
                          :
                          <IconButton disabled>
                            <FontAwesomeIcon icon={faFilePdf} color="#E0E0E0" />
                          </IconButton>
                        }
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