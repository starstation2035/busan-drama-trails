"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in leaflet with webpack/nextjs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface InteractiveMapProps {
  center: [number, number];
  radius: number;
  places: any[];
}

export default function InteractiveMap({ center, radius, places }: InteractiveMapProps) {
  // Use a custom icon for cafes/restaurants to make it prettier
  const createCustomIcon = (type: string) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="flex items-center justify-center w-8 h-8 bg-white rounded-full border-2 border-[#FF385C] shadow-md text-lg">
              ${type === 'cafe' ? '☕' : '🍽️'}
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const centerIcon = L.divIcon({
    className: 'custom-center-icon',
    html: `<div class="w-4 h-4 bg-[#FF385C] rounded-full border-2 border-white shadow-lg z-50"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <div className="w-full h-full rounded-[24px] overflow-hidden border border-[#F3F4F6] shadow-sm relative z-0">
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Search Radius Circle */}
        <Circle
          center={center}
          radius={radius}
          pathOptions={{
            color: "#FF385C",
            fillColor: "#FF385C",
            fillOpacity: 0.1,
            weight: 2,
            dashArray: "4 4"
          }}
        />

        {/* Center Spot */}
        <Marker position={center} icon={centerIcon} zIndexOffset={1000} />

        {/* Nearby Places */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={createCustomIcon(place.food ? 'restaurant' : 'cafe')}
          >
            <Popup className="custom-popup rounded-[16px] overflow-hidden">
              <div className="w-[200px]">
                <div className="h-[120px] bg-[#F8FAFC] w-full overflow-hidden">
                  <img 
                    src={place.thumbnail || place.images?.[0]?.url || ""} 
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 bg-white">
                  <h4 className="font-bold text-[15px] mb-1 leading-tight">{place.name}</h4>
                  <p className="text-[12px] text-[#717171] mb-2 line-clamp-1">{place.signatureMenu || place.food?.ko || place.food}</p>
                  <div className="flex items-center gap-1 text-[13px] font-bold text-[#222222]">
                    <span className="text-[#FF385C]">★</span>
                    {place.rating?.toFixed(1) || "0.0"}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
