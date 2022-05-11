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
    const [selectOptions, setSelectOptions] = React.useState({ status: { loading: true, success: false }, records: null, default_option: "Carregando", label_text: props.label_text });
    const [selectedOption, setSelectedOption] = React.useState(props.default);

    const handleSelectChange = (event) => {

        setSelectedOption(event.target.value);

    };

    React.useEffect(() => {

        AxiosApi.get(axiosURL, {
            access: AuthData.data.access
        })
            .then(function (response) {

                if (response.status === 200) {

                    setSelectOptions({ status: { loading: false, success: true }, records: response.data, default_option: "Escolha uma opção", label_text: props.label_text });

                } else {

                    setSelectOptions({ status: { loading: false, success: false }, default_option: "Erro", label_text: props.label_text });

                }

            })
            .catch(function (error) {

                console.log(error)

                setSelectOptions({ status: { loading: false, success: false }, default_option: "Erro", label_text: props.label_text });

            });

    }, [open]);

    return (

        <>

            {(selectOptions.status.loading == false && selectOptions.status.success) ?
                <FormControl sx={{ margin: "5px 5px 0 0", minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-helper-label">{selectOptions.label_text}</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id={props.name}
                        value={selectedOption}
                        label={selectOptions.label_text}
                        onChange={handleSelectChange}
                        name={props.name}
                        error={selectOptions.status.success ? false : true}
                        disabled={selectOptions.status.loading || selectOptions.status.success == false || props.disabled}
                    >

                        <MenuItem value={0} disabled>{selectOptions.default_option}</MenuItem>

                        {!selectOptions.status.loading &&

                            selectOptions.records.map((row) =>

                                <MenuItem value={row[props.primary_key]} key={row[props.primary_key]}>{row[props.key_content]}</MenuItem>

                            )

                        }

                    </Select>
                </FormControl>
                : ""}

        </>

    )

});