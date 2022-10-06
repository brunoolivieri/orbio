// React
import * as React from 'react';
// Custom
import AxiosApi from "../../../../../services/AxiosApi";
import { CreateReportFormulary } from "../../../../structures/modules/reports/CreateReportFormulary";
import { UpdateReportFormulary } from "../../../../structures/modules/reports/UpdateReportFormulary";
import { DeleteReportFormulary } from "../../../../structures/modules/reports/DeleteReportFormulary";
import { GenerateReportFormulary } from "../../../../structures/modules/reports/GenerateReportFormulary";
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import LinearProgress from '@mui/material/LinearProgress';
// Material UI
import { Table } from "@mui/material";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TablePagination from '@mui/material/TablePagination';
import { InputAdornment } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import { Link } from "@mui/material";
import { useSnackbar } from 'notistack';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
// Lib
import moment from 'moment';

const StyledHeadTableCell = styled(TableCell)({
  color: '#fff',
  fontWeight: 700
});

export function ReportsPanel() {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();

  const [records, setRecords] = React.useState([]);
  const [pagination, setPagination] = React.useState({ total_records: 0, records_per_page: 0, total_pages: 0 });
  const [paginationConfig, setPaginationConfig] = React.useState({ page: 1, limit: 10, order_by: "id", search: 0, total_records: 0, filter: 0 });
  const [loading, setLoading] = React.useState(true);
  const [selectedRecordIndex, setSelectedRecordIndex] = React.useState(null);
  const [searchField, setSearchField] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Context do snackbar
  const { enqueueSnackbar } = useSnackbar();

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  React.useEffect(() => {
    serverLoadRecords();
  }, [paginationConfig]);

  function serverLoadRecords() {

    const limit = paginationConfig.limit;
    const search = paginationConfig.search;
    const page = paginationConfig.page;
    const order_by = paginationConfig.order_by;
    const filter = paginationConfig.filter;

    AxiosApi.get(`/api/reports-module?limit=${limit}&search=${search}&page=${page}&order_by=${order_by}&filter=${filter}`)
      .then(function (response) {

        setLoading(false);
        setRecords(response.data.records);
        setPagination({ total_records: response.data.total_records, records_per_page: response.data.records_per_page, total_pages: response.data.total_pages });

        if (response.data.total_records > 1) {
          handleOpenSnackbar(`Foram encontrados ${response.data.total_records} logs`, "success");
        } else {
          handleOpenSnackbar(`Foi encontrado ${response.data.total_records} log`, "success");
        }

      })
      .catch(function (error) {

        const error_message = error.response.data.message ? error.response.data.message : "Erro do servidor";
        handleOpenSnackbar(error_message, "error");

        setLoading(false);
        setRecords([]);
        setPagination({ total_records: 0, records_per_page: 0, total_pages: 0 });

      });

  }

  const handleDownloadReport = () => {
    //console.log('download');
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

  const handleChangeRowsPerPage = (event) => {

    setPaginationConfig({
      page: 1,
      limit: event.target.value,
      order_by: "id",
      search: paginationConfig.search,
      total_records: 0,
      filter: 0
    });

  };

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

  const reloadTable = () => {

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

  const handleClickRadio = (event) => {

    const value = event.target.value;

    if (value === selectedRecordIndex) {
      setSelectedRecordIndex(null);
    } else if (value != selectedRecordIndex) {
      setSelectedRecordIndex(event.target.value);
    }

  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleOpenSnackbar = (text, variant) => {
    enqueueSnackbar(text, { variant });
  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

  return (
    <>
      <Grid container spacing={1} alignItems="center" mb={1}>

        <Grid item>
          <CreateReportFormulary reload_table={reloadTable} />
        </Grid>

        <Grid item>
          {selectedRecordIndex === null &&
            <Tooltip title="Selecione um registro para editar">
              <IconButton disabled={AuthData.data.user_powers["4"].profile_powers.write == 1 ? false : true}>
                <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["4"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {(!loading && selectedRecordIndex != null) &&
            <UpdateReportFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          {selectedRecordIndex === null &&
            <Tooltip title="Selecione um registro para excluir">
              <IconButton disabled={AuthData.data.user_powers["4"].profile_powers.write == 1 ? false : true} >
                <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["4"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {/* O modal é renderizado apenas quando um registro já foi selecionado */}
          {(!loading && selectedRecordIndex != null) &&
            <DeleteReportFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
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
              <FontAwesomeIcon icon={faFilter} color={AuthData.data.user_powers["1"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
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
          <Tooltip title="Carregar">
            <IconButton onClick={reloadTable}>
              <FontAwesomeIcon icon={faArrowsRotate} size="sm" id="reload_icon" color='#007937' />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item xs>
          <TextField
            fullWidth
            placeholder={"Pesquisar plano por ID"}
            onChange={(e) => setSearchField(e.currentTarget.value)}
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <IconButton onClick={handleSearchSubmit}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" />
                  </IconButton>
                </InputAdornment>,
              disableunderline: 1,
              sx: { fontSize: 'default' },
              disableUnderline: true
            }}
            variant="standard"
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
                  <StyledHeadTableCell align="center">Log</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Plano de voo</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Relatório</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Data do log</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Observação</StyledHeadTableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tbody">
                {(!loading && records.length > 0) &&
                  records.map((log, index) => (
                    <TableRow key={log.id}>
                      <TableCell><FormControlLabel value={index} control={<Radio onClick={(e) => { handleClickRadio(e) }} />} label={log.id} /></TableCell>
                      <TableCell align="center">{log.log.name}</TableCell>
                      <TableCell align="center">
                        {log.flight_plan != null ?
                          <Link href={`/internal/map?file=${log.flight_plan.path}`} target="_blank">
                            <Tooltip title="Ver plano">
                              <IconButton disabled={!AuthData.data.user_powers["2"].profile_powers.read == 1}>
                                <FontAwesomeIcon icon={faEye} color={AuthData.data.user_powers["2"].profile_powers.read == 1 ? "#00713A" : "#808991"} size="sm" />
                              </IconButton>
                            </Tooltip>
                          </Link>
                          :
                          <Tooltip title={"Um plano de voo é necessário"}>
                            <IconButton disabled={!AuthData.data.user_powers["2"].profile_powers.read == 1}>
                              <FontAwesomeIcon icon={faEye} color={"#808991"} size="sm" />
                            </IconButton>
                          </Tooltip>
                        }
                      </TableCell>
                      <TableCell align="center">
                        {
                          log.flight_plan != null ?
                            (log.path != null ?
                              <Tooltip title={"Exportar relatório"}>
                                <IconButton onClick={() => handleDownloadReport()}>
                                  <FontAwesomeIcon icon={faFilePdf} size="sm" color={"#007937"} />
                                </IconButton>
                              </Tooltip>
                              :
                              <GenerateReportFormulary record={log} />
                            )
                            :
                            <Tooltip title={"Um plano de voo é necessário"}>
                              <IconButton>
                                <FontAwesomeIcon icon={faFileCirclePlus} size="sm" color={"#808991"} />
                              </IconButton>
                            </Tooltip>
                        }
                      </TableCell>
                      <TableCell align="center">{moment(log.log.datetime).format('DD-MM-YYYY hh:mm')}</TableCell>
                      <TableCell align="center">{log.observation}</TableCell>
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