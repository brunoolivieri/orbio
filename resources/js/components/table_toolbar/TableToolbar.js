import * as React from 'react';
import {
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport
} from '@mui/x-data-grid';

const csvOptions = {
    fileName: 'table-data',
    delimiter: ';',
    utf8WithBom: true,
    includeHeaders: true
}

export function TableToolbar() {
    return (
        <GridToolbarContainer sx={{ boxShadow: 1, padding: 1, backgroundColor: '#007937' }}>
            <GridToolbarColumnsButton sx={{ color: '#fff' }} />
            <GridToolbarFilterButton sx={{ color: '#fff' }} />
            <GridToolbarDensitySelector sx={{ color: '#fff' }} />
            {/* <GridToolbarExport sx={{ color: '#fff' }} GridCsvExportOptions={csvOptions} /> */}
        </GridToolbarContainer>
    );
}