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
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editExerciseName, setEditExerciseName] = useState("");
    const [editMuscleGroup, setEditMuscleGroup] = useState("");
    const [isAddingNewMuscleGroup, setIsAddingNewMuscleGroup] = useState(false)

    const [muscleGroups, setMuscleGroups] = useState(() => {
        const defaultMuscleGroups = Array.from(
            new Set(defaultExercises.map((exercise) => exercise.muscleGroup))
        )
        defaultMuscleGroups.push("Add a new muscle group")
        return defaultMuscleGroups
    })

    const addExercise = () => {
        if(newExercise.trim() && newMuscleGroup.trim()) {
            setExercises([...exercises, { name: newExercise, muscleGroup: newMuscleGroup }])
            setNewExercise("")
            setNewMuscleGroup("")
        }
    }

    const deleteExercise = (index) => {
        setExercises(exercises.filter((_, i) => i !== index))
    }

    const editExercise = (index) => {
        setEditIndex(index)
        setEditExerciseName(exercises[index].name)
        setEditMuscleGroup(exercises[index].muscleGroup)
    }

    const saveExercise = (index) => {
        if(isAddingNewMuscleGroup && editMuscleGroup && !muscleGroups.includes(editMuscleGroup)) {
            setMuscleGroups([...muscleGroups.slice(0,-1), editMuscleGroup, "Add a new muscle group"])
        }
        const updatedExercises = exercises.map((exercise, i) => {
            if (i === index) {
                return { name: editExerciseName, muscleGroup: editMuscleGroup }
            }
            return exercise
        })
        setExercises(updatedExercises)
        setEditIndex(null)
        setIsAddingNewMuscleGroup(false)
    }

    const handleMuscleGroupChange = (e) => {
        const selectedValue = e.target.value
        if(selectedValue === "Add a new muscle group") {
            setIsAddingNewMuscleGroup(true)
            setEditMuscleGroup("")
        } else {
            setIsAddingNewMuscleGroup(false)
            setEditMuscleGroup(selectedValue)
        }
    }

    const toggleMuscleGroup = () => {
        setShowMuscleGroup(!showMuscleGroup)
        setIsEditing(false)
    }

    const toggleEditing = () => {
        setIsEditing(!isEditing)
        setShowMuscleGroup(true)
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
            <button onClick={toggleEditing}>{isEditing ? "Disable edit mode" : "Enable edit mode"}</button>
            <table>
                <thead>
                    <tr>
                        <th>Exercise</th>
                        {showMuscleGroup && <th>Muscle Group</th>}
                        {isEditing && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {exercises.map((exercise, index) => (
                        <tr key={index}>
                            {editIndex === index ? (
                                <>
                                    <td>
                                        <input type="text" value={editExerciseName} onChange={(e) => setEditExerciseName(e.target.value)}/>
                                    </td>
                                    <td>
                                        {isAddingNewMuscleGroup ? (
                                            <input type="text" value={editMuscleGroup} onChange={(e) => setEditMuscleGroup(e.target.value)} placeholder="Enter new muscle group"/>
                                        ) : (
                                            <select value={editMuscleGroup} onChange={handleMuscleGroupChange}>
                                                {muscleGroups.map((group, i) => (
                                                    <option key={i} value={group}>
                                                        {group}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                    <td>
                                        <button onClick={() => saveExercise(index)}>Save</button>
                                        <button onClick={() => setEditIndex(null)}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{exercise.name}</td>
                                    {showMuscleGroup && <td>{exercise.muscleGroup}</td>}
                                    {isEditing && (
                                    <td>
                                        <button onClick={() => deleteExercise(index)}>Delete</button>
                                        <button onClick={() => editExercise(index)}>Edit</button>
                                    </td>)}
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default ExerciseLog