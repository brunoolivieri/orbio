import * as React from 'react';
// Custom
import { DocumentsFormulary } from './formulary/DocumentsFormulary';
import { AddressFormulary } from './formulary/AddressFormulary';

export function ComplementaryInformation() {
    return (
        <>
            <DocumentsFormulary />
            <AddressFormulary />
        </>
    );
}