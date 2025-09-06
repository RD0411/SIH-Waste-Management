import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapComponent = ({ locations, drivers }) => {
  const center = [12.9716, 77.5946]; // Bangalore coordinates

  const driverMap = {};
  drivers.forEach(driver => {
    driverMap[driver.id] = driver;
  });

  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => {
        const driver = driverMap[loc.driver_id];
        if (!driver) return null;
        return (
          <Marker key={loc.driver_id} position={[loc.lat, loc.lng]}>
            <Popup>
              <div>
                <strong>{driver.name}</strong><br />
                Vehicle: {driver.vehicle_number}<br />
                Last update: {new Date(loc.timestamp).toLocaleTimeString()}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;