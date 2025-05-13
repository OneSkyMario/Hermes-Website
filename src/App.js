import { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, Typography, Tabs, Tab, AppBar, Toolbar, IconButton, TextField, Badge, Drawer, Divider, Box } from '@mui/material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import buttonImage from './assets/IceCappSolo.png';
import nuMapImage from './assets/nu_map.jpg';
import saladImage from './assets/salad_image.jpg';
import { FaShoppingCart, FaMapMarkerAlt, FaRobot } from 'react-icons/fa';
import HermesLogo from './assets/Hermes_Logo.png';

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
  const [nickname, setNickname] = useState('');
  const [hasPlacedOrder, setHasPlacedOrder] = useState(false);
  const mapRef = useRef(null);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const cartPreviewTimeout = useRef(null);
  const [mapMaximized, setMapMaximized] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeOrderIndex, setActiveOrderIndex] = useState(null);
  const [hasScrolledToMap, setHasScrolledToMap] = useState(false);

  function handleAddToCart(item) {
    setCartItems(prev => {
      const exists = prev.find(ci => ci.id === item.id);
      if (exists) {
        return prev.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setShowCartPreview(true);
    if (cartPreviewTimeout.current) clearTimeout(cartPreviewTimeout.current);
    cartPreviewTimeout.current = setTimeout(() => setShowCartPreview(false), 2000);
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
    setCartOpen(false);
    setMapMaximized(true);
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 350); // Wait for drawer to close
  }

  function handleMapClick(e) {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width);
    const y = ((e.clientY - rect.top) / rect.height);
    setLocation({ x, y });
    if (!hasScrolledToMap && mapRef.current) {
      setTimeout(() => {
        mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      setHasScrolledToMap(true);
    }
  }

  function handleConfirmLocation() {
    setLocationConfirmed(true);
    setMapMaximized(false);
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

  function handleCheckout() {
    if (!location) {
      alert('Please select a delivery location first!');
      return;
    }
    if (!nickname) {
      alert('Please enter a nickname first!');
      return;
    }
    setOrders(prev => [
      ...prev,
      {
        nickname,
        items: cartItems,
        location,
        status: 'Preparing',
        placedAt: new Date(),
      }
    ]);
    setHasPlacedOrder(true);
    setShowLocationStep(false);
    setCartItems([]);
  }

  function handleNewOrder() {
    setHasPlacedOrder(false);
    setLocation(null);
    setNickname('');
  }

  return (
    <div className="App">
      <header className="App-header" style={{ position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: '2rem 0 1rem 0', background: 'none', gap: 24 }}>
        <img src={HermesLogo} alt="Hermes Logo" style={{ height: 100, width: 100, objectFit: 'contain', borderRadius: 8}} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Helvetica Neue, Helvetica', fontWeight: 100000, fontSize: '5rem', color: '#e53935', letterSpacing: 1, lineHeight: 1 }}>
            Hermes
          </span>
          <div style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', color: '#e53935', marginTop: 4 }}>
            NU's-in-house robot delivery service
          </div>
        </div>
        <div className="cart-icon" onClick={handleCartOpen} style={{ position: 'absolute', top: 32, right: 48, zIndex: 10, border: '3px solid #e53935', borderRadius: 16, background: 'white', transition: 'box-shadow 0.2s, background 0.2s', boxShadow: '0 2px 8px rgba(229,57,53,0.08)' }}>
          <FaShoppingCart color="#e53935" size="3rem" />
          {cartItems.length > 0 && (
            <span
              className="cart-count"
              style={{
                position: 'absolute',
                top: 40,
                right: -20,
                backgroundColor: '#e53935',
                color: '#fff',
                borderRadius: 999,
                padding: '2px 10px',
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(229,57,53,0.18)',
                border: '2px solid #fff',
                minWidth: 26,
                minHeight: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {cartItems.reduce((sum, ci) => sum + ci.quantity, 0)}
            </span>
          )}
        </div>
      </header>

      {!hasPlacedOrder ? (
        <Box sx={{ p: 2, bgcolor: 'background.default' }}>
          {/* Show the map at the top only if location is not confirmed */}
          {!locationConfirmed && (
            <div ref={mapRef} style={{ marginBottom: 32 }}>
              <Card sx={{ mt: 4, p: 2, width: '100%', boxSizing: 'border-box', mx: 'auto', boxShadow: 3 }}>
                {nickname && (
                  <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                    Delivering to: <b>{nickname}</b>
                  </Typography>
                )}
                <Typography variant="h5" gutterBottom>Choose Your Delivery Location</Typography>
                <Typography variant="body2" gutterBottom>Click on the map to place your marker, then confirm.</Typography>
                <div style={{ position: 'relative', width: '100%', height: '70vh', margin: '0 auto' }}>
                  <img
                    src={nuMapImage}
                    alt="Map for delivery location"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8, cursor: 'crosshair' }}
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
                    transform: 'translate(-220%, -300%)',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}>
                    <span style={{ fontSize: 24 }}>🤖</span>
                  </div>
                </div>
                {location && !locationConfirmed && (
                  <>
                    <Typography color="success.main" sx={{ mt: 2 }}>A robot is available to deliver to your location!</Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleConfirmLocation}>
                      Confirm Location
                    </Button>
                  </>
                )}
              </Card>
            </div>
          )}
          {/* Rest of the UI below the map */}
          {locationConfirmed && (
            <>
              <Tabs value={selectedTab} onChange={handleTabChange} centered style={{ marginBottom: '20px' }}>
                <Tab label="Drinks" />
                <Tab label="Food" />
                <Tab label="Orders" />
              </Tabs>
              <div className="tab-gradient-bar"></div>
              {selectedTab === 2 ? (
                // Orders Tab
                <div style={{ maxWidth: 900, margin: '2rem auto', background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 32 }}>
                  <h2>Your Orders</h2>
                  {orders.length === 0 ? (
                    <p>No orders yet.</p>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {orders.map((order, idx) => (
                        <li key={idx} style={{ marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong>Order for:</strong> {order.nickname}<br />
                              <strong>Status:</strong> {order.status}<br />
                              <strong>Placed:</strong> {order.placedAt.toLocaleString()}
                            </div>
                            <button
                              style={{ background: '#DC143C', color: 'white', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', fontWeight: 600, cursor: 'pointer' }}
                              onClick={() => setActiveOrderIndex(idx)}
                            >
                              Track Order
                            </button>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <strong>Items:</strong>
                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                              {order.items.map((item, i) => (
                                <li key={i}>{item.name} x {item.quantity}</li>
                              ))}
                            </ul>
                          </div>
                          {activeOrderIndex === idx && (
                            <div style={{ marginTop: 16 }}>
                              <strong>Delivery Location:</strong>
                              <div style={{ position: 'relative', width: '100%', maxWidth: 600, height: 300, margin: '1rem 0', borderRadius: 8, overflow: 'hidden', border: '1px solid #eee' }}>
                                <img
                                  src={nuMapImage}
                                  alt="Order delivery location"
                                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                                {order.location && (
                                  <div style={{
                                    position: 'absolute',
                                    left: `${order.location.x * 100}%`,
                                    top: `${order.location.y * 100}%`,
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
                                  transform: 'translate(-220%, -300%)',
                                  pointerEvents: 'none',
                                  zIndex: 1
                                }}>
                                  <span style={{ fontSize: 18 }}>🤖</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'Helvetica' }}>You've selected your location! Now you can order whatever you want! (as long as you have enough cash) 😆</Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {(selectedTab === 0 ? drinks : foods).filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        onAdd={handleAddToCart}
                      />
                    ))}
                  </div>
                </>
              )}
              <Drawer anchor="right" open={cartOpen} onClose={handleCartClose}>
                <div style={{ width: 350, padding: 28, background: 'white', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', borderTopLeftRadius: 18, borderBottomLeftRadius: 18, boxShadow: '0 4px 24px rgba(200,0,0,0.10)' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#e53935', mb: 2, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Your Cart</Typography>
                  {cartItems.length === 0 ? (
                    <Typography variant="body1" sx={{ color: '#888', mt: 4, textAlign: 'center' }}>Cart is empty</Typography>
                  ) : (
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                      {cartItems.map(ci => (
                        <div key={ci.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0 8px 0', borderBottom: '1px solid #f3f3f3' }}>
                          <div>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', color: '#222' }}>{ci.name}</Typography>
                            <Typography variant="body2" sx={{ color: '#888', fontWeight: 600, fontSize: '1rem', mt: 0.5 }}>${ci.price.toFixed(2)} x {ci.quantity}</Typography>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Button variant="outlined" size="small" onClick={() => handleQuantityChange(ci.id, -1)} sx={{ minWidth: 36, minHeight: 36, borderRadius: '50%', borderColor: '#e53935', color: '#e53935', fontWeight: 700, fontSize: '1.3rem', borderWidth: 2, p: 0, '&:hover': { background: '#ffe3e3', borderColor: '#b71c1c', color: '#b71c1c' } }}>-</Button>
                            <Button variant="outlined" size="small" onClick={() => handleQuantityChange(ci.id, +1)} sx={{ minWidth: 36, minHeight: 36, borderRadius: '50%', borderColor: '#e53935', color: '#e53935', fontWeight: 700, fontSize: '1.3rem', borderWidth: 2, p: 0, '&:hover': { background: '#ffe3e3', borderColor: '#b71c1c', color: '#b71c1c' } }}>+</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Divider style={{ margin: '24px 0 16px 0', background: '#f3f3f3' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#e53935', fontSize: '1.5rem', mb: 1, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Total: ${total.toFixed(2)}</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter your nickname"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    disabled={hasPlacedOrder}
                    sx={{
                      mt: 2,
                      mb: 2,
                      background: '#fff',
                      borderRadius: 2,
                      fontWeight: 700,
                      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                    }}
                    inputProps={{ style: { fontWeight: 700, fontSize: '1.1rem', color: '#e53935', padding: '12px 14px' } }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleCheckoutClick}
                    sx={{
                      mt: 1,
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      borderRadius: 2,
                      background: '#e53935',
                      color: '#fff',
                      boxShadow: '0 2px 8px rgba(229,57,53,0.08)',
                      '&:hover': { background: '#b71c1c' },
                      opacity: cartItems.length === 0 || !nickname ? 0.5 : 1,
                    }}
                    disabled={cartItems.length === 0 || !nickname}
                  >
                    Proceed to Delivery
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
              {/* Always show the minimized/maximized map after location is confirmed */}
              <div ref={mapRef} style={{ margin: '48px 0 32px 0' }}>
                {mapMaximized ? (
                  <Card sx={{ p: 2, width: '100%', boxSizing: 'border-box', mx: 'auto', boxShadow: 3 }}>
                    {nickname && (
                      <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                        Delivering to: <b>{nickname}</b>
                      </Typography>
                    )}
                    <Typography variant="h5" gutterBottom>Confirm Your Delivery Location</Typography>
                    <Typography variant="body2" gutterBottom>Review your location and confirm your order below.</Typography>
                    <div style={{ position: 'relative', width: '100%', height: '70vh', margin: '0 auto' }}>
                      <img
                        src={nuMapImage}
                        alt="Map for delivery location"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8, cursor: 'crosshair' }}
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
                        transform: 'translate(-220%, -300%)',
                        pointerEvents: 'none',
                        zIndex: 1
                      }}>
                        <span style={{ fontSize: 24 }}>🤖</span>
                      </div>
                    </div>
                    <div className="delivery-info">
                      <FaRobot className="robot-icon" />
                      <p>A robot will deliver your order to this location</p>
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={handleCheckout}
                      disabled={!location}
                      style={{
                        border: '2px solid #e53935',
                        color: '#e53935',
                        background: 'white',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                        fontSize: '1rem',
                        padding: '0.6rem 1.5rem',
                        marginRight: 8,
                        cursor: !location ? 'not-allowed' : 'pointer',
                        opacity: !location ? 0.5 : 1,
                        boxShadow: '0 2px 8px rgba(229,57,53,0.08)',
                        transition: 'background 0.2s',
                      }}
                    >
                      Confirm Location & Place Order
                    </button>
                    <button
                      className="add-to-cart-btn"
                      style={{
                        border: '2px solid #e53935',
                        color: '#e53935',
                        background: 'white',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                        fontSize: '1rem',
                        padding: '0.6rem 1.5rem',
                        marginTop: 8,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(229,57,53,0.08)',
                        transition: 'background 0.2s',
                      }}
                      onClick={() => setMapMaximized(false)}
                    >
                      Minimize Map
                    </button>
                  </Card>
                ) : (
                  <Card sx={{ p: 1, width: '100%', boxSizing: 'border-box', mx: 'auto', boxShadow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 60 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={nuMapImage}
                        alt="Map thumbnail"
                        style={{ width: 80, height: 48, objectFit: 'cover', borderRadius: 4 }}
                      />
                      <span style={{ fontWeight: 500 }}>Delivery location selected</span>
                    </div>
                    <button 
                      className="checkout-btn"
                      style={{ marginLeft: 16, minWidth: 90 }}
                      onClick={() => setMapMaximized(true)}
                    >
                      Maximize Map
                    </button>
                  </Card>
                )}
              </div>
            </>
          )}
        </Box>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}>
          <div style={{
            background: 'white',
            borderRadius: 18,
            boxShadow: '0 4px 24px rgba(200,0,0,0.10)',
            padding: '2.5rem 2.5rem 2rem 2.5rem',
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
            borderTop: '8px solid #e53935',
          }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 48, color: '#e53935', fontWeight: 700 }}>🤖</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '2.1rem', color: '#e53935', marginBottom: 12, fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Order Confirmed!
            </div>
            <div style={{ fontWeight: 700, color: '#e53935', fontSize: '1.1rem', marginBottom: 8, fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Your order will be delivered to {nickname}
            </div>
            <div style={{ fontWeight: 700, color: '#222', fontSize: '1.1rem', marginBottom: 24, fontFamily: 'Helvetica, Arial, sans-serif' }}>
              A robot will deliver your order to the selected location.
            </div>
            <button
              className="new-order-btn"
              onClick={handleNewOrder}
              style={{
                background: '#e53935',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '0.7rem 2.2rem',
                fontWeight: 700,
                fontSize: '1.1rem',
                fontFamily: 'Helvetica, Arial, sans-serif',
                cursor: 'pointer',
                marginTop: 8,
                boxShadow: '0 2px 8px rgba(229,57,53,0.08)',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#b71c1c'}
              onMouseOut={e => e.currentTarget.style.background = '#e53935'}
            >
              Place New Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
