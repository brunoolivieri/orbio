import * as React from 'react';
// Material UI
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Divider, DialogContentText, FormHelperText } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
// Custom
import { FetchedDataSelection } from '../../../../../shared/input_select/FetchedDataSelection';

const initialFormData = { id: "", array_index: "", drone_id: "", battery_id: "", equipment_id: "" }
const fieldError = { error: false, message: "" }
const initialFormError = { drone_id: fieldError, battery_id: fieldError, equipment_id: fieldError }

export const FlightPlanEquipmentSelection = React.memo((props) => {

    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState(initialFormData);
    const [formError, setFormError] = React.useState(initialFormError);

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

        if (!handleSubmissionValidation()) return '';

        let updatedSelectedFlightPlans = props.selectedFlightPlans.map((selected_flight_plan) => {
            if (selected_flight_plan.id === formData.id) {
                return formData;
            } else {
                return selected_flight_plan;
            }
        });

        props.setSelectedFlightPlans(updatedSelectedFlightPlans.sort((a, b) => a.id - b.id));
        handleClose();

    }

    function handleSubmissionValidation() {

        let validation = Object.assign({}, initialFormError);

        for (let field in formData) {
            if (field != "id" && field != "array_index") {
                validation[field] = formData[field] == "0" ? { error: true, message: "" } : { error: false, message: "" }
            }
        }

        setFormError(validation);

        return !(validation.drone_id.error || validation.battery_id.error || validation.equipment_id.error);
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
                            fetch_from={"/api/load-drones"}
                            primary_key={"id"}
                            key_content={"name"}
                            setFormData={setFormData}
                            formData={formData}
                            name={"drone_id"}
                            selected={formData.drone_id}
                            error={formError.drone_id.error}
                        />
                        <FormHelperText error>{formError.drone_id.message}</FormHelperText>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <FetchedDataSelection
                            label_text="Bateria"
                            fetch_from={"/api/load-batteries"}
                            primary_key={"id"}
                            key_content={"name"}
                            setFormData={setFormData}
                            formData={formData}
                            name={"battery_id"}
                            selected={formData.battery_id}
                            error={formError.battery_id.error}
                        />
                        <FormHelperText error>{formError.battery_id.message}</FormHelperText>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <FetchedDataSelection
                            label_text="Equipamento"
                            fetch_from={"/api/load-equipments"}
                            primary_key={"id"}
                            key_content={"name"}
                            setFormData={setFormData}
                            formData={formData}
                            name={"equipment_id"}
                            selected={formData.equipment_id}
                            error={formError.equipment_id.error}
                        />
                        <FormHelperText error>{formError.equipment_id.message}</FormHelperText>
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
