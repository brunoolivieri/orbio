import * as React from 'react';
// Mui
import { AppBar, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MapIcon from '@mui/icons-material/Map';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// Custom
import { usePage } from '../../context/PageContext';

export function SubHeader() {

    const { pageIndex } = usePage();

    const pages = [
        { icon: <DashboardIcon />, title: "DASHBOARD" },
        { icon: <AdminPanelSettingsIcon sx={{ mr: 1 }} />, title: "ADMINISTRAÇÃO" },
        { icon: <MapIcon sx={{ mr: 1 }} />, title: "PLANOS DE VOO E LOGS" },
        { icon: <AssignmentIcon sx={{ mr: 1 }} />, title: "ORDENS DE SERVIÇO" },
        { icon: <AssessmentIcon sx={{ mr: 1 }} />, title: "RELATÓRIOS" },
        { icon: <HomeRepairServiceIcon sx={{ mr: 1 }} />, title: "EQUIPAMENTOS" },
        { icon: <AccountCircleIcon sx={{ mr: 1 }} />, title: "MINHA CONTA" }
    ];

    return (
        <AppBar position="static" className='shadow-sm'>
            <Toolbar className="bg-white dark:bg-[#1F2937]">
                <Typography variant="h7" fontWeight={600} className='text-green-700 dark:text-white'>{pages[pageIndex].title}</Typography>
            </Toolbar>
        </AppBar>
    )
}