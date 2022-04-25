import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { useAuthentication } from '../../context/InternalRoutesAuth/AuthenticationContext';
import AxiosApi from '../../../services/AxiosApi';

/*

- Two lists are generated: the left with all items, and the right one with the selected items
- The original component "TransferList" has two main states: "left" (an array will all items) and "right" (an array with the selected items)
- For a better semantic code, instead of use just "left" as a name that indicates the left list, i wrote with "Items" posfix - leftItems
- The "right" state were substituted for the state of selected items that exists in the parent component
- By this way, the items are being selected and pushed for an array that the parent component has directly access

*/

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export function TransferList({...props}) {

// ============================================================================== STATES E OUTROS VALORES ============================================================================== //

  // Utilizador do state global de autenticação
  const {AuthData, setAuthData} = useAuthentication();

  // State do carregamento dos dados do input de select
  const [listOptions, setListOptions] = React.useState({status: {loading: true, success: false}, records: null, item_primary_key: "", item_key_text: ""});

  const [checked, setChecked] = React.useState([]);
  const [leftItems, setLeftItems] = React.useState([]);
  // Substituded for the parent state of the selected items
  //const [rightItems, setRightItems] = React.useState(props.default_selections); 

  const leftChecked = intersection(checked, leftItems);
  const rightChecked = intersection(checked, props.selections.state);

// ============================================================================== FUNÇÕES/ROTINAS ============================================================================== //

  React.useEffect(() => {

    AxiosApi.get(props.axios_url, {
      access: AuthData.data.access
      })
      .then(function (response) {

      if(response.status === 200){

        let options_available = [];

        // If already exists selected items (right list) they need to be excluded of the left list
        if(props.selections.state.length > 0){

          props.selections.state.map((value, index) => {

            if(options_available.indexOf(response.data[index]) != -1){

              options_available[index] = response.data[index];

            }
           
          });

        }else{

          options_available = response.data;

        }

        setLeftItems(options_available);

        setListOptions({status: {loading: false, success: true}, records: options_available, item_primary_key: "id", item_key_text: "arquivo"});

      }else{

        setListOptions({status: {loading: false, success: false}});

      }

      })
      .catch(function (error) {

        console.log(error)

        setListOptions({status: {loading: false, success: false}});

      });

  },[]);

  // Handle click on one list item
  const handleToggle = (value) => () => {

    // The indexOf() method returns the first index where the element can be found in the array
    // Returns -1 if it is not present.
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    props.selections.setter(props.selections.state.concat(leftChecked));
    setLeftItems(not(leftItems, leftChecked));
    setChecked(not(checked, leftChecked));

  };

  const handleCheckedLeft = () => {
    setLeftItems(leftItems.concat(rightChecked));
    props.selections.setter(not(props.selections.state, rightChecked));
    setChecked(not(checked, rightChecked));
  };



// ============================================================================== ESTRUTURAÇÃO DAS LISTAS ============================================================================== //

  const makeList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length}`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {

          return (
            <ListItem
              key={value[listOptions.item_primary_key]}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <Checkbox
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={value[listOptions.item_key_text]} />
            </ListItem>
          );

        })}
        <ListItem />
      </List>
    </Card>
  );

// ============================================================================== ESTRUTURAÇÃO PRINCIPAL ============================================================================== //
      
  return (
    <>
    {(listOptions.status.loading == false && listOptions.status.success) ?
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>{makeList('Itens', leftItems)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item>{makeList('Seleções', props.selections.state)}</Grid>
      </Grid>
      :
      (!listOptions.status.loading && !listOptions.status.success) ? 
      "ERRO" 
      : 
      "CARREGANDO...."
    }
    </>
  );
}
