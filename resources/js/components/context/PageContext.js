import * as React from "react";

const PageContext = React.createContext(0);

// Provider
export function PageProvider({ children }) {

    const [pageIndex, setPageIndex] = React.useState(0);

    return (

        <PageContext.Provider value={{ pageIndex, setPageIndex }}>

            {children}

        </PageContext.Provider>
    )
}

// Hook
export function usePage() {

    const context = React.useContext(PageContext);

    return context;

}