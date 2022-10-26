// React
import * as React from 'react';
// Material UI
import { Table, TableBody, TableCell, TableContainer, TableHead, Tooltip, IconButton, Grid, TextField, styled, TableRow, Paper, Stack, InputAdornment, Radio, RadioGroup, FormControlLabel, FormControl, TablePagination, Menu, MenuItem, Checkbox } from "@mui/material";
import { useSnackbar } from 'notistack';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
// Custom
import { useAuthentication } from "../../../../context/InternalRoutesAuth/AuthenticationContext";
import axios from "../../../../../services/AxiosApi";
import { CreateDroneFormulary } from '../../../../structures/modules/equipment/drones/CreateDroneFormulary';
import { DeleteDroneFormulary } from '../../../../structures/modules/equipment/drones/DeleteDroneFormulary';
import { UpdateDroneFormulary } from '../../../../structures/modules/equipment/drones/UpdateDroneFormulary';
import LinearProgress from '@mui/material/LinearProgress';

const StyledHeadTableCell = styled(TableCell)({
    color: '#fff',
    fontWeight: 700
});

const initialPagination = { total_records: 0, records_per_page: 0, total_pages: 0 };
const initialPaginationConfig = { page: 1, limit: 10, order_by: "id", search: 0, total_records: 0, filter: 0 };

export const DronesPanel = () => {

    // ============================================================================== STATES ============================================================================== //

    const { AuthData } = useAuthentication();
    const [records, setRecords] = React.useState([]);
    const [pagination, setPagination] = React.useState(initialPagination);
    const [paginationConfig, setPaginationConfig] = React.useState(initialPaginationConfig);
    const [loading, setLoading] = React.useState(true);
    const [searchField, setSearchField] = React.useState("");
    const [selectedRecordIndex, setSelectedRecordIndex] = React.useState(null);
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

        axios.get(`/api/equipments-module-drone?limit=${limit}&search=${search}&page=${page}&order_by=${order_by}&filter=${filter}`)
            .then(function (response) {
                setLoading(false);
                setRecords(response.data.records);
                setPagination({ total_records: response.data.total_records, records_per_page: response.data.records_per_page, total_pages: response.data.total_pages });

                if (response.data.total_records > 1) {
                    handleOpenSnackbar(`Foram encontrados ${response.data.total_records} drones`, "success");
                } else {
                    handleOpenSnackbar(`Foi encontrado ${response.data.total_records} drone`, "success");
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
                        <IconButton disabled={AuthData.data.user_powers["6"].profile_powers.write == 1 ? false : true}>
                            <FontAwesomeIcon icon={faPlus} color={"#E0E0E0"} size="sm" />
                        </IconButton>
                    }

                    {selectedRecordIndex === null &&
                        <CreateDroneFormulary reload_table={reloadTable} />
                    }
                </Grid>

                <Grid item>
                    {selectedRecordIndex == null &&
                        <Tooltip title="Selecione um registro">
                            <IconButton disabled={AuthData.data.user_powers["6"].profile_powers.write == 1 ? false : true}>
                                <FontAwesomeIcon icon={faPen} color={"#E0E0E0"} size="sm" />
                            </IconButton>
                        </Tooltip>
                    }

                    {/* O modal é renderizado apenas quando um registro já foi selecionado */}
                    {(!loading && selectedRecordIndex != null) &&
                        <UpdateDroneFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
                    }
                </Grid>

                <Grid item>
                    {selectedRecordIndex == null &&
                        <Tooltip title="Selecione um registro">
                            <IconButton disabled={AuthData.data.user_powers["6"].profile_powers.write == 1 ? false : true} >
                                <FontAwesomeIcon icon={faTrashCan} color={"#E0E0E0"} size="sm" />
                            </IconButton>
                        </Tooltip>
                    }

                    {/* O modal é renderizado apenas quando um registro já foi selecionado */}
                    {(!loading && selectedRecordIndex != null) &&
                        <DeleteDroneFormulary record={records[selectedRecordIndex]} record_setter={setSelectedRecordIndex} reload_table={reloadTable} />
                    }
                </Grid>

                <Grid item>
                    <IconButton disabled={AuthData.data.user_powers["6"].profile_powers.write == 1 ? false : true} >
                        <FontAwesomeIcon icon={faCircleInfo} color={"#E0E0E0"} size="sm" />
                    </IconButton>
                </Grid>

                <Grid item>
                    <Tooltip title="Filtros">
                        <IconButton
                            disabled={AuthData.data.user_powers["6"].profile_powers.write == 1 ? false : true}
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <FontAwesomeIcon icon={faFilter} color={AuthData.data.user_powers["6"].profile_powers.write == 1 ? "#007937" : "#E0E0E0"} size="sm" />
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
                        placeholder={"Pesquisar drone por ID e nome"}
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
                                    <StyledHeadTableCell align="center">Imagem</StyledHeadTableCell>
                                    <StyledHeadTableCell align="center">Nome</StyledHeadTableCell>
                                    <StyledHeadTableCell align="center">Fabricante</StyledHeadTableCell>
                                    <StyledHeadTableCell align="center">Modelo</StyledHeadTableCell>
                                    <StyledHeadTableCell align="center">Nº do Registro</StyledHeadTableCell>
                                    <StyledHeadTableCell align="center">Nº Serial</StyledHeadTableCell>
                                    <StyledHeadTableCell align="center">Peso (kg)</StyledHeadTableCell>
                                    <StyledHeadTableCell align="center">Descrição</StyledHeadTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="tbody">
                                {(!loading && records.length > 0) &&
                                    records.map((row, index) => (
                                        <TableRow key={row.id}>
                                            <TableCell><FormControlLabel value={index} control={<Radio onClick={(event) => { handleClickRadio(event) }} />} label={row.id} /></TableCell>
                                            <TableCell align="center"><img src={row.image_url} style={{ borderRadius: 10, width: '60px', height: '60px' }} /></TableCell>
                                            <TableCell align="center">{row.name}</TableCell>
                                            <TableCell align="center">{row.manufacturer}</TableCell>
                                            <TableCell align="center">{row.model}</TableCell>
                                            <TableCell align="center">{row.record_number}</TableCell>
                                            <TableCell align="center">{row.serial_number}</TableCell>
                                            <TableCell align="center">{row.weight}</TableCell>
                                            <TableCell align="center">{row.observation}</TableCell>
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