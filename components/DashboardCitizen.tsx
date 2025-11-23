
import React, { useState, useRef } from 'react';
import { Card } from './ui/Card';
import { ArrowUpRight, Leaf, Coins, MapPin, Bell, Calendar, Truck, Banknote, X, CalendarCheck, CheckCircle2, MessageSquare, Camera, History, Image as ImageIcon, Trash2 } from 'lucide-react';
import { User, UserRole } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MapView } from './Map';
import { MOCK_NOTIFICATIONS, MOCK_FISHERMAN_TRANSACTIONS } from '../constants';
import { Button } from './ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardCitizenProps {
  user: User;
  onNavigateToMap: () => void;
  onNewTransaction?: (data: any) => void;
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

export const DashboardCitizen: React.FC<DashboardCitizenProps> = ({ user, onNavigateToMap, onNewTransaction }) => {
  const { t } = useLanguage();
  const [view, setView] = useState<'stats' | 'map'>('stats');
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [pickupLoading, setPickupLoading] = useState(false);
  const [pickupSuccess, setPickupSuccess] = useState(false);
  const [estWeight, setEstWeight] = useState('');
  
  // New state for viewing complete history
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // Photo Upload State
  const [pickupImage, setPickupImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isFisherman = user.role === UserRole.FISHERMAN;

  const calculateCash = () => {
    const w = parseFloat(estWeight);
    return isNaN(w) ? 0 : Math.floor(w * 25); // 25 BDT per kg for home pickup
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPickupImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePickupRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setPickupLoading(true);

    const cashAmount = calculateCash();
    const weightNum = parseFloat(estWeight);
    
    const pickupData = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      weight: isNaN(weightNum) ? 0 : weightNum,
      amount: cashAmount,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      location: 'Home Pickup Request',
      proofImage: pickupImage
    };

    // Simulate API call
    setTimeout(() => {
      setPickupLoading(false);
      setPickupSuccess(true);
      
      // Log to Admin Dashboard
      if (onNewTransaction) {
        onNewTransaction(pickupData);
      }
    }, 2000);
  };

  const closePickupModal = () => {
    setShowPickupModal(false);
    setPickupSuccess(false);
    setEstWeight('');
    setPickupImage(null);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800">{t('welcome')}, {user.name.split(' ')[0]}!</h2>
          <p className="text-gray-500 text-sm">
            {isFisherman ? t('hello_msg_fisherman') : t('hello_msg_citizen')}
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
              {user.points} {t('points')}
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
          {t('nav_dashboard')}
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
                  <p className="text-white/80 text-sm">{isFisherman ? t('stat_collected_today') : t('stat_recycled')}</p>
                  <h3 className="text-2xl font-bold">{user.totalPlasticRecycled} kg</h3>
                </div>
              </div>
            </Card>
            <Card className="bg-white text-brand-dark border border-gray-100">
              <div className="flex flex-col h-full justify-between min-h-[100px]">
                <ArrowUpRight className="text-gray-400" size={24} />
                <div>
                  <p className="text-gray-500 text-sm">{t('stat_impact')}</p>
                  <h3 className="text-2xl font-bold">{user.impactScore} <span className="text-xs font-normal text-green-500">+5%</span></h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Activity Chart */}
          <Card title={t('chart_title')}>
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

          {/* Fisherman Payment History Summary */}
          {isFisherman && (
            <div className="animate-fade-in">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="font-heading font-bold text-lg text-gray-800">{t('recent_payments')}</h3>
                 <button 
                    onClick={() => setShowHistoryModal(true)} 
                    className="text-sm text-brand-blue font-semibold hover:underline"
                  >
                    {t('view_all')}
                  </button>
               </div>
               <div className="space-y-3">
                 {/* Only show first 3 items in summary */}
                 {MOCK_FISHERMAN_TRANSACTIONS.slice(0, 3).map((tx) => (
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

          {/* Action Call: Find Nearest & Home Pickup (For Citizen Only) */}
          {!isFisherman && (
            <div className="grid grid-cols-1 gap-4">
              {/* Map Action */}
              <div onClick={onNavigateToMap} className="bg-brand-dark text-white p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-lg shadow-gray-300/50 transition-transform active:scale-95">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-full">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">{t('btn_find_machine')}</h4>
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
                    <h4 className="font-bold">{t('btn_home_pickup')}</h4>
                    <p className="text-xs text-white/80">{t('desc_home_pickup')}</p>
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

      {/* Complete Payment History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-lg h-[80vh] flex flex-col relative overflow-hidden">
            <button 
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-1 bg-white rounded-full"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-6 p-1">
              <div className="bg-brand-blue/10 p-3 rounded-full text-brand-blue">
                <History size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{t('history')}</h3>
                <p className="text-sm text-gray-500">Complete record of your earnings</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {MOCK_FISHERMAN_TRANSACTIONS.map((tx) => (
                 <div key={tx.id} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow flex items-center justify-between group">
                    <div>
                      <h4 className="font-bold text-brand-dark text-sm group-hover:text-brand-blue transition-colors">{tx.location}</h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar size={12} />
                        <span>{tx.date}</span>
                      </div>
                      <div className="mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          tx.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-brand-blue font-bold text-lg">
                        <span className="text-sm">৳</span>
                        {tx.cashEarned}
                      </div>
                      <span className="text-xs font-medium text-gray-500">
                        {tx.amountKg} kg @ ৳{(tx.cashEarned! / tx.amountKg!).toFixed(0)}/kg
                      </span>
                    </div>
                 </div>
              ))}
              <div className="text-center text-xs text-gray-400 py-4">
                End of history records
              </div>
            </div>
            
            <div className="pt-4 mt-auto border-t border-gray-100">
               <Button onClick={() => setShowHistoryModal(false)} className="w-full">
                 Close
               </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Home Pickup Request Modal */}
      {showPickupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-md relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
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
                   <h3 className="text-xl font-bold text-gray-800">{t('btn_home_pickup')}</h3>
                   <p className="text-sm text-gray-500">We collect from your home every Friday.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Pickup Address</label>
                  <input 
                    type="text" 
                    defaultValue="House 12, Road 5, Dhanmondi, Dhaka"
                    className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm text-gray-700 font-medium outline-none focus:border-orange-500"
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
                      className="w-full p-3 bg-white rounded-xl border border-gray-200 text-lg font-bold outline-none focus:border-orange-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">kg</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{t('photo')}</label>
                  {!pickupImage ? (
                     <button 
                       type="button"
                       onClick={() => fileInputRef.current?.click()}
                       className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 bg-white transition-colors"
                     >
                       <Camera size={20} />
                       <span className="text-sm">Upload Photo of Waste</span>
                     </button>
                  ) : (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 group">
                       <img src={pickupImage} alt="Waste" className="w-full h-full object-cover" />
                       <button 
                         type="button" 
                         onClick={() => setPickupImage(null)}
                         className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
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
              <div className="text-center py-6 animate-fade-in flex flex-col items-center">
                 <div className="flex items-center gap-2 text-green-600 mb-6">
                    <CheckCircle2 size={32} />
                    <h3 className="text-2xl font-bold font-heading">Request Confirmed!</h3>
                 </div>

                 {/* Realistic Mobile SMS Simulation */}
                 <div className="bg-gray-900 p-4 rounded-[2rem] w-64 shadow-2xl border-[4px] border-gray-800 relative transform transition-all hover:scale-105 mb-6">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-b-xl z-10"></div>
                     <div className="h-64 flex flex-col pt-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-0"></div>
                        <div className="text-center text-gray-200 font-thin text-4xl mb-6 z-10">
                          {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <div className="mx-2 bg-white/90 backdrop-blur-md text-brand-dark p-3 rounded-2xl text-left shadow-lg animate-slide-up z-10">
                           <div className="flex justify-between items-center mb-1 border-b border-gray-200 pb-1">
                              <div className="flex items-center gap-1">
                                <div className="bg-green-500 p-0.5 rounded text-white"><MessageSquare size={8} /></div>
                                <span className="text-[8px] font-bold uppercase text-gray-600">PlastiXide • Now</span>
                              </div>
                           </div>
                           <p className="text-[10px] font-bold mb-0.5">Pickup Scheduled</p>
                           <p className="text-[10px] text-gray-700 leading-tight">
                             Hi {user.name.split(' ')[0]}, pickup confirmed for Friday. Est. Cash: <span className="font-bold">৳{calculateCash()}</span> for {estWeight}kg.
                           </p>
                        </div>
                        <div className="mt-auto mb-2 flex justify-center gap-3 z-10">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Camera size={12} className="text-white" /></div>
                        </div>
                     </div>
                 </div>

                 <p className="text-gray-500 text-sm mb-6">
                   Our collection vehicle will arrive at your doorstep this <span className="font-bold text-brand-dark">Friday between 10 AM - 12 PM</span>.
                 </p>

                 <Button onClick={closePickupModal} variant="outline" className="w-full">
                   Done
                 </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
