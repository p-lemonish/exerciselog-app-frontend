import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: null,
    username: '',
    email: '',
    roleName: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/profile');
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        if (err.response && err.response.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false)
      }
    };
    fetchUserProfile();
  }, [logout, navigate]);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setPasswordError('');
    setPasswordSuccess('');
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setErrors({ confirmNewPassword: 'Passwords do not match' });
      return;
    }
    try {
      await api.post('/profile/change-password', passwordData);
      setPasswordSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      console.error('Error changing password:', err);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const errorMessages = Object.entries(errorData).map(
          ([field, message]) => `${message}`
        );
        setPasswordError(errorMessages);
      } else {
        setPasswordError('Error changing password');
      }
    }
  };

  if (loading)
    return (
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '64px',
          paddingTop: '20px',
        }}>
        <CircularProgress />
      </Container>
    );

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        paddingBottom: '64px',
        paddingTop: '20px',
      }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
        <Typography variant="body1">
          <strong>Username:</strong> {user.username}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="body1">
          <strong>Role:</strong> {user.roleName}
        </Typography>

        <Typography variant="h5" sx={{ mt: 4 }}>
          Change Password
        </Typography>
        <form onSubmit={handlePasswordSubmit}>
          <TextField
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            required
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            required
          />
          <TextField
            label="Confirm New Password"
            name="confirmNewPassword"
            type="password"
            value={passwordData.confirmNewPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            error={!!errors.confirmNewPassword}
            helperText={errors.confirmNewPassword}
            required
          />
          {passwordError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {passwordError}
            </Alert>
          )}
          {passwordSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {passwordSuccess}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}>
            Change Password
          </Button>
        </form>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
          <Button
            onClick={() => {
              logout()
              navigate("/login")
            }}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}>
            Logout
          </Button>
      </Box>
    </Container>
  );
}

export default Profile;
