import React, { useState, useRef } from 'react';
import { X, Navigation, MapPin, Activity, Target, Send } from 'lucide-react';

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

export default function MapComponent({ initialOpen = true, onClose }: { initialOpen?: boolean; onClose?: () => void }) {
  const [isMapOpen, setIsMapOpen] = useState(initialOpen);
  const [currentFloor, setCurrentFloor] = useState(1);
  const mapRef = useRef<HTMLDivElement>(null);

  const [deliveryInfo, setDeliveryInfo] = useState({
    block: 'Sector-Alpha',
    x: 0,
    y: 0,
    commentary: ''
  });

  const floors: Floors = {
    1: { name: "Ground Floor", points: [
      { id: 1, x: 20, y: 30, type: "bot", label: "Bot #9220", status: "active", image: "https://via.placeholder.com/100/4ade80/ffffff?text=9220" },
      { id: 2, x: 60, y: 50, type: "pickup", label: "Zone A", status: "idle", image: "https://via.placeholder.com/100/9ca3af/ffffff?text=PICKUP" },
    ]},
    2: { name: "First Floor", points: [
      { id: 4, x: 40, y: 40, type: "bot", label: "Bot #9221", status: "warning", image: "https://via.placeholder.com/100/eab308/ffffff?text=9221" },
    ]},
    3: { name: "Second Floor", points: [
      { id: 7, x: 50, y: 50, type: "bot", label: "Bot #9222", status: "idle", image: "https://via.placeholder.com/100/9ca3af/ffffff?text=9222" },
    ]}
  };

  // Capture coordinates from map click
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setDeliveryInfo(prev => ({
      ...prev,
      x: Math.round(x),
      y: Math.round(y)
    }));
  };

  if (!isMapOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-0 md:p-4">
      <div className="bg-[#f5f5f5] border-[3px] border-[#6b6b6b] w-full max-w-[1400px] h-full md:h-[95vh] flex flex-col shadow-none md:shadow-[8px_8px_0_rgba(107,107,107,0.5)] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-[3px] border-[#6b6b6b] bg-[#f5f5f5]">
          <div>
            <h2 className="text-xl font-black text-[#4a4a4a] uppercase tracking-tighter italic leading-none">
              Command Center
            </h2>
            <p className="text-[#7a7a7a] text-[10px] font-bold uppercase mt-1">
              Floor {currentFloor} — {floors[currentFloor].name}
            </p>
          </div>
          <button
            onClick={() => onClose ? onClose() : setIsMapOpen(false)}
            className="w-10 h-10 border-2 border-[#6b6b6b] flex items-center justify-center bg-white hover:bg-red-500 hover:text-white transition-colors shadow-[3px_3px_0_rgba(0,0,0,1)]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden relative">
          
          {/* Floor Selector (Sidebar) */}
          <div className="w-full lg:w-16 bg-[#e5e5e5] border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-[#6b6b6b] flex lg:flex-col items-center justify-center py-2 lg:py-4 gap-2">
            {[3, 2, 1].map((f) => (
              <button
                key={f}
                onClick={() => setCurrentFloor(f)}
                className={`w-10 h-10 border-2 border-[#6b6b6b] font-black transition-all ${
                  currentFloor === f ? 'bg-black text-white' : 'bg-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Map Area */}
          <div 
            ref={mapRef}
            onClick={handleMapClick}
            className="flex-1 relative bg-[#e5e5e5] cursor-crosshair overflow-hidden group"
          >
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'linear-gradient(#6b6b6b 1px, transparent 1px), linear-gradient(90deg, #6b6b6b 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            />

            {/* Instruction Overlay */}
            <div className="absolute top-4 left-4 z-10 bg-black/10 px-2 py-1 text-[9px] font-black uppercase pointer-events-none">
              Click map to set target coordinates
            </div>

            {/* Robot Markers (Read Only) */}
            {floors[currentFloor].points.map((point) => (
              <div
                key={point.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-[#6b6b6b] bg-white relative shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
                   <div className="absolute -top-5 left-0 bg-[#6b6b6b] text-white text-[8px] px-1 font-bold whitespace-nowrap">
                    {point.label}
                  </div>
                  <img src={point.image} alt="" className="w-full h-full object-cover grayscale opacity-50" />
                </div>
              </div>
            ))}

            {/* Target Reticle (Shows where user clicked) */}
            {deliveryInfo.x !== 0 && (
              <div 
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                style={{ left: `${deliveryInfo.x}%`, top: `${deliveryInfo.y}%` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 border-2 border-red-500 rounded-full" />
                  <MapPin className="text-red-500 w-6 h-6 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM INPUT DOCK (Always Visible) */}
        <div className="bg-white border-t-[3px] border-[#6b6b6b] p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              
              {/* Coordinates & Block */}
              <div className="w-full lg:w-auto grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-500">Block ID</label>
                  <input 
                    type="text"
                    className="w-full bg-[#f5f5f5] border-2 border-[#6b6b6b] p-2 text-xs font-black outline-none focus:bg-yellow-50"
                    value={deliveryInfo.block}
                    onChange={(e) => setDeliveryInfo({...deliveryInfo, block: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-500">Coord X</label>
                  <input 
                    type="number" readOnly
                    className="w-full bg-[#e5e5e5] border-2 border-[#6b6b6b] p-2 text-xs font-black outline-none"
                    value={deliveryInfo.x}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-500">Coord Y</label>
                  <input 
                    type="number" readOnly
                    className="w-full bg-[#e5e5e5] border-2 border-[#6b6b6b] p-2 text-xs font-black outline-none"
                    value={deliveryInfo.y}
                  />
                </div>
              </div>

              {/* Commentary */}
              <div className="flex-1 w-full space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-500">Mission Notes</label>
                <input 
                  type="text"
                  placeholder="Enter specific instructions..."
                  className="w-full bg-[#f5f5f5] border-2 border-[#6b6b6b] p-2 text-xs font-black outline-none focus:bg-yellow-50"
                  value={deliveryInfo.commentary}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, commentary: e.target.value})}
                />
              </div>

              {/* Submit Button */}
              <button 
                className="w-full lg:w-48 bg-black text-white p-3 font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-[4px_4px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none"
                onClick={() => alert(`DISPATCH: Block ${deliveryInfo.block} at [${deliveryInfo.x}, ${deliveryInfo.y}]`)}
              >
                <Send size={14} /> Dispatch
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}