import React, { createContext, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const token = localStorage.getItem('token')
    const [authState, setAuthState] = useState({
        token: token,
        isAuthenticated: !!token
    })

    const login = (token, user) => {
        localStorage.setItem('token', token)
        setAuthState({ token, isAuthenticated: true })
    }

    const logout = () => {
        localStorage.removeItem('token')
        setAuthState({ token: null, isAuthenticated: false })
    }

    return(
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}