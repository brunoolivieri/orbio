import * as React from 'react';
import MuiToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ToggleButton = styled(MuiToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "#fff",
    backgroundColor: '#007937',
    boxShadow: 'rgba(0, 0, 0, 0.16) 3px'
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
      sx={{ bgcolor: '#fff' }}
    >
      {props.options.map((item, index) => (
        <ToggleButton value={index} onClick={() => props.panelStateSetter(item.page)} sx={{ display: "flex", border: 'none' }} key={index}>
          <Typography sx={{ marginRight: 2 }}>{item.title.toUpperCase()}</Typography> {item.icon}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
