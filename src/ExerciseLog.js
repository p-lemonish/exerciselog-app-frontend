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
        if(newExercise.trim()) {
            setExercises([...exercises, newExercise])
            setNewExercise("")
        }
    }

    return (
        <div>
            <h2>Add exercise</h2>
            <input type="text" value={newExercise} onChange={(e) => setNewExercise(e.target.value)} placeholder="Enter exercise name"/>
            <button onClick={addExercise}>Add</button>
            <h2>Exercise list</h2>
            <div>
                {exercises.map((exercise, index) => (
                    <p key={index}>{exercise}</p>
                ))}
            </div>
        </div>
    )
}
export default ExerciseLog