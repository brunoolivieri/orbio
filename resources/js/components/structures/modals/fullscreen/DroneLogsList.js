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
// Custom
import AxiosApi from '../../../../services/AxiosApi';
// Libs
import moment from 'moment';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const DroneLogsList = React.memo((props) => {

    const [open, setOpen] = React.useState(false);

    const [loading, setLoading] = React.useState(true);
    const [refresh, setRefresh] = React.useState(false);
    const [logs, setLogs] = React.useState([]);

    React.useEffect(() => {

        setLogs([]);

        const ip = props.source.ip;
        const http_port = props.source.http_port;

        AxiosApi.get(`api/get-drone-logs?ip=${ip}&http_port=${http_port}`)
            .then(function (response) {

                console.log(response.data)

                setLoading(false);
                setLogs(response.data);

            })
            .catch(function (error) {

                console.log(error)
                setLoading(false);
                setLogs([]);

            });

    }, [refresh]);

    const handleClickRecord = (event) => {

        const log_id = parseInt(event.currentTarget.value);

        // Clone for sync the modifications
        let selectedLogsClone = [...props.selectedLogs];

        // If one or more logs are already selected
        if (selectedLogsClone.length > 0) {

            let indexOf = selectedLogsClone.findIndex(log => log.id === log_id);

            // If the log already exists
            if (indexOf) {

                // Remove log from clone
                selectedLogsClone.splice(indexOf);

                // If log is not already selected
            } else {

                // Find it by id
                let log = logs.find(log => log.id === log_id);

                // Push log for clone
                selectedLogsClone.push(log);

            }

            // Update state with its modified clone
            props.setSelectedLogs(selectedLogsClone);

            // If there's not logs selected
        } else {

            console.log('ok')

            // Find log that has the same ID and save it
            logs.map((log) => {

                if (log.id == log_id) {
                    selectedLogsClone.push(log);

                    // Update state with its modified clone
                    props.setSelectedLogs(selectedLogsClone);
                }

            });

        }

    }

    const handleSaveAndClose = () => {
        console.log(props.selectedLogs)
        setOpen(false);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseUnsaved = () => {
        props.setSelectedLogs([]);
        setOpen(false);
    };

    return (
        <>
            <Button variant="outlined" startIcon={<WifiIcon />} onClick={handleClickOpen}>
                Logs disponíveis
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

                    {!loading && logs.length > 0 &&
                        logs.map((log, index) =>
                            <>
                                <ListItem
                                    button
                                    key={index}
                                    secondaryAction={
                                        <Checkbox
                                            edge="end"
                                            value={log.id}
                                            onChange={handleClickRecord}
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
