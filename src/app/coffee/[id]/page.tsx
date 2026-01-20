// File: app/coffee/[id]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { Coffee, MapPin, Thermometer, Clock, Star, User, ArrowLeft, ChevronDown, Zap, Tag, ThumbsUp, Navigation, Info, Check, Plus, ArrowRight, ShieldCheck, Maximize2} from 'lucide-react';
import { coffees } from '@/lib/coffees';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './page.css';
import { useShop } from '@/app/context/ShopContext';
import MapComponent from '@/app/MapComponent/Map';

 const STORES = [
  { 
    id: 's1', name: 'Mitte Roastery', image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=800&auto=format&fit=crop',
    rating: 4.9, price: 4.50, speed: '8m', tag: 'Fastest', type: 'Zap', address: '123 Coffee St, Berlin', distance: '0.5 km'
  },
  { 
    id: 's3', name: 'Organic Bean Co.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
    rating: 5.0, price: 5.20, speed: '12m', tag: 'Recommended', type: 'ThumbsUp', address: '456 Brew Ave, Berlin', distance: '1.2 km'
  },
  { 
    id: 's2', name: 'The Dot Lab', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
    rating: 4.7, price: 3.80, speed: '14m', tag: 'Cheapest', type: 'Tag', address: '789 Espresso Rd, Berlin', distance: '2.0 km'
  },
  { 
    id: 's4', name: 'West End Grinds', image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=800&auto=format&fit=crop',
    rating: 4.5, price: 4.20, speed: '18m', tag: 'Partner', type: 'Coffee', address: '321 Latte Ln, Berlin', distance: '2.5 km'
  },
];

const INGREDIENTS = [
  { id: 'oat', name: 'Oat Milk', price: 0.50, allergen: false },
  { id: 'almond', name: 'Almond Milk', price: 0.50, allergen: true, allergenName: 'Nuts' },
  { id: 'syrup', name: 'Vanilla Bean', price: 0.75, allergen: false },
  { id: 'honey', name: 'Wild Honey', price: 0.40, allergen: false },
  { id: 'extra', name: 'Extra Shot', price: 1.20, allergen: false }
];

const getIcon = (type:String) => {
  switch(type) {
    case 'Zap': return Zap;
    case 'Tag': return Tag;
    case 'ThumbsUp': return ThumbsUp;
    default: return Coffee;
  }
};

export default function CoffeeDetail() {
  const router = useRouter();
  const params = useParams();
  const coffeeId = Number(params.id);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const selectedCoffee = coffees.find(c => c.productID === coffeeId);
  const [activeView, setActiveView] = useState('inside');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cartCount, setCartCount] = useState(0);
  const [activeStore, setActiveStore] = useState(STORES[0]);  // Close dropdown when clicking outside
  const { getCoffeeById, loading } = useShop();
  const coffee = getCoffeeById(coffeeId);
  const [showMap, setIsMapOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsStoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedCoffee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Кофе не найден</h1>
          <button 
            onClick={() => router.push('/')}
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = useMemo(() => {
      const toppingsCost = selectedToppings.reduce((acc, id) => {
        const item = INGREDIENTS.find(i => i.id === id);
        return acc + (item?.price || 0);
      }, 0);
      return activeStore.price + toppingsCost;
    }, [activeStore, selectedToppings]);
  
  const toggleTopping = (id:string) => {
    setSelectedToppings(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };
  



  const handleCoffeeClick = (productID: number) => {
    router.push(`/coffee/${productID}`);
  };

    const handleOrder = () => {
    setIsOrdering(true);
    setIsMapOpen(true);
    setTimeout(() => {
      setIsOrdering(false);
      setCartCount(prev => prev + 1);
    }, 2000);
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
              <Coffee style={{ width: '32px', height: '32px' }} />
              <span>Otto</span>
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
              <h1 className="coffee-title">{selectedCoffee.name}</h1>
              <p className="coffee-subtitle">{selectedCoffee.subtitle}</p>
            </div>

            <div className="price"></div>

            <div className="info-card">
              information about 
            </div>
       {/* Store Selection */}
              <div className="store-section">
                <h3 className="store-section-title">Выберите магазин</h3>
                
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
                        <span className="store-dropdown-menu-title">Доступные магазины</span>
                      </div>
                      <div className="store-dropdown-list">
                        {STORES.map((store) => {
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
                    <div className="selected-store-label">Выбранный магазин:</div>
                    <div className="selected-store-name">{selectedStore.name}</div>
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
                  Your order is prioritized through the optimal hub for thermal retention.
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
              {/* Coffee Display */}
              <div className="coffee-display" style={{ background: "from-amber-900 to-amber-700" }}>
                <Coffee className="coffee-icon-large" />
                <div className="floating-info top-right">
                  <div className="floating-label">Объем</div>
                  <div className="floating-value">{selectedCoffee.volume}</div>
                </div>
                <div className="floating-info bottom-left">
                  <div className="floating-label">Кофеин</div>
                  <div className="floating-value">{selectedCoffee.caffeine}</div>
                </div>
              </div>

              {/* Customization Section */}
              <div className="custom-section">
                <h3 className="section-header-tag">Build Your Dose</h3>
                <div className="ingredients-grid">
                  {INGREDIENTS.map(item => (
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
          
                
        {/* Coffee Selection */}
        <div className="coffee-selection">
          <div className="coffee-scroll">
            {coffees.map((coffee) => (
              <button
                key={coffee.productID}
                className={`coffee-card ${selectedCoffee.productID === coffee.productID ? 'active' : ''}`}
                onClick={() => handleCoffeeClick(coffee.productID)}
              >
                <div className="coffee-card-icon" style={{ background: "from-amber-900 to-amber-700" }}>
                  <Coffee style={{ width: '24px', height: '24px' }} />
                </div>
                <div className="coffee-card-name">{coffee.name}</div>
                <div className="coffee-card-price">{coffee.price}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}