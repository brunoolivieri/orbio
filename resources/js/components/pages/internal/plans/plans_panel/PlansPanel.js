// React
import * as React from 'react';
// Custom
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import AxiosApi from "../../../../../services/AxiosApi";
import { UpdatePlanFormulary } from "../../../../structures/modules/plans/UpdatePlanFormulary";
import { DeletePlanFormulary } from "../../../../structures/modules/plans/DeletePlanFormulary";
import { BackdropLoading } from '../../../../structures/backdrop_loading/BackdropLoading';
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
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

  const [records, setRecords] = React.useState([]);

  const [pagination, setPagination] = React.useState({ total_records: 0, records_per_page: 0, total_pages: 0 });

  const [paginationParams, setPaginationParams] = React.useState({ page: 1, limit: 10, where: 0, total_records: 0 });

  const [loading, setLoading] = React.useState(true);

  // State do registro selecionado
  // Quando um registro é selecionado, seu índice é salvo nesse state
  // Os modais de update e delete são renderizados e recebem panelData.response.records[selectedRecordIndex]
  const [selectedRecordIndex, setSelectedRecordIndex] = React.useState(null);

  const [searchField, serSearchField] = React.useState("");

  const { enqueueSnackbar } = useSnackbar();

  // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

  React.useEffect(() => {

    if (!paginationParams.where) {

      requestToGetAllFlightPlans();

    } else {

      requestToGetSearchedFlightPlans();

    }

  }, [paginationParams]);

  const requestToGetAllFlightPlans = (() => {

    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

    AxiosApi.get(`/api/plans-module?args=${select_query_params}`)
      .then(function (response) {

        setLoading(false);
        setRecords(response.data.records);
        setPagination({ total_records: response.data.total_records_founded, records_per_page: response.data.records_per_page, total_pages: response.data.total_pages });

        if (response.data.total_records_founded > 1) {
          handleOpenSnackbar(`Foram encontrados ${response.data.total_records_founded} planos de voo`, "success");
        } else {
          handleOpenSnackbar(`Foi encontrado ${response.data.total_records_founded} plano de voo`, "success");
        }

      })
      .catch(function (error) {

        const error_message = error.response.data.message ? error.response.data.message : "Erro do servidor";
        handleOpenSnackbar(error_message, "error");

        setLoading(false);
        setRecords([]);
        setPagination({ total_records: 0, records_per_page: 0, total_pages: 0 });

      });


  });

  const requestToGetSearchedFlightPlans = (() => {

    const select_query_params = `${paginationParams.limit}.${paginationParams.where}.${paginationParams.page}`;

    AxiosApi.get(`/api/plans-module/show?args=${select_query_params}`)
      .then(function (response) {

        setLoading(false);
        setRecords(response.data.records);
        setPagination({ total_records: response.data.total_records_founded, records_per_page: response.data.records_per_page, total_pages: response.data.total_pages });

        if (response.data.total_records_founded > 1) {
          handleOpenSnackbar(`Foram encontrados ${response.data.total_records_founded} planos de voo`, "success");
        } else {
          handleOpenSnackbar(`Foi encontrado ${response.data.total_records_founded} plano de voo`, "success");
        }

      })
      .catch(function (error) {

        const error_message = error.response.data.message ? error.response.data.message : "Erro do servidor";
        handleOpenSnackbar(error_message, "error");

        setLoading(false);
        setRecords([]);
        setPagination({ total_records: 0, records_per_page: 0, total_pages: 0 });

      });

  });

  const handleTablePageChange = (_event, value) => {

    setPaginationParams({
      page: value + 1,
      limit: paginationParams.limit,
      where: paginationParams.where
    });

  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    setPaginationParams({
      page: 1,
      limit: paginationParams.limit,
      where: searchField
    });

  }

  const reloadTable = () => {

    setSelectedRecordIndex(null);

    setLoading(false);
    setRecords([]);
    setPagination({ total_records: 0, records_per_page: 0, total_pages: 0 });

    setPaginationParams({
      page: 1,
      limit: paginationParams.limit,
      where: 0
    });

  }

  const handleClickRadio = (event) => {

    if (event.target.value === selectedRecordIndex) {
      setSelectedRecordIndex(null);
    } else if (event.target.value != selectedRecordIndex) {
      setSelectedRecordIndex(event.target.value);
    }

  }

  const handleChangeRowsPerPage = (event) => {

    setPaginationParams({
      page: 1,
      limit: event.target.value,
      where: paginationParams.where
    });

  }

  const handleDownloadFlightPlan = ((filename) => {

    const module_middleware = `${AuthData.data.id}.${2}.${"read"}`;

    AxiosApi.get(`/api/plans-module-download/${filename}?auth=${module_middleware}`, null, {
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

  const handleOpenSnackbar = (text, variant) => {

    enqueueSnackbar(text, { variant });

  }

  // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //


  return (
    <>
      {loading && <BackdropLoading />}
      <Grid container spacing={1} alignItems="center" mb={1}>
        <Grid item>
          <Tooltip title="Novo Plano">
            <Link href={`/internal/map?userid=${AuthData.data.id}`} target="_blank">
              <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.read == 1 ? false : true}>
                <FontAwesomeIcon icon={faPlus} color={AuthData.data.user_powers["2"].profile_powers.read == 1 ? "#00713A" : "#808991"} size="sm" />
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
          {(!loading && records.length > 0 && selectedRecordIndex != null) &&
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
          {(!loading && records.length > 0 && selectedRecordIndex != null) &&
            <DeletePlanFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
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
                page={paginationParams.page - 1}
                onPageChange={handleTablePageChange}
                rowsPerPage={paginationParams.limit}
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
                    <TableRow key={row.plan_id} >
                      <TableCell><FormControlLabel value={index} control={<Radio onClick={(event) => { handleClickRadio(event) }} />} label={row.id} /></TableCell>
                      <TableCell align="center">{row.coordinates.split(".")[0]}</TableCell>
                      <TableCell align="center">
                        <Link href={`/internal/map?file=${row.coordinates}`} target="_blank">
                          <Tooltip title="Ver plano">
                            <IconButton disabled={AuthData.data.user_powers["2"].profile_powers.read == 1 ? false : true}>
                              <FontAwesomeIcon icon={faEye} color={AuthData.data.user_powers["2"].profile_powers.read == 1 ? "#00713A" : "#808991"} size="sm" />
                            </IconButton>
                          </Tooltip>
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Baixar plano">
                          <IconButton onClick={() => handleDownloadFlightPlan(row.coordinates)} disabled={AuthData.data.user_powers["2"].profile_powers.read == 1 ? false : true}>
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
                      <TableCell align="center">{row.status === 1 ? <Chip label={"Ativo"} color={"success"} variant="outlined" /> : <Chip label={"Inativo"} color={"error"} variant="outlined" />}</TableCell>
                      <TableCell align="center">{row.incident_id == null ? "Sem dados" : row.incident_id}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </RadioGroup>
      </FormControl>
    </>
  );
}