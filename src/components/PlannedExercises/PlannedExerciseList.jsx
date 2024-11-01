import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";

function PlannedExerciseList() {
    const [plannedExercises, setPlannedExercises] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState();
    const { authState, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleClick = () => {
        navigate("/add-planned")
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
    }, [authState.token, logout])

    if(loading) return <div>Loading..</div>
    if(error) return <div>{error}</div>

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Planned Exercises
            </Typography>
                <ul>
                    {plannedExercises.map((exercise) => (
                        <li key={exercise.id}>
                            {exercise.exerciseName}: {exercise.plannedSets} x {exercise.plannedReps} @ {exercise.plannedWeight}kg
                        </li>
                    ))}
                </ul>
            <Button type="submit" color="primary" fullWidth onClick={handleClick}>
                Add New Exercise
            </Button>
        </Container>
    )
}

export default PlannedExerciseList