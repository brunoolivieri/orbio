import * as React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box } from '@mui/system';
import { animated } from '@react-spring/web';

export const PizzaChart = React.memo((props) => {

    const CenteredMetric = ({ centerX, centerY }) => {

        return (
            <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                    fontSize: '25px',
                    fontWeight: 600,
                }}
            >
                {props.total}
            </text>
        )
    }

    return (
        <>
            <Box width={'100%'} height={220}>
                <ResponsivePie
                    data={props.data}
                    innerRadius={0.6}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    colors={{ datum: 'data.color' }}
                    padAngle={0.7}
                    cornerRadius={2}
                    arcLabelsTextColor={"#000"}
                    borderColor={"transparent"}
                    activeOuterRadiusOffset={5}
                    borderWidth={1}
                    enableArcLinkLabels={false}
                    arcLabelsComponent={({ label, style }) => (
                        <animated.g transform={style.transform} style={{ pointerEvents: 'none' }}>
                            <circle fill={"transparent"} cy={6} r={15} />
                            <circle fill="#ffffff" stroke={"transparent"} strokeWidth={2} r={16} />
                            <text
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill={style.textColor}
                                style={{
                                    fontSize: 10,
                                    fontWeight: 800,
                                }}
                            >
                                {label}
                            </text>
                        </animated.g>
                    )}
                    arcLinkLabelsThickness={2}
                    isInteractive={true}
                    layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', CenteredMetric]}
                />
            </Box>
        </>
    );


});