import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, Loader2, AlertCircle } from 'lucide-react';
import { weatherService, type LocationInfo } from '../../services/weatherService';

interface LocationSelectorProps {
  currentLocation: LocationInfo;
  onLocationChange: (location: LocationInfo) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentLocation,
  onLocationChange,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const searchRes = await weatherService.searchLocations(query);
      setResults(searchRes);
      setIsSearching(false);
      setIsOpen(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: LocationInfo) => {
    weatherService.setSavedLocation(loc);
    onLocationChange(loc);
    setQuery('');
    setIsOpen(false);
    setGeoError(null);
  };

  const handleBrowserGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsGeolocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Math.round(pos.coords.latitude * 10000) / 10000;
        const lon = Math.round(pos.coords.longitude * 10000) / 10000;

        const loc: LocationInfo = {
          name: 'My Farm Location',
          state: 'GPS Detected',
          country: 'India',
          latitude: lat,
          longitude: lon
        };

        handleSelectLocation(loc);
        setIsGeolocating(false);
      },
      (err) => {
        setIsGeolocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('Location permission denied. Please search your city or district manually.');
        } else {
          setGeoError('Unable to detect location. Please search manually below.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        
        {/* Current Location Badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-xs">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="text-left text-xs">
            <span className="font-bold text-slate-800 block leading-tight">
              {currentLocation.name}
            </span>
            <span className="text-[10px] text-slate-400">
              {currentLocation.state ? `${currentLocation.state}, ` : ''}{currentLocation.country}
            </span>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setIsOpen(true); }}
            placeholder="Search city, district, or coordinates..."
            className="w-full pl-9 pr-9 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
          {isSearching && (
            <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* GPS Geolocation Button */}
        <button
          type="button"
          onClick={handleBrowserGeolocation}
          disabled={isGeolocating}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
          title="Detect current GPS location"
        >
          {isGeolocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
          )}
          <span className="hidden sm:inline">Use GPS</span>
        </button>

      </div>

      {/* Geolocation Notice Banner */}
      {geoError && (
        <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{geoError}</span>
          </div>
          <button
            type="button"
            onClick={() => setGeoError(null)}
            className="text-xs font-bold text-amber-700 hover:text-amber-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Autocomplete Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 max-h-60 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Select Location / शहर चुनें
          </div>
          {results.map((loc, idx) => (
            <button
              key={`${loc.latitude}-${loc.longitude}-${idx}`}
              type="button"
              onClick={() => handleSelectLocation(loc)}
              className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between transition-colors border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900">{loc.name}</span>
                  <span className="text-[11px] text-slate-400 ml-1.5">
                    {loc.state ? `${loc.state}, ` : ''}{loc.country}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
