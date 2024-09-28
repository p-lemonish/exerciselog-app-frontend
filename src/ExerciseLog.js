import React, {useState} from "react"
import defaultExercises from "./defaultExercises.js"

const ExerciseLog = () => {
    const [exercises, setExercises] = useState(defaultExercises)
    const [newExercise, setNewExercise] = useState("")
    const [selectedExercise, setSelectedExercise] = useState("")
    const [weight, setWeight] = useState("")
    const [reps, setReps] = useState("")
    const [log, setLog] = useState([])

    const addExercise = () => {
        setExercises([...exercises, newExercise])

    }
}