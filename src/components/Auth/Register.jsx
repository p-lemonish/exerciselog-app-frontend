import React, { useContext, useState } from 'react';
import axios from 'axios';
import handleApiError from '../ErrorHandler'
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Button, Container, TextField, Typography } from '@mui/material';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { authState, logout } = useContext(AuthContext);

  const { username, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL
      await axios.post(`${baseURL}/register`, {
        username,
        email,
        password,
        confirmPassword,
      });
      navigate('/login');
    } catch (err) {
      console.log('Registration error:', err);
      const errorMessage = handleApiError(err, logout, navigate)
      setError(errorMessage)
    }
  };

  return (
    <Container maxWidth="sm" sx={{ paddingTop: "20px" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Register
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
          label="Email"
          name="email"
          value={email}
          onChange={onChange}
          type="email"
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
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChange}
          type="password"
          fullWidth
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" color="primary" fullWidth>
          Register
        </Button>
      </form>
      <Typography variant="body2">
        Already have an account? <Link to="/login">Login here.</Link>
      </Typography>
    </Container>
  );
}

export default Register;
