import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const { username, email, password, confirmPassword } = formData

    const onChange = (e) => 
        setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()

        if(password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        try {
            await axios.post('http://localhost:8080/api/register', {
                username,
                email,
                password,
                confirmPassword
            })
            navigate('/login')
        } catch(err) {
            console.log('Registration error:', err)
            if(err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error)
            } else {
                setError('An error occurred during registration')
            }
        }
    }

    return (
        <div>
            <h2>Register</h2>
                <form onSubmit={onSubmit}>
                    <div>
                        <label>Username:</label>
                        <input name="username" value={username} onChange={onChange} required />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input name="email" value={email} onChange={onChange} type="email" required />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input name="password" value={password} onChange={onChange} type="password" required />
                    </div>
                    <div>
                        <label>Confirm Password:</label>
                        <input name="confirmPassword" value={confirmPassword} onChange={onChange} type="password" required />
                    </div>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <button type="submit">Register</button>
                </form>
            <p>
                Already have an account? <Link to="/login">Login here.</Link>
            </p>
        </div>
    )
}

export default Register