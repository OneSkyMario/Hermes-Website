import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

export default function ItemCard({ item, onAdd }) {
  return (
    <Card style={{ width: '200px', margin: '10px' }}>
      <CardContent style={{ textAlign: 'center' }}>
        <img src={item.image} alt={item.name} style={{ width: '150px', height: '100px' }} />
        <Typography variant="h6" gutterBottom>{item.name}</Typography>
        <Typography variant="body1" gutterBottom>${item.price.toFixed(2)}</Typography>
        <Button variant="outlined" size="small" onClick={() => onAdd(item)}>
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
