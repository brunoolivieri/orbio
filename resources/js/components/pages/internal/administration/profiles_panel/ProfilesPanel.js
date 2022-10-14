// React
import * as React from "react";
// Custom
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { CreateProfileFormulary } from "../../../../structures/modules/administration/profiles_administration/CreateProfileFormulary";
import { UpdateProfileFormulary } from "../../../../structures/modules/administration/profiles_administration/UpdateProfileFormulary";
import { DeleteProfileFormulary } from "../../../../structures/modules/administration/profiles_administration/DeleteProfileFormulary";
import LinearProgress from '@mui/material/LinearProgress';
// Material UI
import styled from "@emotion/styled";
import { Table } from "@mui/material";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { InputAdornment } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import { useSnackbar } from 'notistack';
import TablePagination from '@mui/material/TablePagination';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// Fontsawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const StyledHeadTableCell = styled(TableCell)({
  color: '#fff',
  fontWeight: 700
});

export function ProfilesPanel() {

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

  // context do snackbar
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

    AxiosApi.get(`/api/admin-module-profile?limit=${limit}&search=${search}&page=${page}&order_by=${order_by}&filter=${filter}`)
      .then(function (response) {

        setLoading(false);
        setRecords(response.data.records);
        setPagination({ total_records: response.data.total_records, records_per_page: response.data.records_per_page, total_pages: response.data.total_pages });

        if (response.data.total_records > 1) {
          handleOpenSnackbar(`Foram encontrados ${response.data.total_records} perfis`, "success");
        } else {
          handleOpenSnackbar(`Foi encontrado ${response.data.total_records} perfil`, "success");
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
    setPagination({ total_records: 0, records_per_page: 0, total_pages: 0 });

    setPaginationConfig({
      page: 1,
      limit: paginationConfig.limit,
      order_by: "id",
      search: 0,
      total_records: 0,
      filter: 0
    });

  }

  const handleChangeRowsPerPage = (event) => {

    setPaginationConfig({
      page: 1,
      limit: event.target.value,
      order_by: "id",
      search: paginationConfig.search,
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  }

  function handleOpenSnackbar(text, variant) {
    enqueueSnackbar(text, { variant });
  }


  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

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
            <CreateProfileFormulary reload_table={reloadTable} />
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
            <UpdateProfileFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
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
            <DeleteProfileFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
          }
        </Grid>

        <Grid item>
          <IconButton disabled={AuthData.data.user_powers["1"].profile_powers.write == 1 ? false : true} >
            <FontAwesomeIcon icon={faCircleInfo} color={"#E0E0E0"} size="sm" />
          </IconButton>
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
            placeholder={"Pesquisar perfil por ID"}
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

        {/* Geração da paginação */}
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
                  <StyledHeadTableCell align="center">Administração</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Planos de voo</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Ordens de serviço</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Relatórios</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Equipamentos</StyledHeadTableCell>
                  <StyledHeadTableCell align="center">Incidentes</StyledHeadTableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tbody">
                {(!loading && records.length > 0) &&
                  records.map((row, index) => (
                    <TableRow key={row.profile_id}>
                      <TableCell><FormControlLabel value={index} control={<Radio onClick={(e) => { handleClickRadio(e) }} />} label={row.profile_id} /></TableCell>
                      <TableCell align="center">{row.profile_name}</TableCell>
                      <TableCell>
                        <FormGroup>
                          <FormControlLabel control={<Checkbox defaultChecked={row.profile_modules_relationship["0"].read == 1 ? true : false} disabled size="small" />} label="Ler" />
                          <FormControlLabel control={<Checkbox defaultChecked={row.profile_modules_relationship["0"].write == 1 ? true : false} disabled size="small" />} label="Escrever" />
                        </FormGroup>
                      </TableCell>
                      <TableCell>
                        <FormGroup>
                          <FormControlLabel control={<Checkbox defaultChecked={row.profile_modules_relationship["1"].read == 1 ? true : false} disabled size="small" />} label="Ler" />
                          <FormControlLabel control={<Checkbox defaultChecked={row.profile_modules_relationship["1"].write == 1 ? true : false} disabled size="small" />} label="Escrever" />
                        </FormGroup>
                      </TableCell>
                      <TableCell align="center">
                        <FormGroup>
                          <FormControlLabel control={<Checkbox defaultChecked={row.profile_modules_relationship["2"].read == 1 ? true : false} disabled size="small" />} label="Ler" />
                          <FormControlLabel control={<Checkbox defaultChecked={row.profile_modules_relationship["2"].write == 1 ? true : false} disabled size="small" />} label="Escrever" />
                        </FormGroup>
                      </TableCell>
                      <TableCell align="center">
                        <FormGroup>
                          <FormControlLabel control={<Checkbox defaultChecked={row.profile_modules_relationship["3"].read == 1 ? true : false} disabled size="small" />} label="Ler" />
                          <FormControlLabel control={<Checkbox defaultChecked={row.profile_modules_relationship["3"].write == 1 ? true : false} disabled size="small" />} label="Escrever" />
                        </FormGroup>
                      </TableCell>
                      <TableCell align="center">
                        <FormGroup>
                          <FormControlLabel control={<Checkbox defaultChecked={row.profile_modules_relationship["5"].read == 1 ? true : false} disabled size="small" />} label="Ler" />
                          <FormControlLabel control={<Checkbox defaultChecked={row.profile_modules_relationship["5"].write == 1 ? true : false} disabled size="small" />} label="Escrever" />
                        </FormGroup>
                      </TableCell>
                      <TableCell align="center">
                        <FormGroup>
                          <FormControlLabel control={<Checkbox defaultChecked={row.profile_modules_relationship["4"].read == 1 ? true : false} disabled size="small" />} label="Ler" />
                          <FormControlLabel control={<Checkbox defaultChecked={row.profile_modules_relationship["4"].write == 1 ? true : false} disabled size="small" />} label="Escrever" />
                        </FormGroup>
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
  )
}