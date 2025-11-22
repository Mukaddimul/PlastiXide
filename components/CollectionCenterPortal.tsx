import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Camera, UserCheck, Send, Search, CheckCircle2, MessageSquare } from 'lucide-react';
import { MOCK_REGISTERED_FISHERMEN } from '../constants';

interface CollectionCenterPortalProps {
  onNewTransaction?: (data: any) => void;
}

export const CollectionCenterPortal: React.FC<CollectionCenterPortalProps> = ({ onNewTransaction }) => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [weight, setWeight] = useState('');
  const [pricePerKg, setPricePerKg] = useState(35); // BDT
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastTx, setLastTx] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCalculate = () => {
    const w = parseFloat(weight);
    if (isNaN(w)) return 0;
    return Math.floor(w * pricePerKg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      alert("Please select a registered fisherman/hawker.");
      return;
    }

    setLoading(true);
    
    const userDetails = MOCK_REGISTERED_FISHERMEN.find(u => u.id === selectedUser);
    const totalAmount = handleCalculate();
    const txData = {
      id: Date.now().toString(),
      userId: userDetails?.id,
      userName: userDetails?.name,
      userPhone: userDetails?.phone,
      weight: weight,
      amount: totalAmount,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      location: 'Mirpur Hub (ID: C-102)'
    };

    // Simulate network delay and SMS sending time
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      setLastTx(txData);
      
      // Push data to Admin Dashboard via App parent
      if (onNewTransaction) {
        onNewTransaction(txData);
      }

      // Reset Form
      setWeight('');
      setSelectedUser('');
      
      // Auto hide success after 8 seconds to allow time to read the SMS
      setTimeout(() => setShowSuccess(false), 8000);
    }, 2000);
  };

  const currentUserDetails = MOCK_REGISTERED_FISHERMEN.find(u => u.id === selectedUser);

  const filteredFishermen = MOCK_REGISTERED_FISHERMEN.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h2 className="text-2xl font-heading font-bold text-gray-800">Collection Center</h2>
        <p className="text-gray-500">Mirpur Hub (ID: C-102)</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-brand-dark text-white">
          <p className="text-gray-400 text-xs uppercase">Today's Collection</p>
          <h3 className="text-2xl font-bold">458.5 kg</h3>
        </Card>
        <Card className="bg-brand-blue text-white">
          <p className="text-blue-100 text-xs uppercase">Cash Paid Out</p>
          <h3 className="text-2xl font-bold">৳ 12,500</h3>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Entry Form */}
        <div className="lg:col-span-2 relative">
          {showSuccess && lastTx && (
            <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center p-6 animate-fade-in border border-green-100 shadow-xl">
              
              <div className="flex items-center gap-2 text-green-600 mb-6">
                <CheckCircle2 size={32} />
                <h3 className="text-2xl font-bold font-heading">Transaction Successful</h3>
              </div>

              {/* Realistic Mobile SMS Simulation */}
              <div className="bg-gray-900 p-4 rounded-[2.5rem] w-72 shadow-2xl border-[6px] border-gray-800 relative transform transition-all hover:scale-105 ring-4 ring-gray-200/50">
                 {/* Notch */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-xl z-10"></div>
                 
                 {/* Lock Screen Content */}
                 <div className="h-96 flex flex-col pt-10 relative overflow-hidden">
                    {/* Background Wallpaper effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-50 z-0"></div>

                    <div className="text-center text-gray-200 font-thin text-6xl mb-8 z-10 tracking-tighter">
                      {lastTx.timestamp}
                    </div>

                    {/* Notification Bubble */}
                    <div className="mx-2 bg-white/90 backdrop-blur-md text-brand-dark p-3 rounded-2xl text-left shadow-lg animate-slide-up z-10 relative">
                       <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="bg-green-500 p-1 rounded text-white">
                              <MessageSquare size={10} fill="currentColor" />
                            </div>
                            <span className="text-[10px] font-bold uppercase text-gray-600">Messages • Now</span>
                          </div>
                       </div>
                       
                       <div>
                         <p className="text-xs font-bold mb-1">Payment Received</p>
                         <p className="text-xs text-gray-700 leading-relaxed">
                           Dear {lastTx.userName}, you received <span className="font-bold">৳{lastTx.amount}</span> for <span className="font-bold">{lastTx.weight}kg</span> plastic at {lastTx.location}.
                           <br/><br/>
                           <span className="text-[10px] text-gray-500 italic">Sent to {lastTx.userPhone}</span>
                         </p>
                       </div>
                    </div>

                    <div className="mt-auto mb-4 flex justify-center gap-4 z-10">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <Camera size={16} className="text-white" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <div className="w-3 h-3 rounded-sm border border-white"></div>
                      </div>
                    </div>
                 </div>
              </div>

              <div className="mt-8 flex flex-col items-center gap-2">
                <p className="text-sm text-gray-500">SMS has been sent automatically.</p>
                <Button onClick={() => setShowSuccess(false)} size="sm" variant="outline">
                   Start New Entry
                </Button>
              </div>
            </div>
          )}

          <Card title="New Plastic Entry">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Select Registered Collector</label>
                <select 
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-brand-blue transition-colors appearance-none cursor-pointer"
                  required
                >
                  <option value="">-- Select Fisherman / Hawker --</option>
                  {MOCK_REGISTERED_FISHERMEN.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} (ID: {user.id})
                    </option>
                  ))}
                </select>
              </div>

              {currentUserDetails && (
                 <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-3 animate-fade-in">
                   <div className="bg-blue-100 p-2 rounded-full text-brand-blue">
                     <UserCheck size={20} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-brand-dark">{currentUserDetails.name}</p>
                     <p className="text-xs text-gray-500">{currentUserDetails.type} • {currentUserDetails.phone}</p>
                   </div>
                 </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Weight (kg)</label>
                <input 
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-brand-blue transition-colors text-2xl font-mono"
                  placeholder="0.0"
                  required
                />
              </div>

              <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-green-100">
                <div>
                  <p className="text-xs text-green-700">Calculated Payment</p>
                  <p className="font-bold text-brand-green text-xl">৳ {handleCalculate()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Rate: ৳{pricePerKg}/kg</p>
                  <button type="button" onClick={() => setPricePerKg(pricePerKg + 1)} className="text-xs text-blue-500 underline">Edit Rate</button>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50">
                  <Camera size={20} />
                  Photo
                </button>
                <Button 
                  type="submit" 
                  className="flex-[2]" 
                  isLoading={loading}
                  disabled={!selectedUser || !weight}
                >
                  {loading ? (
                    <span className="text-xs">
                      Sending SMS to {currentUserDetails?.phone?.split('-')[0]}...
                    </span>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Confirm Payment & Send SMS
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Directory */}
        <div className="lg:col-span-1">
           <Card title="Collector Directory" className="h-full max-h-[600px] flex flex-col">
             <div className="mb-3 relative">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Search name or ID..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm border border-gray-100 focus:border-brand-blue outline-none"
               />
             </div>
             <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
               {filteredFishermen.length === 0 ? (
                 <p className="text-center text-xs text-gray-400 py-4">No collectors found.</p>
               ) : (
                 filteredFishermen.map(user => (
                   <button 
                     key={user.id}
                     onClick={() => setSelectedUser(user.id)}
                     className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 group ${
                       selectedUser === user.id 
                         ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' 
                         : 'bg-white border-gray-100 hover:border-gray-300'
                     }`}
                   >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        user.type === 'Fisherman' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-800 truncate">{user.name}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                           <span className="font-mono">{user.id}</span>
                           <span>•</span>
                           <span>{user.phone}</span>
                        </div>
                      </div>
                      {selectedUser === user.id && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                   </button>
                 ))
               )}
             </div>
           </Card>
        </div>
      </div>
    </div>
  );
};