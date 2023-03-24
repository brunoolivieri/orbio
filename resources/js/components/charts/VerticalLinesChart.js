import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function VerticalLinesChart(props) {

    const data = [
        {
            name: 'Janeiro',
            ativos: props.data.months.january.active,
            deletados: props.data.months.january.trashed
        },
        {
            name: 'Fevereiro',
            ativos: props.data.months.february.active,
            deletados: props.data.months.february.trashed
        },
        {
            name: 'Março',
            ativos: props.data.months.march.active,
            deletados: props.data.months.march.trashed
        },
        {
            name: 'Abril',
            ativos: props.data.months.april.active,
            deletados: props.data.months.april.trashed
        },
        {
            name: 'Maio',
            ativos: props.data.months.may.active,
            deletados: props.data.months.may.trashed
        },
        {
            name: 'Junho',
            ativos: props.data.months.june.active,
            deletados: props.data.months.june.trashed
        },
        {
            name: 'Julho',
            ativos: props.data.months.july.active,
            deletados: props.data.months.july.trashed
        },
        {
            name: 'Agosto',
            ativos: props.data.months.august.active,
            deletados: props.data.months.august.trashed
        },
        {
            name: 'Setembro',
            ativos: props.data.months.september.active,
            deletados: props.data.months.september.trashed
        },
        {
            name: 'Outubro',
            ativos: props.data.months.october.active,
            deletados: props.data.months.october.trashed
        },
        {
            name: 'Novembro',
            ativos: props.data.months.november.active,
            deletados: props.data.months.november.trashed
        },
        {
            name: 'Dezembro',
            ativos: props.data.months.december.active,
            deletados: props.data.months.december.trashed
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
