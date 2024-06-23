import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Chat from './CHAT';
import Login from './Login';
import Register from './Register';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/chat"
                    element={isLoggedIn ? <Chat /> : <Navigate to="/login" />}
                />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
