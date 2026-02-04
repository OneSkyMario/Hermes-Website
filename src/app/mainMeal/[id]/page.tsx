// File: app/mainMeal/[id]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { 
  Utensils, MapPin, Thermometer, Clock, Star, User, ArrowLeft, 
  ChevronDown, Zap, Tag, ThumbsUp, Navigation, Info, Check, 
  Plus, ArrowRight, ShieldCheck, Maximize2, Pizza, Beef, Salad
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
// We reuse the same CSS file to maintain the exact design system
import '@/app/coffee/[id]/page.css'; 
import { useShop } from '@/app/context/ShopContext';
import MapComponent from '@/app/MapComponent/Map';

// --- MOCK DATA FOR MEALS ---
const MEAL_STORES = [
  { 
    id: 'ms1', name: 'Otto Central Kitchen', image: '',
    rating: 4.8, price: 12.50, speed: '15m', tag: 'Primary Hub', type: 'Zap', address: 'Bldg A, Logistics Park', distance: '0.2 km'
  },
  { 
    id: 'ms2', name: 'The Grid Grill', image: '',
    rating: 4.6, price: 10.80, speed: '25m', tag: 'Cheapest', type: 'Tag', address: 'Sector 7G, Berlin', distance: '1.8 km'
  },
  { 
    id: 'ms3', name: 'Fresh Labs', image: '',
    rating: 4.9, price: 14.20, speed: '20m', tag: 'Organic', type: 'ThumbsUp', address: '404 Green Ln, Berlin', distance: '1.2 km'
  },
];

const MEAL_ADDONS = [
  { id: 'protein', name: 'Extra Protein', price: 3.50, allergen: false },
  { id: 'sauce', name: 'Spicy Glaze', price: 0.50, allergen: true, allergenName: 'Chili' },
  { id: 'cheese', name: 'Aged Cheddar', price: 1.50, allergen: true, allergenName: 'Dairy' },
  { id: 'sides', name: 'Root Chips', price: 2.00, allergen: false },
  { id: 'drink', name: 'Synth Cola', price: 1.80, allergen: false }
];

const MEALS = [
  { 
    id: '1', name: 'Margherita Pizza', price: '$12.50', weight: '450g', calories: '820kcal', 
    subtitle: 'Standardized Unit #02', type: 'pizza' 
  },
  { 
    id: '2', name: 'Cyber Burger', price: '$14.00', weight: '380g', calories: '950kcal', 
    subtitle: 'High-Protein Unit #05', type: 'burger' 
  },
  { 
    id: '3', name: 'Synth Bowl', price: '$11.20', weight: '500g', calories: '640kcal', 
    subtitle: 'Nutrient-Dense Unit #09', type: 'salad' 
  },
  { 
    id: '4', name: 'Neo Tacos', price: '$10.50', weight: '320g', calories: '580kcal', 
    subtitle: 'Street Format #11', type: 'taco' 
  },
];

const getIcon = (type: string) => {
  switch(type) {
    case 'Zap': return Zap;
    case 'Tag': return Tag;
    case 'ThumbsUp': return ThumbsUp;
    default: return Utensils;
  }
};

const getMealIcon = (type: string) => {
  switch(type) {
    case 'pizza': return Pizza;
    case 'burger': return Beef;
    case 'salad': return Salad;
    default: return Utensils;
  }
};

