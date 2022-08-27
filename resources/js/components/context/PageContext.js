import * as React from "react";

const PageContext = React.createContext("DASHBOARD");

// Provider
export function PageProvider({ children }) {

    const [page, setPage] = React.useState("DASHBOARD");

    return (

        <PageContext.Provider value={{ page, setPage }}>

            {children}

        </PageContext.Provider>
    )
}

// Hook
export function usePage() {

    const context = React.useContext(PageContext);

    return context;

}