import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function VerticalLinesChart(props) {

    const data = [
        {
            name: 'Janeiro',
            ativos: 4000,
            deletados: 2400
        },
        {
            name: 'Fevereiro',
            ativos: 3000,
            deletados: 1398,
            amt: 2210,
        },
        {
            name: 'Março',
            ativos: 9000,
            deletados: 2800,
            amt: 2290,
        },
        {
            name: 'Abril',
            ativos: 5780,
            deletados: 1908,
            amt: 2000,
        },
        {
            name: 'Maio',
            ativos: 1890,
            deletados: 4800,
            amt: 2181,
        },
        {
            name: 'Junho',
            ativos: 2390,
            deletados: 3800,
            amt: 2500,
        },
        {
            name: 'Julho',
            ativos: 3490,
            deletados: 4300,
            amt: 2100,
        },
        {
            name: 'Agosto',
            ativos: 3490,
            deletados: 4300,
            amt: 2100,
        },
        {
            name: 'Setembro',
            ativos: 3490,
            deletados: 4300,
            amt: 2100,
        },
        {
            name: 'Outubro',
            ativos: 3490,
            deletados: 4300,
            amt: 2100,
        },
        {
            name: 'Novembro',
            ativos: 3490,
            deletados: 4300,
            amt: 2100,
        },
        {
            name: 'Dezembro',
            ativos: 3490,
            deletados: 4300,
            amt: 2100,
        },
    ];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                width={'100%'}
                height={'100%'}
                data={data}
            >
                <Tooltip offset={0} />
                <Line type="monotone" dataKey="ativos" stroke="#82ca9d" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="deletados" stroke="#FF7C74" />
            </LineChart>
        </ResponsiveContainer>
    )
}
