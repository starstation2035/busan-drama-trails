"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in leaflet with webpack/nextjs
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

interface CourseMapProps {
  course: any[]; // EditableTimelineEntry[]
  lang: string;
}

// Helper component to auto-focus map bounds on course spots
function ChangeView({ positions, positionsKey }: { positions: [number, number][]; positionsKey: string }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, { padding: [50, 50], maxZoom: 15 });
    }
  }, [positionsKey, map]); // Only trigger fitBounds when coordinates list actually changes
  return null;
}

export default function CourseMap({ course, lang }: CourseMapProps) {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  const validEntries = course.filter(
    (e) => e.item?.coords?.lat && e.item?.coords?.lng
  );

  const positions = useMemo(() => {
    return validEntries.map(
      (e) => [e.item.coords.lat, e.item.coords.lng] as [number, number]
    );
  }, [validEntries.map(e => `${e.item.coords.lat},${e.item.coords.lng}`).join(";")]);

  const positionsKey = useMemo(() => {
    return JSON.stringify(positions);
  }, [positions]);

  useEffect(() => {
    if (positions.length < 2) {
      setRouteCoordinates([]);
      return;
    }

    const coordsString = validEntries
      .map((e) => `${e.item.coords.lng},${e.item.coords.lat}`)
      .join(";");

    const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

    let isMounted = true;

    async function fetchRoute() {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("OSRM routing request failed");
        const data = await res.json();
        if (data.code === "Ok" && data.routes?.[0]?.geometry?.coordinates) {
          const routeCoords = data.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
          );
          if (isMounted) {
            setRouteCoordinates(routeCoords);
          }
        } else {
          throw new Error("Invalid OSRM response structure");
        }
      } catch (err) {
        console.error("Routing error, falling back to straight lines:", err);
        if (isMounted) {
          // Fallback to straight lines
          setRouteCoordinates(positions);
        }
      }
    }

    fetchRoute();

    return () => {
      isMounted = false;
    };
  }, [positionsKey]);

  const getMarkerIcon = (kind: string, index: number) => {
    const colors: Record<string, string> = {
      spot: "bg-[#FF385C]",
      restaurant: "bg-amber-500",
      cafe: "bg-emerald-500",
    };
    const colorClass = colors[kind] || "bg-[#FF385C]";
    
    return L.divIcon({
      className: "custom-course-marker",
      html: `<div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg text-white font-extrabold text-xs ${colorClass}">
              ${index}
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const getLabel = (kind: string) => {
    const labels: Record<string, string> = {
      spot: lang === "ko" ? "스팟" : "Spot",
      restaurant: lang === "ko" ? "식사" : "Meal",
      cafe: lang === "ko" ? "카페" : "Cafe",
    };
    return labels[kind] || kind;
  };

  const getKakaoMapRouteUrl = () => {
    if (validEntries.length === 0) return "https://map.kakao.com";
    if (validEntries.length === 1) {
      const spot = validEntries[0].item;
      const name = spot.name[lang] || spot.name["en"] || "";
      return `https://map.kakao.com/link/to/${encodeURIComponent(name)},${spot.coords.lat},${spot.coords.lng}`;
    }
    const start = validEntries[0].item;
    const end = validEntries[validEntries.length - 1].item;
    const startName = start.name[lang] || start.name["en"] || "";
    const endName = end.name[lang] || end.name["en"] || "";
    return `https://map.kakao.com/?sName=${encodeURIComponent(startName)}&eName=${encodeURIComponent(endName)}`;
  };

  const getNaverMapRouteUrl = () => {
    if (validEntries.length < 2) return "https://map.naver.com";
    const start = validEntries[0].item;
    const end = validEntries[validEntries.length - 1].item;
    const startName = start.name[lang] || start.name["en"] || "";
    const endName = end.name[lang] || end.name["en"] || "";
    return `https://map.naver.com/v5/directions/${start.coords.lng},${start.coords.lat},${encodeURIComponent(startName)}///${end.coords.lng},${end.coords.lat},${encodeURIComponent(endName)}/-/car`;
  };

  if (validEntries.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30 text-muted-foreground text-xs font-semibold gap-2 p-4">
        <span>표시할 코스 정보가 없습니다.</span>
      </div>
    );
  }

  // Calculate default center if map container needs it on first load
  const center = positions[0] || [35.1795, 129.0756];

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Dynamic bounds fitting */}
        <ChangeView positions={positions} positionsKey={positionsKey} />

        {/* Route Line (Polyline) following roads */}
        {routeCoordinates.length > 0 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: "#3B82F6", // Blue-500
              weight: 5,
              opacity: 0.85,
              lineJoin: "round",
            }}
          />
        )}

        {/* Fallback dotted line if OSRM failed/loading but positions are ready */}
        {routeCoordinates.length === 0 && positions.length > 1 && (
          <Polyline
            positions={positions}
            pathOptions={{
              color: "#3B82F6",
              weight: 4,
              opacity: 0.5,
              lineJoin: "round",
              dashArray: "8, 6"
            }}
          />
        )}

        {/* Spot Markers */}
        {validEntries.map((entry, index) => {
          const item = entry.item;
          const pos: [number, number] = [item.coords.lat, item.coords.lng];
          const name = item.name[lang] || item.name["en"] || "";

          return (
            <Marker
              key={`${item.id}-${index}`}
              position={pos}
              icon={getMarkerIcon(item.kind, index + 1)}
            >
              <Popup className="custom-popup rounded-2xl overflow-hidden">
                <div className="w-[180px] font-sans">
                  {item.thumbnail && (
                    <div className="h-[90px] w-full overflow-hidden rounded-t-lg">
                      <img
                        src={item.thumbnail}
                        alt={name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-2.5 bg-white">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60">
                        {getLabel(item.kind)}
                      </span>
                      <span className="text-[10px] font-bold text-primary">
                        {entry.time}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-[13px] text-zinc-900 leading-snug line-clamp-2">
                      {name}
                    </h4>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
