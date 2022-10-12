import * as React from 'react';
import MuiToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ToggleButton = styled(MuiToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "#007937",
    backgroundColor: '#fff'
  }
});

export function Switcher({ ...props }) {

  const [alignment, setAlignment] = React.useState(0);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      fullWidth
    >
      {props.options.map((item, index) => (
        <ToggleButton value={index} onClick={() => props.panelStateSetter(item.page)} sx={{ display: "flex", border: 'none', borderRadius: 5 }} key={index}>
          <Typography sx={{ marginRight: 2 }}>{item.title.toUpperCase()}</Typography> {item.icon}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
