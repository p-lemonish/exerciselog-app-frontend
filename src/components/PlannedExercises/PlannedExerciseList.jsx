import React, { useContext, useEffect, useState, useSyncExternalStore } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

function PlannedExerciseList() {
    const [plannedExercises, setPlannedExercises] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState();
    const { authState, logout } = useContext(AuthContext)

    useEffect(() => {
        const fetchPlannedExercises = async () => {
            try {
                const response = await api.get('/planned')
                setPlannedExercises(response.data)
            } catch (err) {
                console.error('Error fetching planned exercises', err)
                if(err.response && err.response.status === 401) {
                    logout()
                    window.location.href = '/login'
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
        <div>
            <h2>Planned Exercises</h2>
            <ul>
                {plannedExercises.map((exercise) => (
                    <li key={exercise.id}>
                        {exercise.exerciseName} - {exercise.muscleGroup}: {exercise.plannedSets} x {exercise.plannedReps} @ {exercise.plannedWeight}kg
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PlannedExerciseList