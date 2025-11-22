import React, { useState, useEffect } from 'react';
import { MapPin, Navigation2, AlertTriangle, CheckCircle2, XCircle, BatteryFull, Wrench } from 'lucide-react';
import { MOCK_MAP_POINTS } from '../constants';
import { MapPoint } from '../types';
import { Card } from './ui/Card';
import { useLanguage } from '../contexts/LanguageContext';

export const MapView: React.FC = () => {
  const { t } = useLanguage();
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [points, setPoints] = useState<MapPoint[]>(MOCK_MAP_POINTS);

  // Simulation for Real-Time Status Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(currentPoints => currentPoints.map(point => {
        if (point.type === 'MACHINE') {
          // 1. Simulate Capacity Fluctuation
          const change = Math.floor(Math.random() * 5) - 2; // Randomly add or subtract capacity (-2 to +2)
          let newCapacity = Math.max(0, Math.min(100, (point.capacity || 0) + change));
          
          // Occasional dramatic change for demo purposes
          if (Math.random() > 0.98) {
             newCapacity = Math.random() > 0.5 ? 98 : 15;
          }

          let newStatus = point.status;
          
          // 2. Logic for Status based on Capacity
          if (point.status !== 'MAINTENANCE') {
             if (newCapacity >= 95) {
               newStatus = 'FULL';
             } else if (newCapacity < 90 && point.status === 'FULL') {
               newStatus = 'ONLINE';
             }
          }

          // 3. Randomly toggle MAINTENANCE mode (rare event)
          if (Math.random() > 0.995) {
             newStatus = newStatus === 'MAINTENANCE' ? 'ONLINE' : 'MAINTENANCE';
          }

          return { ...point, capacity: newCapacity, status: newStatus as any };
        }
        return point;
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = (status: string, type: string) => {
    if (type === 'CENTER') return { color: 'text-brand-blue', bg: 'bg-blue-500', ring: 'ring-blue-300' };
    switch (status) {
      case 'ONLINE': return { color: 'text-green-500', bg: 'bg-green-500', ring: 'ring-green-300' };
      case 'FULL': return { color: 'text-red-500', bg: 'bg-red-500', ring: 'ring-red-300' };
      case 'MAINTENANCE': return { color: 'text-orange-500', bg: 'bg-orange-500', ring: 'ring-orange-300' };
      default: return { color: 'text-gray-400', bg: 'bg-gray-400', ring: 'ring-gray-200' };
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

  return (
    <div className="relative h-[calc(100vh-180px)] w-full rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
      {/* Fake Map Background */}
      <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-cover bg-center grayscale" />
      
      <div className="absolute inset-0 p-4">
        {/* Points */}
        {points.map((point) => {
          const config = getStatusConfig(point.status, point.type);
          const isSelected = selectedPoint?.id === point.id;

          return (
            <button
              key={point.id}
              onClick={() => setSelectedPoint(point)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-110 ${isSelected ? 'scale-125 z-20' : 'z-10'}`}
              style={{ 
                top: `${(point.lat - 23.7) * 1000}%`, 
                left: `${(point.lng - 90.3) * 1000}%` 
              }}
            >
              <div className={`relative flex flex-col items-center ${config.color}`}>
                <div className="relative">
                  {/* Main Pin Icon */}
                  <MapPin size={48} fill="currentColor" className="drop-shadow-lg" />
                  
                  {/* Status Indicator Overlay */}
                  <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                    {point.type === 'MACHINE' && (
                       <div className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow-sm ${config.bg}`}>
                        {point.status === 'ONLINE' && (
                           <>
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                             <CheckCircle2 size={12} className="text-white relative z-10" />
                           </>
                        )}
                        {point.status === 'FULL' && <BatteryFull size={12} className="text-white" />}
                        {point.status === 'MAINTENANCE' && <Wrench size={12} className="text-white" />}
                       </div>
                    )}
                  </div>
                </div>
                
                {/* Label */}
                <div className={`bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-md whitespace-nowrap mt-1 border flex items-center gap-1 transition-all ${isSelected ? 'border-brand-blue text-brand-blue scale-105' : 'border-gray-100 text-gray-600'}`}>
                   {point.type === 'CENTER' && <Navigation2 size={10} className="text-brand-blue" />}
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
          <Card className={`p-4 shadow-2xl border-t-4 ${
             selectedPoint.status === 'FULL' ? 'border-t-red-500' : 
             selectedPoint.status === 'MAINTENANCE' ? 'border-t-orange-500' : 
             selectedPoint.type === 'CENTER' ? 'border-t-brand-blue' : 'border-t-brand-green'
          }`}>
            <div className="flex justify-between items-start">
              <div className="w-full mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-brand-dark text-lg">{selectedPoint.name}</h3>
                  <span className={`text-[10px] px-2 py-1 rounded-full border font-bold flex items-center gap-1 ${
                    selectedPoint.status === 'ONLINE' ? 'bg-green-100 text-green-700 border-green-200' :
                    selectedPoint.status === 'FULL' ? 'bg-red-100 text-red-700 border-red-200' :
                    selectedPoint.status === 'MAINTENANCE' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                    'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                    {selectedPoint.status === 'ONLINE' && <CheckCircle2 size={10} />}
                    {selectedPoint.status === 'FULL' && <BatteryFull size={10} />}
                    {selectedPoint.status === 'MAINTENANCE' && <AlertTriangle size={10} />}
                    {getStatusText(selectedPoint.status)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{selectedPoint.address}</p>
                
                {selectedPoint.type === 'MACHINE' && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                     <div className="flex justify-between text-xs mb-1.5">
                       <span className="font-bold text-gray-500">{t('map_capacity')}</span>
                       <span className={`font-bold ${selectedPoint.capacity! > 90 ? 'text-red-500' : 'text-gray-700'}`}>
                         {selectedPoint.capacity}%
                       </span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                       <div 
                         className={`h-full rounded-full transition-all duration-500 ${
                           selectedPoint.capacity! > 90 ? 'bg-red-500' : 
                           selectedPoint.status === 'MAINTENANCE' ? 'bg-orange-400' : 'bg-brand-green'
                         }`}
                         style={{ width: `${selectedPoint.capacity}%` }}
                       ></div>
                     </div>
                     {selectedPoint.status === 'FULL' && (
                       <p className="text-[10px] text-red-500 mt-2 font-semibold flex items-center gap-1">
                         <AlertTriangle size={10} /> Machine is full. Dispatching collection truck...
                       </p>
                     )}
                  </div>
                )}
              </div>
              <button 
                onClick={() => setSelectedPoint(null)}
                className="text-gray-400 hover:text-gray-600 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-brand-blue text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                <Navigation2 size={16} />
                {t('map_navigate')}
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Map Controls / Legend */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-md flex flex-col gap-2 text-xs border border-gray-200">
           <div className="font-bold text-gray-400 text-[10px] uppercase mb-1">{t('map_legend')}</div>
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500"></span> {t('status_online')}
           </div>
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-red-500"></span> {t('status_full')}
           </div>
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-orange-500"></span> {t('status_maintenance')}
           </div>
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-brand-blue"></span> {t('map_center')}
           </div>
        </div>
      </div>
    </div>
  );
};