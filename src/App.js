import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Tabs, Tab, AppBar, Toolbar, IconButton, TextField, Badge, Drawer, Divider, Box } from '@mui/material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import buttonImage from './assets/IceCappSolo.png';
import nuMapImage from './assets/nu_map.jpg';
import saladImage from './assets/salad_image.jpg';

const drinks = [
  { id: 1, name: 'Ice Cappucino', image: buttonImage, price: 4.99 },
];

const foods = [
  { id: 1, name: 'Veggie Sandwich', image: buttonImage, price: 5.49 },
  { id: 2, name: 'Cheese Pizza', image: buttonImage, price: 7.99 },
  { id: 3, name: 'Fresh Salad', image: saladImage, price: 6.25 },
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
  const [location, setLocation] = useState(null); // {x, y} relative to image
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [showLocationStep, setShowLocationStep] = useState(false);

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
  
  function handleCartOpen() {
    setCartOpen(true);
    setShowLocationStep(false);
  }

  function handleCartClose() {
    setCartOpen(false);
    setShowLocationStep(false);
  }

  function handleCheckoutClick() {
    setShowLocationStep(true);
  }

  function handleMapClick(e) {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width);
    const y = ((e.clientY - rect.top) / rect.height);
    setLocation({ x, y });
  }

  function handleConfirmLocation() {
    setLocationConfirmed(true);
  }

  function handlePlaceOrder() {
    if (cartItems.length === 0 || !locationConfirmed) return;
    setOrderPlaced(true);
    const minutes = Math.floor(Math.random() * 11) + 5;
    const eta = new Date(Date.now() + minutes * 60000);
    setDeliveryTime(eta);
  }

  function handleTabChange(event, newValue) {
    setSelectedTab(newValue);
    handleCartClose();
    setOrderPlaced(false);
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
            disabled={!locationConfirmed}
          />
          <IconButton color="inherit" style={{ marginLeft: 16 }} onClick={handleCartOpen} disabled={!locationConfirmed}>
            <Badge badgeContent={cartItems.length} color="secondary">
              <div style={{ color: 'inherit', fontWeight: 'bold' }}>Cart</div>
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2, bgcolor: 'background.default' }}>
        {!locationConfirmed && (
          <Card sx={{ mt: 4, p: 2, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>Choose Your Delivery Location</Typography>
            <Typography variant="body2" gutterBottom>Click on the map to place your marker, then confirm.</Typography>
            <div style={{ position: 'relative', width: '100%', maxWidth: 500, margin: '0 auto' }}>
              <img
                src={nuMapImage}
                alt="Map for delivery location"
                style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8, cursor: 'crosshair' }}
                onClick={handleMapClick}
              />
              {location && (
                <div style={{
                  position: 'absolute',
                  left: `${location.x * 100}%`,
                  top: `${location.y * 100}%`,
                  transform: 'translate(-50%, -100%)',
                  pointerEvents: 'none',
                  zIndex: 2
                }}>
                  <span style={{ fontSize: 32, color: '#e50000' }}>📍</span>
                </div>
              )}
              {/* Robot always in the center */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 1
              }}>
                <span style={{ fontSize: 32 }}>🤖</span>
              </div>
            </div>
            {location && (
              <>
                <Typography color="success.main" sx={{ mt: 2 }}>A robot is available to deliver to your location!</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleConfirmLocation}>
                  Confirm Location
                </Button>
              </>
            )}
          </Card>
        )}
        {locationConfirmed && (
          <>
            <Box sx={{ mb: 4 }}>
              <Card sx={{ mt: 2, p: 2, maxWidth: 600, mx: 'auto' }}>
                <Typography variant="h6" gutterBottom>Your Delivery Location</Typography>
                <div style={{ position: 'relative', width: '100%', maxWidth: 500, margin: '0 auto' }}>
                  <img
                    src={nuMapImage}
                    alt="Map for delivery location"
                    style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8 }}
                  />
                  {location && (
                    <div style={{
                      position: 'absolute',
                      left: `${location.x * 100}%`,
                      top: `${location.y * 100}%`,
                      transform: 'translate(-50%, -100%)',
                      pointerEvents: 'none',
                      zIndex: 2
                    }}>
                      <span style={{ fontSize: 32, color: '#e50000' }}>📍</span>
                    </div>
                  )}
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}>
                    <span style={{ fontSize: 32 }}>🤖</span>
                  </div>
                </div>
              </Card>
            </Box>
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
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  onClick={handlePlaceOrder}
                  style={{ marginTop: 10 }}
                  disabled={cartItems.length === 0}
                >
                  Checkout
                </Button>
              </div>
            </Drawer>
            {orderPlaced && cartItems.length > 0 && (
              <Card sx={{ mt: 2 }} elevation={3}>
                <CardContent>
                  <Typography variant="h6">Your order has been placed!</Typography>
                  <Typography>
                    Estimated delivery at {deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Box>
    </>
  );
}
