import React, { useState } from 'react';
import { Card, Typography, Button, TextField, Box } from '@mui/material';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../Firebase';
import { Route } from 'react-router-dom';

export default function RegisterPage({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      
      console.log('Email verification sent');
      alert('Email verification sent. Please check your inbox.');
      setSuccessMessage('Registration successful! Please check your email to verify your account.');
      setError('');

      // Optionally, call onRegister to log in the user after verification
      onRegister();
      Route.push('/login'); // Redirect to login page after registration
    } catch (err) {
      setError(err.message);
      setSuccessMessage('');
    }
  };

  return (
    <div className="register-page" style={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
      <Card sx={{ p: 4, width: '100%', maxWidth: 400, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        <Typography variant="body2" gutterBottom>
          Create an account to continue.
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
            onClick={handleRegister}
          >
            Register
          </Button>
        </Box>
      </Card>
    </div>
  );
}