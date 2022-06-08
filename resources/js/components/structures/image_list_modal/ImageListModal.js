import * as React from 'react';
// Material UI
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/system';
// Axios
import Axios from '../../../services/AxiosApi';
// Assets
import ErrorImage from "../../assets/images/Error/Error_md.png";
// Fonts Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

export const ImagesListModal = React.memo(({ ...props }) => {

    const [open, setOpen] = React.useState(false);

    const [response, setResponse] = React.useState({ loaded: false, images: [] });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {

        Axios.get(props.source)
            .then((response) => {
                setResponse({ loaded: true, error: false, images: response.data });
            })
            .catch((error) => {
                setResponse({ loaded: true, error: error.response.message, images: [] });
            });

    }, []);

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen} startIcon={<FontAwesomeIcon icon={faFile} color={"#fff"} size="sm" />}>
                Banco de imagens
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.title.toUpperCase()}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {!response.images.loaded &&
                            <>
                                <Box sx={{ width: 200, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            </>
                        }

                        {(response.images.loaded && !response.error) &&
                            <>
                                <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                                    {response.images.map((image, index) => (
                                        <ImageListItem key={index}>
                                            <img
                                                src={`${image.src}?w=164&h=164&fit=crop&auto=format`}
                                                srcSet={`${image.src}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                loading="lazy"
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </>
                        }

                        {(response.images.loaded && response.error) &&
                            <>
                                <Box sx={{ width: 200, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img src={ErrorImage} />
                                </Box>
                            </>
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Fechar</Button>
                    <Button variant="contained" onClick={handleClose} autoFocus disabled={true}>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});
