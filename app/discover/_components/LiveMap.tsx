"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix for default Leaflet icon missing in build
const iconDefaultProto = L.Icon.Default.prototype as { _getIconUrl?: string };
if (iconDefaultProto._getIconUrl) {
  delete iconDefaultProto._getIconUrl;
}
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Premium Gradients from Food Pulse design system
const PREMIUM_GOLD = "linear-gradient(140deg, #FF6B2B 0%, #C94A10 100%)";

interface Place {
  id: string;
  name: string;
  cuisine: string;
  emoji: string;
  isSponsored: boolean;
  lat: number;
  lng: number;
  rating: number;
}

interface LiveMapProps {
  center: [number, number];
  places: Place[];
  zoom?: number;
}

// Custom Marker Creators
const createStandardIcon = (emoji: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="background: white; width: 28px; height: 28px; border-radius: 50%; border: 2px solid #FF6B2B; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
        <span style="font-size: 14px;">${emoji}</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const createSponsoredIcon = (emoji: string) => {
  return L.divIcon({
    className: "custom-div-icon-sponsored",
    html: `
      <div style="position: relative; width: 34px; height: 34px;">
        <div class="pulse-ring" style="position: absolute; inset: -4px; border-radius: 50%; border: 2px solid #FFD700; animation: pulse 2s infinite;"></div>
        <div style="background: ${PREMIUM_GOLD}; width: 34px; height: 34px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(255,107,43,0.5);">
          <span style="font-size: 18px;">${emoji}</span>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
};

const UserIcon = L.divIcon({
  className: "user-location-icon",
  html: `
    <div style="width: 20px; height: 20px; background: #3B82F6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(59,130,246,0.8);">
      <div style="position: absolute; inset: -10px; background: rgba(59,130,246,0.2); border-radius: 50%; animation: ping 2s infinite;"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Component to handle map center changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function LiveMap({ center, places, zoom = 14 }: LiveMapProps) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#1a1a1a" }}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          70% { transform: scale(1.1); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .leaflet-container {
          background: #111 !important;
          border-radius: 24px;
        }
      `}</style>
      
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        {/* CartoDB Voyager: A premium, clean tile set */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <ChangeView center={center} zoom={zoom} />

        {/* User Location */}
        <Marker position={center} icon={UserIcon}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Place Markers */}
        {places.map((place) => (
          <Marker 
            key={place.id} 
            position={[place.lat, place.lng]}
            icon={place.isSponsored ? createSponsoredIcon(place.emoji) : createStandardIcon(place.emoji)}
          >
            <Popup>
              <div style={{ padding: "4px" }}>
                <p style={{ fontWeight: 800, margin: 0 }}>{place.name}</p>
                <p style={{ fontSize: "12px", margin: "2px 0 0", color: "#666" }}>{place.cuisine}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
