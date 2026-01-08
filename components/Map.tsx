import React, { useState, useEffect } from 'react';
import { MapPin, Navigation2, AlertTriangle, CheckCircle2, AlertCircle, Wrench, Globe, XCircle } from 'lucide-react';
import { MOCK_MAP_POINTS } from '../constants.ts';
import { MapPoint } from '../types.ts';
import { Card } from './ui/Card.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

export const MapView: React.FC = () => {
  const { t } = useLanguage();
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [points, setPoints] = useState<MapPoint[]>(MOCK_MAP_POINTS);
  const [mapStyle, setMapStyle] = useState<'road' | 'satellite'>('satellite');
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

  // Fetch real geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log("Geolocation error:", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Simulation for Real-Time Status Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(currentPoints => currentPoints.map(point => {
        if (point.type === 'MACHINE') {
          const change = Math.floor(Math.random() * 5) - 2;
          let newCapacity = Math.max(0, Math.min(100, (point.capacity || 0) + change));
          
          if (Math.random() > 0.98) newCapacity = Math.random() > 0.5 ? 98 : 15;

          let newStatus = point.status;
          if (point.status !== 'MAINTENANCE') {
             if (newCapacity >= 95) newStatus = 'FULL';
             else if (newCapacity < 90 && point.status === 'FULL') newStatus = 'ONLINE';
          }

          if (Math.random() > 0.995) newStatus = newStatus === 'MAINTENANCE' ? 'ONLINE' : 'MAINTENANCE';

          return { ...point, capacity: newCapacity, status: newStatus as any };
        }
        return point;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = (status: string, type: string) => {
    if (type === 'CENTER') return { color: 'text-brand-blue', bg: 'bg-blue-500', ring: 'ring-blue-300', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.6)]' };
    switch (status) {
      case 'ONLINE': return { color: 'text-green-400', bg: 'bg-green-500', ring: 'ring-green-300', glow: 'shadow-[0_0_15px_rgba(74,222,128,0.6)]' };
      case 'FULL': return { color: 'text-red-500', bg: 'bg-red-500', ring: 'ring-red-300', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.6)]' };
      case 'MAINTENANCE': return { color: 'text-orange-400', bg: 'bg-orange-500', ring: 'ring-orange-300', glow: 'shadow-[0_0_15px_rgba(251,146,60,0.6)]' };
      default: return { color: 'text-gray-400', bg: 'bg-gray-400', ring: 'ring-gray-200', glow: '' };
    }
  };

  const getStatusText = (status: string) => {
      switch (status) {
          case 'ONLINE': return t('status_online');
          case 'FULL': return t('status_full');
          case 'MAINTENANCE': return t('status_maintenance');
          default: return status;
      }
  };

  const handleNavigate = () => {
    if (!selectedPoint) return;
    const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
    const url = isApple 
      ? `http://maps.apple.com/?daddr=${selectedPoint.lat},${selectedPoint.lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.lat},${selectedPoint.lng}`;
    window.open(url, '_blank');
  };

  // Base coordinates for the visual grid
  const baseLat = userLocation?.lat || 23.7;
  const baseLng = userLocation?.lng || 90.3;

  return (
    <div className="relative h-[calc(100vh-180px)] w-full rounded-3xl overflow-hidden bg-gray-900 border border-gray-700 shadow-2xl group">
      
      {/* Map Background */}
      {mapStyle === 'road' ? (
        <div className="absolute inset-0 bg-[#e5e7eb] opacity-100 transition-all duration-700">
           <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#d1d5db 2px, transparent 2px), linear-gradient(90deg, #d1d5db 2px, transparent 2px)', backgroundSize: '100px 100px', opacity: 0.3 }}></div>
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 grayscale mix-blend-multiply"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-black transition-all duration-700">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-80 scale-110"></div>
           <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay"></div>
           <div className="absolute inset-0 bg-black/30"></div>
        </div>
      )}
      
      <div className="absolute inset-0 p-4">
        {/* User Marker */}
        {userLocation && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-40"
            style={{ top: '50%', left: '50%' }}
          >
            <div className="relative flex flex-col items-center">
              <div className="w-6 h-6 bg-brand-blue rounded-full border-4 border-white shadow-lg animate-pulse"></div>
              <span className="bg-brand-blue text-white text-[8px] px-2 py-0.5 rounded-full mt-1 font-bold shadow-md">YOU</span>
            </div>
          </div>
        )}

        {/* Points - Positioned relative to userLocation or mock center */}
        {points.map((point) => {
          const config = getStatusConfig(point.status, point.type);
          const isSelected = selectedPoint?.id === point.id;

          // Simple linear projection for visualization
          const topPos = 50 + (point.lat - baseLat) * 800;
          const leftPos = 50 + (point.lng - baseLng) * 800;

          return (
            <button
              key={point.id}
              onClick={() => setSelectedPoint(point)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-110 hover:z-30 ${isSelected ? 'scale-125 z-20' : 'z-10'}`}
              style={{ top: `${topPos}%`, left: `${leftPos}%` }}
            >
              <div className="relative flex flex-col items-center">
                <div className="relative">
                  {mapStyle === 'satellite' && <div className={`absolute inset-0 rounded-full opacity-50 blur-md ${config.glow}`}></div>}
                  <MapPin size={48} fill="currentColor" className={`drop-shadow-2xl ${config.color} transition-colors duration-300`} />
                  
                  {/* Status Badges for Machines */}
                  <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/4">
                    {point.type === 'MACHINE' && (
                       <div className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 border-white shadow-md ${config.bg} transition-all duration-300`}>
                        {point.status === 'ONLINE' && (
                           <>
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                             <CheckCircle2 size={14} className="text-white relative z-10" />
                           </>
                        )}
                        {point.status === 'FULL' && (
                          <AlertCircle size={14} className="text-white animate-pulse" />
                        )}
                        {point.status === 'MAINTENANCE' && (
                          <Wrench size={14} className="text-white" />
                        )}
                       </div>
                    )}
                  </div>
                </div>
                <div className={`backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-xl whitespace-nowrap mt-1 border flex items-center gap-1 transition-all duration-300 ${isSelected ? 'border-brand-blue text-brand-blue scale-105 bg-white/95' : mapStyle === 'satellite' ? 'bg-black/60 border-white/10 text-white' : 'bg-white/90 border-gray-100 text-gray-600'}`}>
                   {point.type === 'CENTER' && <Navigation2 size={10} className={mapStyle === 'satellite' ? "text-blue-400" : "text-brand-blue"} />}
                   {point.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Point Detail Overlay */}
      {selectedPoint && (
        <div className="absolute bottom-4 left-4 right-4 z-30 animate-fade-in">
          <Card className={`p-4 shadow-2xl border-t-4 backdrop-blur-md ${mapStyle === 'satellite' ? 'bg-white/95' : 'bg-white'} ${selectedPoint.status === 'FULL' ? 'border-t-red-500' : selectedPoint.status === 'MAINTENANCE' ? 'border-t-orange-500' : selectedPoint.type === 'CENTER' ? 'border-t-brand-blue' : 'border-t-brand-green'}`}>
            <div className="flex justify-between items-start">
              <div className="w-full mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-brand-dark text-lg">{selectedPoint.name}</h3>
                  <span className={`text-[10px] px-2 py-1 rounded-full border font-bold flex items-center gap-1 ${selectedPoint.status === 'ONLINE' ? 'bg-green-100 text-green-700 border-green-200' : selectedPoint.status === 'FULL' ? 'bg-red-100 text-red-700 border-red-200' : selectedPoint.status === 'MAINTENANCE' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                    {getStatusText(selectedPoint.status)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{selectedPoint.address}</p>
                {selectedPoint.type === 'MACHINE' && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                     <div className="flex justify-between text-xs mb-1.5"><span className="font-bold text-gray-500">{t('map_capacity')}</span><span className={`font-bold ${selectedPoint.capacity! > 90 ? 'text-red-500' : 'text-gray-700'}`}>{selectedPoint.capacity}%</span></div>
                     <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${selectedPoint.capacity! > 90 ? 'bg-red-500' : selectedPoint.status === 'MAINTENANCE' ? 'bg-orange-400' : 'bg-brand-green'}`} style={{ width: `${selectedPoint.capacity}%` }}></div></div>
                  </div>
                )}
              </div>
              <button onClick={() => setSelectedPoint(null)} className="text-gray-400 hover:text-gray-600 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><XCircle size={24} /></button>
            </div>
            <div className="mt-4 flex gap-2"><button onClick={handleNavigate} className="flex-1 bg-brand-blue text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"><Navigation2 size={16} />{t('map_navigate')}</button></div>
          </Card>
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-white/90 backdrop-blur-md p-1 rounded-lg border border-gray-200 shadow-lg flex">
           <button onClick={() => setMapStyle('road')} className={`p-2 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${mapStyle === 'road' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}><div className="w-4 h-4 border border-gray-400 bg-gray-50 rounded-sm"></div>Road</button>
           <button onClick={() => setMapStyle('satellite')} className={`p-2 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${mapStyle === 'satellite' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}><Globe size={14} />Satellite</button>
        </div>
      </div>
    </div>
  );
};
