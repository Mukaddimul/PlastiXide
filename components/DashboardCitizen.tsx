import React, { useState } from 'react';
import { Card } from './ui/Card';
import { ArrowUpRight, Leaf, Coins, MapPin, RefreshCw, Bell, DollarSign, Calendar, Truck, Banknote, X, CalendarCheck } from 'lucide-react';
import { User, UserRole } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MapView } from './Map';
import { MOCK_NOTIFICATIONS, MOCK_FISHERMAN_TRANSACTIONS } from '../constants';
import { Button } from './ui/Button';

interface DashboardCitizenProps {
  user: User;
  onNavigateToMap: () => void;
}

const data = [
  { name: 'Mon', kg: 0.5 },
  { name: 'Tue', kg: 1.2 },
  { name: 'Wed', kg: 0.8 },
  { name: 'Thu', kg: 2.1 },
  { name: 'Fri', kg: 1.5 },
  { name: 'Sat', kg: 3.2 },
  { name: 'Sun', kg: 2.4 },
];

export const DashboardCitizen: React.FC<DashboardCitizenProps> = ({ user, onNavigateToMap }) => {
  const [view, setView] = useState<'stats' | 'map'>('stats');
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [pickupLoading, setPickupLoading] = useState(false);
  const [pickupSuccess, setPickupSuccess] = useState(false);
  const [estWeight, setEstWeight] = useState('');
  
  const isFisherman = user.role === UserRole.FISHERMAN;

  const handlePickupRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setPickupLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPickupLoading(false);
      setPickupSuccess(true);
    }, 2000);
  };

  const closePickupModal = () => {
    setShowPickupModal(false);
    setPickupSuccess(false);
    setEstWeight('');
  };

  const calculateCash = () => {
    const w = parseFloat(estWeight);
    return isNaN(w) ? 0 : Math.floor(w * 25); // 25 BDT per kg for home pickup
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800">Hello, {user.name.split(' ')[0]}!</h2>
          <p className="text-gray-500 text-sm">
            {isFisherman ? 'Keep the rivers clean 🌊' : 'Ready to save the planet today? 🌱'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white p-2 rounded-full border border-gray-200 relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className={`${isFisherman ? 'bg-brand-blue/10' : 'bg-brand-green/10'} px-4 py-2 rounded-full flex items-center gap-2`}>
            <Coins className={isFisherman ? 'text-brand-blue' : 'text-brand-green'} size={20} />
            <span className={`font-bold ${isFisherman ? 'text-brand-blue' : 'text-brand-green'}`}>
              {user.points} pts
            </span>
          </div>
        </div>
      </header>

      {/* Notifications Teaser (if any) */}
      {MOCK_NOTIFICATIONS.slice(0, 1).map(n => (
        <div key={n.id} className="bg-brand-light border border-brand-green/20 p-3 rounded-xl flex items-center gap-3 text-sm">
          <span className="bg-brand-green text-white text-[10px] px-2 rounded-md font-bold py-0.5">NEW</span>
          <p className="text-brand-dark truncate flex-1">{n.message}</p>
        </div>
      ))}

      {/* View Toggles */}
      <div className="flex p-1 bg-gray-100 rounded-xl">
        <button 
          onClick={() => setView('stats')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${view === 'stats' ? 'bg-white shadow text-brand-dark' : 'text-gray-500'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setView('map')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${view === 'map' ? 'bg-white shadow text-brand-dark' : 'text-gray-500'}`}
        >
          Live Map
        </button>
      </div>

      {view === 'stats' ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className={`bg-gradient-to-br ${isFisherman ? 'from-brand-blue to-blue-600' : 'from-brand-green to-emerald-600'} text-white border-none shadow-lg`}>
              <div className="flex flex-col h-full justify-between min-h-[100px]">
                <div className="flex justify-between items-start">
                  <Leaf className="opacity-80" size={24} />
                  {isFisherman && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white">Today</span>}
                </div>
                <div>
                  <p className="text-white/80 text-sm">{isFisherman ? 'Collected Today' : 'Total Recycled'}</p>
                  <h3 className="text-2xl font-bold">{user.totalPlasticRecycled} kg</h3>
                </div>
              </div>
            </Card>
            <Card className="bg-white text-brand-dark border border-gray-100">
              <div className="flex flex-col h-full justify-between min-h-[100px]">
                <ArrowUpRight className="text-gray-400" size={24} />
                <div>
                  <p className="text-gray-500 text-sm">Impact Score</p>
                  <h3 className="text-2xl font-bold">{user.impactScore} <span className="text-xs font-normal text-green-500">+5%</span></h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Activity Chart */}
          <Card title="Weekly Contribution">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isFisherman ? '#1A73E8' : '#2ECC71'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isFisherman ? '#1A73E8' : '#2ECC71'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="kg" stroke={isFisherman ? '#1A73E8' : '#2ECC71'} strokeWidth={3} fillOpacity={1} fill="url(#colorKg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Fisherman Payment History Section */}
          {isFisherman && (
            <div className="animate-fade-in">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="font-heading font-bold text-lg text-gray-800">Payment History</h3>
                 <button className="text-sm text-brand-blue font-semibold hover:underline">View All</button>
               </div>
               <div className="space-y-3">
                 {MOCK_FISHERMAN_TRANSACTIONS.map((tx) => (
                   <div key={tx.id} className="bg-white p-4 rounded-xl border-l-4 border-l-brand-blue shadow-sm flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-brand-dark text-sm">{tx.location}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Calendar size={12} />
                          <span>{tx.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-brand-blue font-bold text-lg">
                          <span className="text-sm">৳</span>
                          {tx.cashEarned}
                        </div>
                        <span className="text-[10px] font-medium bg-blue-50 text-brand-blue px-2 py-0.5 rounded-full inline-block">
                          {tx.amountKg} kg
                        </span>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Action Call: Find Nearest & Home Pickup */}
          {!isFisherman && (
            <div className="grid grid-cols-1 gap-4">
              {/* Map Action */}
              <div onClick={onNavigateToMap} className="bg-brand-dark text-white p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-lg shadow-gray-300/50 transition-transform active:scale-95">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-full">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Find Vending Machine</h4>
                    <p className="text-xs text-gray-400">3 centers & 5 machines nearby</p>
                  </div>
                </div>
                <div className="bg-white text-brand-dark w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  →
                </div>
              </div>

              {/* Home Pickup Action */}
              <div onClick={() => setShowPickupModal(true)} className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-lg shadow-orange-200 transition-transform active:scale-95">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">Doorstep Cash Collection</h4>
                    <p className="text-xs text-white/80">Weekly pickup • Get paid in Cash 💵</p>
                  </div>
                </div>
                <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  +
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <MapView />
      )}

      {/* Home Pickup Request Modal */}
      {showPickupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-md relative overflow-hidden">
            {/* Close Button */}
            <button 
              onClick={closePickupModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <X size={20} />
            </button>

            {!pickupSuccess ? (
              <form onSubmit={handlePickupRequest} className="space-y-4">
                <div className="text-center mb-6">
                   <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Truck size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800">Schedule Weekly Pickup</h3>
                   <p className="text-sm text-gray-500">We collect from your home every Friday.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Pickup Address</label>
                  <input 
                    type="text" 
                    defaultValue="House 12, Road 5, Dhanmondi, Dhaka"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700 font-medium outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Est. Weight (kg)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={estWeight}
                      onChange={(e) => setEstWeight(e.target.value)}
                      placeholder="e.g. 5.0"
                      required
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-lg font-bold outline-none focus:border-orange-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">kg</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <Banknote size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-green-800 font-bold">Est. Cash Payment</p>
                    <p className="text-lg font-bold text-green-600">৳ {calculateCash()}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-[10px] bg-white px-2 py-1 rounded border border-green-200 text-gray-500">Rate: ৳25/kg</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-orange-200"
                  isLoading={pickupLoading}
                  disabled={!estWeight}
                >
                  Request Collection Truck
                </Button>
              </form>
            ) : (
              <div className="text-center py-6 animate-fade-in">
                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-