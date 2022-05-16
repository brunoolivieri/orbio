// React
import * as React from 'react';
// MATERIAL UI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';

export const GenericModalDialog = React.memo(({ ...props }) => {

    const handleClose = () => {

        props.modal_controller.setModalState(false);

    };

    React.useEffect(() => {

        if (props.modal_controller.counter.required) {

            setTimeout(() => {

                props.modal_controller.setModalState(false);

            }, 5000);

        }

    }, [])

    return (
        <>

            <Dialog
                open={props.modal_controller.state}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps = {{style: { borderRadius: 15 }}}
            >

                {props.title.top.required &&
                    <DialogTitle>{props.title.top.text.toUpperCase()}</DialogTitle>
                }

                <Box>
                    <DialogContent>

                        {props.image.required &&
                            <Box sx={{ margin: "auto", mb: 3, width: "max-content" }} justifyContent="center" >
                                <img src={props.image.src} width={100} />
                            </Box>
                        }

                        {
                            props.lottie.required &&
                            <Box sx={{ margin: "auto", mb: 3, width: "max-content" }} justifyContent="center" >
                               {props.lottie.animation}
                            </Box>
                        }

                        {props.title.middle.required &&
                            <DialogTitle id="alert-dialog-title" textAlign="center">
                                {props.title.middle.text}
                            </DialogTitle>
                        }

                        <DialogContentText id="alert-dialog-description">
                            {props.content_text}
                        </DialogContentText>

                    </DialogContent>

                    {props.actions.required &&
                        <DialogActions>
                            {props.actions.close_button_text.required &&
                                <Button onClick={handleClose}>{props.actions.close_button_text.text}</Button>
                            }
                            {props.actions.confirmation_default_button.required &&
                                <Button onClick={props.actions.confirmation_default_button.event}>{props.actions.confirmation_default_button.text}</Button>
                            }
                            {props.actions.confirmation_button_with_link.required &&
                                <Button><a href={props.actions.confirmation_button_with_link.href}>{props.actions.confirmation_button_with_link.text}</a></Button>
                            }
                        </DialogActions>
                    }
                </Box>
            </Dialog>
        </>
    );

});
