import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import VisibilityIcon from '@mui/icons-material/Visibility';
// Assets
import BirdviewLogo from "../../assets/images/Logos/Birdview.png";

// Create styles
const styles = StyleSheet.create({
    viewer: {
        width: "100%",
        height: "650px"
    },
    page: {
        flexDirection: 'row',
        padding: 40
    },
    container: {
        display: 'flex',
        flexDirection: 'column'
    },
    section: {
        flexGrow: 1
    },
    top_text: {
        padding: '5px 5px 5px 0',
        fontSize: '12px',
        fontWeight: '900'
    },
    logo: {
        width: '90px',
        height: '40px',
        marginBottom: '20px'
    }
});

export const ReportBuilder = React.memo((props) => {

    const [open, setOpen] = React.useState(false);

    const [report, setReport] = React.useState({});

    const handleClickOpen = () => {
        setOpen(true);
        setReport(props.data);
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

                                    <Image
                                        src={BirdviewLogo}
                                        style={styles.logo}
                                    ></Image>
                                    <Text style={styles.top_text}>{`RELATÓRIO: ${report.name}`.toUpperCase()}</Text>
                                    <Text style={styles.top_text}>{`CLIENTE: ${report.client}`.toUpperCase()}</Text>
                                    <Text style={styles.top_text}>{`REGIÃO: ${report.city}, ${report.state}`.toUpperCase()}</Text>
                                    <Text style={styles.top_text}>{`FAZENDA: ${report.farm}`.toUpperCase()}</Text>

                                </View>
                                
                                <Text style={styles.top_text}>{`RELATÓRIO: ${report.name}`.toUpperCase()}</Text>
                                <Text style={styles.top_text}>{`CLIENTE: ${report.client}`.toUpperCase()}</Text>
                                <Text style={styles.top_text}>{`REGIÃO: ${report.city}, ${report.state}`.toUpperCase()}</Text>
                                <Text style={styles.top_text}>{`FAZENDA: ${report.farm}`.toUpperCase()}</Text>


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