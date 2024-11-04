import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Container, TextField, Typography } from '@mui/material';

function Login() {
  const navigate = useNavigate();
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
      const response = await axios.post('http://localhost:8080/api/login', {
        username,
        password,
      });
      const token = response.data.jwt;
      login(token);
      navigate('/planned-exercises');
    } catch (err) {
      console.log('Login error: ', err);
      setError('Invalid username or password');
    }
  };
  return (
    <Container maxWidth="sm">
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
