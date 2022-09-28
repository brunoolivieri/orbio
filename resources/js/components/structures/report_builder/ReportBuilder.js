import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Create styles
const styles = StyleSheet.create({
    viewer: {
        width: "100%",
        height: "650px"
    },
    page: {
        flexDirection: 'row'
    },
    section: {
        flexGrow: 1
    }
});

export const ReportBuilder = React.memo((props) => {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (

        <>
            <Button variant="contained" onClick={handleClickOpen} startIcon={<VisibilityIcon />}>Visualizar</Button>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    {"Visualização do relatório"}
                </DialogTitle>
                <DialogContent>

                    <PDFViewer style={styles.viewer}>
                        <Document>
                            <Page size="A4" style={styles.page}>

                                <View style={styles.section}>
                                    <Text>Section #1</Text>
                                </View>
                                <View style={styles.section}>
                                    <Text>Section #2</Text>
                                </View>
                            </Page>
                        </Document>
                    </PDFViewer>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Fechar</Button>
                </DialogActions>
            </Dialog>
        </>

    );
});