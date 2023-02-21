// React
import React from "react";
// React Router
import { BrowserRouter, Route, Routes } from "react-router-dom";
// Internal Layout
import { Layout } from "../components/shared/layout/Layout";
// All Pages
import { NotFound } from "../components/pages/notfound/NotFound";
import { Login } from "../components/pages/external/login/Login";
import { ForgotPassword } from "../components/pages/external/forgotpassword/ForgotPassword";
import { Dashboard } from "../components/pages/internal/Dashboard/Dashboard";
import { FlightPlansAndLogs } from "../components/pages/internal/flightplans-logs/FlightPlansAndLogs";
import { Reports } from "../components/pages/internal/reports/Reports";
import { Account } from "../components/pages/internal/account/Account";
import { Administration } from "../components/pages/internal/administration/Administration";
import { ServiceOrders } from "../components/pages/internal/service_orders/ServiceOrders";
import { DronesBatteriesAndEquipments } from "../components/pages/internal/equipments/DronesBatteriesAndEquipments";


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
            <Route exact path="planos" element={<FlightPlansAndLogs />} />
            <Route exact path="relatorios" element={<Reports />} />
            <Route exact path="conta" element={<Account />} />
            <Route exact path="administracao" element={<Administration />} />
            <Route exact path="ordens" element={<ServiceOrders />} />
            <Route exact path="equipamentos" element={<DronesBatteriesAndEquipments />} />
        </Routes>
    )
}