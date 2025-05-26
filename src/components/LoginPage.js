import React, { useState } from 'react';
import { Card, Typography, Button, TextField, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin, setUserRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const results = userCredential.user;
      if (results.emailVerified === true) {
        console.log('User is verified');
        console.log('Login successful');
        const userData = await fetchUser(results.uid); // Fetch user data after successful login
        if (userData) {
          setUserRole(userData.role.replace(/\n/g, '').trim()); // Set user role in context or state
          if (userData.role === "student") {
            onLogin();
            
            navigate('/'); // Redirect to the main page for students

          } else if (userData.role === 'seller') {
            onLogin();

            navigate('/seller-dashboard'); // Redirect to the seller dashboard

          }
        }
      }
      else {
      setError('User email not verified. Please check your inbox for the verification email.');
      } 
      // Update authentication state in the parent component
    } catch (err) {
      setError(err.message);
      console.log('Login error:', err);
    }
  };
  const fetchUser = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'Users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log('No such user!');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
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