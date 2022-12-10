// React
import * as React from 'react';
// Material UI
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const menuIconStyle = {
  color: '#fff'
}

export function HeaderMenu() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  return (
    <div>
      <IconButton
        size="large"
        aria-label="menu"
        onClick={handleClick}
      >
        <AccountCircleIcon color="success" style={menuIconStyle} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}><a href="/api/auth/logout">Sair</a></MenuItem>
      </Menu>
    </div>
  );
}
