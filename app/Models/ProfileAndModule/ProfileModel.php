<?php

namespace App\Models\ProfileAndModule;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Models\ProfileAndModule\ProfileHasModuleModel;
use  App\Models\User\UserModel;

class ProfileModel extends Model
{
    use HasFactory;

    protected $table = "profile";
    const CREATED_AT = "dh_criacao";
    const UPDATED_AT = "dh_atualizacao";

    function newProfile(array $data) : array {

        try{

            // Inicialização da transação
            DB::beginTransaction();

            // Contador: verificar se o email já existe no banco de dados
            $checkIfExists = ProfileModel::where('nome', $data["profile_name"])->exists();

            if($checkIfExists){

                // Se a operação falhar, desfazer as transações
                DB::rollBack();

                // Erro do tipo "email já existe"
                return ["status" => false, "error" => "name"];

            }else{

                $this->nome = $data["profile_name"];
                $this->acesso_geral = $data["access"];

                // Se a inserção na tabela "users" for bem sucedida
                if($insert = $this->save()){

                    $createdProfileID = $this->id;

                    $model = new ProfileHasModuleModel();

                    $newRelationship = $model->newProfileRelationship($createdProfileID);

                    // Log da operação realizada
                    Log::channel("internal")->info("Registro de perfil realizado com sucesso. Dados: [ID do Novo Perfil: {$createdProfileID}]");

                    // Se a operação for bem sucedida, confirmar
                    DB::commit();

                    // Retornar Status 200 com o ID da inserção
                    return ["status" => true, "error" => false];

                }else{

                    // Se a operação falhar, desfazer as transações
                    DB::rollBack();

                    // Retornar resposta com erro do tipo "genérico"
                    return ["status" => false, "error" => "generic"];

                }

            }  

        }catch(\Exception $e){

            // Log do erro
            Log::channel("internal")->error("Falha no registro de perfil. Erro: ".$e);

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            // Retornar resposta com erro do tipo "genérico"
            return ["status" => false, "error" => "generic"];

        }

    }

    function loadAllProfiles() : array {

        try{

            // Inicialização da transação
            DB::beginTransaction();

            if($returnedRecords = ProfileModel::all()){

                 // Se a operação for bem sucedida, confirmar
                 DB::commit();

                 return ["status" => true, "error" => false, "data" => $returnedRecords];

            }else{

                // Se a operação falhar, desfazer as transações
                DB::rollBack();

                return ["status" => false, "error" => true];

            }
                
                
        }catch(\Exception $e){

            // Log do erro
            Log::channel("internal")->error("Falha no carregamento dos perfis. Erro: ".$e);

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            return ["status" => false, "error" => true];

        }


    }

    function updateProfile(int $id, string $profile_name, array $profile_module_table_data) : array {

        try{

            // Inicialização da transação
            DB::beginTransaction();

            // Se existe um Perfil com o nome informado
            if(ProfileModel::where('nome', $profile_name)->where('id', '!=', $id)->exists()){

                // Erro do tipo "nome"
                return ["status" => false, "error" => "name_already_exists"];

            }else{

                $profile_update = ProfileModel::where('id', $id)->update(["nome" => $profile_name]);

                if($profile_update){

                    // O perfil teve seus dados básicos atualizados (tabela 'profile')
                    // Agora é preciso atualizar a relação dele com os módulos (tabela 'profile_has_module')

                    $model = new ProfileHasModuleModel();

                    $profile_module_update = $model->updateProfileModuleRelationship($id, $profile_module_table_data);

                    if($profile_module_update["status"] && !$profile_module_update["error"]){

                        // Log da operação realizada
                        Log::channel("internal")->info("Atualização de perfil realizada com sucesso. Dados: [ID do Perfil: $id]");

                        // Se a operação for bem sucedida, confirmar
                        DB::commit();

                        return ["status" => true, "error" => false];

                    }else if(!$profile_module_update["status"] && $profile_module_update["error"]){

                        // Se a operação falhar, desfazer as transações
                        DB::rollBack();

                        return ["status" => false, "error" => true];

                    }

                }else{

                    // Se a operação falhar, desfazer as transações
                    DB::rollBack();

                    return ["status" => false, "error" => true];

                }

            }

        }catch(\Exception $e){

            // Log do erro
            Log::channel("internal")->error("Falha na atualização do perfil. Dados: [ID do Perfil: $id]. Erro: ".$e);

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            return ["status" => false, "error" => true];

        }

    }

    /**
     * Método realizar um DELETE em um registro especifico da tabela "profiles"
     *
     * @param int $userid
     * @return array
     */
    function deleteProfile(int $profileID) : array {

        try{

            // Inicialização da transação
            DB::beginTransaction();

            $delete = ProfileModel::where('id', $profileID)->delete();

            if($delete){

                // Log da operação realizada
                Log::channel("internal")->info("Deleção de perfil realizada com sucesso. Dados: [ID do Perfil: $profileID]");

                // Se a operação for bem sucedida, confirmar
                DB::commit();

                return ["status" => true, "error" => false];

            }else{

                // Se a operação falhar, desfazer as transações
                DB::rollBack();

                return ["status" => false, "error" => true];

            }

        }catch(\Exception $e){

            // Log do erro
            Log::channel("internal")->error("Falha na deleção do perfil. Dados: [ID do Perfil: $profileID]. Erro: ".$e);

            // Se a operação falhar, desfazer as transações
            DB::rollBack();

            return ["status" => false, "error" => true];

        }


    }


}
