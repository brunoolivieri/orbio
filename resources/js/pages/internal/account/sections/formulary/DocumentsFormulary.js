import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { useSnackbar } from 'notistack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import axios from '../../../../../services/AxiosApi'

const initialFormData = {}
const resetFieldError = { error: false, message: "" }
const initialFormError = {}

const formConfig = {
    cpf: { label: "CPF", validation: { regex: /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, message: 'CPF inválido.' }, help: "XX.XXX.XXX-XX" },
    cnpj: { label: "CNPJ", validation: { regex: /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, message: 'CNPJ inválido.' }, help: "XX.XXX.XXX/XXXX-XX" },
    cellphone: { label: "Celular", validation: { regex: /^\(\d{2}\)\d{4,5}-\d{4}$/, message: 'Número de celular inválido.' }, help: "(XX)XXXXX-XXXX. O dígito adicional é opcional." },
    telephone: { label: "Telefone", validation: { regex: /^\(\d{2}\)\d{4,5}-\d{4}$/, message: 'Número de telefone inválido.' }, help: "(XX)XXXXX-XXXX. O dígito adicional é opcional." },
    anac_license: { label: "Licença Anac", validation: { regex: /^[0-9]{9}$/, message: 'Licença Anac inválida.' }, help: "XXXXXXXXX" },
    company_name: { label: "Razão Social", validation: { regex: /^[a-zA-Z]{3,}$/, message: 'Deve ter pelo menos 3 letras.' }, help: null },
    trading_name: { label: "Nome Fantasia", validation: { regex: /^[a-zA-Z]{3,}$/, message: 'Deve ter pelo menos 3 letras.' }, help: null }
}

export function DocumentsFormulary() {

    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = React.useState(initialFormData);
    const [formError, setFormError] = React.useState(initialFormError);
    const [loading, setLoading] = React.useState(true);
    const [refresh, setRefresh] = React.useState(false);

    React.useEffect(() => {

        axios.get("api/module/my-profile/documents")
            .then(function (response) {
                setFormData(response.data);
                setFormError(() => {
                    let form_error = Object.assign({}, response.data);
                    for (let field in form_error) {
                        form_error[field] = { error: false, message: "" }
                    }
                    return form_error;
                });
            })
            .catch(function (error) {
                errorResponse(error.response);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [refresh]);

    function handleSubmit() {
        if (!formSubmissionValidation()) return;

        setLoading(true);
        requestServer();
    }

    function formSubmissionValidation() {

        let is_valid = true;
        let form_validation = Object.assign({}, formError);

        for (let field in formData) {

            let field_regex = formConfig[field].validation.regex;
            let field_error_message = formConfig[field].validation.message;
            let field_value = formData[field];

            if (field_regex.test(field_value)) {
                form_validation[field] = resetFieldError;
            } else {
                is_valid = false;
                form_validation[field] = { error: true, message: field_error_message }
            }
        }

        setFormError(formError);
        return is_valid;

    }

    function requestServer() {
        axios.patch("api/module/my-profile/documents", formData)
            .then(function (response) {
                enqueueSnackbar(response.data.message, { variant: "success" });
            })
            .catch(function (error) {
                console.log(error.message)
                errorResponse(error.response);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function errorResponse(response) {
        enqueueSnackbar(response.data.message, { variant: "error" });

        if (response.status === 422) {
            let response_errors = {}
            for (let prop in response.data.errors) {
                response_errors[prop] = {
                    error: true,
                    message: response.data.errors[prop][0]
                }
            }
            setFormError(response_errors);
        }
    }

    function checkIfCanRenderDocuments() {
        return Object.keys(formData).length != 0 && Object.keys(formError).length != 0;
    }

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.currentTarget.value });
    }

    return (
        <>
            <Grid container spacing={1} alignItems="center" mt={2}>
                <Grid item>
                    <Tooltip title="Carregar">
                        <IconButton onClick={() => setRefresh((old) => !old)}>
                            <FontAwesomeIcon icon={faArrowsRotate} size="sm" color={'#007937'} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>

            <Paper className='mt-2 p-[18px] rounded-[8px] dark:bg-[#1F2937]'>
                <Typography className='text-black dark:text-white' variant="h5" marginBottom={2}>Documentos</Typography>
                <Grid container spacing={2}>

                    {checkIfCanRenderDocuments() && Object.keys(formData).map((key) => {
                        return (
                            <Grid item xs={12} lg={6} key={key}>
                                <TextField
                                    id={key}
                                    name={key}
                                    label={formConfig[key].label}
                                    fullWidth
                                    variant="outlined"
                                    value={formData[key]}
                                    disabled={loading}
                                    error={formError[key].error}
                                    helperText={formError[key].message}
                                    onChange={handleInputChange}
                                    InputProps={formConfig[key].help && {
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <Tooltip title={formConfig[key].help}>
                                                    <IconButton>
                                                        <HelpIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>,
                                    }}
                                />
                            </Grid>
                        )
                    })}
                </Grid>

                <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }} onClick={handleSubmit}>
                    Atualizar
                </Button>
            </Paper>
        </>
    )
}