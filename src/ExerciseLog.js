/**
 * ExerciseLog Component
 * ---------------------
 * This component handles the logging of exercises and their associated muscle groups. 
 * Users can add new exercises, edit existing ones, and filter exercises by muscle group.
 * 
 * State Variables:
 * ----------------
 * exercises : Array
 *    List of all exercises currently added to the log.
 * newExercise : String
 *    Name of the new exercise being entered by the user.
 * newMuscleGroup : String
 *    Name of the muscle group associated with the new exercise.
 * showMuscleGroup : Boolean
 *    Controls whether the muscle group column is displayed in the exercise table.
 * isEditing : Boolean
 *    Determines if the edit mode is enabled or disabled for exercises.
 * editIndex : Number
 *    The index of the exercise being edited.
 * editExerciseName : String
 *    The name of the exercise currently being edited.
 * editMuscleGroup : String
 *    The muscle group associated with the exercise being edited.
 * isAddingNewMuscleGroup : Boolean
 *    Tracks whether the user is adding a new muscle group.
 * muscleGroups : Array
 *    List of all available muscle groups, including default and user-added groups.
 * searchTerm : String
 *    The search term used to filter exercises by muscle group.
 * selectedMuscleGroup : String
 *    The muscle group currently selected from the search results or dropdown.
 * 
 * Methods:
 * --------
 * addExercise() : Adds a new exercise to the log, and if the muscle group is not in the list, 
 *                 adds the new muscle group.
 * deleteExercise(index: Number) : Deletes the exercise at the given index from the log.
 * editExercise(index: Number) : Prepares the exercise at the given index for editing.
 * saveExercise(index: Number) : Saves the edited exercise back into the list.
 * handleMuscleGroupChange(e: Event) : Handles changes to the muscle group dropdown during editing.
 * handleMuscleGroupSelect(group: String) : Handles selection of a muscle group from the search results.
 * deleteMuscleGroup(group: String) : Deletes a muscle group from the list if it is not in use.
 * handleSearchChange(e: Event) : Updates the search term used to filter muscle groups.
 * toggleMuscleGroup() : Toggles the display of the muscle group column in the exercise table.
 * toggleEditing() : Toggles edit mode for the exercises.
 * 
 */

import React, {useState} from "react"
import defaultExercises from "./defaultExercises.js"

const ExerciseLog = () => {
    const [exercises, setExercises] = useState(defaultExercises)
    const [newExercise, setNewExercise] = useState("")
    const [newMuscleGroup, setNewMuscleGroup] = useState("")
    const [showMuscleGroup, setShowMuscleGroup] = useState(true)
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

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All")

    const addExercise = () => {
        if(newExercise.trim() && newMuscleGroup.trim()) {
            if (!muscleGroups.includes(newMuscleGroup)) {
                setMuscleGroups([...muscleGroups.slice(0, -1), newMuscleGroup, "Add a new muscle group"])
            }
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

    const deleteMuscleGroup = (group) => {
        const isMuscleGroupInUse = exercises.some((exercise) => exercise.muscleGroup === group)
        if(!isMuscleGroupInUse) {
            setMuscleGroups(muscleGroups.filter((g) => g !== group))
        } else {
            alert("Muscle group is in use!")
        }
    }

    const filteredMuscleGroups = muscleGroups.filter((group) => (
        group.toLowerCase().includes(searchTerm.toLowerCase()) && group !== "Add a new muscle group"
    ))

    const filteredExercises = exercises.filter((exercise) => {
        if(selectedMuscleGroup === "All" && searchTerm.trim() === "") return true
        if(selectedMuscleGroup !== "All") return exercise.muscleGroup === selectedMuscleGroup
        return exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
    })

    const handleSearchChange = ((e) => {
        setSearchTerm(e.target.value)
        setSelectedMuscleGroup("All")
    })

    const handleMuscleGroupSelect = ((group) => {
        setSelectedMuscleGroup(group)
        setSearchTerm(group)
    })

    const toggleMuscleGroup = () => {
        setShowMuscleGroup(!showMuscleGroup)
        setIsEditing(false)
    }

    const toggleEditing = () => {
        setIsEditing(!isEditing)
        setShowMuscleGroup(true)
    }

    return (
        <div>
            <h2>Add exercise</h2>
            <input type="text" value={newExercise} onChange={(e) => setNewExercise(e.target.value)} placeholder="Enter exercise name"/>
            <input type="text" value={newMuscleGroup} onChange={(e) => setNewMuscleGroup(e.target.value)} placeholder="Enter muscle group name"/>
            <button onClick={addExercise}>Add</button>
            <button onClick={toggleMuscleGroup}>{showMuscleGroup ? "Hide muscle group" : "Show muscle group"}</button>
            <h2>Exercise list</h2>
            <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Enter a muscle group name"/>
            {searchTerm && (
            <ul style={{listStyleType: "none", padding: 0}}>
                {filteredMuscleGroups.map((group, index) => (
                    <li key={index} onClick={() => handleMuscleGroupSelect(group)} style={{cursor: "pointer", padding: "1px", border: "1px solid #ddd"}}>
                        {group}
                    </li>
                ))}
            </ul>
            )}
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
                    {filteredExercises.map((exercise, index) => (
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
            {isEditing && (
            <>
                <h2>Delete muscle groups</h2> 
                <table>
                    <thead>
                        <tr>
                            <th>
                                Muscle Group
                            </th>
                            <th>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {muscleGroups.filter((group) => group !== "Add a new muscle group").map((group, index) => (
                            <tr key={index}>
                                <td>
                                    {group}
                                </td>
                                <td>
                                    <button onClick={() => deleteMuscleGroup(group)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
            )}
        </div>
    )
}
export default ExerciseLog