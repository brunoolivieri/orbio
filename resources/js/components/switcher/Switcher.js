import * as React from 'react';
import MuiToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ToggleButton = styled(MuiToggleButton)({
  display: 'flex',
  border: 'none',
  borderRadius: 0,
  "&.Mui-selected, &.Mui-selected:hover": {
    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
    backgroundColor: 'transparent'
  }
});

export function Switcher({ ...props }) {

  const [option, setOption] = React.useState(0);

  function handleChange(event, newAlignment) {
    setOption(newAlignment);
  }

  return (
    <ToggleButtonGroup
      value={option}
      exclusive
      onChange={handleChange}
      fullWidth
      className='bg-white rounded-none border-b border-gray-200'
      sx={{ borderRadius: 0 }}
    >
      {props.options.map((item, index) => (
        <ToggleButton value={index} onClick={() => props.panelStateSetter(item.page)} key={index}>
          <Typography sx={{ fontSize: 15, fontWeight: index === option && 600 }} className='font-sans'>{item.title.toUpperCase()}</Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
