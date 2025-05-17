import React from 'react';
import { Card, Typography, Button } from '@mui/material';

export default function MapSection({ mapRef, nuMapImage, location, handleMapClick, locationConfirmed, handleConfirmLocation }) {
  return (
    <div className="map-section-home">
      <div ref={mapRef} style={{ margin: '32px auto', maxWidth: 900 }}>
        <Card sx={{ p: 2, width: '100%', boxSizing: 'border-box', mx: 'auto', boxShadow: 3 }}>
          <Typography variant="h5" gutterBottom>Choose Your Delivery Location</Typography>
          <Typography variant="body2" gutterBottom>Click on the map to place your marker, then confirm.</Typography>
          <div style={{ position: 'relative', width: '100%', height: '60vh', margin: '0 auto' }}>
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
                <span style={{ fontSize: 32, color: '#e50000' }}>📍</span>
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
          {location && !locationConfirmed && (
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleConfirmLocation}>
              Confirm Location
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
