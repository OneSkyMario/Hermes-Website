import '@/app/coffee/[id]/page.css';

import { useState } from 'react';
import { X, Navigation, MapPin, Package, User, ChevronUp, ChevronDown, Maximize2, Clock } from 'lucide-react';

interface Point {
  id: number;
  x: number;
  y: number;
  type: 'bot' | 'pickup' | 'delivery' | 'user';
  label: string;
  status: 'active' | 'warning' | 'idle' | 'complete';
  image?: string;
}

interface Floor {
  name: string;
  points: Point[];
}

interface Floors {
  [key: number]: Floor;
}

export default function MapComponent() {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);

  const floors: Floors = {
    1: {
      name: "Ground Floor",
      points: [
        { id: 1, x: 20, y: 30, type: "bot", label: "Bot #9220", status: "active", image: "https://via.placeholder.com/100x100/4ade80/ffffff?text=BOT" },
        { id: 2, x: 60, y: 50, type: "pickup", label: "Pickup Zone A", status: "idle", image: "https://via.placeholder.com/100x100/9ca3af/ffffff?text=PICKUP" },
        { id: 3, x: 80, y: 70, type: "delivery", label: "Delivery Point", status: "complete", image: "https://via.placeholder.com/100x100/3b82f6/ffffff?text=DELIVERY" },
      ]
    },
    2: {
      name: "First Floor",
      points: [
        { id: 4, x: 40, y: 40, type: "bot", label: "Bot #9221", status: "warning", image: "https://via.placeholder.com/100x100/eab308/ffffff?text=BOT" },
        { id: 5, x: 70, y: 60, type: "user", label: "Customer Location", status: "active", image: "https://via.placeholder.com/100x100/4ade80/ffffff?text=USER" },
        { id: 6, x: 30, y: 70, type: "pickup", label: "Pickup Zone B", status: "idle", image: "https://via.placeholder.com/100x100/9ca3af/ffffff?text=PICKUP" },
      ]
    },
    3: {
      name: "Second Floor",
      points: [
        { id: 7, x: 50, y: 50, type: "bot", label: "Bot #9222", status: "idle", image: "https://via.placeholder.com/100x100/9ca3af/ffffff?text=BOT" },
        { id: 8, x: 65, y: 35, type: "delivery", label: "Office 301", status: "active", image: "https://via.placeholder.com/100x100/4ade80/ffffff?text=OFFICE" },
      ]
    }
  };

  const getPointColor = (status: string): string => {
    switch(status) {
      case "active": return "#4ade80";
      case "warning": return "#eab308";
      case "idle": return "#9ca3af";
      case "complete": return "#3b82f6";
      default: return "#6b7280";
    }
  };

  const getPointIcon = (type: string) => {
    switch(type) {
      case "bot": return <Navigation size={16} />;
      case "pickup": return <Package size={16} />;
      case "delivery": return <MapPin size={16} />;
      case "user": return <User size={16} />;
      default: return null;
    }
  };

  return (
    <div style={{background: '#f5f5f5', padding: '1rem' }}>
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
                  fontSize: '0.75rem'
                }}>
                  <Maximize2 size={16} />
                  <span>Click to expand</span>
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

      {/* Full Screen Map Popup */}
      {isMapOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: '#f5f5f5',
            border: '3px solid #6b6b6b',
            width: '100%',
            maxWidth: '1400px',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '8px 8px 0 rgba(107, 107, 107, 0.5)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem',
              borderBottom: '3px solid #6b6b6b',
              background: '#f5f5f5'
            }}>
              <div>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  color: '#4a4a4a',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  marginBottom: '0.25rem'
                }}>
                  Multi-Floor Navigation
                </h2>
                <p style={{ color: '#7a7a7a', fontSize: '0.875rem' }}>
                  Floor {currentFloor} - {floors[currentFloor].name}
                </p>
              </div>
              <button
                onClick={() => setIsMapOpen(false)}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '2px solid #6b6b6b',
                  background: '#f5f5f5',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4a4a4a'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#6b6b6b';
                  e.currentTarget.style.color = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                  e.currentTarget.style.color = '#4a4a4a';
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Floor Selector */}
              <div style={{
                width: '80px',
                background: '#e5e5e5',
                borderRight: '3px solid #6b6b6b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1.5rem 0',
                gap: '1rem'
              }}>
                <button
                  onClick={() => setCurrentFloor(Math.min(3, currentFloor + 1))}
                  disabled={currentFloor === 3}
                  style={{
                    padding: '0.75rem',
                    border: '2px solid #6b6b6b',
                    background: currentFloor === 3 ? '#e5e5e5' : '#f5f5f5',
                    cursor: currentFloor === 3 ? 'not-allowed' : 'pointer',
                    opacity: currentFloor === 3 ? 0.3 : 1,
                    color: '#4a4a4a'
                  }}
                >
                  <ChevronUp size={24} />
                </button>

                {[3, 2, 1].map((floor) => (
                  <button
                    key={floor}
                    onClick={() => setCurrentFloor(floor)}
                    style={{
                      width: '56px',
                      height: '56px',
                      border: '2px solid #6b6b6b',
                      background: currentFloor === floor ? '#6b6b6b' : '#f5f5f5',
                      color: currentFloor === floor ? '#f5f5f5' : '#4a4a4a',
                      fontWeight: 'bold',
                      fontSize: '1.25rem',
                      cursor: 'pointer',
                      boxShadow: currentFloor === floor ? '3px 3px 0 rgba(74, 74, 74, 0.5)' : 'none',
                      transform: currentFloor === floor ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    {floor}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentFloor(Math.max(1, currentFloor - 1))}
                  disabled={currentFloor === 1}
                  style={{
                    padding: '0.75rem',
                    border: '2px solid #6b6b6b',
                    background: currentFloor === 1 ? '#e5e5e5' : '#f5f5f5',
                    cursor: currentFloor === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentFloor === 1 ? 0.3 : 1,
                    color: '#4a4a4a'
                  }}
                >
                  <ChevronDown size={24} />
                </button>
              </div>

              {/* Map Area */}
              <div style={{ flex: 1, position: 'relative', background: 'linear-gradient(135deg, #e5e5e5, #f5f5f5)' }}>
                {/* Grid Pattern */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.15,
                  backgroundImage: 'linear-gradient(#6b6b6b 1px, transparent 1px), linear-gradient(90deg, #6b6b6b 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }} />

                {/* Halftone Effect */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.08,
                  background: 'radial-gradient(circle, #4a4a4a 0%, transparent 70%)',
                  pointerEvents: 'none'
                }} />

                {/* Points with Images */}
                {floors[currentFloor].points.map((point) => (
                  <div
                    key={point.id}
                    style={{ 
                      position: 'absolute',
                      left: `${point.x}%`, 
                      top: `${point.y}%`,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedPoint(point)}
                  >
                    {/* Image Container */}
                    <div style={{
                      width: '80px',
                      height: '80px',
                      border: '3px solid ' + getPointColor(point.status),
                      boxShadow: `0 0 0 6px rgba(107, 107, 107, 0.3), 4px 4px 0 ${getPointColor(point.status)}`,
                      background: '#f5f5f5',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Placeholder Image */}
                      <img 
                        src={point.image} 
                        alt={point.label}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      
                      {/* Status Indicator */}
                      <div style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '12px',
                        height: '12px',
                        background: getPointColor(point.status),
                        border: '2px solid #f5f5f5',
                        animation: point.status === 'active' ? 'pulse 2s infinite' : 'none'
                      }} />
                    </div>

                    {/* Label on Hover */}
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#6b6b6b',
                      color: '#f5f5f5',
                      padding: '0.5rem 0.75rem',
                      border: '2px solid #4a4a4a',
                      whiteSpace: 'nowrap',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      boxShadow: '3px 3px 0 rgba(74, 74, 74, 0.5)',
                      opacity: 0,
                      pointerEvents: 'none',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      {point.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Info Panel */}
              <div style={{
                width: '320px',
                background: '#e5e5e5',
                borderLeft: '3px solid #6b6b6b',
                padding: '1.5rem',
                overflowY: 'auto'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#4a4a4a',
                  marginBottom: '1rem'
                }}>
                  Active Points
                </h3>
                
                {selectedPoint ? (
                  <div style={{
                    background: '#f5f5f5',
                    border: '2px solid #6b6b6b',
                    padding: '1rem',
                    marginBottom: '1rem',
                    boxShadow: '3px 3px 0 rgba(107, 107, 107, 0.3)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                      <img 
                        src={selectedPoint.image} 
                        alt={selectedPoint.label}
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          objectFit: 'cover',
                          border: '2px solid #6b6b6b'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ 
                          color: '#4a4a4a', 
                          fontWeight: 'bold', 
                          fontSize: '0.875rem',
                          marginBottom: '0.25rem',
                          textTransform: 'uppercase'
                        }}>
                          {selectedPoint.label}
                        </h4>
                        <p style={{ 
                          color: '#7a7a7a', 
                          fontSize: '0.75rem',
                          textTransform: 'uppercase'
                        }}>
                          {selectedPoint.status}
                        </p>
                      </div>
                    </div>
                    <div style={{ 
                      display: 'grid',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                      borderTop: '2px solid #e5e5e5',
                      paddingTop: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#7a7a7a' }}>Floor:</span>
                        <span style={{ color: '#4a4a4a', fontWeight: 'bold' }}>{currentFloor}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#7a7a7a' }}>Type:</span>
                        <span style={{ color: '#4a4a4a', fontWeight: 'bold', textTransform: 'uppercase' }}>{selectedPoint.type}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: '#f5f5f5',
                    border: '2px solid #6b6b6b',
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    color: '#7a7a7a',
                    marginBottom: '1rem'
                  }}>
                    <MapPin size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '0.75rem' }}>Click on a point to view details</p>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {floors[currentFloor].points.map((point) => (
                    <button
                      key={point.id}
                      onClick={() => setSelectedPoint(point)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: selectedPoint?.id === point.id ? '3px solid #4a4a4a' : '2px solid #6b6b6b',
                        background: selectedPoint?.id === point.id ? '#6b6b6b' : '#f5f5f5',
                        color: selectedPoint?.id === point.id ? '#f5f5f5' : '#4a4a4a',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: selectedPoint?.id === point.id ? '3px 3px 0 rgba(74, 74, 74, 0.5)' : 'none'
                      }}
                    >
                      <div style={{
                        width: '8px',
                        height: '8px',
                        background: getPointColor(point.status),
                        border: '2px solid ' + (selectedPoint?.id === point.id ? '#f5f5f5' : '#6b6b6b'),
                        flexShrink: 0
                      }} />
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {point.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}