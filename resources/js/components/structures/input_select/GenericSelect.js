// React
import * as React from 'react';
// Material UI
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Custom
import AxiosApi from "../../../services/AxiosApi";
import { useAuthentication } from "../../context/InternalRoutesAuth/AuthenticationContext";

export const GenericSelect = React.memo(({ ...props }) => {

    const { AuthData } = useAuthentication();
    const [axiosURL] = React.useState(props.data_source);
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState({ records: [], label_text: props.label_text });

    const handleChange = (event) => {

        props.setControlledInput({ ...props.controlledInput, [event.target.name]: event.target.value });

    };

    React.useEffect(() => {

        AxiosApi.get(axiosURL, {
            access: AuthData.data.access
        })
            .then(function (response) {

                setLoading(false);
                setData({ records: response.data, label_text: props.label_text });

            })
            .catch(function () {

                setLoading(false);
                setData({ records: [], label_text: props.label_text });

            });

    }, [open]);

    return (
        <>
            <FormControl sx={{ margin: "5px 5px 0 0", minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">{data.label_text}</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    id={props.name}
                    defaultValue={props.default}
                    label={data.label_text}
                    onChange={handleChange}
                    name={props.name}
                    error={(!loading && data.records.length == 0)}
                    disabled={loading}
                >

                    <MenuItem value={0} disabled>{loading ? "Carregando" : "Escolha uma opção"}</MenuItem>

                    {!loading &&
                        data.records.map((row) =>
                            <MenuItem value={row[props.primary_key]} key={row[props.primary_key]}>{row[props.key_content]}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
        </>
    );
});