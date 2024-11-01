import React, { useContext, useState }from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState('')
    const { username, password } = formData
    const { login } = useContext(AuthContext)

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(
                'http://localhost:8080/api/login',
                {
                    username,
                    password
                }
            )
            const token = response.data.jwt
            login(token)
            navigate('/planned-exercises')
        } catch (err) {
            console.log('Login error: ', err)
            setError('Invalid username or password')
        }
    }
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Username:</label>
                    <input name="username" value={username} onChange={onChange} required/>
                </div>
                <div>
                    <label>Password:</label>
                    <input name="password" value={password} onChange={onChange}type="password" required/>
                </div>
                {error && <div style={{color: 'red'}}>{error}</div>}
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login