import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"
import { Alert, Button, Container, TextField, Typography } from "@mui/material";

function AddPlannedExercise() {
    const [formData, setFormData] = useState({
        exerciseName: "",
        muscleGroup: "",
        plannedReps: "",
        plannedSets: "",
        plannedWeight: "",
        notes: ""
    });
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const { exerciseName, muscleGroup, plannedReps, plannedSets, plannedWeight, notes } = formData

    const handleCancel = () => {
        navigate(-1)
    }

    const onChange = (e) => 
        setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            await api.post("/planned", {
                exerciseName,
                muscleGroup,
                plannedReps,
                plannedSets,
                plannedWeight,
                notes
            })
            navigate("/planned-exercises")
        } catch(err) {
            console.log("Error while adding a planned exercise:", err)
            if(err.response && err.response.data) {
                const errorData = err.response.data
                const errorMessages = Object.entries(errorData).map(
                    ([field, message]) => `${message}`
                )
                setError(errorMessages)
            } else {
                setError("An error occurred while adding planned exercise")
            }
        }
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Plan a new exercise
            </Typography>
            <form onSubmit={onSubmit}>
                <TextField 
                    label="Exercise Name" 
                    name="exerciseName" 
                    value={exerciseName} 
                    onChange={onChange} 
                    type="exerciseName" 
                    fullWidth 
                    required
                />
                <TextField 
                    label="Muscle Group (optional if adding existing exercise)" 
                    name="muscleGroup" 
                    value={muscleGroup} 
                    onChange={onChange} 
                    type="muscleGroup" 
                    fullWidth 
                />
                <TextField 
                    label="Planned Sets" 
                    name="plannedSets" 
                    value={plannedSets} 
                    onChange={onChange} 
                    type="plannedSets" 
                    fullWidth 
                    required
                />
                <TextField 
                    label="Planned Reps" 
                    name="plannedReps" 
                    value={plannedReps} 
                    onChange={onChange} 
                    type="plannedReps" 
                    fullWidth 
                    required
                />
                <TextField 
                    label="Planned Weight" 
                    name="plannedWeight" 
                    value={plannedWeight} 
                    onChange={onChange} 
                    type="plannedWeight" 
                    fullWidth 
                    required
                />
                <TextField 
                    label="Notes (optional)" 
                    name="notes" 
                    value={notes} 
                    onChange={onChange} 
                    type="notes" 
                    fullWidth 
                />
                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}
                <Button type="submit" color="primary" variant="outlined" fullWidth>
                    Save
                </Button>
            </form>
            <Button type="cancel" color="primary" variant="outlined" onClick={handleCancel} fullWidth>
                Cancel
            </Button>
        </Container>
    )
}

export default AddPlannedExercise