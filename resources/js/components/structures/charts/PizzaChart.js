import * as React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box } from '@mui/system';

const data = [
    {
        "id": "Ativos",
        "label": "Ativos",
        "value": 100
    },
    {
        "id": "Inativos",
        "label": "Inativos",
        "value": 200
    }
];

export const PizzaChart = React.memo((props) => {

    return (
        <>
            <Box width={'100%'} height={220}>
                <ResponsivePie
                    data={data}
                    innerRadius={0.5}
                    margin={'auto'}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'darker',
                                0.2
                            ]
                        ]
                    }}
                    arcLinkLabelsSkipAngle={5}
                    arcLinkLabelsTextColor="#fff"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    enableArcLabels={true}
                    arcLabelsSkipAngle={10}
                    isInteractive={false}
                />
            </Box>
        </>
    );


});