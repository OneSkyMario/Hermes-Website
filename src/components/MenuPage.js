import React, { useState } from 'react';
import { Box, Tabs, Tab, Drawer, Typography, Divider, Button, TextField, Card, CardContent } from '@mui/material';
import ItemCard from './ItemCard';

export default function MenuPage({
  drinks,
  foods,
  searchTerm,
  setSearchTerm,
  cartItems,
  handleAddToCart,
  handleQuantityChange,
  cartOpen,
  handleCartClose,
  nickname,
  setNickname,
  hasPlacedOrder,
  handleCheckoutClick,
  orderPlaced,
  deliveryTime,
  orders,
  activeOrderIndex,
  setActiveOrderIndex,
  mapRef,
  mapMaximized,
  location,
  handleMapClick,
  handleCheckout,
  setMapMaximized,
  total,
  nuMapImage // <-- add this prop
}) {
  // Local state for menu sub-tabs: 0=Drinks, 1=Food, 2=Orders
  const [menuTab, setMenuTab] = useState(0);

  return (
    <Box sx={{ p: 2, bgcolor: 'background.default', maxWidth: 1200, margin: '0 auto', borderRadius: 2, boxShadow: 3 }}>
      {/* Menu Tabs and Cards */}
      <Tabs
        value={menuTab}
        onChange={(_, v) => setMenuTab(v)}
        centered
        style={{ marginBottom: '20px' }}
        TabIndicatorProps={{ style: { display: 'none' } }}
      >
        <Tab
          label="Drinks"
          sx={{
            color: '#FFFFFF', //White text color
            fontWeight: 700,
            background: menuTab === 0 ? '#FFFFFF' : '#FFFFFF',
            borderRadius: 3,
            mx: 1,
            boxShadow: menuTab === 0 ? '0 4px 16px rgba(229,57,53,0.15)' : 'none',
            transition: 'all 0.18s',
            '&:hover': {
              background: '#b71c1c',
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 24px rgba(229,57,53,0.18)',
              color: '#FFFFFF',
            },
          }}
        />
        <Tab
          label="Food"
          sx={{
            color: '#fff',
            fontWeight: 700,
            background: menuTab === 1 ? '#c0392b' : '#e53935',
            borderRadius: 3,
            mx: 1,
            boxShadow: menuTab === 1 ? '0 4px 16px rgba(229,57,53,0.15)' : 'none',
            transition: 'all 0.18s',
            '&:hover': {
              background: '#b71c1c',
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 24px rgba(229,57,53,0.18)',
              color: '#fff',
            },
          }}
        />
        <Tab
          label="Orders"
          sx={{
            color: '#fff',
            fontWeight: 700,
            background: menuTab === 2 ? '#c0392b' : '#e53935',
            borderRadius: 3,
            mx: 1,
            boxShadow: menuTab === 2 ? '0 4px 16px rgba(229,57,53,0.15)' : 'none',
            transition: 'all 0.18s',
            '&:hover': {
              background: '#b71c1c',
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 24px rgba(229,57,53,0.18)',
              color: '#fff',
            },
          }}
        />
      </Tabs>
      <div className="tab-gradient-bar"></div>
      {menuTab === 2 ? (
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
                          src={order.mapImage}
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
            {(menuTab === 0 ? drinks : foods).filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
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
      {(!hasPlacedOrder && mapMaximized) && (
        <div ref={mapRef} style={{ margin: '48px 0 32px 0' }}>
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
                  <span style={{ fontSize: 32, color: '#e53935' }}>📍</span>
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
              <span className="robot-icon">🤖</span>
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
        </div>
      )}
      {/* Show minimized map only if order is not placed and map is not maximized */}
      {(!hasPlacedOrder && !mapMaximized) && (
        <div ref={mapRef} style={{ margin: '48px 0 32px 0' }}>
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
        </div>
      )}
    </Box>
  );
}
