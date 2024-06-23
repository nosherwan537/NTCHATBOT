import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize navigate from useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:5000/auth/login', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.access_token);
            onLogin(); // Notify App component that login was successful
            navigate('/chat'); // Use navigate to redirect to '/chat'
        } catch (error) {
            console.error('Login failed', error);
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=' bg-gradient-to-r from-gray-900 to-blue-500 w-full min-h-screen flex flex-col justify-center items-center swald-bro'>
            <h2 className='relative bottom-36 font-bold text-2xl bg-gradient-to-r from-lime-300 to-emerald-400 bg-clip-text text-transparent'>Login Page</h2>
            <form onSubmit={handleSubmit} className='flex flex-col relative gap-3'>
                <input
                    type="text"
                    placeholder="Username"
                    className='border-2 border-blue-900 rounded-md p-1'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className='border-2 border-blue-900 rounded-md p-1'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading} className='m-2 p-2 border-2 rounded-lg bg-slate-500 w-auto'>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <button className='m-2 border-2 rounded-lg bg-slate-500 w-auto p-2'>
                   <a href="/register">Register</a>  
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Login;
