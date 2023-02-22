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
                <Route path="/dashboard" element={
                    <Layout>
                        <Dashboard />
                    </Layout>
                } />
                <Route path="/administracao" element={
                    <Layout>
                        <Administration />
                    </Layout>
                } />
                <Route path="/planos" element={
                    <Layout>
                        <FlightPlansAndLogs />
                    </Layout>
                } />
                <Route path="/ordens" element={
                    <Layout>
                        <ServiceOrders />
                    </Layout>
                } />
                <Route path="/relatorios" element={
                    <Layout>
                        <Reports />
                    </Layout>
                } />
                <Route path="/equipamentos" element={
                    <Layout>
                        <DronesBatteriesAndEquipments />
                    </Layout>
                } />
                <Route path="/conta" element={
                    <Layout>
                        <Account />
                    </Layout>
                } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}