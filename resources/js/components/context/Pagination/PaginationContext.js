// ==== STATE GLOBAL DA AUTENTICAÇÃO ==== //

import React, {useState, useContext, createContext} from 'react';

//Cria um objeto Contexto (context)
const PaginationContext = createContext();

// PROVIDER
export function PaginationProvider({children}){

    //O state é inicializado aqui, no contexto
    const [actualPage, setActualPage] = useState("DASHBOARD");

    return(

        // O contexto deve ser pai, ou embrulhar o componente em que será disponibilizado
        // Então vou embrular o componente de Rota existente no arquivo index.js
        <PaginationContext.Provider value = {{actualPage, setActualPage}}>

            {children} 

        </PaginationContext.Provider>
    )
}

// HOOK 
export function usePagination(){

    //Context recebe o atual valor do contexto UserContext
    const context = useContext(PaginationContext);

    //O retorno de context é o retornar de um objeto {userData, setUserData} com valores atualizados
    return context;

}