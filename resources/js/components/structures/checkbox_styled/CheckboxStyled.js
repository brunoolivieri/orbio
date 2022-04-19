import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';

export function CheckboxStyled({...props}) {

  const [selected, setSelected] = React.useState(false);

  return (
    <ToggleButton
      value="check"
      selected={selected}
      onChange={() => {
        setSelected(!selected);
      }}
      onClick={() => {props.eventOnClick(event, props.row)}}
      color = {"primary"}
    >
      {props.row[props.text_key]}
    </ToggleButton>
  );
}
