import * as React from 'react';
import { ResponsiveLine } from '@nivo/line'

const data = [
    {
        "id": "Acessos",
        "color": "hsl(166, 70%, 50%)",
        "data": [
            {
                "x": "Janeiro",
                "y": 154
            },
            {
                "x": "Fevereiro",
                "y": 201
            },
            {
                "x": "Março",
                "y": 240
            },
            {
                "x": "Abril",
                "y": 256
            },
            {
                "x": "Maio",
                "y": 25
            },
            {
                "x": "Junho",
                "y": 253
            },
            {
                "x": "Julho",
                "y": 94
            },
            {
                "x": "Agosto",
                "y": 136
            },
            {
                "x": "Setembro",
                "y": 195
            },
            {
                "x": "Outubro",
                "y": 61
            },
            {
                "x": "Novembro",
                "y": 12
            },
            {
                "x": "Dezembro",
                "y": 115
            }
        ]
    }
];

export const LinesChart = () => {

    return (
        <>
            <ResponsiveLine
                data={data}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                colors={{ scheme: 'category10' }}
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: true,
                    reverse: false
                }}
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 0,
                    tickPadding: 30,
                    tickRotation: 0,
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 0,
                    tickPadding: 10,
                    tickRotation: 0,
                    legend: `Novos usuários (${new Date().getFullYear()})`,
                    legendOffset: -50,
                    legendPosition: 'middle'
                }}
                pointSize={10}
                pointColor={"#1F77B4"}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
        </>
    );
}
