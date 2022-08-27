import * as React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box } from '@mui/system';

export const PizzaChart = React.memo((props) => {

    return (
        <>
            <Box width={'100%'} height={220}>
                <ResponsivePie
                    data={props.data}
                    innerRadius={0.1}
                    margin={{ top: 10, right: 0, left: 5, bottom: 65 }}
                    padAngle={0.7}
                    cornerRadius={3}
                    arcLabelsTextColor={"#000"}
                    activeOuterRadiusOffset={8}
                    colors={{ scheme: 'nivo' }}
                    borderWidth={1}
                    enableArcLinkLabels={false}
                    arcLinkLabelsThickness={5}
                    isInteractive={true}
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: 56,
                            itemsSpacing: 5,
                            itemWidth: 105,
                            itemHeight: 18,
                            itemTextColor: '#fff',
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 15,
                            symbolShape: 'circle'
                        }
                    ]}
                />
            </Box>
        </>
    );


});