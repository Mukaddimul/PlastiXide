import React, { useState, useEffect } from 'react';
import { MapPin, Navigation2, Info, AlertTriangle, CheckCircle2, XCircle, BatteryFull } from 'lucide-react';
import { MOCK_MAP_POINTS } from '../constants';
import { MapPoint } from '../types';
import { Card } from './ui/Card';

export const MapView: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [points, setPoints] = useState<MapPoint[]>(MOCK_MAP_POINTS);

  // Simulation for Real-Time Status Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(currentPoints => currentPoints.map(point => {
        if (point.type === 'MACHINE') {
          // Randomly adjust capacity
          const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
          let newCapacity = Math.max(0, Math.min(100, (point.capacity || 0) + change));
          
          // Force some dramatic changes for demo purposes occasionally
          if (Math.random() > 0.95) {
             newCapacity = Math.random() > 0.5 ? 98 : 15;
          }

          let newStatus = point.status;
          
          // Logic for status based on capacity
          if (point.status !== 'MAINTENANCE') {
             if (newCapacity >= 95) newStatus = 'FULL';
             else if (newCapacity < 90) newStatus = 'ONLINE';
          }

          // Randomly toggle maintenance for demo
          if (Math.random() > 0.99) {
             newStatus = newStatus === 'MAINTENANCE' ? 'ONLINE' : 'MAINTENANCE';
          }

          return { ...point, capacity: newCapacity, status: newStatus as any };
        }
        return point;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string, type: string) => {
    if (type === 'CENTER') return 'text-brand-blue';
    switch (status) {
      case 'ONLINE': return 'text-green-500';
      case 'FULL': return 'text-red-500';
      case 'MAINTENANCE': return 'text-orange-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="relative h-[calc(100vh-180px)] w-full rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
      {/* Fake Map Background */}
      <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-cover bg-center grayscale" />
      
      <div className="absolute inset-0 p-4">
        {/* Points */}
        {points.map((point) => (
          <button
            key={point.id}
            onClick={() => setSelectedPoint(point)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-110 ${selectedPoint?.id === point.id ? 'scale-125 z-20' : 'z-10'}`}
            style={{ 
              top: `${(point.lat - 23.7) * 1000}%`, 
              left: `${(point.lng - 90.3) * 1000}%` 
            }}
          >
            <div className={`relative flex flex-col items-center ${getStatusColor(point.status, point.type)}`}>
              <div className="relative">
                <MapPin size={40} fill="currentColor" className="drop-shadow-lg" />
                {/* Status Dot Indicator */}
                {point.type === 'MACHINE' && (
                   <>
                    {point.status === 'ONLINE' && (
                       <span className="absolute top-0 right-0 flex h-3 w-3">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-white"></span>
                       </span>
                    )}
                    {point.status === 'FULL' && (
                        <span className="absolute top-0 right-0 h-3 w-3 bg-red-600 border-2 border-white rounded-full shadow-sm"></span>
                    )}
                    {point.status === 'MAINTENANCE' && (
                        <span className="absolute top-0 right-0 h-3 w-3 bg-orange-500 border-2 border-white rounded-full shadow-sm"></span>
                    )}
                   </>
                )}
              </div>
              
              {/* Label */}
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold shadow-sm whitespace-nowrap mt-1 border border-gray-100 flex items-center gap-1">
                 {point.type === 'CENTER' && <Navigation2 size={8} className="text-brand-blue" />}
                 {point.name}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Point Detail Overlay */}
      {selectedPoint && (
        <div className="absolute bottom-4 left-4 right-4 z-30 animate-fade-in">
          <Card className="p-4 shadow-2xl border-t-4 border-t-brand-green">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
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
                    {selectedPoint.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{selectedPoint.address}</p>
                
                {selectedPoint.type === 'MACHINE' && (
                  <div className="mt-3">
                     <div className="flex justify-between text-xs mb-1">
                       <span className="text-gray-500">Bin Capacity</span>
                       <span className={`font-bold ${selectedPoint.capacity! > 90 ? 'text-red-500' : 'text-gray-700'}`}>
                         {selectedPoint.capacity}%
                       </span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                       <div 
                         className={`h-full rounded-full transition-all duration-500 ${
                           selectedPoint.capacity! > 90 ? 'bg-red-500' : 
                           selectedPoint.status === 'MAINTENANCE' ? 'bg-orange-400' : 'bg-brand-green'
                         }`}
                         style={{ width: `${selectedPoint.capacity}%` }}
                       ></div>
                     </div>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setSelectedPoint(null)}
                className="text-gray-400 hover:text-gray-600 p-1 bg-gray-100 rounded-full"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-brand-blue text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                <Navigation2 size={16} />
                Navigate
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Map Controls / Legend */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-white p-3 rounded-xl shadow-md flex flex-col gap-2 text-xs">
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
           </div>
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-red-500"></span> Full
           </div>
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-orange-500"></span> Maint.
           </div>
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-brand-blue"></span> Center
           </div>
        </div>
      </div>
    </div>
  );
};