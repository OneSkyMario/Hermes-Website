import React, { useState } from 'react';
import { Card, Typography, Button, TextField, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      setError('');
      onLogin(); // Update authentication state in the parent component
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page" style={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
      <Card sx={{ p: 4, width: '100%', maxWidth: 400, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Typography variant="body2" gutterBottom>
          Enter your credentials to continue.
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </Typography>
      </Card>
    </div>
  );
}