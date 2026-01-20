'use client';

import { useRouter, useParams } from 'next/navigation';
// Replaced Coffee with Utensils and Pizza
import { Utensils, Pizza, Clock, Star, User, ArrowLeft, ChevronDown, Zap, Tag, Info, Check, Plus, ArrowRight, Maximize2, Navigation } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './page.css'; 
import MapComponent from '@/app/MapComponent/Map';

const MEAL_STORES = [
  { 
    id: 'ms1', name: 'Otto Central Kitchen', 
    rating: 4.8, price: 12.50, speed: '15m', tag: 'Primary Hub', type: 'Zap', address: 'Bldg A, Logistics Park', distance: '0.2 km'
  },
  { 
    id: 'ms2', name: 'The Grid Grill', 
    rating: 4.6, price: 10.80, speed: '25m', tag: 'Cheapest', type: 'Tag', address: 'Sector 7G, Berlin', distance: '1.8 km'
  }
];

const MEAL_ADDONS = [
  { id: 'protein', name: 'Extra Protein Pulse', price: 3.50, allergen: false },
  { id: 'sauce', name: 'Industrial Glaze', price: 0.50, allergen: true, allergenName: 'Soy' },
  { id: 'sides', name: 'Fiber Pack (Veg)', price: 2.00, allergen: false }
];

// Mock Meals Data for the bottom selection bar
const MEALS = [
  { id: '1', name: 'Margherita Pizza', price: '$12.50', weight: '450g', calories: '820kcal', subtitle: 'Standardized Unit #02' },
  { id: '2', name: 'Cyber Burger', price: '$14.00', weight: '380g', calories: '950kcal', subtitle: 'High-Protein Unit #05' },
  { id: '3', name: 'Synth Bowl', price: '$11.20', weight: '500g', calories: '640kcal', subtitle: 'Nutrient-Dense Unit #09' },
];

