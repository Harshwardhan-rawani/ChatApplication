import { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserContext = createContext();


export const DataProvider = ({ children }) => {
    const params = useParams(); 
    console.log
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!phoneNumber) return; 

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/data/${phoneNumber}`);
                setData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [phoneNumber]); // Fetch data whenever `id` changes

    return (
        <UserContext.Provider value={{ data, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the context
export const useData = () => useContext(UserContext);
