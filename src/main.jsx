import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MyComponent from "./ExerciseLog"
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MyComponent />
  </StrictMode>,
)
