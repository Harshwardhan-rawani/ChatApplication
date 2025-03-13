import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();


export const DataProvider = ({ children }) => {
    
    const [Alluser, setAlluser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   
     // Fetch user data
     useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/All`);
                setAlluser(response.data)

            } catch (err) {
                console.error("Error fetching user:", err);
                setError(err.response?.data?.message || "Failed to fetch user");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);
     
    return (
        <UserContext.Provider value={{Alluser, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the context
export const useData = () => useContext(UserContext);
