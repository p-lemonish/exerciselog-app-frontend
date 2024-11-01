import React, { useMemo } from "react";
import { ThemeProvider } from "@mui/material";
import { lightTheme, darkTheme } from "./theme"
import { useMediaQuery } from "@mui/material";

// eslint-disable-next-line react/prop-types
function CustomThemeProvider({ children }) {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

    const theme = useMemo(() => (prefersDarkMode ? darkTheme : lightTheme), [prefersDarkMode])

    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}
export default CustomThemeProvider