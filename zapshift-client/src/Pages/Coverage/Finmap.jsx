import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap  } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import finlandWarehouses from "../../data/FinWarehouses.json";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* Fix marker icon issue */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const FlyToLocation = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, {
        duration: 1.5,
      });
    }
  }, [position, map]);

  return null;
};


const Finmap = ({ finlandWarehouses= [],
 center = [61.9241, 25.7482], // Finland (center)
  zoom = 7,
  height = "320px",
  flyToPosition
}) => {
    return (
        <div
      className="w-full rounded-xl overflow-hidden border"
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToLocation position={flyToPosition} />

        {/* Multiple markers */}
        {finlandWarehouses.map((warehouse, index) => (
          <Marker
            key={index}
            position={[warehouse.latitude, warehouse.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{warehouse.city}</p>
                <p className="text-gray-600">
                  Region: {warehouse.region}
                </p>
                <p className="text-gray-600">
                  Covered: {warehouse.covered_area.join(", ")}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
    );
};

export default Finmap;