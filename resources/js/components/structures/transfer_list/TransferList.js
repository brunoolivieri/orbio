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
- The "right" state were substituted for the state of selected items that exists in the parent component - props.right_items
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

  const leftChecked = intersection(checked, leftItems);
  const rightChecked = intersection(checked, props.right_items.state);

// ============================================================================== FUNÇÕES/ROTINAS ============================================================================== //

  /*
  *
  * If there are not items selected, the left side receives all data, and the right nothing
  * If there are selected items, the left side receives only the not selected items, and the right the selecteds
  * In each loop of the items on the left, each is compared to each item on the right
  * 
  */
  React.useEffect(() => {

    AxiosApi.get(props.axios_url, {
      access: AuthData.data.access
      })
      .then(function (response) {

      if(response.status === 200){

        let available_options = [];

        if(props.right_items.state.length == 0){

          available_options = response.data;

        }else if(props.right_items.state.length > 0){

          // Every value comparison that is different will add 1 to the counter
          // Every value comparison that is equal resets the counter
          let counter_available_options = 0;

          // Loops the loaded items
          for(let i = 0; i < response.data.length; i++){

            let counter_of_the_true_cases = 0;

            // Loops the selected items
            for(let j = 0; j < props.right_items.state.length; j++){
              
              // If the loaded item is equal to the selected one
              if(response.data[i].id == props.right_items.state[j].id){
                //console.log("resets")
                
                counter_of_the_true_cases = 0;
              
              // If the loaded item is different from the selected one
              }else if(response.data[i].id != props.right_items.state[j].id){
                //console.log("count")
              
                counter_of_the_true_cases++;

              }

            }

            // If the different cases counter is equal to the quantity of selected items
            // This means that the value is not one of the selected ones
            if(counter_of_the_true_cases == props.right_items.state.length){

              available_options[counter_available_options] = response.data[i];

              counter_available_options++;

            }

          }

          //console.log(counter_available_options);

        }

        setLeftItems(available_options);
        setListOptions({status: {loading: false, success: true}, records: available_options, item_primary_key: "id", item_key_text: "arquivo"});

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
    props.right_items.setter(props.right_items.state.concat(leftChecked));
    setLeftItems(not(leftItems, leftChecked));
    setChecked(not(checked, leftChecked));

  };

  const handleCheckedLeft = () => {
    setLeftItems(leftItems.concat(rightChecked));
    props.right_items.setter(not(props.right_items.state, rightChecked));
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
        <Grid item>{makeList('Seleções', props.right_items.state)}</Grid>
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
