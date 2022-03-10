<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

// Model utilizado
use App\Models\User\UserModel;
use App\Models\User\UserAuthenticationOperationsModel;
use App\Models\ProfileAndModule\ProfileModel;
use App\Models\ProfileAndModule\ProfileHasModuleModel;

// Envio de email
use Illuminate\Support\Facades\Mail;

// Classe de Email
use App\Mail\UserRegisteredEmail;

class AdministrationModuleController extends Controller
{

    /**
     * Carrega e retorna os dados para compor o painel
     * O painel pode ser de administração de usuários
     * O painel pode ser de administração de perfis
     * Para determinar o caso a rota é acessada enviando uma query string de nome "panel"
     * Para os argumentos do SELECT, é enviada uma query string de nome "args"
     * 
     * MÉTODO: GET
     * 
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {

        $panel = request()->panel;

        $request_values = explode("|", request()->args);

        $offset = $request_values[0];
        $limit = $request_values[1];

        // Se o procedimento estiver sendo realizado no painel de usuários...
        if($panel === "users_panel"){

            $model = new UserModel();
            
            $response = $model->loadAllUsers((int) $offset, (int) $limit);
    
            if($response["status"] && !$response["error"]){
    
                $dataFormated = $this->usersPanelDataFormat($response["data"], $limit);

                return response(["status" => true, "records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);
    
            }else if(!$response["status"] && $response["error"]){

                return response(["status" => false, "error" => $response->content()], 500);
    
            }  

        // Se o procedimento estiver sendo realizado no painel de usuários...
        }else if($panel === "profiles_panel"){

            $model = new ProfileHasModuleModel();

            // O LIMIT e o OFFSET originais devem ser multiplicados por 4
            // Isso ocorre porque cada grupo de quatro registros da tabela do BD serão agrupados em um
            $up_limit = $limit*4;
            $up_offset = $offset*4;

            $response = $model->loadProfilesModulesRelationship((int) $up_offset, (int) $up_limit);

            if($response["status"] && !$response["error"]){

                $dataFormated = $this->profilesPanelDataFormat($response["data"]["selectedRecords"], $response["data"]["referencialValueForCalcPages"], $limit);

                return response(["status" => true, "records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

            }else if(!$response["status"] && $response["error"]){

                return response(["status" => false, "error" => $response["error"]], 500);

            }  

        }

    }

    /**
     * Função para formatação dos dados para o painel de usuários
     * Os dados são tratados e persistidos em uma matriz
     *
     * @param object $data
     * @param string $limit
     * @return array
     */
    private function usersPanelDataFormat(array $data, int $limit) : array {

        $arrData = [];
        $badgeStatus = [];

        foreach($data["selectedRecords"] as $row => $object){

                // Formatação dos dados do tipo DATETIME
                $created_at_formated = date( 'd-m-Y h:i', strtotime($object->dh_criacao));
                $updated_at_formated = $object->dh_atualizacao === NULL ? "Sem dados" : date( 'd-m-Y h:i', strtotime($object->dh_atualizacao));
                $last_access_formated = $object->dh_ultimo_acesso === NULL ? "Sem dados" : date( 'd-m-Y h:i', strtotime($object->dh_ultimo_acesso));
                
                // Se o status for 1 e tiver registro de acesso
                if($object->status === 1 && $last_access_formated != "Sem dados"){

                    // Valores para uma badge com texto "Ativo", e do tipo "success"
                    $badgeStatus = ["Ativo", "success"];
                
                // Se o status for 0 e não existir registro de acesso
                }else if($object->status === 0 && $last_access_formated === "Sem dados"){

                    // Valores para uma badge com texto "Inativo", e do tipo "error"
                    $badgeStatus = ["Inativo", "error"];
                
                // Se o status for 0 e existir registro de acesso
                }else if($object->status === 0 && $last_access_formated != "Sem dados"){

                    // Valores para uma badge com texto "Desativado", e do tipo "error"
                    $badgeStatus = ["Desativado", "error"];

                }

                // Geração da estrutura com os dados preparados para uso no front-end
                $arrData[$row] = array(
                    "user_id" => $object->id,
                    "name" => $object->nome,
                    "email" => $object->email,
                    "status" => $badgeStatus,
                    "access" => $object->id_perfil,
                    "nome_perfil" => $object->nome_perfil,
                    "created_at" => $created_at_formated,
                    "updated_at" => $updated_at_formated,
                    "last_access" => $last_access_formated
                );

        }

        // O total de registros existentes é menor ou igual a LIMIT? Se sim, existirá apenas uma página
        // Se não, se o total de registros existentes é maior do que LIMT, e sua divisão por LIMIT tem resto zero, o total de páginas será igual ao total de registros dividido por LIMIT (Exemplo: 30 / 10 = 3)
        // Se não, se o total de registros, maior do LIMIT, dividido por LIMIT tem resto maior do que zero, o total de páginas será igual ao total de registros arredondado para cima e dividido por LIMIT (Exemplo: 15 -> 20 / 10 = 2)
        $totalPages = $data["referencialValueForCalcPages"] <= $limit ? 1 : ($data["referencialValueForCalcPages"] % $limit === 0 ? $data["referencialValueForCalcPages"] / $limit : ceil($data["referencialValueForCalcPages"] / $limit));

        $ret = [(int) $totalPages, $arrData];

        return $ret;

    }

