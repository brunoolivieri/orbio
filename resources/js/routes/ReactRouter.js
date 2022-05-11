// React
import React from "react";
// React Router
import { BrowserRouter, Route, Routes } from "react-router-dom";
// Custom pages
import { NotFound } from "../components/pages/notfound/NotFound";
import { Login } from "../components/pages/external/login/Login";
import { ForgotPassword } from "../components/pages/external/forgotpassword/ForgotPassword";
import { Layout } from "../components/pages/internal/layout/Layout";
import { Dashboard } from "../components/pages/internal/Dashboard/Dashboard";
import { Plans } from "../components/pages/internal/plans/Plans";
import { Reports } from "../components/pages/internal/reports/Reports";
import { Account } from "../components/pages/internal/account/Account";
import { AdministrationPanel } from "../components/pages/internal/administration/AdministrationPanel";
import { Configurations } from "../components/pages/internal/configurations/Configurations";
import { Support } from "../components/pages/internal/support/Support";
import { ServiceOrders } from "../components/pages/internal/orders/ServiceOrders";
import { Incidents } from "../components/pages/internal/incidents/Incidents";
// Provider da paginação
import { PaginationProvider } from "../components/context/Pagination/PaginationContext";

export function ReactRoutes() {

    return (

        <BrowserRouter>
            <Routes>
                <Route path="/acessar" element={<Login />} />
                <Route path="/recuperarsenha" element={<ForgotPassword />} />
                <Route exact path="/sistema/*" element={<PaginationProvider><Layout /></PaginationProvider>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>

    )

}

export function InternalRoutes() {

    // CRIAR ROTAS PRIVADAS

    return (

        <Routes>
            <Route index element={<Dashboard />} />
            <Route exact path="planos" element={<Plans />} />
            <Route exact path="relatorios" element={<Reports />} />
            <Route exact path="conta" element={<Account />} />
            <Route exact path="configuracoes" element={<Configurations />} />
            <Route exact path="administracao" element={<AdministrationPanel />} />
            <Route exact path="suporte" element={<Support />} />
            <Route exact path="ordens" element={<ServiceOrders />} />
            <Route exact path="incidentes" element={<Incidents />} />
        </Routes>

    )
}