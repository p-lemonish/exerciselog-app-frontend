import React, {useState} from "react"
import defaultExercises from "./defaultExercises.js"

const ExerciseLog = () => {
    const [exercises, setExercises] = useState(defaultExercises)
    const [newExercise, setNewExercise] = useState("")
    const [newMuscleGroup, setNewMuscleGroup] = useState("")
    const [selectedExercise, setSelectedExercise] = useState("")
    const [weight, setWeight] = useState("")
    const [reps, setReps] = useState("")
    const [log, setLog] = useState([])
    const [showMuscleGroup, setShowMuscleGroup] = useState(false)

    const addExercise = () => {
        if(newExercise.trim() && newMuscleGroup.trim()) {
            setExercises([...exercises, { name: newExercise, muscleGroup: newMuscleGroup }])
            setNewExercise("")
            setNewMuscleGroup("")
        }
    }

    const toggleMuscleGroup = () => {
        setShowMuscleGroup(!showMuscleGroup)
    }
    
    const deleteExercise = (index) => {
        setExercises(exercises.filter((_, i) => i !== index))
    }

    const logWorkout = () => {
        if(selectedExercise && weight && reps) {
            setLog([...log, {exercise: selectedExercise, weight, reps}])
            setWeight("")
            setReps("")
        }
    }

    return (
        <div>
            <h2>Add exercise</h2>
            <input type="text" value={newExercise} onChange={(e) => setNewExercise(e.target.value)} placeholder="Enter exercise name"/>
            <input type="text" value={newMuscleGroup} onChange={(e) => setNewMuscleGroup(e.target.value)} placeholder="Enter muscle group name"/>
            <button onClick={addExercise}>Add</button>
            <button onClick={toggleMuscleGroup}>Show muscle group</button>
            <h2>Exercise list</h2>
            <div>
                {exercises.map((exercise, index) => (
                    <p key={index}>
                        {exercise.name}
                        {showMuscleGroup && ` - ${exercise.muscleGroup}`}
                        <button onClick={() => deleteExercise(index)}>Delete</button>
                    </p>
                ))}
            </div>
        </div>
    )
}
export default ExerciseLog