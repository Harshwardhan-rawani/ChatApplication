import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./component/Chat";
import Registration from "./component/Registraion";
import Login from "./component/Login";
import PrivateRoute from "./PrivateRoute";
import "./App.css"
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";


function App() {
    const {token} = useContext(AuthContext)
    const isAuthenticated = !!token; // Proper boolean conversion

    return (
        <Router>
            <div className="">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/register" element={<Registration />} />
                    <Route path="/login" element={<Login />} />
                    <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                        <Route path="/" element={<Chat />} />
                        <Route path="/:phoneNumber" element={<Chat />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
