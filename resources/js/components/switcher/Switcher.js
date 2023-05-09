import * as React from 'react';
import MuiToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ToggleButton = styled(MuiToggleButton)({
  display: 'flex',
  border: 'none',
  "&.Mui-selected, &.Mui-selected:hover": {
    boxShadow: '0 0 5px 2px rgba(0,0,0,0.2)',
    backgroundColor: 'transparent'
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
      className='bg-white rounded-none border border-gray-200 dark:bg-[#374151] dark:border-none'
    >
      {props.options.map((item, index) => (
        <ToggleButton value={index} onClick={() => props.panelStateSetter(item.page)} key={index}>
          <Typography sx={{ marginRight: 2, fontWeight: 600 }}>{item.title.toUpperCase()}</Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
