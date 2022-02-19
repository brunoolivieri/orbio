// ==== STATE GLOBAL DA AUTENTICAÇÃO ==== //

import React, {useState, useContext, createContext} from 'react';

//Cria um objeto Contexto (context)
const AuthenticationContext = createContext({status: false});

// PROVIDER
export function AuthProvider({children}){

    //O state é inicializado aqui, no contexto
    const [AuthData, setAuthData] = useState({});

    return(

        // O contexto deve ser pai, ou embrulhar o componente em que será disponibilizado
        // Então vou embrular o componente de Rota existente no arquivo index.js
        <AuthenticationContext.Provider value = {{AuthData, setAuthData}}>

            {children} 

        </AuthenticationContext.Provider>
    )
}

// HOOK 
export function useAuthentication(){

    //Context recebe o atual valor do contexto UserContext
    const context = useContext(AuthenticationContext);

    //O retorno de context é o retornar de um objeto {userData, setUserData} com valores atualizados
    return context;

}