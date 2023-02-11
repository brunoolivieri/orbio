import * as React from 'react';
// Mui
import { Divider, Grid, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';

const itemData = Array(20).fill({
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    author: '@rollelflex_graphy726',
});

export const ImageListSelection = React.memo((props) => {

    const [open, setOpen] = React.useState(false);
    const [images, setImages] = React.useState([{}]);
    const [selected, setSelected] = React.useState(null);

    React.useEffect(() => {
        fetchImages();
    }, []);

    function fetchImages() {
        console.log('fetch images');
    }

    function handleOpen() {
        setOpen(true);
        setSelected(null);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleSave() {
        console.log('save image');
    }

    return (
        <div>
            <Button variant="contained" component="span" startIcon={<StorageIcon />} onClick={handleOpen}>
                Procurar imagem
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen
            >
                <DialogTitle>BANCO DE IMAGENS</DialogTitle>
                <Divider />

                <DialogContent>
                    <DialogContentText>
                        Aqui estão as imagens que já foram previamente salvas em nosso sistema e que estão disponíveis para reutilização. Para selecionar uma imagem, basta clicar sobre ela e clicar em salvar.
                    </DialogContentText>
                    <Box mt={2}>
                        <Grid container columns={12} columnSpacing={1}>
                            {itemData.map((item, index) =>
                                <Grid
                                    item xs={1}
                                    key={index}
                                    sx={{
                                        cursor: "pointer"
                                    }}
                                >
                                    <img
                                        src={`${item.img}?w=248&fit=crop&auto=format`}
                                        srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        alt={item.title}
                                        loading="lazy"
                                        width={"100%"}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </DialogContent>

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" disabled>Salvar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
});
