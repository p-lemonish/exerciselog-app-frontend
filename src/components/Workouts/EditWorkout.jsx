import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api"
import { Box, CircularProgress, List, Alert, Button, Container, TextField, Typography, ListItem, Checkbox, ListItemText, Divider, Autocomplete } from "@mui/material";
import { AuthContext } from "../../context/AuthContext"

function EditWorkout() {
    const [formData, setFormData] = useState({
        workoutName: "",
        selectedExerciseIds: [],
        plannedDate: ""
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [plannedExercises, setPlannedExercises] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [autocompleteValue, setAutocompleteValue] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const { authState, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const { id } = useParams()
    const { workoutName, selectedExerciseIds, plannedDate } = formData

    const handleCancel = () => {
        navigate(-1)
    }
    const onChange = (e) => 
        setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.put(`/workouts/${id}`, {
                workoutName,
                selectedExerciseIds,
                plannedDate
            })

            setError("")
        } catch(err) {
            console.log("Error while editing workout:", err)
            if(err.response && err.response.data) {
                const errorData = err.response.data
                const errorMessages = Object.entries(errorData).map(
                    ([field, message]) => `${message}`
                )
                setError(errorMessages)
            } else {
                setError("An error occurred while editing workout")
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
    }, [authState.token, logout, navigate])

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

    if (loading) return (
        <Container>
            <CircularProgress />
        </Container>
    )

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Edit workout
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
                    getOptionLabel={(option) => `${option.exerciseName}: ${option.plannedSets}x${option.plannedReps}@${option.plannedWeight}kg`}
                    inputValue={inputValue}
                    value={autocompleteValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue)
                    }}
                    onChange={(event, newValue) => {
                        if(newValue) {
                            if(!selectedExerciseIds.includes(newValue.id)) {
                                setFormData({ ...formData, selectedExerciseIds: [...selectedExerciseIds, newValue.id] })
                            }
                            setAutocompleteValue(null)
                        }
                        setInputValue("")
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
                {error && ( // TODO Add Box to keep the area for error/success constant
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}
                {successMessage && (
                    <Alert severity="success">
                        {successMessage}
                    </Alert>
                )}
                {plannedExercises.length === 0 ? (
                    <Typography variant="body1">No planned exercises found</Typography>
                ) : (
                    <Box sx={{ maxHeight: "50vh", overflowY: "auto" }}>
                        <List> 
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
                                                secondary={`${exercise.plannedSets}x${exercise.plannedReps}@${exercise.plannedWeight}kg`}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                )
                            })}
                        </List>
                    </Box>
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

export default EditWorkout