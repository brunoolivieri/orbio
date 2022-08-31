import * as React from 'react';
import { ResponsiveLine } from '@nivo/line'

const CustomSymbol = ({ size, color, borderWidth, borderColor }) => (
    <g>
        <circle fill="#fff" r={size / 2} strokeWidth={borderWidth} stroke={borderColor} />
        <circle
            r={size / 5}
            strokeWidth={borderWidth}
            stroke={borderColor}
            fill={color}
            fillOpacity={0.35}
        />
    </g>
);

export const LinesChart = React.memo((props) => {

    return (
        <>
            <ResponsiveLine
                data={props.data}
                enableArea={true}
                margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
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
                    legendOffset: -50,
                    legendPosition: 'middle',
                    format: e => Math.floor(e) === e && e
                }}
                pointSize={16}
                pointColor={"#1F77B4"}
                pointBorderWidth={1}
                pointSymbol={CustomSymbol}
                pointBorderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.3]],
                }}
                pointLabelYOffset={-12}
                useMesh={true}

            />
        </>
    );
});
