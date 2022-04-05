<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdministrationModuleProfilePanelController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $request_values = explode(".", request()->args);
        $limit = $request_values[1];

        $model = new ProfileHasModuleModel();

        // O LIMIT e o OFFSET originais devem ser multiplicados por 5
        // Isso ocorre porque cada grupo de cinco registros da tabela do BD serão agrupados em um
        $up_limit = $limit*5;
        $up_offset = $offset*5;

        $model_response = $model->loadAllRecords((int) $up_offset, (int) $up_limit);

        if($model_response["status"] && !$model_response["error"]){

            $dataFormated = $this->profilesPanelDataFormat($model_response["data"]["selectedRecords"], $model_response["data"]["referencialValueForCalcPages"], $limit);

            return response(["status" => true, "records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["status" => false, "error" => $response["error"]], 500);

        } 
        
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

        // O Do While deve reunir em uma só linha cada conjunto de 5 registros em que o campo id_perfil se repete
        // Cada perfil tem quatro linhas na tabela, e em cada uma dessas linhas o valor do campo "id_modulo" varia
        // Ou seja: cada linha com o mesmo "id_perfil" representa uma relação desse perfil com um determinado módulo (1,2,3, 4 ou 5)

        do{
           
            // A atual posição do array, que é igual ao valor do perfil, recebe as chaves "profile_id" e "profile_name"
            // Mesmo variando a linha, se o perfil continuar sendo o mesmo, essas chaves receberão o mesmo valor
            $profile_name = $data[$row]->nome_perfil;
            $arrData[(int) $profileCounter] = ["profile_id" => $data[$row]->id_perfil, "profile_name" =>  $profile_name, "profile_access" => $data[$row]->acesso_geral, "modules" => array()]; 

            // O array $modulesCurrentProfile recebe os valores dos poderes CRUD do atual perfil
            // São empurrados novos array enquanto o id do módulo não for igual a 5
            // A linha, $row, varia a cada loop, também o valor do campo "id_modulo", mas o campo "id_perfil" se mantém o mesmo por 5 loops (porque existem 5 módulos relacionados)
            // Ou seja, enquanto o id do perfil for X entre os registros percorridos, o array abaixo receberá, a cada variação de $row, novos valores CRUD referente a relação com outro módulo
            $module_name = $data[$row]->id_modulo == 1 ? "Administração" : ($data[$row]->id_modulo === 2 ? "Planos" : ($data[$row]->id_modulo === 3 ? "Ordens" : ($data[$row]->id_modulo === 4 ? "Relatorios" : "Incidentes")));
            $modulesCurrentProfile[$data[$row]->id_modulo] = ["mod_name" => $module_name, "profile_powers" => ["ler" => $data[$row]->ler, "escrever" => $data[$row]->escrever]];
            
            // Se o ID do módulo atual for igual a 5
            if($data[$row]->id_modulo == 5){

                // Então agora existem 5 arrays armazenados no array: $modulesCurrentProfile = [[...], [...], [...], [...], [...]]
                // Em cada posição tem as relações de poder do atual perfil, "id_perfil", com cada um dos quatro módulos existentes
                // Agora essa estrutura é jogada para dentro do $arrData na posição cujo valor é igual ao id do atual perfil
                $arrData[$profileCounter]["modules"] = $modulesCurrentProfile;

                // Ou seja, se existe um perfil com ID 1, o $arrData terá uma posição [1] com 5 arrays
                // Essa posição [1] terá as relações do perfil de ID 1 com os 5 módulos existentes

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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
        try{

            $data = ProfileModel::all();

            return response($data, 200);
    
        }catch(\Exception $e){

            return response(["error" => $e->getMessage()], 500);

        }

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        
        $model = new ProfileModel();

        $model_response = $model->newProfile($request->except("auth", "panel"));

        if($model_response["status"] === true && !$model_response["error"]){

            return response(["error" => $model_response["error"]], 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
        $model = new ProfileHasModuleModel();

        // O LIMIT e o OFFSET originais devem ser multiplicados por 5
        // Isso ocorre porque cada grupo de cinco registros da tabela do BD serão agrupados em um
        $up_limit = $limit*5;
        $up_offset = $offset*5;

        $model_response = $model->loadRecordCompatibleWithTheSearchedValue($value_searched, (int) $up_offset, (int) $up_limit);

        if($model_response["status"] && !$model_response["error"]){
            
            $dataFormated = $this->profilesPanelDataFormat($model_response["data"]["selectedRecords"], (int) $model_response["data"]["referencialValueForCalcPages"], $limit);

            return response(["records" => $dataFormated[1], "total_pages" =>  $dataFormated[0]], 200);

        }else if(!$model_response["status"] && $model_response["error"]){
            
            return response(["error" => $model_response["error"]], 500);

        } 

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        
        $model = new ProfileModel();

        $model_response = $model->updateProfile((int) $id, $request->profile_name, $request->profile_modules_relationship);

        if($model_response["status"] && !$model_response["error"]){

            return response("", 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $model = new ProfileModel();

        $model_response = $model->deleteProfile($id);

        if($model_response["status"] && !$model_response["error"]){

            return response("", 200);

        }else if(!$model_response["status"] && $model_response["error"]){

            return response(["error" => $model_response["error"]], 500);

        }

    }
}