     /**
     * Função para formatação dos dados para o painel de perfis
     * Os dados são tratados e persistidos em uma matriz
     *
     * @param object $data
     * @return array
     */
    private function profilesPanelDataFormat(object $data, int $dbTotalRecords,  int $limit) : array {

        $arrData = [];

        $row = 0;
        $modulesCurrentProfile = array();
        $profileCounter = 0;

        // O Do While deve reunir em uma só linha cada conjunto de 4 registros em que o campo id_perfil se repete
        // Cada perfil tem quatro linhas na tabela, e em cada uma dessas linhas o valor do campo "id_modulo" varia
        // Ou seja: cada linha com o mesmo "id_perfil" representa uma relação desse perfil com um determinado módulo (1,2,3 ou 4)

        do{
           
            // A atual posição do array, que é igual ao valor do perfil, recebe as chaves "profile_id" e "profile_name"
            // Mesmo variando a linha, se o perfil continuar sendo o mesmo, essas chaves receberão o mesmo valor
            $profile_name = $data[$row]->nome_perfil;
            $arrData[(int) $profileCounter] = ["profile_id" => $data[$row]->id_perfil, "profile_name" =>  $profile_name, "profile_access" => $data[$row]->acesso_geral, "modules" => array()]; 

            // O array $modulesCurrentProfile recebe os valores dos poderes CRUD do atual perfil
            // São empurrados novos array enquanto o id do módulo não for igual a 4
            // A linha, $row, varia a cada loop, também o valor do campo "id_modulo", mas o campo "id_perfil" se mantém o mesmo por 4 loops (porque existem 4 módulos relacionados)
            // Ou seja, enquanto o id do perfil for X entre os registros percorridos, o array abaixo receberá, a cada variação de $row, novos valores CRUD referente a relação com outro módulo
            $module_name = $data[$row]->id_modulo === 1 ? "Administração" : ($data[$row]->id_modulo === 2 ? "Planos" : ($data[$row]->id_modulo === 3 ? "Ordens" : "Relatorios"));
            $modulesCurrentProfile[$data[$row]->id_modulo] = ["mod_name" => $module_name, "profile_powers" => ["ler" => $data[$row]->ler, "escrever" => $data[$row]->escrever]];
            
            // Se o ID do módulo atual for igual a 4
            if($data[$row]->id_modulo === 4){

                // Então agora existem 4 arrays armazenados no array: $modulesCurrentProfile = [[...], [...], [...], [...]]
                // Em cada posição tem as relações de poder do atual perfil, "id_perfil", com cada um dos quatro módulos existentes
                // Agora essa estrutura é jogada para dentro do $arrData na posição cujo valor é igual ao id do atual perfil
                $arrData[$profileCounter]["modules"] = $modulesCurrentProfile;

                // Ou seja, se existe um perfil com ID 1, o $arrData terá uma posição [1] com 4 arrays
                // Essa posição [1] terá as relações do perfil de ID 1 com os 4 módulos existentes

                $profileCounter += 1;

            }

            $row += 1;

        }while($row < count($data));

        // O total de registros existentes é menor ou igual a LIMIT? Se sim, existirá apenas uma página
        // Se não, se o total de registros existentes é maior do que LIMT, e sua divisão por LIMIT tem resto zero, o total de páginas será igual ao total de registros dividido por LIMIT (Exemplo: 30 / 10 = 3)
        // Se não, se o total de registros, maior do LIMIT, dividido por LIMIT tem resto maior do que zero, o total de páginas será igual ao total de registros arredondado para cima e dividido por LIMIT (Exemplo: 15 -> 20 / 10 = 2)
        $total_pages = $dbTotalRecords <= $limit ? 1 : ($dbTotalRecords % $limit === 0 ? $dbTotalRecords / $limit : ceil($dbTotalRecords / $limit));

        $ret = [(int) $total_pages, $arrData];

        return $ret;


    }

