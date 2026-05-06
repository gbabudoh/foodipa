"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Star, Clock, ChevronRight, Navigation, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Geolocation } from "@capacitor/geolocation";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("./_components/LiveMap"), { 
  ssr: false,
  loading: () => <div style={{ height: "100%", width: "100%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 className="animate-spin" color="white" /></div>
});

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

const categories = [
  { label: "All", emoji: "🍽️" },
  { label: "Restaurants", emoji: "🏪" },
  { label: "Markets", emoji: "🛒" },
  { label: "Street Food", emoji: "🥘" },
  { label: "Cafés", emoji: "☕" },
  { label: "Bakeries", emoji: "🥖" },
];

const LONDON_CENTER = { lat: 51.5074, lng: -0.1278 };

// Haversine formula to calculate distance between two points in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface Place {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  distance: string;
  time: string;
  emoji: string;
  tag: string | null;
  tagColor: string | null;
  category: string;
  isSponsored: boolean;
  lat: number;
  lng: number;
  x: string;
  y: string;
  calculatedDistance?: number;
}

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number} | null>(null);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);

  const handleGetDirections = (name: string, lat: number, lng: number) => {
    const query = encodeURIComponent(`${name} ${lat},${lng}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  };

  const fetchPlaces = useCallback(async (lat: number, lng: number, category: string = "All") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/places?lat=${lat}&lng=${lng}&category=${category}&radius=10`);
      const data = await res.json();
      setPlaces(data);
    } catch (err) {
      console.error("Discovery Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const pos = await Geolocation.getCurrentPosition().catch(() => ({
          coords: { latitude: LONDON_CENTER.lat, longitude: LONDON_CENTER.lng }
        }));
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setMapCenter(loc);
        fetchPlaces(loc.lat, loc.lng, activeCategory);
      } catch (err) {
        console.error("Init Error:", err);
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchPlaces(userLocation.lat, userLocation.lng, activeCategory);
    }
  }, [activeCategory, userLocation, fetchPlaces]);

  const processedPlaces = useMemo(() => {
    return places.map(p => {
      // Use server-calculated distance if available (it's a number from $queryRaw)
      const serverDist = p.calculatedDistance;
      let distStr = p.distance;
      let numericDist = parseFloat(p.distance);

      if (serverDist !== undefined) {
        numericDist = serverDist;
        distStr = serverDist < 1 ? `${(serverDist * 1000).toFixed(0)} m` : `${serverDist.toFixed(1)} km`;
      } else if (userLocation) {
        const d = calculateDistance(userLocation.lat, userLocation.lng, p.lat, p.lng);
        distStr = d < 1 ? `${(d * 1000).toFixed(0)} m` : `${d.toFixed(1)} km`;
        numericDist = d;
      }

      return { ...p, calculatedDistance: distStr, numericDist };
    }).sort((a, b) => {
      if (a.isSponsored && !b.isSponsored) return -1;
      if (!a.isSponsored && b.isSponsored) return 1;
      return a.numericDist - b.numericDist;
    });
  }, [places, userLocation]);

  const filtered = processedPlaces.filter((place) => {
    const matchesCategory = activeCategory === "All" || place.category === activeCategory;
    const q = query.toLowerCase();
    const matchesQuery = !q || place.name.toLowerCase().includes(q) || place.cuisine.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
        <Loader2 className="animate-spin" style={{ color: "var(--accent)" }} size={32} />
      </div>
    );
  }

  return (
    <div className="desktop-page-inner" style={{ minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{ padding: "32px 20px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.4px" }}>
            Global Food Finder 🗺️
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "5px" }}>
            Exploring {userLocation?.lat.toFixed(4)}, {userLocation?.lng.toFixed(4)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{ ...G, borderRadius: "16px", height: "52px", display: "flex", alignItems: "center", gap: "12px", padding: "0 18px", marginTop: "20px" }}
        >
          <Search size={17} style={{ color: "var(--muted)", flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants, cuisines…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--foreground)" }}
          />
        </motion.div>
      </div>

      {/* ── Map ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          margin: "0 20px",
          borderRadius: "24px",
          overflow: "hidden",
          height: "280px",
          position: "relative",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
      >
        <LiveMap 
          center={mapCenter ? [mapCenter.lat, mapCenter.lng] : [LONDON_CENTER.lat, LONDON_CENTER.lng]} 
          highlightedId={hoveredPlaceId}
          onRegionChange={(center: [number, number]) => {
            setMapCenter({ lat: center[0], lng: center[1] });
            setShowSearchArea(true);
          }}
          places={filtered.map(p => ({
            id: p.id,
            name: p.name,
            cuisine: p.cuisine,
            emoji: p.emoji,
            isSponsored: p.isSponsored,
            lat: p.lat,
            lng: p.lng,
            rating: p.rating
          }))}
        />

        {/* Search this area overlay */}
        {showSearchArea && (
          <div style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}>
            <motion.button
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={() => {
                if (mapCenter) fetchPlaces(mapCenter.lat, mapCenter.lng, activeCategory);
                setShowSearchArea(false);
              }}
              style={{
                ...G, borderRadius: "50px", padding: "8px 20px",
                fontSize: "12px", fontWeight: 700, color: "var(--foreground)",
                display: "flex", alignItems: "center", gap: "8px",
                cursor: "pointer", border: "1px solid var(--accent)",
                boxShadow: "0 4px 15px rgba(255,107,43,0.2)"
              }}
            >
              <Search size={14} style={{ color: "var(--accent)" }} />
              Search this area
            </motion.button>
          </div>
        )}

        {/* Sync btn overlay */}
        <button 
          onClick={() => window.location.reload()}
          style={{
            position: "absolute", bottom: "14px", right: "14px",
            width: "40px", height: "40px", borderRadius: "12px",
            background: "white", display: "flex", alignItems: "center", justifyContent: "center",
            border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.2)", cursor: "pointer",
            zIndex: 1000
          }}
        >
          <Navigation size={16} style={{ color: "var(--accent)" }} />
        </button>
      </motion.div>

      {/* ── Category Filter ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{ padding: "20px 20px 0" }}
      >
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", borderRadius: "50px",
                fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap",
                cursor: "pointer", transition: "all 0.2s", border: "none",
                ...(activeCategory === cat.label
                  ? { background: "var(--accent)", color: "white", boxShadow: "0 4px 12px rgba(255,107,43,0.3)" }
                  : { ...G, color: "var(--foreground)" }
                ),
              }}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Nearby List ── */}
      <div style={{ padding: "24px 20px 36px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "14px" }}>
          Nearby Spots ({filtered.length})
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)", fontSize: "14px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🔍</div>
              No spots found. Try a different filter or search term.
            </div>
          )}
          {filtered.map((place, i) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: hoveredPlaceId === place.id ? 1.02 : 1,
              }}
              transition={{ delay: i < 10 ? 0.2 + i * 0.06 : 0, duration: 0.2 }}
              onMouseEnter={() => setHoveredPlaceId(place.id)}
              onMouseLeave={() => setHoveredPlaceId(null)}
              onClick={() => handleGetDirections(place.name, place.lat, place.lng)}
              style={{
                ...G, borderRadius: "20px",
                display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 16px", cursor: "pointer",
                border: place.id === hoveredPlaceId ? "1.5px solid var(--accent)" : place.isSponsored ? "1.5px solid rgba(255, 215, 0, 0.4)" : "1px solid var(--glass-border)",
                background: place.id === hoveredPlaceId ? "rgba(255,107,43,0.05)" : place.isSponsored ? "linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, var(--glass-bg) 100%)" : "var(--glass-bg)",
                boxShadow: place.id === hoveredPlaceId ? "0 8px 24px rgba(255,107,43,0.15)" : "var(--glass-shadow)",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{
                width: "54px", height: "54px", borderRadius: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px", flexShrink: 0,
                background: place.isSponsored ? "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)" : "rgba(255,255,255,0.5)",
                border: "1px solid var(--glass-border)",
                boxShadow: place.isSponsored ? "0 4px 12px rgba(184,134,11,0.2)" : "none",
                position: "relative"
              }}>
                {place.isSponsored ? "✨" : place.emoji}
                {place.isSponsored && <span style={{ position: "absolute", fontSize: "20px", bottom: -2, right: -2 }}>{place.emoji}</span>}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {place.name}
                  </p>
                  {place.isSponsored && (
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "50px", background: "#FFD70018", color: "#B8860B", flexShrink: 0 }}>
                      Featured
                    </span>
                  )}
                  {place.tag && !place.isSponsored && (
                    <span style={{ 
                      fontSize: "10px", 
                      fontWeight: 700, 
                      padding: "2px 8px", 
                      borderRadius: "50px", 
                      background: place.tagColor ? `${place.tagColor}18` : undefined, 
                      color: place.tagColor ?? undefined, 
                      flexShrink: 0 
                    }}>
                      {place.tag}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "7px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {place.cuisine}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "12px", fontWeight: 600, color: "var(--foreground)" }}>
                    <Star size={11} fill="#F59E0B" style={{ color: "#F59E0B" }} />{place.rating}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "12px", color: "var(--muted)" }}>
                    <MapPin size={11} />{place.calculatedDistance}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "12px", color: "var(--muted)" }}>
                    <Clock size={11} />{place.time}
                  </span>
                </div>
              </div>

              <ChevronRight size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
