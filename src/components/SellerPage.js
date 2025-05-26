import React, { useState } from 'react';
import { Card, Typography, Button, TextField, Box } from '@mui/material';
import { auth, db } from '../Firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function SellerPage({role}) {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  if (role !== 'seller') {
    return (
      <div className="unauthorized-access" style={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
        <Card sx={{ p: 4, width: '100%', maxWidth: 600, boxShadow: 3 }}>
          <Typography variant="h5" gutterBottom>
            Unauthorized Access
          </Typography>
          <Typography variant="body2" gutterBottom>
            You do not have permission to access this page. Please log in as a seller.
          </Typography>
        </Card>
      </div>
    );
  }
  const handleCreateProduct = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('You must be logged in to create a product.');
        return;
      }
      // Validate product details
      if (!productName || !productPrice || !productDescription) {
        setError('All fields are required.');     

        return;
      }
      if (isNaN(productPrice) || parseFloat(productPrice) <= 0) {
        setError('Please enter a valid product price.');
        
        return;
      }
      // Add product to Firestore
      await addDoc(collection(db, 'Products'), {
        sellerId: user.uid,
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        createdAt: new Date(),
      });

      setSuccessMessage('Product created successfully!');
      setError('');
      setProductName('');
      setProductPrice('');
      setProductDescription('');
    } catch (err) {
      setError('Error creating product: ' + err.message);
      setSuccessMessage('');
    }
  };

  return (
    <div className="seller-page" style={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
      <Card sx={{ p: 4, width: '100%', maxWidth: 600, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          Seller Dashboard
        </Typography>
        <Typography variant="body2" gutterBottom>
          Create a new product to sell on the platform.
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Product Name"
            variant="outlined"
            margin="normal"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Product Price"
            type="number"
            variant="outlined"
            margin="normal"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
          <TextField
            fullWidth
            label="Product Description"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
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
            onClick={handleCreateProduct}
          >
            Create Product
          </Button>
        </Box>
      </Card>
    </div>
  );
}