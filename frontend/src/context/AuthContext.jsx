import { createContext, useState, useEffect } from "react";

// Create Context
export const AuthContext = createContext();

// Create Provider Component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    // Save token to localStorage when it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    // Logout function
    const logout = () => {
        setToken("");
    };

    return (
        <AuthContext.Provider value={{ token, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
