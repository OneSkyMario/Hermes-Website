// File: app/coffee/[id]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { Coffee, MapPin, Thermometer, Clock, Star, User, ArrowLeft } from 'lucide-react';
import { coffees } from '@/lib/coffees';
import { useState } from 'react';
import './page.css';

export default function CoffeeDetail() {
  const router = useRouter();
  const params = useParams();
  const coffeeId = Number(params.id);
  
  const selectedCoffee = coffees.find(c => c.productID === coffeeId);
  const [activeView, setActiveView] = useState('inside');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  
  const stores = [
    { id: 1, name: 'Lyros Coffee Central', address: 'ул. Абая, 150', distance: '2.3 км', rating: 4.8 },
    { id: 2, name: 'Lyros Coffee Park', address: 'пр. Сатпаева, 90', distance: '3.1 км', rating: 4.9 },
    { id: 3, name: 'Lyros Coffee Mall', address: 'ТРЦ Dostyk Plaza', distance: '4.5 км', rating: 4.7 },
    { id: 4, name: 'Lyros Coffee Station', address: 'ул. Желтоксан, 55', distance: '1.8 км', rating: 4.6 }
  ];

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

  const handleCoffeeClick = (productID: number) => {
    router.push(`/coffee/${productID}`);
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

          <nav className="nav">
            <button className="nav-btn active">Models</button>
            <button className="nav-btn">Services</button>
            <button className="nav-btn">Shop</button>
            <button className="nav-btn">Purchase</button>
            <button className="nav-btn">Contact</button>
          </nav>

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

            <div className="price">{selectedCoffee.price}</div>

            <div className="info-card">
              <div className="info-card-header">
                <MapPin className="icon" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Происхождение</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#555' }}>{selectedCoffee.origin}</div>
            </div>

            <div className="specs-grid">
              <div className="info-card">
                <div className="info-card-header">
                  <Thermometer className="icon" />
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>Температура</span>
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{selectedCoffee.temperature}</div>
              </div>

              <div className="info-card">
                <div className="info-card-header">
                  <Clock className="icon" />
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>Время</span>
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{selectedCoffee.brewTime}</div>
              </div>

              <div className="info-card">
                <div className="info-card-header">
                  <Coffee className="icon" />
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>Цвет</span>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{selectedCoffee.color}</div>
              </div>

              <div className="info-card">
                <div className="info-card-header">
                  <Star className="icon" />
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>Крепость</span>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{selectedCoffee.intensity}</div>
              </div>
            </div>

            {/* Store Selection */}
            <div className="store-section">
              <h3 className="store-section-title">Выберите магазин</h3>
              <div className="store-list">
                {stores.map((store) => (
                  <button
                    key={store.id}
                    className={`store-card ${selectedStore?.id === store.id ? 'selected' : ''}`}
                    onClick={() => setSelectedStore(store)}
                  >
                    <div className="store-card-header">
                      <div className="store-name">{store.name}</div>
                      <div className="store-rating">
                        <Star className="star-icon" fill="#fbbf24" stroke="#fbbf24" />
                        <span>{store.rating}</span>
                      </div>
                    </div>
                    <div className="store-address">{store.address}</div>
                    <div className="store-distance">{store.distance}</div>
                  </button>
                ))}
              </div>
              {selectedStore && (
                <div className="selected-store-info">
                  <div className="selected-store-label">Выбранный магазин:</div>
                  <div className="selected-store-name">{selectedStore.name}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="view-section">
            <div className="view-toggles">
              <button
                className={`view-btn ${activeView === 'inside' ? 'active' : ''}`}
                onClick={() => setActiveView('inside')}
              >
                <Coffee className="icon" />
                <span>Inside</span>
              </button>
              <button
                className={`view-btn ${activeView === 'topped' ? 'active' : ''}`}
                onClick={() => setActiveView('topped')}
              >
                <Coffee className="icon" />
                <span>Topped</span>
              </button>
            </div>

            <div className="coffee-display" style={{ background: selectedCoffee.bgGradient }}>
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

            <div className="order-card">
              <h3 className="order-title">Забронировать место</h3>
              <p className="order-description">
                Закажите ваш любимый кофе заранее и избегайте очередей
              </p>
              <button className="order-btn">Заказать сейчас</button>
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
                <div className="coffee-card-icon" style={{ background: coffee.bgGradient }}>
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