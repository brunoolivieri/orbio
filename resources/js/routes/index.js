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
import { FlightPlans } from "../components/pages/internal/flight_plans/FlightPlans";
import { Reports } from "../components/pages/internal/reports/Reports";
import { Account } from "../components/pages/internal/account/Account";
import { Administration } from "../components/pages/internal/administration/Administration";
import { Support } from "../components/pages/internal/support/Support";
import { ServiceOrders } from "../components/pages/internal/service_orders/ServiceOrders";
import { Incidents } from "../components/pages/internal/incidents/Incidents";
import { Equipments } from "../components/pages/internal/equipments/Equipments";

export function MainRoutes() {
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

export function InternalRoutes() {
    return (
        <Routes>
            <Route index element={<Dashboard />} />
            <Route exact path="planos" element={<FlightPlans />} />
            <Route exact path="relatorios" element={<Reports />} />
            <Route exact path="conta" element={<Account />} />
            <Route exact path="administracao" element={<Administration />} />
            <Route exact path="suporte" element={<Support />} />
            <Route exact path="ordens" element={<ServiceOrders />} />
            <Route exact path="incidentes" element={<Incidents />} />
            <Route exact path="equipamentos" element={<Equipments />} />
        </Routes>
    )
}