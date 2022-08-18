import * as React from 'react';
import { BarChart, Bar, Tooltip, Legend, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
    {
        "name": "Janeiro",
        "Acessos": 27
    },
    {
        "name": "Fevereiro",
        "Acessos": 25
    },
    {
        "name": "Abril",
        "Acessos": 12
    },
    {
        "name": "Março",
        "Acessos": 45
    },
    {
        "name": "Junho",
        "Acessos": 42
    },
    {
        "name": "Julho",
        "Acessos": 77
    },
    {
        "name": "Agosto",
        "Acessos": 16
    },
    {
        "name": "Setembro",
        "Acessos": 31
    },
    {
        "name": "Outubro",
        "Acessos": 33
    },
    {
        "name": "Novembro",
        "Acessos": 7
    },
    {
        "name": "Dezembro",
        "Acessos": 47
    }
]

export const LinesChart = () => {

    return (
        <>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Acessos" fill="#82CA9D" />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}
