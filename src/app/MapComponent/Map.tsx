'use client';
import { useState, useRef } from 'react';
import { X, Bot, MapPin, Package, Send } from 'lucide-react';
import Dialog from '@/components/common/Dialog';
import './map.css';

const floors = [
  { name: 'Ground floor', points: [{ id: 1, x: 20, y: 30, type: 'bot', label: 'Bot #9220', status: 'active' }, { id: 2, x: 60, y: 50, type: 'pickup', label: 'Zone A', status: 'idle' }] },
  { name: 'First floor', points: [{ id: 4, x: 40, y: 40, type: 'bot', label: 'Bot #9221', status: 'warning' }] },
  { name: 'Second floor', points: [{ id: 7, x: 50, y: 50, type: 'bot', label: 'Bot #9222', status: 'idle' }] },
];

export default function MapComponent({ initialOpen = true, onClose }: { initialOpen?: boolean; onClose?: () => void }) {
  const [isMapOpen, setIsMapOpen] = useState(initialOpen);
  const [currentFloor, setCurrentFloor] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const [deliveryInfo, setDeliveryInfo] = useState({ block: 'Sector-Alpha', x: 0, y: 0, commentary: '' });
  const [hasTarget, setHasTarget] = useState(false);
  const [message, setMessage] = useState('');
  const close = () => onClose ? onClose() : setIsMapOpen(false);
  const setTarget = (x: number, y: number) => { setHasTarget(true); setDeliveryInfo(previous => ({ ...previous, x: Math.max(0, Math.min(100, Math.round(x))), y: Math.max(0, Math.min(100, Math.round(y))) })); setMessage(''); };
  if (!isMapOpen) return null;
  return <Dialog label="Delivery map demo" onClose={close} wide>
    <div className="map-panel">
      <header className="map-heading"><div><p className="eyebrow">Navigation / delivery environment</p><h2>Delivery map <span className="demo-badge">Demo</span></h2><p>Sample robot positions. Previewing a dispatch does not send an order.</p></div><button className="button button-secondary icon-button" onClick={close} aria-label="Close map"><X size={20}/></button></header>
      <div className="map-workspace">
        <nav className="floor-nav" aria-label="Map floors"><span className="eyebrow">Floor</span>{floors.map((floor, index) => <button key={floor.name} aria-label={floor.name} aria-pressed={currentFloor === index} onClick={() => { setCurrentFloor(index); setMessage(''); }}>{index + 1}</button>)}</nav>
        <div ref={mapRef} className="operations-map" role="application" aria-label="Delivery target map. Use arrow keys to position the target." tabIndex={0} onClick={event => { const rect = mapRef.current!.getBoundingClientRect(); setTarget((event.clientX - rect.left) / rect.width * 100, (event.clientY - rect.top) / rect.height * 100); }} onKeyDown={event => {
          const deltas: Record<string, [number, number]> = { ArrowUp: [0, -2], ArrowDown: [0, 2], ArrowLeft: [-2, 0], ArrowRight: [2, 0] };
          const delta = deltas[event.key]; if (delta) { event.preventDefault(); setTarget((hasTarget ? deliveryInfo.x : 50) + delta[0], (hasTarget ? deliveryInfo.y : 50) + delta[1]); }
        }}>
          <div className="map-building building-a"/><div className="map-building building-b"/><div className="map-building building-c"/>
          <span className="map-instruction">{floors[currentFloor].name} · Click or use arrow keys to set a destination</span>
          {floors[currentFloor].points.map(point => <div key={point.id} className="map-marker" style={{ left: `${point.x}%`, top: `${point.y}%` }}><span>{point.label}</span><div>{point.type === 'bot' ? <Bot size={22}/> : <Package size={22}/>}</div><small>{point.status} · sample</small></div>)}
          {hasTarget && <div className="map-target" style={{ left: `${deliveryInfo.x}%`, top: `${deliveryInfo.y}%` }}><MapPin size={28}/><span>Destination</span></div>}
          <span className="map-key"><Bot size={14}/> Robot <Package size={14}/> Pickup <MapPin size={14}/> Destination</span>
        </div>
      </div>
      <form className="map-dock" onSubmit={event => { event.preventDefault(); setMessage(`Demo dispatch: ${deliveryInfo.block} at [${deliveryInfo.x}, ${deliveryInfo.y}]. No robot has been dispatched.`); }}>
        <div className="map-coordinate-fields"><label>Block ID<input value={deliveryInfo.block} onChange={event => setDeliveryInfo({ ...deliveryInfo, block: event.target.value })}/></label><label>Coord X<input type="number" readOnly value={deliveryInfo.x}/></label><label>Coord Y<input type="number" readOnly value={deliveryInfo.y}/></label></div>
        <label className="map-notes">Delivery notes<input placeholder="Add delivery instructions…" value={deliveryInfo.commentary} onChange={event => setDeliveryInfo({ ...deliveryInfo, commentary: event.target.value })}/></label>
        <button type="submit" className="button button-primary"><Send size={16}/> Preview dispatch</button>
        {message && <p className="map-message" role="status">{message}</p>}
      </form>
    </div>
  </Dialog>;
}
