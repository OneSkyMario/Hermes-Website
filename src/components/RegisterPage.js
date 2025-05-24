import React, { useState } from 'react';
import { Card, Typography, Button, TextField, Box } from '@mui/material';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../Firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const actionCodeSettings = {
    url: 'https://hermesnu123.com/verify-email', // Replace with your custom domain
    handleCodeInApp: true, // Ensures the link is handled in the app
    iOS: {
      bundleId: 'com.hermesnu.ios',
    },
    android: {
      packageName: 'com.hermesnu.android',
      installApp: true,
      minimumVersion: '12',
    },
    dynamicLinkDomain: 'hermesnu.page.link',
  };

  const handleRegister = async () => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Send email verification
      await sendEmailVerification(user, actionCodeSettings);
  
      console.log('Email verification sent');
      alert('Email verification sent. Please check your inbox.');
  
      // Wait for the user to verify their email
      setSuccessMessage('Registration successful! Please verify your email to complete the process.');
      setError('');
  
      // Save user to Firestore after email verification
      await saveUserToDatabase(user); // Pass the user object here
    } catch (err) {
      setError(err.message);
      setSuccessMessage('');
    }
  };

  const saveUserToDatabase = async (user) => {
    try {
      // Save the user's email to Firestore
      await setDoc(doc(db, 'Users', user.uid), {
        email: user.email,
        role: 'student', // Assign role here (e.g., 'student' or 'teacher')
      });
      console.log('User added to Firestore');
    } catch (err) {
      console.error('Error saving user to Firestore:', err);
    }
  };

  const checkEmailVerification = async () => {
    try {
      const user = auth.currentUser;
      await user.reload(); // Reload user to get the latest email verification status

      if (user.emailVerified) {
        // Save user to Firestore after email verification
        await saveUserToDatabase(user);
        alert('Email verified! Your account has been successfully registered.');
        navigate('/dashboard'); // Redirect to the dashboard or another page
      } else {
        alert('Please verify your email before proceeding.');
      }
    } catch (err) {
      console.error('Error checking email verification:', err);
    }
  };

  return (
    <div className="register-page" style={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
      <Card sx={{ p: 4, width: '100%', maxWidth: 400, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Registration
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
          {successMessage && (
            <Typography color="success" variant="body2" sx={{ mt: 1 }}>
              {successMessage}
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
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={checkEmailVerification}
          >
            Check Email Verification
          </Button>
        </Box>
      </Card>
    </div>
  );
}