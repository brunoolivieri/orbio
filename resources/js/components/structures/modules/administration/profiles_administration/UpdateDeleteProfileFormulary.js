// IMPORTAÇÃO DOS COMPONENTES REACT
import { useState, useEffect } from 'react';
import * as React from 'react';

// IMPORTAÇÃO DOS COMPONENTES PARA O MATERIAL UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

// IMPORTAÇÃO DOS COMPONENTES CUSTOMIZADOS
import { useAuthentication } from '../../../../context/InternalRoutesAuth/AuthenticationContext';
import { FormValidation } from '../../../../../utils/FormValidation';
import AxiosApi from '../../../../../services/AxiosApi';

/*

- Esse modal é utilizado para construir formulários para a página de administração
- Ele recebe os dados e o tipo de operação, e é construído de acordo com esses dados
- Por enquanto é utilizado apenas para a operação de DELETE e UPDATE de usuários

*/

export function UpdateDeleteProfileFormulary({data, operation, refresh_setter}) {

    // ============================================================================== DECLARAÇÃO DOS STATES E OUTROS VALORES ============================================================================== //

    // Utilizador do state global de autenticação
    const {AuthData, setAuthData} = useAuthentication();

    // States do formulário
    const [open, setOpen] = React.useState(false);

    // States utilizados nas validações dos campos 
    const [errorDetected, setErrorDetected] = useState({name: false}); // State para o efeito de erro - true ou false
    const [errorMessage, setErrorMessage] = useState({name: null}); // State para a mensagem do erro - objeto com mensagens para cada campo

    // State da mensagem do alerta
    const [displayAlert, setDisplayAlert] = useState({display: false, type: "", message: ""});

    // State da acessibilidade do botão de executar o registro
    const [disabledButton, setDisabledButton] = useState(false);

    const [modulePowers, setModulePowers] = useState({
      "1": {read: data.modules["1"].profile_powers.ler == 1 ? true : false, write: data.modules["1"].profile_powers.escrever == 1 ? true : false}, 
      "2": {read: data.modules["2"].profile_powers.ler == 1 ? true : false, write: data.modules["2"].profile_powers.escrever == 1 ? true : false}, 
      "3": {read: data.modules["3"].profile_powers.ler == 1 ? true : false, write: data.modules["3"].profile_powers.escrever == 1 ? true : false}, 
      "4":{read: data.modules["4"].profile_powers.ler == 1 ? true : false, write: data.modules["4"].profile_powers.escrever == 1 ? true : false},
      "5":{read: data.modules["5"].profile_powers.ler == 1 ? true : false, write: data.modules["5"].profile_powers.escrever == 1 ? true : false}
      }
    );

    // ============================================================================== FUNÇÕES/ROTINAS DA PÁGINA ============================================================================== //

    // Função para abrir o modal
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Função para fechar o modal
    const handleClose = () => {

      setErrorDetected({name: false});
      setErrorMessage({name: null});
      setDisplayAlert({display: false, type: "", message: ""});
      setDisabledButton(false);

      setOpen(false);

    };

    /*
    * Rotina 1
    * Ponto inicial do processamento do envio do formulário de atualização ou deleção
    * Recebe os dados do formulário, e transforma em um objeto da classe FormData
    * A próxima rotina, 2, validará esses dados
    */
    function handleSubmitOperation(event){
        event.preventDefault();

        // Instância da classe JS FormData - para trabalhar os dados do formulário
      const data = new FormData(event.currentTarget);

      if(operation === "update"){

          setDisabledButton(true);

          // Validação dos dados do formulário
          // A comunicação com o backend só é realizada se o retorno for true
          if(dataValidate(data)){

            // Inicialização da requisição para o servidor
            requestServerOperation(data, operation);

        }

      }else if(operation === "delete"){

          setDisabledButton(true);

         // Inicialização da requisição para o servidor
         requestServerOperation(data, operation);

      }

    }

    /*
    * Rotina 2
    * Validação dos dados no frontend
    * Recebe o objeto da classe FormData criado na rotina 1
    * Se a validação não falhar, a próxima rotina, 3, é a da comunicação com o Laravel 
    */
    function dataValidate(formData){

      // Validação dos dados - true para presença de erro e false para ausência
      // Se utilizada a função FormValidation é retornado um objeto com dois atributos: "erro" e "message"
      // Se o atributo "erro" for true, um erro foi detectado, e o atributo "message" terá a mensagem sobre a natureza do erro
      const nameValidate = FormValidation(formData.get("name_input"), 3, null, null, null);

      // Atualização dos estados responsáveis por manipular os inputs
      setErrorDetected({name: nameValidate.error});
      setErrorMessage({name: nameValidate.message});

      // Se o email ou a senha estiverem errados
      if(nameValidate.error === true){

          return false;

      }else{

          return true;

      }

    }

    /*
    * Rotina 3 - apenas no formulário de atualização
    * Essa função serve para organizar os valores dos checkbox
    * 
    */
    function changeModulePowers(event, module_and_power){

      // O retorno será um array com os valores [id_modulo, poder]
      let checkboxIdentifiers = module_and_power.split("|");
      let checkboxModule = checkboxIdentifiers[0];
      let checkboxPower = checkboxIdentifiers[1];

      // Um checkbox é alterado por vez
      // Cada checkbox é de um módulo, e de um poder desse módulo
      // O checkbox não alterado recebe o seu valor atual
      // O checkbox alterado recebe sempre o valor new_value

      let new_value = event.currentTarget.checked;

      // Se for o checkbox do módulo 1...
      if(checkboxModule === "1"){

        // Se for o poder "read"...
        if(checkboxPower === "read"){

          setModulePowers({
            "1": {read: new_value, write: modulePowers["1"].write}, 
            "2": {read: modulePowers["2"].read, write: modulePowers["2"].write}, 
            "3": {read: modulePowers["3"].read, write: modulePowers["3"].write}, 
            "4":{read: modulePowers["4"].read, write: modulePowers["4"].write},
            "5":{read: modulePowers["5"].read, write: modulePowers["5"].write}
            }
          );

        }else if(checkboxPower === "write"){

          setModulePowers({
            "1": {read: modulePowers["1"].read, write: new_value}, 
            "2": {read: modulePowers["2"].read, write: modulePowers["2"].write}, 
            "3": {read: modulePowers["3"].read, write: modulePowers["3"].write}, 
            "4":{read: modulePowers["4"].read, write: modulePowers["4"].write},
            "5":{read: modulePowers["5"].read, write: modulePowers["5"].write}
            }
          );

        }

      }else if(checkboxModule === "2"){

        if(checkboxPower === "read"){

          setModulePowers({
            "1": {read: modulePowers["1"].read, write: modulePowers["1"].write}, 
            "2": {read: new_value, write: modulePowers["2"].write}, 
            "3": {read: modulePowers["3"].read, write: modulePowers["3"].write}, 
            "4":{read: modulePowers["4"].read, write: modulePowers["4"].write},
            "5":{read: modulePowers["5"].read, write: modulePowers["5"].write}
            }
          );

        }else if(checkboxPower === "write"){

          setModulePowers({
            "1": {read: modulePowers["1"].read, write: modulePowers["1"].write}, 
            "2": {read: modulePowers["2"].read, write: new_value}, 
            "3": {read: modulePowers["3"].read, write: modulePowers["3"].write}, 
            "4":{read: modulePowers["4"].read, write: modulePowers["3"].write},
            "5":{read: modulePowers["5"].read, write: modulePowers["5"].write}
            }
          );
          
        }

      }else if(checkboxModule === "3"){

        if(checkboxPower === "read"){

          setModulePowers({
            "1": {read: modulePowers["1"].read, write: modulePowers["1"].write}, 
            "2": {read: modulePowers["2"].read, write: modulePowers["2"].write}, 
            "3": {read: new_value, write: modulePowers["3"].write}, 
            "4":{read: modulePowers["4"].read, write: modulePowers["4"].write},
            "5":{read: modulePowers["5"].read, write: modulePowers["5"].write}
            }
          );

        }else if(checkboxPower === "write"){

          setModulePowers({
            "1": {read: modulePowers["1"].read, write: modulePowers["1"].write}, 
            "2": {read: modulePowers["2"].read, write: modulePowers["2"].write}, 
            "3": {read: modulePowers["3"].read, write: new_value}, 
            "4":{read: modulePowers["4"].read, write: modulePowers["4"].write},
            "5":{read: modulePowers["5"].read, write: modulePowers["5"].write}
            }
          );
          
        }

      }else if(checkboxModule === "4"){

        if(checkboxPower === "read"){

          setModulePowers({
            "1": {read: modulePowers["1"].read, write: modulePowers["1"].write}, 
            "2": {read: modulePowers["2"].read, write: modulePowers["2"].write}, 
            "3": {read: modulePowers["3"].read, write: modulePowers["3"].write}, 
            "4":{read: new_value, write: modulePowers["4"].write},
            "5":{read: new_value, write: modulePowers["5"].write}
            }
          );

        }else if(checkboxPower === "write"){

          setModulePowers({
            "1": {read: modulePowers["1"].read, write: modulePowers["1"].write}, 
            "2": {read: modulePowers["2"].read, write: modulePowers["2"].write}, 
            "3": {read: modulePowers["3"].read, write: modulePowers["3"].write}, 
            "4":{read: modulePowers["4"].read, write: new_value},
            "5":{read: modulePowers["5"].read, write: new_value}
            }
          );
          
        }

      }

    }

    /*
    * Rotina 4
    * Comunicação AJAX com o Laravel utilizando AXIOS
    * Após o recebimento da resposta, é chamada próxima rotina, 4, de tratamento da resposta do servidor
    */
    function requestServerOperation(data){

      // Dados para o middleware de autenticação
      let logged_user_id = AuthData.data.id; // ID do usuário logado
      let module_id = 1; // ID do módulo
      let action = "escrever"; // Tipo de ação realizada

      if(operation === "update"){

        AxiosApi.patch(`/api/admin-module/${data.get("id_input")}`, {
          panel: "profiles_panel",
          auth: `${logged_user_id}.${module_id}.${action}`,
          profile_name: data.get("name_input"),
          profile_modules_relationship: modulePowers
        })
        .then(function (response) {
  
            // Tratamento da resposta do servidor
            serverResponseTreatment(response);
  
        })
        .catch(function (error) {
          
          // Tratamento da resposta do servidor
          serverResponseTreatment(error.response);
  
        });

      }else if(operation === "delete"){

        let param = `profiles_panel.${data.get("id_input")}`;

        AxiosApi.delete(`/api/admin-module/${param}?auth=${logged_user_id}.${module_id}.${action}`)
        .then(function (response) {
  
            // Tratamento da resposta do servidor
            serverResponseTreatment(response);
  
        })
        .catch(function (error) {
          
          // Tratamento da resposta do servidor
          serverResponseTreatment(error.response);
  
        });

      }

    }

    /*
    * Rotina 5
    * Tratamento da resposta do servidor
    * Se for um sucesso, aparece, mo modal, um alerta com a mensagem de sucesso, e o novo registro na tabela de usuários
    */
    function serverResponseTreatment(response){

      if(response.status === 200){

        if(operation === "update"){

          // Altera o state "refreshPanel" para true
          refresh_setter(true);

          // Alerta sucesso
          setDisplayAlert({display: true, type: "success", message: "Atualização realizada com sucesso!"});

        }else if(operation === "delete"){

          // Altera o state "refreshPanel" para true
          refresh_setter(true);

          // Alerta sucesso
          setDisplayAlert({display: true, type: "success", message: "Deleção realizada com sucesso!"});

        }

        setTimeout(() => {
          
          setDisabledButton(false);
          
          handleClose();

        }, 2000);

      }else{

        // Habilitar botão de envio
        setDisabledButton(false);

        if(operation === "update" && response.data.error === "name_already_exists"){

          // Alerta erro
          setDisplayAlert({display: true, type: "error", message: "Erro! Já existe um perfil com esse nome."});

        }else{

          // Alerta erro
          setDisplayAlert({display: true, type: "error", message: "Erro! Tente novamente."});

        }

      }
      
    }

    // ============================================================================== ESTRUTURAÇÃO DA PÁGINA - COMPONENTES DO MATERIAL UI ============================================================================== //

    {/* Se o acesso do registro for 1, ou se o acesso do registro for igual ao do usuário logado, que estará vendo a tabela, os botões serão desabilitados e a cor dos ícones será mudada para cinza */}
    {/* Isso significa que o usuário Super-Admin não pode editar a si mesmo, e os usuários Sub-Admin, de acesso 2, não podem remover ou editar outros usuários Sub-Admin - apenas o Super-Admin pode editar usuários admin */}
    const deleteButton = <IconButton 
    disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? (data.profile_id <= 4 ? true : false) : true} 
    value = {data.profile_id} onClick={handleClickOpen}
    ><DeleteIcon 
    style={{ fill: AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? (data.profile_id <= 4 ? "#808991" : "#D4353B") : "#808991"}} 
    /></IconButton>

    const updateButton = <IconButton 
    disabled={AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? (data.profile_id <= 4 ? true : false) : true} 
    value = {data.profile_id} onClick={handleClickOpen}
    ><EditIcon 
    style={{ fill: AuthData.data.user_powers["1"].profile_powers.escrever == 1 ? (data.profile_id <= 4 ? "#808991" : "#009BE5") : "#808991"}} 
    /></IconButton>
    
  return (
    <div>

      {/* Botão que abre o Modal - pode ser o de atualização ou de deleção, depende da operação */}
      {operation === "update" ? updateButton : deleteButton}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{operation === "update" ? "ATUALIZAÇÃO" : "DELEÇÃO"} | PERFIL (ID: {data.profile_id})</DialogTitle>

        {/* Formulário da criação/registro do usuário - Componente Box do tipo "form" */}
        <Box component="form" noValidate onSubmit={handleSubmitOperation} >

          <DialogContent>
            
            <TextField
            margin="dense"
            defaultValue={data.profile_id}
            id="id_input"
            name = "id_input"
            label="ID do perfil"
            fullWidth
            variant="outlined"
            InputProps={{
                readOnly: true,
            }}
          />
            <TextField
            margin="dense"
            defaultValue={data.profile_name}
            id="name_input"
            name = "name_input"
            label="Nome do perfil"
            fullWidth
            variant="outlined"
            InputProps={{
                readOnly: operation == "delete" ? true : false,
            }}
          />

          </DialogContent>


          {/* Renderização condicional dos checkbox - serão necessários apenas no formulário de atualização */}
          {operation == "update" &&
          <Grid container sx={{ ml: 2, mb: 3 }} spacing={1} alignItems="left">

              {/* Os checkbox não possuem name porque seus valores, após o envio do formulário, serão recuperados a partir do state "modulePowers" */}

              <Grid item>
                <FormLabel component="legend">Admin</FormLabel>
                <FormGroup>
                  <FormControlLabel control={<Checkbox defaultChecked={data.modules["1"].profile_powers.ler == 1 ? true : false} onChange={(event) => { changeModulePowers(event, "1|read")} } />} label="Ler" />
                  <FormControlLabel control={<Checkbox defaultChecked={data.modules["1"].profile_powers.escrever == 1 ? true : false} onChange={(event) => { changeModulePowers(event, "1|write")} } />} label="Escrever" />
                </FormGroup>
              </Grid>

              <Grid item>
                <FormLabel component="legend">Planos</FormLabel>
                <FormGroup>
                  <FormControlLabel control={<Checkbox defaultChecked={data.modules["2"].profile_powers.ler == 1 ? true : false} onChange={(event) => { changeModulePowers(event, "2|read")} } />} label="Ler" />
                  <FormControlLabel control={<Checkbox defaultChecked={data.modules["2"].profile_powers.escrever == 1 ? true : false} onChange={(event) => { changeModulePowers(event, "2|write")} } />} label="Escrever" />
                </FormGroup>
              </Grid>

              <Grid item>
                <FormLabel component="legend">Ordens</FormLabel>
                <FormGroup>
                  <FormControlLabel control={<Checkbox defaultChecked={data.modules["3"].profile_powers.ler == 1 ? true : false} onChange={(event) => { changeModulePowers(event, "3|read") }} />} label="Ler" />
                  <FormControlLabel control={<Checkbox defaultChecked={data.modules["3"].profile_powers.escrever == 1 ? true : false} onChange={(event) => { changeModulePowers(event, "3|write") }} />} label="Escrever" />
                </FormGroup>
              </Grid>

              <Grid item>
                <FormLabel component="legend">Relatórios</FormLabel>
                <FormGroup>
                  <FormControlLabel control={<Checkbox defaultChecked={data.modules["4"].profile_powers.ler == 1 ? true : false} onChange={(event) => { changeModulePowers(event, "4|read") }} />} label="Ler" />
                  <FormControlLabel control={<Checkbox defaultChecked={data.modules["4"].profile_powers.escrever == 1 ? true : false} onChange={(event) => { changeModulePowers(event, "4|write") }} />} label="Escrever" />
                </FormGroup>
              </Grid>

              <Grid item>
                <FormLabel component="legend">Incidentes</FormLabel>
                <FormGroup>
                  <FormControlLabel control={<Checkbox defaultChecked={data.modules["5"].profile_powers.ler == 1 ? true : false} onChange={(event) => { changeModulePowers(event, "5|read") }} />} label="Ler" />
                  <FormControlLabel control={<Checkbox defaultChecked={data.modules["5"].profile_powers.escrever == 1 ? true : false} onChange={(event) => { changeModulePowers(event, "5|write") }} />} label="Escrever" />
                </FormGroup>
              </Grid>

          </Grid>
          }

          {displayAlert.display && 
              <Alert severity={displayAlert.type}>{displayAlert.message}</Alert> 
          }
          
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={disabledButton}>Confirmar {operation === "update" ? "atualização" : "deleção"}</Button>
          </DialogActions>

        </Box>

        
      </Dialog>
    </div>
  );
}