export default function MainMealDetail() {
  const router = useRouter();
  const params = useParams();
  const mealId = params.id;
  
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [activeStore, setActiveStore] = useState(MEAL_STORES[0]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showMap, setIsMapOpen] = useState(false);

  // Find the specific meal based on URL ID or default to the first one
  const selectedMeal = useMemo(() => {
    return MEALS.find(m => m.id === mealId) || MEALS[0];
  }, [mealId]);

  const totalPrice = useMemo(() => {
    const toppingsCost = selectedToppings.reduce((acc, id) => {
      const item = MEAL_ADDONS.find(i => i.id === id);
      return acc + (item?.price || 0);
    }, 0);
    return activeStore.price + toppingsCost;
  }, [activeStore, selectedToppings]);

  const toggleTopping = (id: string) => {
    setSelectedToppings(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  
  const handleOrder = () => {
    setIsOrdering(true);
    setIsMapOpen(true);
    setTimeout(() => {
      setIsOrdering(false);
    }, 2000);
  };
  const getIcon = (type: string) => {
    return type === 'Zap' ? Zap : Tag;
  };

  
  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="back-btn" onClick={() => router.push('/')}>
              <ArrowLeft className="icon" />
            </button>
            <div className="logo">
              <Utensils style={{ width: '32px', height: '32px' }} />
              <span>Otto Food</span>
            </div>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              <User className="icon" />
            </div>
            <div className="user-details">
              <div className="user-name">Grayson Adler</div>
              <div className="user-role">Account manager</div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="main-content">
          {/* Left Column */}
          <div className="info-section">
            <div>
              <h1 className="meal-title">{selectedMeal.name}</h1>
              <p className="meal-subtitle">{selectedMeal.subtitle}</p>
            </div>

            {/* Store Selection */}
            <div className="store-section">
              <h3 className="store-section-title">Select Prep Hub</h3>
              <div className="store-dropdown-container" ref={dropdownRef}>
                <button 
                  onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
                  className="store-dropdown-btn"
                >
                  <div className="store-dropdown-btn-content">
                    <div className="store-dropdown-icon">
                      {React.createElement(getIcon(activeStore.type), { size: 20 })}
                    </div>
                    <div className="store-dropdown-details">
                      <div className="store-dropdown-tag">Source: {activeStore.tag}</div>
                      <div className="store-dropdown-name">{activeStore.name}</div>
                      <div className="store-dropdown-address">{activeStore.address}</div>
                    </div>
                  </div>
                  <div className="store-dropdown-right">
                    <div className="store-dropdown-stats">
                      <div className="store-dropdown-speed"><Clock size={12} /> {activeStore.speed}</div>
                      <div className="store-dropdown-rating"><Star size={12} fill="#fbbf24" stroke="#fbbf24" /> {activeStore.rating}</div>
                    </div>
                    <ChevronDown size={20} className={isStoreDropdownOpen ? 'open' : ''} />
                  </div>
                </button>

                {isStoreDropdownOpen && (
                  <div className="store-dropdown-menu">
                    <div className="store-dropdown-list">
                      {MEAL_STORES.map((store) => {
                        const Icon = getIcon(store.type);
                        return (
                          <button 
                            key={store.id}
                            onClick={() => { setActiveStore(store); setIsStoreDropdownOpen(false); }}
                            className={`store-dropdown-item ${activeStore.id === store.id ? 'active' : ''}`}
                          >
                            <div className="store-dropdown-item-left">
                              <Icon size={20} />
                              <div className="store-dropdown-item-info">
                                <div className="store-dropdown-item-tag">{store.tag}</div>
                                <div className="store-dropdown-item-name">{store.name}</div>
                              </div>
                            </div>
                            <div className="store-dropdown-item-right">
                               <div className="store-dropdown-item-rating"><Star size={12} fill="#fbbf24" stroke="#fbbf24" /> {store.rating}</div>
                               <div className="store-dropdown-item-distance">{store.distance}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Logistics Preview */}
                 <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div className="logistics-row">
                          {/* Map Card */}
                          <div className="card map-card">
                            <div className="card-header">
                              <h3 className="card-title">Autonomous Map</h3>
                              <span className="badge">4 BOTS ACTIVE</span>
                            </div>
                            <div 
                              className="map-container"
                              onClick={() => setIsMapOpen(true)}
                              style={{ cursor: 'pointer', position: 'relative' }}
                            >
                              <div className="map-grid" />
                              <div className="map-halftone" />
                              
                              {/* Sample Bots */}
                              <div className="bot bot-main" />
                              <div className="bot bot-warning" />
                              <div className="bot bot-idle" />
            
                              {/* Hover Overlay */}
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(0,0,0,0.5)',
                                opacity: 0,
                                transition: 'opacity 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                              >
                                <div style={{
                                  background: 'rgba(255,255,255,0.1)',
                                  backdropFilter: 'blur(4px)',
                                  padding: '0.75rem 1.5rem',
                                  border: '2px solid #6b6b6b',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  color: '#f5f5f5',
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  fontSize: '0.75rem',
                                  zIndex: 100
                                }}>
                                  <Maximize2 size={16} />
                                  <span onClick={() => setIsMapOpen(true)}>Click to expand</span>
                                </div>
                              </div>
            
                              <div className="status-card">
                                <div className="status-header">
                                  <Navigation size={12} />
                                  <span>Bot #9220 moving south</span>
                                </div>
                                <div className="progress-bar">
                                  <div className="progress-fill" />
                                </div>
                              </div>
                            </div>
                          </div>
            
                          {/* ETA Card */}
                          <div className="card eta-card eta-side">
                            <div className="eta-header">
                              <div className="eta-icon">
                                <Clock size={14} />
                              </div>
                              <div>
                                <div className="eta-label">Estimated Time</div>
                                <div className="eta-value">8-12 MIN</div>
                              </div>
                            </div>
                            <p className="eta-note" style={{ color: 'rgba(255,255,255,0.7)' }}>
                              Your order is prioritized through the optimal hub for thermal retention.
                            </p>
                          </div>
                        </div>
                      </div>

            {/* Final Order Section */}
            <div className="checkout-card" style={{ marginTop: '2rem' }}>
              <div className="price-summary">
                <span className="label">Final Price</span>
                <span className="total-value">${totalPrice.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleOrder}
                disabled={isOrdering}
                className={`launch-btn ${isOrdering ? 'loading' : ''}`}
              >
                {isOrdering ? 'Processing Pulse...' : <>Launch Order <ArrowRight size={18} /></>}
              </button>
            {/* RENDER THE MAP COMPONENT CONDITIONALLY */}
                {showMap && (
                  <MapComponent 
                    initialOpen={true} 
                    onClose={() => setIsMapOpen(false)} 
                  />
                )}            </div>
          </div>

          {/* Right Column */}
          <div className="view-section">
            <div className="meal-display" style={{ background: "linear-gradient(to bottom right, #1a2e1a, #0d1a0d)", borderRadius: '24px', position: 'relative', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pizza size={120} color="#4ade80" />
              <div className="floating-info top-right">
                <div className="floating-label">Weight</div>
                <div className="floating-value">{selectedMeal.weight}</div>
              </div>
              <div className="floating-info bottom-left">
                <div className="floating-label">Calories</div>
                <div className="floating-value">{selectedMeal.calories}</div>
              </div>
            </div>

            {/* Customization */}
            <div className="custom-section" style={{ marginTop: '2rem' }}>
              <h3 className="section-header-tag">Nutritional Add-ons</h3>
              <div className="ingredients-grid">
                {MEAL_ADDONS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleTopping(item.id)}
                    className={`ingredient-card ${selectedToppings.includes(item.id) ? 'active' : ''}`}
                  >
                    <div className="ingredient-info">
                      <span className="ingredient-name">{item.name}</span>
                      {item.allergen && <span className="allergen-tag"><Info size={10} /> {item.allergenName}</span>}
                    </div>
                    <div className="ingredient-price-action">
                      <span className="price-tag">+${item.price.toFixed(2)}</span>
                      {selectedToppings.includes(item.id) ? <Check size={14} /> : <Plus size={14} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Meal Selection */}
        <div className="meal-selection" style={{ marginTop: '4rem' }}>
          <h3 className="section-header-tag">Switch Meal Unit</h3>
          <div className="meal-scroll" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            {MEALS.map((m) => (
              <button
                key={m.id}
                className={`meal-card ${selectedMeal.id === m.id ? 'active' : ''}`}
                onClick={() => router.push(`/mainMeal/${m.id}`)}
                style={{ minWidth: '200px', padding: '1rem', border: '2px solid #333', textAlign: 'left' }}
              >
                <div className="meal-card-icon" style={{ marginBottom: '0.5rem' }}>
                  <Utensils size={20} />
                </div>
                <div className="meal-card-name" style={{ fontWeight: 'bold' }}>{m.name}</div>
                <div className="meal-card-price" style={{ opacity: 0.7 }}>{m.price}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}