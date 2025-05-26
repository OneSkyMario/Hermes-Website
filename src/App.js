import { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import buttonImage from './assets/IceCappSolo.png';
import nuMapImage from './assets/nu_map.jpg';
import saladImage from './assets/salad_image.jpg';
import React from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MapSection from './components/MapSection';
import MenuPage from './components/MenuPage';
import ContactPage from './components/ContactPage';
import OrderConfirmed from './components/OrderConfirmed';
import TelegramQR from './components/TelegramQR';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SellerPage from './components/SellerPage';

const drinks = [
  { id: 1, name: 'Ice Cappucino', image: buttonImage, price: 4.99 },
];

const foods = [
  { id: 1, name: 'Veggie Sandwich', image: buttonImage, price: 5.49 },
  { id: 2, name: 'Cheese Pizza', image: buttonImage, price: 7.99 },
  { id: 3, name: 'Fresh Salad', image: saladImage, price: 6.25 },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  const [selectedTab, setSelectedTab] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [location, setLocation] = useState(null); // {x, y} relative to image
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [nickname, setNickname] = useState('');
  const [hasPlacedOrder, setHasPlacedOrder] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showLocationStep, setShowLocationStep] = useState(false);
  const [menuTab, setMenuTab] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [userRole, setUserRole] = useState(null); // Add this state

  useEffect(() => {
    // Parallax effect for coffee spill
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Parallax: move coffee slower than scroll (0.3x)
      document.documentElement.style.setProperty('--coffee-parallax', `${scrollY * 0.3}px`);
    };
    window.addEventListener('scroll', handleScroll);
    // Prevent extra scroll (bounce/overscroll)
    document.body.style.overflowX = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const mapRef = useRef(null);
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

    // Existing state updates
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

  function handleLogin() {
    setIsAuthenticated(true); // Set authentication state to true
  }

  return (
    <Router>
      {(!userRole)? (
        <Routes>
        {console.log('User role:', userRole, isAuthenticated,(userRole) === 'seller')}

<Route path="/login" element={<LoginPage onLogin={handleLogin} setUserRole={setUserRole} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) :(userRole.trim() === 'seller')  ? (
        
        <Routes>

          <Route path="/seller-dashboard" element={<SellerPage role={userRole} />} />
          <Route path="*" element={<Navigate to="/seller-dashboard" />} />
        </Routes>
      ) : (
        
        <div className={`app-bg ${selectedTab === 0 ? 'home' : selectedTab === 1 && menuTab === 0 ? 'drinks-menu' : 'food-menu'}`}>
          <Header selectedTab={selectedTab} setSelectedTab={setSelectedTab} handleCartOpen={handleCartOpen} />
          {/* Main Content Routing */}
          {selectedTab === 0 && (
            <>
              <HeroSection />
              <MapSection
                mapRef={mapRef}
                nuMapImage={nuMapImage}
                location={location}
                handleMapClick={handleMapClick}
                locationConfirmed={locationConfirmed}
                handleConfirmLocation={handleConfirmLocation}
              />
            </>
          )}
          {selectedTab === 1 && (
            <MenuPage
              selectedTab={selectedTab}
              handleTabChange={handleTabChange}
              drinks={drinks}
              foods={foods}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              cartItems={cartItems}
              handleAddToCart={handleAddToCart}
              handleQuantityChange={handleQuantityChange}
              cartOpen={cartOpen}
              handleCartClose={handleCartClose}
              nickname={nickname}
              setNickname={setNickname}
              hasPlacedOrder={hasPlacedOrder}
              handleCheckoutClick={handleCheckoutClick}
              orderPlaced={orderPlaced}
              deliveryTime={deliveryTime}
              orders={orders}
              activeOrderIndex={activeOrderIndex}
              setActiveOrderIndex={setActiveOrderIndex}
              mapRef={mapRef}
              mapMaximized={mapMaximized}
              location={location}
              handleMapClick={handleMapClick}
              handleCheckout={handleCheckout}
              setMapMaximized={setMapMaximized}
              total={total}
              nuMapImage={nuMapImage}
              menuTab={menuTab}
              setMenuTab={setMenuTab}
            />
          )}
          {selectedTab === 2 && <ContactPage />}
          {selectedTab === 3 && <TelegramQR />}
          {hasPlacedOrder && <OrderConfirmed nickname={nickname} handleNewOrder={handleNewOrder} />}
        </div>
      )}
      
    </Router>
  );
}