export default function MainMealDetail() {
  const router = useRouter();
  const params = useParams();
  // Handle ID parsing safely
  const mealId = typeof params.id === 'string' ? params.id : '1';
  
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Find selected meal or default to first
  const selectedMeal = MEALS.find(m => m.id === mealId) || MEALS[0];
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const [activeStore, setActiveStore] = useState(MEAL_STORES[0]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showMap, setIsMapOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsStoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalPrice = useMemo(() => {
    const toppingsCost = selectedToppings.reduce((acc, id) => {
      const item = MEAL_ADDONS.find(i => i.id === id);
      return acc + (item?.price || 0);
    }, 0);
    return activeStore.price + toppingsCost;
  }, [activeStore, selectedToppings]);
  
  const toggleTopping = (id: string) => {
    setSelectedToppings(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleMealClick = (id: string) => {
    router.push(`/mainMeal/${id}`);
  };

  const handleOrder = () => {
    setIsOrdering(true);
    setIsMapOpen(true);
    setTimeout(() => {
      setIsOrdering(false);
    }, 2000);
  };

  const MealIcon = getMealIcon(selectedMeal.type);

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
              <div className="user-role">Logistics Lead</div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="main-content">
          {/* Left Column */}
          <div className="info-section">
            <div>
              <h1 className="coffee-title">{selectedMeal.name}</h1>
              <p className="coffee-subtitle">{selectedMeal.subtitle}</p>
            </div>

            <div className="price"></div>

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
                      <div className="store-dropdown-tag">
                        Source: {activeStore.tag}
                      </div>
                      <div className="store-dropdown-name">
                        {activeStore.name}
                      </div>
                      <div className="store-dropdown-address">
                        {activeStore.address}
                      </div>
                    </div>
                  </div>
                  <div className="store-dropdown-right">
                    <div className="store-dropdown-stats">
                      <div className="store-dropdown-speed">
                        <Clock size={12} />
                        {activeStore.speed}
                      </div>
                      <div className="store-dropdown-rating">
                        <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                        {activeStore.rating}
                      </div>
                    </div>
                    <div className={`store-dropdown-chevron ${isStoreDropdownOpen ? 'open' : ''}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isStoreDropdownOpen && (
                  <div className="store-dropdown-menu">
                    <div className="store-dropdown-menu-header">
                      <span className="store-dropdown-menu-title">Available Kitchens</span>
                    </div>
                    <div className="store-dropdown-list">
                      {MEAL_STORES.map((store) => {
                        const Icon = getIcon(store.type);
                        const isActive = activeStore.id === store.id;
                        
                        return (
                          <button 
                            key={store.id}
                            onClick={() => {
                              setActiveStore(store);
                              setIsStoreDropdownOpen(false);
                            }}
                            className={`store-dropdown-item ${isActive ? 'active' : ''}`}
                          >
                            <div className="store-dropdown-item-left">
                              <div className="store-dropdown-item-icon">
                                <Icon size={20} />
                              </div>
                              <div className="store-dropdown-item-info">
                                <div className="store-dropdown-item-tag">
                                  {store.tag}
                                </div>
                                <div className="store-dropdown-item-name">
                                  {store.name}
                                </div>
                                <div className="store-dropdown-item-address">
                                  {store.address}
                                </div>
                              </div>
                            </div>
                            <div className="store-dropdown-item-right">
                              <div className="store-dropdown-item-rating">
                                <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                                {store.rating}
                              </div>
                              <div className="store-dropdown-item-speed">
                                <Clock size={11} />
                                {store.speed}
                              </div>
                              <div className="store-dropdown-item-distance">
                                {store.distance}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {selectedStore && (
                <div className="selected-store-info">
                  <div className="selected-store-label">Selected Hub:</div>
                  <div className="selected-store-name">{activeStore.name}</div>
                </div>
              )}
            </div>

            {/* Map Card in Layout */}
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
                    Your meal is prioritized through the optimal hub for heat retention.
                  </p>
                </div>
              </div>
            </div>

            {/* Final Order Section */}
            <div className="checkout-card">
              <div className="price-summary">
                <span className="label">Final Price</span>
                <span className="total-value">${totalPrice.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={handleOrder}
                disabled={isOrdering || showMap}
                className={`launch-btn ${isOrdering ? 'loading' : ''}`}
              >
                {isOrdering ? (
                  <>Processing Pulse...</>
                ) : (
                  <>Launch Order <ArrowRight size={18} /></>
                )}
              </button>
              
              {/* RENDER THE MAP COMPONENT CONDITIONALLY */}
              {showMap && (
                <MapComponent 
                  initialOpen={true} 
                  onClose={() => setIsMapOpen(false)} 
                />
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="view-section">
            {/* Meal Display (Reusing coffee-display class for styling) */}
            <div className="coffee-display" style={{ background: "from-green-900 to-green-700" }}>
              <MealIcon className="coffee-icon-large" />
              <div className="floating-info top-right">
                <div className="floating-label">Weight</div>
                <div className="floating-value">{selectedMeal.weight}</div>
              </div>
              <div className="floating-info bottom-left">
                <div className="floating-label">Calories</div>
                <div className="floating-value">{selectedMeal.calories}</div>
              </div>
            </div>

            {/* Customization Section */}
            <div className="custom-section">
              <h3 className="section-header-tag">Enhance Meal</h3>
              <div className="ingredients-grid">
                {MEAL_ADDONS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleTopping(item.id)}
                    className={`ingredient-card ${selectedToppings.includes(item.id) ? 'active' : ''}`}
                  >
                    <div className="ingredient-info">
                      <span className="ingredient-name">{item.name}</span>
                      {item.allergen && (
                        <span className="allergen-tag">
                          <Info size={10} /> {item.allergenName}
                        </span>
                      )}
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

        {/* Meal Selection (Reusing coffee-selection classes) */}
        <div className="coffee-selection">
          <div className="coffee-scroll">
            {MEALS.map((meal) => {
               const ScrollIcon = getMealIcon(meal.type);
               return (
                <button
                  key={meal.id}
                  className={`coffee-card ${selectedMeal.id === meal.id ? 'active' : ''}`}
                  onClick={() => handleMealClick(meal.id)}
                >
                  <div className="coffee-card-icon" style={{ background: "from-green-900 to-green-700" }}>
                    <ScrollIcon style={{ width: '24px', height: '24px' }} />
                  </div>
                  <div className="coffee-card-name">{meal.name}</div>
                  <div className="coffee-card-price">{meal.price}</div>
                </button>
               )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}