import React from 'react';
import ReactDOM from 'react-dom';

// ==== Importação do componente que unifica o sistema de roteamento ==== //
import { ReactRoutes } from "./routes/ReactRouter";

// ==== Importação do provider do state global AuthenticationContext ==== //
import { AuthProvider } from './components/context/InternalRoutesAuth/AuthenticationContext';

// ==== IMportação do provider do state global de paginação ==== //
import { PaginationProvider } from "./components/context/Pagination/PaginationContext";

export default function Index() {

    return (
        <>
            <React.StrictMode>
                <AuthProvider>
                    <PaginationProvider>
                        <ReactRoutes/>
                    </PaginationProvider>
                </AuthProvider>
            </React.StrictMode>
        </>
    );
}

if (document.getElementById('root')) {

    ReactDOM.render(<Index/>, document.getElementById('root'));
}
