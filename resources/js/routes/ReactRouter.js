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
import { Administration } from "../components/pages/internal/administration/Administration";
import { Configurations } from "../components/pages/internal/configurations/Configurations";
import { Support } from "../components/pages/internal/support/Support";
import { ServiceOrders } from "../components/pages/internal/orders/ServiceOrders";
import { Incidents } from "../components/pages/internal/incidents/Incidents";
import { Equipments } from "../components/pages/internal/equipments/Equipments";

export function ReactRoutes() {

    return (

        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route exact path="/internal/*" element={<Layout />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>

    )

}

export function InternalRoutes({ ...props }) {

    return (

        <Routes>
            <Route index element={<Dashboard setPage={props.setPage} />} />
            <Route exact path="planos" element={<Plans setPage={props.setPage} />} />
            <Route exact path="relatorios" element={<Reports setPage={props.setPage} />} />
            <Route exact path="conta" element={<Account setPage={props.setPage} />} />
            <Route exact path="configuracoes" element={<Configurations setPage={props.setPage} />} />
            <Route exact path="administracao" element={<Administration setPage={props.setPage} />} />
            <Route exact path="suporte" element={<Support setPage={props.setPage} />} />
            <Route exact path="ordens" element={<ServiceOrders setPage={props.setPage} />} />
            <Route exact path="incidentes" element={<Incidents setPage={props.setPage} />} />
            <Route exact path="equipamentos" element={<Equipments setPage={props.setPage} />} />
        </Routes>

    )
}