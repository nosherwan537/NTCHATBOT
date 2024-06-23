import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/register', {
        username,
        password,
      });
      setToken(response.data.access_token);
      localStorage.setItem('token', response.data.access_token);
      setUsername('');
      setPassword('');
      setError('');
    } catch (error) {
      console.error('Registration failed', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=' bg-gradient-to-r from-gray-900 to-blue-500 w-full min-h-screen flex flex-col justify-center items-center swald-bro'>
      <h2 className='relative bottom-36 font-bold text-2xl bg-gradient-to-r from-lime-300 to-emerald-400 bg-clip-text text-transparent'>NEW TO OUR APP?</h2>
        <h2 className='relative bottom-36 font-bold text-2xl bg-gradient-to-r from-lime-300 to-emerald-400 bg-clip-text text-transparent'>REGISTER HERE</h2>
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
          {loading ? 'Submitting...' : 'Register'}
        </button>
        <button>
            <a href="/login">Login</a>
        </button>
      </form>
      {error && alert("Registration failed. Please try again.") &&console.log(error)}
      {token && alert("Registration successful! Please login.") && console.log(token)}
    </div>
  );
}

export default Register;
