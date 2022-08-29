// React
import * as React from 'react';
// Custom
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { UpdatePlanFormulary } from "../../../../structures/modules/plans/UpdatePlanFormulary";
import { DeletePlanFormulary } from "../../../../structures/modules/plans/DeletePlanFormulary";
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
import Chip from '@mui/material/Chip';
import { Link } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TablePagination from '@mui/material/TablePagination';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
// Outros
import { useSnackbar } from 'notistack';

const StyledHeadTableCell = styled(TableCell)({
  color: '#fff',
  fontWeight: 700
});


export function PlansPanel() {

  // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

  const { AuthData } = useAuthentication();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const [records, setRecords] = React.useState([]);

  const [pagination, setPagination] = React.useState({ total_records: 0, records_per_page: 0, total_pages: 0 });

  const [paginationConfig, setPaginationConfig] = React.useState({ page: 1, limit: 10, order_by: "id", search: 0, total_records: 0, filter: 0 });

  const [loading, setLoading] = React.useState(true);

  // When a record is selected, its index is saved in this state
  // The index is used for retrieve the correspondent record in records state
  const [selectedRecordIndex, setSelectedRecordIndex] = React.useState(null);

  const [searchField, serSearchField] = React.useState("");

  const { enqueueSnackbar } = useSnackbar();

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  React.useEffect(() => {
    serverLoadRecords();
  }, [paginationConfig]);

  const serverLoadRecords = () => {

    const limit = paginationConfig.limit;
    const search = paginationConfig.search;
    const page = paginationConfig.page;
    const order_by = paginationConfig.order_by;
    const filter = paginationConfig.filter;

    AxiosApi.get(`/api/plans-module?limit=${limit}&search=${search}&page=${page}&order_by=${order_by}&filter=${filter}`)
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

        const error_message = error.response.data.message ? error.response.data.message : "Erro do servidor";
        handleOpenSnackbar(error_message, "error");

        setLoading(false);
        setRecords([]);
        setPagination({ total_records: 0, records_per_page: 0, total_pages: 0 });

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

  const handleClickRadio = (event) => {

    if (event.target.value === selectedRecordIndex) {
      setSelectedRecordIndex(null);
    } else if (event.target.value != selectedRecordIndex) {
      setSelectedRecordIndex(event.target.value);
    }

  }

  const handleDownloadFlightPlan = ((filename) => {

    AxiosApi.get(`/api/plans-module-download/${filename}?`, null, {
      responseType: 'blob'
    })
      .then(function (response) {

        if (response.status === 200) {

          handleOpenSnackbar(`Download realizado com sucesso! Arquivo: ${filename}`, "success");

          // Download forçado do arquivo com o conteúdo retornado do servidor
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${filename}`); //or any other extension
          document.body.appendChild(link);
          link.click();

        }

      })
      .catch(function () {

        handleOpenSnackbar(`O download não foi realizado! Arquivo: ${filename}`, "error");

      });

  });

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
          <Tooltip title="Novo Plano">
            <Link href={`/internal/map?userid=${AuthData.data.id}`} target="_blank">
              <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.write == 1 ? false : true}>
                <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["2"].profile_powers.write == 1 ? "#00713A" : "#808991"} size="sm" />
              </IconButton>
            </Link>
          </Tooltip>
        </Grid>

        <Grid item>
          {selectedRecordIndex == null &&
            <Tooltip title="Selecione um registro para editar">
              <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.write == 1 ? false : true}>
                <FontAwesomeIcon icon={faPen} color={AuthData.data.user_powers["2"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
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
            <Tooltip title="Selecione um registro para excluir">
              <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.write == 1 ? false : true} >
                <FontAwesomeIcon icon={faTrashCan} color={AuthData.data.user_powers["2"].profile_powers.write == 1 ? "#007937" : "#808991"} size="sm" />
              </IconButton>
            </Tooltip>
          }

          {/* O modal é renderizado apenas quando um registro já foi selecionado */}
          {(!loading && selectedRecordIndex != null) &&
            <DeletePlanFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
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
          <MenuItem ><Checkbox /> Inativos </MenuItem>
          <MenuItem ><Checkbox /> Deletados </MenuItem>
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
            onChange={(e) => serSearchField(e.currentTarget.value)}
            InputProps={{
              startAdornment:
                <InputAdornment position="start">
                  <IconButton onClick={handleSearchSubmit}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" />
                  </IconButton>
                </InputAdornment>,
              disableunderline: 1,
              sx: { fontSize: 'default' },
            }}
            variant="outlined"
            id="search_input"
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
                  <StyledHeadTableCell align="center">Abrir</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Arquivo</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Relatório</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Status</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Incidente</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Descrição</StyledHeadTableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tbody">
                {(!loading && records.length > 0) &&
                  records.map((row, index) => (
                    <TableRow key={row.id} >
                      <TableCell><FormControlLabel value={index} control={<Radio onClick={(event) => { handleClickRadio(event) }} />} label={row.id} /></TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">
                        <Link href={`/internal/map?file=${row.coordinates_file}`} target="_blank">
                          <Tooltip title="Ver plano">
                            <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.read == 1 ? false : true}>
                              <FontAwesomeIcon icon={faEye} color={AuthData.data.user_powers["2"].profile_powers.read == 1 ? "#00713A" : "#808991"} size="sm" />
                            </IconButton>
                          </Tooltip>
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Baixar plano">
                          <IconButton onClick={() => handleDownloadFlightPlan(row.coordinates_file)} disabled={AuthData.data.user_powers["2"].profile_powers.read == 1 ? false : true}>
                            <FontAwesomeIcon icon={faFileArrowDown} size="sm" color={AuthData.data.user_powers["2"].profile_powers.read == 1 ? "#007937" : "#808991"} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        {row.report_id != null ?
                          <Tooltip title="Ver relatório">
                            <IconButton>
                              <FontAwesomeIcon icon={faFilePdf} color="#00713A" />
                            </IconButton>
                          </Tooltip>
                          :
                          <IconButton disabled>
                            <FontAwesomeIcon icon={faFilePdf} color="#808991" />
                          </IconButton>
                        }
                      </TableCell>
                      <TableCell align="center">{row.status == 1 ? <Chip label={"Ativo"} color={"success"} variant="outlined" /> : <Chip label={"Inativo"} color={"error"} variant="outlined" />}</TableCell>
                      <TableCell align="center">{row.incident_id == null ? "Sem dados" : row.incident_id}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
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