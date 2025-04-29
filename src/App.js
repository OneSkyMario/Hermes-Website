import { useState } from 'react';
import { Button, Card, CardContent, Typography, Tabs, Tab, AppBar, Toolbar, IconButton, TextField, Badge, Drawer, Divider, Box } from '@mui/material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import buttonImage from './assets/IceCappSolo.png';

const drinks = [
  { id: 1, name: 'Ice Cappucino', image: buttonImage, price: 4.99 },
];

const foods = [
  { id: 1, name: 'Veggie Sandwich', image: buttonImage, price: 5.49 },
  { id: 2, name: 'Cheese Pizza', image: buttonImage, price: 7.99 },
];

function ItemCard({ item, onAdd }) {
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

export default function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState(null);

  function handleAddToCart(item) {
    setCartItems(prev => {
      const exists = prev.find(ci => ci.id === item.id);
      if (exists) {
        return prev.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function handleQuantityChange(id, delta) {
    setCartItems(prev => prev
      .map(ci => ci.id === id ? { ...ci, quantity: ci.quantity + delta } : ci)
      .filter(ci => ci.quantity > 0)
    );
  }

  const total = cartItems.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);
  
  const handleCartOpen = () => setCartOpen(true);
  const handleCartClose = () => setCartOpen(false);

  function handleTabChange(event, newValue) {
    setSelectedTab(newValue);
    handleCartClose();
    setOrderPlaced(false);
  }

  function handlePlaceOrder() {
    if (cartItems.length === 0) return;
    setOrderPlaced(true);
    const minutes = Math.floor(Math.random() * 11) + 5; // 5-15 minutes
    const eta = new Date(Date.now() + minutes * 60000);
    setDeliveryTime(eta);
  }

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Hermes</Typography>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search for items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ backgroundColor: 'white', borderRadius: 4 }}
          />
          <IconButton color="inherit" style={{ marginLeft: 16 }} onClick={handleCartOpen}>
            <Badge badgeContent={cartItems.length} color="secondary">
              <div style={{ color: 'inherit', fontWeight: 'bold' }}>Cart</div>
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={cartOpen} onClose={handleCartClose}>
        <div style={{ width: 300, padding: 20 }}>
          <Typography variant="h6">Your Cart</Typography>
          {cartItems.length === 0 ? (
            <Typography variant="body2">Cart is empty</Typography>
          ) : (
            cartItems.map(ci => (
              <div key={ci.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <div>
                  <Typography>{ci.name}</Typography>
                  <Typography variant="body2">${ci.price.toFixed(2)} x {ci.quantity}</Typography>
                </div>
                <div>
                  <Button size="small" onClick={() => handleQuantityChange(ci.id, -1)}>-</Button>
                  <Button size="small" onClick={() => handleQuantityChange(ci.id, +1)}>+</Button>
                </div>
              </div>
            ))
          )}
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
          <Button variant="contained" color="primary" fullWidth onClick={() => { handleCartClose(); handlePlaceOrder(); }} style={{ marginTop: 10 }}>
            Checkout
          </Button>
        </div>
      </Drawer>
      <Box sx={{ p: 2, bgcolor: 'background.default' }}>
        <Typography variant="h3" gutterBottom>Hermes, Our In House Delivery Service</Typography>
        <Tabs value={selectedTab} onChange={handleTabChange} centered style={{ marginBottom: '20px' }}>
          <Tab label="Drinks" />
          <Tab label="Food" />
        </Tabs>

        <Typography gutterBottom>Order to your heart's desire, as long as you have enough cash 😊</Typography>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {(selectedTab === 0 ? drinks : foods).filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onAdd={handleAddToCart}
            />
          ))}
        </div>

        {orderPlaced && cartItems.length > 0 && (
          <Card sx={{ mt: 2 }} elevation={3}>
            <CardContent>
              <Typography variant="h6">Your order has been placed!</Typography>
              <Typography>Estimated delivery at {deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.</Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
}
