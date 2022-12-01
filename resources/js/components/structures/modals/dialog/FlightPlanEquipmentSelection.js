import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
// Custom
import { SelectAttributeControl } from '../../input_select/SelectAttributeControl';

export const FlightPlanEquipmentSelection = React.memo((props) => {

    const [open, setOpen] = React.useState(false);
    const [controlledInput, setControlledInput] = React.useState({});

    const handleClickOpen = () => {
        setOpen(true);
        setControlledInput({
            id: props.current.data.id,
            array_index: props.current.array_index,
            drone_id: props.current.data.drone_id,
            battery_id: props.current.data.battery_id,
            equipment_id: props.current.data.equipment_id
        });
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSave = () => {

        // Create clone of selected flight plans array
        let selectedFlightPlansClone = [...props.selectedFlightPlans];

        // Set equipments value into clone first
        // The array_index is the index of actual flight plan in structure of selected flight plans
        selectedFlightPlansClone[controlledInput.array_index].drone_id = controlledInput.drone_id;
        selectedFlightPlansClone[controlledInput.array_index].battery_id = controlledInput.battery_id;
        selectedFlightPlansClone[controlledInput.array_index].equipment_id = controlledInput.equipment_id;

        // Sync clone and original array
        props.setSelectedFlightPlans(selectedFlightPlansClone);

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
                <DialogTitle>Seleção de Equipamentos</DialogTitle>

                <DialogContent>

                    <TextField
                        type="text"
                        margin="dense"
                        label="ID do plano de voo"
                        fullWidth
                        variant="outlined"
                        required
                        name="flight_plan_id"
                        value={props.current.data.id}
                        sx={{ mb: 2 }}
                        InputProps={{
                            readOnly: true
                        }}
                    />

                    <TextField
                        type="text"
                        margin="dense"
                        label="Nome do plano de voo"
                        fullWidth
                        variant="outlined"
                        required
                        value={props.current.data.name}
                        sx={{ mb: 2 }}
                        InputProps={{
                            readOnly: true
                        }}
                    />

                    <Box sx={{ mb: 2 }}>
                        <SelectAttributeControl
                            label_text="Drone"
                            data_source={"/api/load-drones"}
                            primary_key={"id"}
                            key_content={"name"}
                            setControlledInput={setControlledInput}
                            controlledInput={controlledInput}
                            name={"drone_id"}
                            value={controlledInput.drone_id}
                            error={false}
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <SelectAttributeControl
                            label_text="Bateria"
                            data_source={"/api/load-batteries"}
                            primary_key={"id"}
                            key_content={"name"}
                            setControlledInput={setControlledInput}
                            controlledInput={controlledInput}
                            name={"battery_id"}
                            value={controlledInput.battery_id}
                            error={false}
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <SelectAttributeControl
                            label_text="Equipamento"
                            data_source={"/api/load-equipments"}
                            primary_key={"id"}
                            key_content={"name"}
                            setControlledInput={setControlledInput}
                            controlledInput={controlledInput}
                            name={"equipment_id"}
                            value={controlledInput.equipment_id}
                            error={false}
                        />
                    </Box>

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Fechar</Button>
                    <Button onClick={handleSave} variant="contained">Salvar</Button>
                </DialogActions>

            </Dialog>
        </>
    );
});
