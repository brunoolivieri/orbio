import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import WifiIcon from '@mui/icons-material/Wifi';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ReplayIcon from '@mui/icons-material/Replay';
// Libs
import moment from 'moment';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const DroneLogsList = React.memo((props) => {

    const [open, setOpen] = React.useState(false);

    const handleClickRecord = (event) => {

        const log_name = event.currentTarget.value;

        // Clone for sync the modifications
        let selectedLogsClone = [...selectedLogs];

        const indexOf = selectedLogsClone.indexOf(log_name);

        if (indexOf == -1) {

            selectedLogsClone.push(log_name);


        } else {

            selectedLogsClone.splice(indexOf);
        }

        setSelectedLogs(selectedLogsClone);
        props.setSelectedLogs(selectedLogsClone);

    }

    const handleSaveAndClose = () => {
        setOpen(false);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseUnsaved = () => {
        setSelectedLogs([]);
        props.setSelectedLogs([]);
        setOpen(false);
    };

    return (
        <>
            <Button variant="outlined" startIcon={<WifiIcon />} onClick={handleClickOpen}>
                {`Logs disponíveis: ${logsList.length - selectedLogs.length}`}
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleCloseUnsaved}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative', bgcolor: "#fff" }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="primary"
                            onClick={handleCloseUnsaved}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {loading ? <CircularProgress /> :
                                <IconButton
                                    edge="start"
                                    color="primary"
                                    aria-label="close"
                                    onClick={() => setRefresh((previously) => !previously)}
                                >
                                    <ReplayIcon />
                                </IconButton>
                            }
                        </Typography>
                        <Button autoFocus color="primary" variant="contained" onClick={handleSaveAndClose}>
                            CONFIRMAR
                        </Button>
                    </Toolbar>
                </AppBar>
                <List>

                    {!loading && logsList.length > 0 &&
                        logsList.map((log, index) =>
                            <>
                                <ListItem
                                    button
                                    key={index}
                                    secondaryAction={
                                        <Checkbox
                                            edge="end"
                                            value={log.name}
                                            onChange={handleClickRecord}
                                            checked={selectedLogs.includes(log.name)}
                                        />
                                    }
                                    disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <InsertDriveFileIcon color={"success"} />
                                        </ListItemIcon>
                                        <ListItemText id={index} primary={log.name} secondary={"Data: " + moment(log.datetime).format('DD/MM/YYYY') + " | Tamanho: " + log.size} />
                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                            </>
                        )
                    }
                </List>
            </Dialog>
        </>
    );
});
