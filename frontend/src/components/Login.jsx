import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({setUser}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const {data} = await axios.post('https://note-app-mern-y9bi.onrender.com/api/users/login',{
                email, password
            })
            localStorage.setItem("token", data.token)
            setUser(data);
            navigate('/');
        }catch(err){
            setError(error.reponse?.data?.message || "Invalid Credentials")
        }
    }

    return (
        <div className='container mx-auto max-w-md mt-10 p-6 bg-white rounded-lg shadow-md'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>Login</h2>
            {error && <p className='text-red-500 mb-4 text-center'>{error}</p>}
            <form onSubmit={handleSubmit} className='space-y-5'>
                <div>
                    <input type="email" value={email} onChange={(e) =>
                        setEmail(e.target.value)}
                        placeholder='Email'
                        className='w-full px-3 py-3 border rounded-md
                        outline-none focus:ring-2 focus:ring-blue-400'
                        required
                    />
                </div>
                <div>
                    <input type="password" value={password} onChange={(e) =>
                        setPassword(e.target.value)}
                        placeholder='Password'
                        className='w-full px-3 py-3 border rounded-md
                        outline-none focus:ring-2 focus:ring-blue-400'
                        required
                    />
                </div>
                <button className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700'>Login</button>
            </form>
            <p className='mt-4 text-center'>Don't have an account?{" "}
                <Link className='text-blue-600 hover:underline' to="/register">Register</Link>
            </p>
        </div>
    );
}

export default Login
