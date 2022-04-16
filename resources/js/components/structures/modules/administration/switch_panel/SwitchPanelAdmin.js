import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// IMPORTAÇÃO DOS ÍCONES DO FONTS AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faIdCardClip } from '@fortawesome/free-solid-svg-icons';

function TabPanel(props) {

  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// React Memo para ganho de performance - memoriza o componente enquanto passados os mesmos props
export const SwitchPanelAdmin = React.memo((props) => {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    if(newValue === 0){

      props.panelStateSetter("users");

    }else if(newValue === 1){

      props.panelStateSetter("profiles");

    }

  };
  

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'transparent' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth" indicatorColor="primary">
          <Tab icon={<FontAwesomeIcon icon={faUsers} />} label="Gerenciamento dos usuários" {...a11yProps(0)}/>
          <Tab icon={<FontAwesomeIcon icon={faIdCardClip} />} label="Gerenciamento dos perfis" {...a11yProps(1)} />
        </Tabs>
      </Box>
    </Box>
  );

})
