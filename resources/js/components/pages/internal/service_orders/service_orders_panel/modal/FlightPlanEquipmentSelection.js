import * as React from 'react';
// Material UI
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Divider, DialogContentText } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
// Custom
import { FetchedDataSelection } from '../../../../../shared/input_select/FetchedDataSelection';

const initialControlledInput = { id: "", array_index: "", drone_id: "", battery_id: "", equipment_id: "" }

export const FlightPlanEquipmentSelection = React.memo((props) => {

    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState(initialControlledInput);

    const handleClickOpen = () => {
        setOpen(true);
        setFormData({
            id: props.current.id,
            name: props.current.name,
            drone_id: props.current.drone_id,
            battery_id: props.current.battery_id,
            equipment_id: props.current.equipment_id
        });
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSave = () => {

        let updatedSelectedFlightPlans = props.selectedFlightPlans.map((selected_flight_plan) => {

            if (selected_flight_plan.id === formData.id) {
                return formData;
            } else {
                return selected_flight_plan;
            }

        });

        //console.log(updatedSelectedFlightPlans.sort((a, b) => a.id - b.id))

        props.setSelectedFlightPlans(updatedSelectedFlightPlans.sort((a, b) => a.id - b.id));

        handleClose();

    }

    return (
        <>
            <IconButton edge="end" onClick={handleClickOpen}>
                <SettingsIcon />
            </IconButton>
            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>SELEÇÃO DE EQUIPAMENTOS</DialogTitle>
                <Divider />

                <DialogContent>

                    <DialogContentText mb={2}>
                        Selecione os equipamentos que serão utilizados na realização deste plano de voo nesta ordem de serviço.
                    </DialogContentText>

                    <TextField
                        type="text"
                        margin="dense"
                        label="Nome do plano de voo"
                        fullWidth
                        variant="outlined"
                        required
                        value={formData.name}
                        sx={{ mb: 2 }}
                        InputProps={{
                            readOnly: true
                        }}
                    />

                    <Box sx={{ mb: 2 }}>
                        <FetchedDataSelection
                            label_text="Drone"
                            data_source={"/api/load-drones"}
                            primary_key={"id"}
                            key_content={"name"}
                            setFormData={setFormData}
                            formData={formData}
                            name={"drone_id"}
                            selected={formData.drone_id}
                            error={false}
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <FetchedDataSelection
                            label_text="Bateria"
                            data_source={"/api/load-batteries"}
                            primary_key={"id"}
                            key_content={"name"}
                            setFormData={setFormData}
                            formData={formData}
                            name={"battery_id"}
                            selected={formData.battery_id}
                            error={false}
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <FetchedDataSelection
                            label_text="Equipamento"
                            data_source={"/api/load-equipments"}
                            primary_key={"id"}
                            key_content={"name"}
                            setFormData={setFormData}
                            formData={formData}
                            name={"equipment_id"}
                            selected={formData.equipment_id}
                            error={false}
                        />
                    </Box>

                </DialogContent>

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose}>Fechar</Button>
                    <Button onClick={handleSave} variant="contained">Salvar</Button>
                </DialogActions>

            </Dialog>
        </>
    );
});
