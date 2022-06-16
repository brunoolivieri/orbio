// React
import * as React from 'react';
// Material UI
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

export function HeaderMenu() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{ backgroundColor: "transparent" }}
      >
        <FontAwesomeIcon icon = {faCircleUser} color={"#fff"} size={'2x'} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}><a href="/api/auth/logout">Terminar sessão</a></MenuItem>
      </Menu>
    </div>
  );
}
