import * as React from 'react';
import {
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton
} from '@mui/x-data-grid';

const csvOptions = {
    fileName: 'table-data',
    delimiter: ';',
    utf8WithBom: true,
    includeHeaders: true
}

export function TableToolbar() {
    return (
        <GridToolbarContainer className="bg-green-700">
            <GridToolbarColumnsButton sx={{ color: '#fff' }} />
            <GridToolbarFilterButton sx={{ color: '#fff' }} />
        </GridToolbarContainer>
    );
}