    /**
     * Função para composição do formulário de criação de registro
     * Pode ser para o formulário de criação de usuário ou de criação de perfil
     * 
     * MÉTODO: GET
     *
     * @return \Illuminate\Http\Response
     */
    public function create() : \Illuminate\Http\Response {

        $panel = request()->panel;

        // Se o procedimento estiver sendo realizado no painel de usuários...
        if($panel === "users_panel"){

            $model = new ProfileModel();

            $response = $model->loadAllProfiles();

            if($response["status"] && !$response["error"]){

                return response($response["data"], 200);

            }else if(!$response["status"] && $response["error"]){

                return response("", 500);

            } 

        }
 
    }
    

    /**
     * Função para processar a requisição da criação de um registro
     * Esse registro pode ser um novo usuário
     * Esse registro pode ser um novo perfil
     * Para determinar o caso a rota é acessada enviando uma query string de nome "panel"
     * 
     * MÉTODO: POST
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) : \Illuminate\Http\Response {

        // Se o procedimento estiver sendo realizado no painel de usuários...
        if(request()->panel === "users_panel"){

            $model = new UserModel();

            $registrationData = [
                "name" => $request->name,
                "email" => $request->email,
                "password" => password_hash("User{$request->password}", PASSWORD_DEFAULT),
                "profile_type" => $request->profile
            ];

            $response = $model->newUser($registrationData);

            // Se o registro foi realizado com sucesso
            if($response["status"]){

                $emailData = [
                    "name" => $request->name,
                    "email" => $request->email,
                    "password" => "User{$request->password}"
                ];

                // Construção e envio do email para ativação da conta
                Mail::to($request->email)->send(new UserRegisteredEmail($emailData));

                return response(["status" => $response["status"], "error" => $response["error"]], 200);

            }else{

                return response(["status" => $response["status"], "error" => $response["error"]], 500);

            }
        
        // Se o procedimento estiver sendo realizado no painel de perfis
        }else if(request()->panel === "profiles_panel"){

            $model = new ProfileModel();

            $registrationData = [
                "profile_name" => $request->name,
                "access" => $request->access
            ];

            $response = $model->newProfile($registrationData);

            if($response["status"] === true && !$response["error"]){

                return response(["status" => $response["status"], "error" => $response["error"]], 200);

            }else if(!$response["status"] && $response["error"]){

                return response(["status" => false, "error" => $response["error"]], 500);

            }


        }

    }

    /**
     * Função para mostrar um ou mais registros pesquisados
     * 
     * MÉTODO: GET
     *
     * @param string $request
     * @return array
     */
    public function show($request) : array {
        
        // Os valores da string enviada via URL são obtidos
        $request_values = explode("|", $request);

        // Isolamento dos valores da requisição em variáveis
        $panel = $request_values[0];
        $value_searched = $request_values[1];
        $offset = $request_values[2];
        $limit = $request_values[3];

        if($panel === "users_panel"){

            $model = new UserModel();
            
            $response = $model->loadSpecificUsers($value_searched, (int) $offset, (int) $limit);
    
            if($response["status"] && !$response["error"]){
    
                $dataFormated = $this->usersPanelDataFormat($response["data"], $limit);

                return array("status" => true, "records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]);
    
            }else if(!$response["status"] && $response["error"]){
    
                return array("status" => false, "error" => $response["error"]);
    
            }  

        }else if($panel === "profiles_panel"){

            $model = new ProfileHasModuleModel();

            // O LIMIT e o OFFSET originais devem ser multiplicados por 4
            // Isso ocorre porque cada grupo de quatro registros da tabela do BD serão agrupados em um
            $up_limit = $limit*4;
            $up_offset = $offset*4;

            $response = $model->loadProfileModuleRelationshipApproximate($value_searched, (int) $up_offset, (int) $up_limit);

            if($response["status"] && !$response["error"]){
                
                // Formatação dos dados para que se adequem ao format da tabela construída no frontend
                // Recebe os registros pesquisados, a quantidade total de registros, e o LIMIT original
                $dataFormated = $this->profilesPanelDataFormat($response["data"]["selectedRecords"], (int) $response["data"]["referencialValueForCalcPages"], $limit);

                return array("status" => true, "records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]);
    
            }else if(!$response["status"] && $response["error"]){
    
                return array("status" => false, "error" => $response["error"]);
    
            } 

        }

    }
    

    /**
     * Função para mostrar o formulário de edição
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($panel) : \Illuminate\Http\Response {
        

    }
    

    /**
     * Função para processar a edição de um registro
     * 
     * MÉTODO: PATCH
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $panel) : \Illuminate\Http\Response {

        if($panel === "users_panel"){

            $model = new UserModel();

            $data = [
                "nome" => $request->name,
                "email" => $request->email, 
                "status" => $request->status,
                "id_perfil" => $request->profile
            ];

            $update = $model->updateUserData($request->id, $data);

            if($update["status"] && !$update["error"]){

                return response("", 200);

            }else if(!$update["status"] && $update["error"]){

                return response(["error" => $update["error"]], 500);

            }

        }else if("profiles_panel"){

            $model = new ProfileModel();

            // Envia o ID do usuário para o WHERE
            // Envia o nome do perfil
            // Envia um array com os dados da relação do perfil com os módulos
            $update = $model->updateProfile($request->id, $request->name, $request->powers);

            if($update["status"] && !$update["error"]){

                return response("", 200);

            }else if(!$update["status"] && $update["error"]){

                return response(["error" => $update["error"]], 500);

            }

        }

    }
    
    /**
     * Função para processar a remoção de um registro
     * 
     * MÉTODO: DELETE
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $param) : \Illuminate\Http\Response {

        $query_params = explode("|", $param);
        $panel = $query_params[0];
        $id = $query_params[1];

        if($panel === "users_panel"){

            $model = new UserModel();

            $delete = $model->deleteUser($id);

            if($delete["status"]){

                return response("", 200);

            }else{

                return response("", 500);

            }

        }else if($panel === "profiles_panel"){

            $model = new ProfileModel();

            $delete = $model->deleteProfile($id);

            if($delete["status"] && !$delete["error"]){

                return response("", 200);

            }else if(!$delete["status"] && $delete["error"]){

                return response("", 500);

            }

        }

    }
    


}
