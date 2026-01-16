import React, { useState } from 'react';
import { X, Navigation, MapPin, Package, User, ChevronUp, ChevronDown, MessageSquare, Building2 } from 'lucide-react';

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

interface MapComponentProps {
  initialOpen?: boolean;
  onClose?: () => void;
}

export default function MapComponent({ initialOpen = false, onClose }: MapComponentProps) {
  const [isMapOpen, setIsMapOpen] = useState(initialOpen);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);

  // New state for delivery inputs
  const [deliveryInfo, setDeliveryInfo] = useState({
    block: '',
    floor: '',
    commentary: ''
  });

  const floors: Floors = {
    1: { name: "Ground Floor", points: [
      { id: 1, x: 20, y: 30, type: "bot", label: "Bot #9220", status: "active", image: "https://via.placeholder.com/100x100/4ade80/ffffff?text=BOT" },
      { id: 2, x: 60, y: 50, type: "pickup", label: "Pickup Zone A", status: "idle", image: "https://via.placeholder.com/100x100/9ca3af/ffffff?text=PICKUP" },
    ]},
    2: { name: "First Floor", points: [
      { id: 4, x: 40, y: 40, type: "bot", label: "Bot #9221", status: "warning", image: "https://via.placeholder.com/100x100/eab308/ffffff?text=BOT" },
    ]},
    3: { name: "Second Floor", points: [
      { id: 7, x: 50, y: 50, type: "bot", label: "Bot #9222", status: "idle", image: "https://via.placeholder.com/100x100/9ca3af/ffffff?text=BOT" },
    ]}
  };

  const getPointColor = (status: string) => {
    switch(status) {
      case "active": return "#4ade80";
      case "warning": return "#eab308";
      case "idle": return "#9ca3af";
      case "complete": return "#3b82f6";
      default: return "#6b7280";
    }
  };

  if (!isMapOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="bg-[#f5f5f5] border-[3px] border-[#6b6b6b] w-full max-w-[1400px] h-[90vh] flex flex-col shadow-[8px_8px_0_rgba(107,107,107,0.5)] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-[3px] border-[#6b6b6b] bg-[#f5f5f5]">
          <div>
            <h2 className="text-2xl font-black text-[#4a4a4a] uppercase tracking-tighter italic">
              Multi-Floor Navigation
            </h2>
            <p className="text-[#7a7a7a] text-xs font-bold uppercase">
              Floor {currentFloor} — {floors[currentFloor].name}
            </p>
          </div>
          <button
            onClick={() => onClose ? onClose() : setIsMapOpen(false)}
            className="w-10 h-10 border-2 border-[#6b6b6b] flex items-center justify-center hover:bg-[#6b6b6b] hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Floor Selector */}
          <div className="w-20 bg-[#e5e5e5] border-r-[3px] border-[#6b6b6b] flex flex-col items-center py-6 gap-4">
            <button 
              onClick={() => setCurrentFloor(Math.min(3, currentFloor + 1))}
              className="p-2 border-2 border-[#6b6b6b] disabled:opacity-30"
              disabled={currentFloor === 3}
            >
              <ChevronUp size={24} />
            </button>
            
            {[3, 2, 1].map((f) => (
              <button
                key={f}
                onClick={() => setCurrentFloor(f)}
                className={`w-12 h-12 border-2 border-[#6b6b6b] font-black transition-all ${
                  currentFloor === f ? 'bg-[#6b6b6b] text-white scale-110 shadow-[3px_3px_0_rgba(0,0,0,0.2)]' : 'bg-white'
                }`}
              >
                {f}
              </button>
            ))}

            <button 
              onClick={() => setCurrentFloor(Math.max(1, currentFloor - 1))}
              className="p-2 border-2 border-[#6b6b6b] disabled:opacity-30"
              disabled={currentFloor === 1}
            >
              <ChevronDown size={24} />
            </button>
          </div>

          {/* Center: Map Area */}
          <div className="flex-1 relative bg-[#e5e5e5] overflow-hidden">
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'linear-gradient(#6b6b6b 1px, transparent 1px), linear-gradient(90deg, #6b6b6b 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            />

            {floors[currentFloor].points.map((point) => (
              <div
                key={point.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                onClick={() => setSelectedPoint(point)}
              >
                <div 
                  className="w-16 h-16 border-[3px] bg-white relative shadow-[4px_4px_0_rgba(0,0,0,0.1)] transition-transform group-hover:scale-105"
                  style={{ borderColor: getPointColor(point.status) }}
                >
                  <img src={point.image} alt={point.label} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div 
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white animate-pulse"
                    style={{ background: getPointColor(point.status) }}
                  />
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#4a4a4a] text-white text-[10px] px-2 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold">
                  {point.label}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Info & Input Panel */}
          <div className="w-80 bg-[#e5e5e5] border-l-[3px] border-[#6b6b6b] flex flex-col">
            
            {/* Top: System Intel */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#4a4a4a] mb-4 flex items-center gap-2">
                <Navigation size={16} /> System Intel
              </h3>
              
              {selectedPoint ? (
                <div className="bg-white border-2 border-[#6b6b6b] p-4 shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
                  <h4 className="font-black uppercase text-sm mb-2">{selectedPoint.label}</h4>
                  <div className="space-y-2 text-xs font-bold uppercase text-gray-500">
                    <p>Status: <span style={{ color: getPointColor(selectedPoint.status)}}>{selectedPoint.status}</span></p>
                    <p>Type: {selectedPoint.type}</p>
                    <p>Coord: {selectedPoint.x}, {selectedPoint.y}</p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#6b6b6b] p-8 text-center text-gray-400">
                  <p className="text-[10px] font-black uppercase">Select Node for Uplink</p>
                </div>
              )}
            </div>

            {/* Bottom: Delivery Input Section */}
            <div className="p-6 border-t-[3px] border-[#6b6b6b] bg-[#f5f5f5]">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#4a4a4a] mb-4 flex items-center gap-2">
                <MapPin size={16} /> Delivery Address
              </h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-500">Block</label>
                    <input 
                      type="text"
                      className="w-full bg-white border-2 border-[#6b6b6b] p-2 text-xs font-bold focus:outline-none focus:bg-[#e5e5e5]"
                      placeholder="E.g. A"
                      value={deliveryInfo.block}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, block: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-500">Floor</label>
                    <input 
                      type="number"
                      className="w-full bg-white border-2 border-[#6b6b6b] p-2 text-xs font-bold focus:outline-none focus:bg-[#e5e5e5]"
                      placeholder="1-3"
                      value={deliveryInfo.floor}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, floor: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500">Commentary</label>
                  <textarea 
                    className="w-full bg-white border-2 border-[#6b6b6b] p-2 text-xs font-bold focus:outline-none focus:bg-[#e5e5e5] h-20 resize-none"
                    placeholder="Enter delivery notes..."
                    value={deliveryInfo.commentary}
                    onChange={(e) => setDeliveryInfo({...deliveryInfo, commentary: e.target.value})}
                  />
                </div>

                <button className="w-full bg-[#6b6b6b] text-white py-3 font-black uppercase text-xs tracking-widest hover:bg-black transition-colors shadow-[4px_4px_0_rgba(107,107,107,0.3)]">
                  Set Destination
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}