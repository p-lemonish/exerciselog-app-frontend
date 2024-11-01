import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"
import { AuthProvider } from "./context/AuthContext"
import CustomThemeProvider from "./theme/CustomThemeProvider"

const container = document.getElementById("root")
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CustomThemeProvider>
        <App/>
      </CustomThemeProvider>
    </AuthProvider>
  </React.StrictMode>
)
