import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"
import { Box, List, Alert, Button, Container, TextField, Typography, ListItem, Checkbox, ListItemText, Divider, Autocomplete } from "@mui/material";

function AddWorkout() {
    const [formData, setFormData] = useState({
        workoutName: "",
        selectedExerciseIds: [],
        plannedDate: ""
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [plannedExercises, setPlannedExercises] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const navigate = useNavigate()
    const { workoutName, selectedExerciseIds, plannedDate } = formData

    const handleCancel = () => {
        navigate(-1)
    }
    const onChange = (e) => 
        setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post("/workouts", {
                workoutName,
                selectedExerciseIds,
                plannedDate
            })
            navigate("/add-workout")
            // TODO Add message "Workout added succesfully", reload form and let user add another workout if they wish to
        } catch(err) {
            console.log("Error while adding a new workout:", err)
            if(err.response && err.response.data) {
                const errorData = err.response.data
                const errorMessages = Object.entries(errorData).map(
                    ([field, message]) => `${message}`
                )
                setError(errorMessages)
            } else {
                setError("An error occurred while adding a new workout")
            }
        }
    }

    useEffect(() => {
        const fetchPlannedExercises = async () => {
            try {
                const response = await api.get('/planned')
                setPlannedExercises(response.data)
            } catch (err) {
                console.error('Error fetching planned exercises', err)
                if(err.response && err.response.status === 401) {
                    logout()
                    navigate('/login')
                } else {
                    setError('Failed to load planned exercises')
                }
            } finally {
                setLoading(false)
            }
        }
        fetchPlannedExercises()
    }, [])

    const handleExerciseToggle = (exerciseId) => () => {
        const currentIndex = selectedExerciseIds.indexOf(exerciseId)
        const newSelectedExercises = [...selectedExerciseIds]

        if (currentIndex === -1) {
            newSelectedExercises.push(exerciseId)
        } else {
            newSelectedExercises.splice(currentIndex, 1)
        }
        setFormData({ ...formData, selectedExerciseIds: newSelectedExercises })
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Plan a new workout
            </Typography>
            <form onSubmit={onSubmit}>
                <TextField 
                    label="Workout Name" 
                    name="workoutName" 
                    value={workoutName} 
                    onChange={onChange} 
                    type="workoutName" 
                    slotProps={{
                        inputLabel: {
                            shrink: true
                        }
                    }}
                    fullWidth 
                    required
                />
                <TextField 
                    label="Planned Date" 
                    name="plannedDate" 
                    value={plannedDate} 
                    onChange={onChange} 
                    type="date" 
                    slotProps={{
                        inputLabel: {
                            shrink: true
                        }
                    }}
                    fullWidth 
                    required
                />
                <Autocomplete
                    options={plannedExercises}
                    getOptionLabel={(option) => `${option.exerciseName}: ${option.plannedSets}x${option.plannedReps}@${option.plannedWeight}`}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue)
                    }}
                    onChange={(event, newValue) => {
                        if(newValue) {
                            if(!selectedExerciseIds.includes(newValue.id)) {
                                setFormData({ ...formData, selectedExerciseIds: [...selectedExerciseIds, newValue.id] })
                            }
                            setInputValue("")
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search Exercises"
                            variant="outlined"
                        />
                    )}
                    renderTags={() => null}
                />
                {plannedExercises.length === 0 ? (
                    <Typography variant="body1">No planned exercises found</Typography>
                ) : (
                    <List> {/* TODO Limit list size so user can press save and cancel without scrolling down */}
                        {plannedExercises.map((exercise) => {
                            const labelId = `checkbox-list-label-${exercise.id}`

                            return (
                                <React.Fragment key={exercise.id}>
                                    <ListItem dense onClick={handleExerciseToggle(exercise.id)}>
                                        <Checkbox 
                                            edge="start" 
                                            checked={selectedExerciseIds.includes(exercise.id)} 
                                            tabIndex={-1} 
                                            disableRipple 
                                            inputProps={{ "aria-labelledby": labelId }}
                                        />
                                        <ListItemText
                                            id={labelId}
                                            primary={exercise.exerciseName}
                                            secondary={`${exercise.plannedSets}x${exercise.plannedReps}@${exercise.plannedWeight}`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            )
                        })}
                    </List>
                )}
            {error && (
                <Alert severity="error">
                    {error}
                </Alert>
            )}
            <Button type="submit" color="primary" variant="outlined" fullWidth>
                Save
            </Button>
            <Button type="cancel" color="primary" variant="outlined" onClick={handleCancel} fullWidth>
                Cancel
            </Button>
            </form>
            <Box sx={{ height: "80px" /* fix for navbar getting no padding */ }} />
        </Container>
    )
}

export default AddWorkout