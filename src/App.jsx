import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PlannedExerciseList from './components/PlannedExercises/PlannedExerciseList'
import PrivateRoute from './components/PrivateRoute'
import Login from './components/Auth/Login'
import Register from "./components/Auth/Register";
import { AuthContext } from "./context/AuthContext";
import AddPlannedExercise from "./components/PlannedExercises/AddPlannedExercise";
import Workouts from "./components/Workouts/Workouts"
import AddWorkout from "./components/Workouts/AddWorkout"
import EditWorkout from "./components/Workouts/EditWorkout"
import ExerciseLogs from "./components/ExerciseLogs/ExerciseLogs"
import Profile from "./components/Profile/Profile"
import BottomNavBar from "./components/Layout/BottomNavBar";

function App() {
  const { authState } = useContext(AuthContext)
  return (
    <Router>
      {authState.isAuthenticated && <BottomNavBar />}
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/planned-exercises" element={ <PrivateRoute element={ <PlannedExerciseList/> } />} />
        <Route path="/add-planned" element={ <PrivateRoute element={ <AddPlannedExercise/> } />} />
        <Route path="/workouts" element={ <PrivateRoute element={ <Workouts/> } />} />
        <Route path="/add-workout" element={ <PrivateRoute element={ <AddWorkout/> } />} />
        <Route path="/edit-workout" element={ <PrivateRoute element={ <EditWorkout/> } />} />
        <Route path="/exercise-logs" element={ <PrivateRoute element={ <ExerciseLogs/> } />} />
        <Route path="/profile" element={ <PrivateRoute element={ <Profile/> } />} />
        <Route path="/" element={
          authState.isAuthenticated ? <Navigate to="/planned-exercises" replace /> : <Navigate to="/login" replace />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App;