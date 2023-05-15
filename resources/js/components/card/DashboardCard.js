import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const DashboardCard = React.memo((props) => {

    return (

        <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 flex items-center"><span className="mr-2">{props.icon}</span>{props.title}</h5>
                <p className="text-base font-semibold text-green-600">
                    {props.total}
                </p>
            </div>
            <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200">
                    {props.loading ?
                        <LinearProgress />
                        :
                        props.data.map((item, index) =>
                            <>
                                <li className="py-3 sm:py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.label}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {item.text}
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center text-base text-gray-900">
                                            {item.value}
                                        </div>
                                    </div>
                                </li>
                            </>
                        )
                    }
                </ul>
            </div>
        </div>

    )
});