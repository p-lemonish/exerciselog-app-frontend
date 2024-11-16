import React, { useContext, useState } from 'react';
import axios from 'axios';
import handleApiError from '../ErrorHandler'
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Container, TextField, Typography } from '@mui/material';

function Login() { // TODO put login form in the middle of the screen, add a Loading/Submitting page to let the user know their action has gone through and is wiating for a response from the backend (in case of lag)
  const navigate = useNavigate();
  const { authState, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { username, password } = formData;
  const { login } = useContext(AuthContext);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL
      const response = await axios.post(`${baseURL}/login`, {
        username,
        password,
      });
      const token = response.data.jwt;
      login(token);
      navigate('/planned-exercises');
    } catch (err) {
      console.log('Login error: ', err);
      const errorMessage = handleApiError(err, logout, navigate)
      setError(errorMessage)
    }
  };
  return (
    <Container maxWidth="sm" sx={{ paddingTop: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          label="Username"
          name="username"
          value={username}
          onChange={onChange}
          type="username"
          fullWidth
          required
        />
        <TextField
          label="Password"
          name="password"
          value={password}
          onChange={onChange}
          type="password"
          fullWidth
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" color="primary" fullWidth>
          Login
        </Button>
      </form>
      <Typography variant="body2">
        Don&apos;t have an account? <Link to="/register">Register here.</Link>
      </Typography>
    </Container>
  );
}

export default Login;
