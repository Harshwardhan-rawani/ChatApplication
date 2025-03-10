import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from 'react-toastify';
import { FaUserCircle } from "react-icons/fa";

const Login = () => {
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        phoneNumber: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // Added missing loading state

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.phoneNumber.match(/^\d{10}$/)) 
            tempErrors.phoneNumber = "Enter a valid 10-digit phone number";
        if (!formData.password) 
            tempErrors.password = "Password is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, formData);
                setToken(response.data.token);
                toast.success(response.data.message);
                navigate("/");
                setFormData({ phoneNumber: "", password: "" });
                setErrors({});
            } catch (error) {
                console.error("Login failed", error.response?.data || error);
                toast.error(error.response?.data?.message || "Login failed");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <FaUserCircle className="text-6xl text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-4 text-center text-green-600">Login</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-green-700">Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-2 border-b border-gray-400 focus:outline-none focus:border-green-500 transition"
                            placeholder="Enter phone number"
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-green-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border-b border-gray-400 focus:outline-none focus:border-green-500 transition"
                            placeholder="Enter password"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-green-500 text-white py-2 rounded 
                        ${loading ? "cursor-not-allowed opacity-70" : "hover:bg-green-600 active:scale-95 transition-transform duration-150"}`}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-green-500 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
