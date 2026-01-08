
import React, { useState, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Camera, UserCheck, Send, Search, CheckCircle2, MessageSquare, Truck, BatteryFull, MapPin, AlertTriangle, UserPlus, X, CreditCard, FileText, Image as ImageIcon, Trash2, ChevronDown } from 'lucide-react';
import { MOCK_REGISTERED_FISHERMEN, MOCK_MAP_POINTS } from '../constants';
import { MapPoint } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CollectionCenterPortalProps {
  onNewTransaction?: (data: any) => void;
}

const PLASTIC_TYPES = [
  { value: "PET", label: "PET (Polyethylene Terephthalate)" },
  { value: "HDPE", label: "HDPE (High-Density Polyethylene)" },
  { value: "PVC", label: "PVC (Polyvinyl Chloride)" },
  { value: "LDPE", label: "LDPE (Low-Density Polyethylene)" },
  { value: "PP", label: "PP (Polypropylene)" },
  { value: "PS", label: "PS (Polystyrene)" },
];

export const CollectionCenterPortal: React.FC<CollectionCenterPortalProps> = ({ onNewTransaction }) => {
  const { t } = useLanguage();
  // Initialize user list with mock data, but allow additions
  const [registeredUsers, setRegisteredUsers] = useState(MOCK_REGISTERED_FISHERMEN);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [plasticType, setPlasticType] = useState('PET');
  const [weight, setWeight] = useState('');
  const [pricePerKg, setPricePerKg] = useState(35); // BDT
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastTx, setLastTx] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Photo Upload State
  const [proofImage, setProofImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Registration Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newCollector, setNewCollector] = useState({ 
    name: '', phone: '', type: 'Fisherman', zone: '', nid: '', 
    emergencyContact: '', bkash: '', bankAccount: '' 
  });

  // Local state for machine alerts (Initialize with machines > 80% capacity)
  const [machineAlerts, setMachineAlerts] = useState<MapPoint[]>(
    MOCK_MAP_POINTS.filter(p => p.type === 'MACHINE' && (p.capacity || 0) >= 80)
  );
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

  const handleCalculate = () => {
    const w = parseFloat(weight);
    if (isNaN(w)) return 0;
    return Math.floor(w * pricePerKg);
  };

  const handleDispatchTruck = (machineId: string) => {
    setDispatchingId(machineId);
    setTimeout(() => {
      // Remove the machine from alerts after "emptying" it
      setMachineAlerts(prev => prev.filter(m => m.id !== machineId));
      setDispatchingId(null);
      alert("Collection Truck Dispatched! Machine status will be reset to 0% once collected.");
    }, 2000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollector.name || !newCollector.phone) return;

    const newId = `${newCollector.type === 'Fisherman' ? 'F' : 'H'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newUserEntry = {
      id: newId,
      name: newCollector.name,
      phone: newCollector.phone,
      type: newCollector.type
    };

    setRegisteredUsers([newUserEntry, ...registeredUsers]);
    setSelectedUser(newId); // Auto select the new user
    setShowRegisterModal(false);
    // Reset form
    setNewCollector({ 
      name: '', phone: '', type: 'Fisherman', zone: '', nid: '', 
      emergencyContact: '', bkash: '', bankAccount: '' 
    }); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      alert("Please select a registered fisherman/hawker.");
      return;
    }

    setLoading(true);
    
    const userDetails = registeredUsers.find(u => u.id === selectedUser);
    const totalAmount = handleCalculate();
    const txData = {
      id: Date.now().toString(),
      userId: userDetails?.id,
      userName: userDetails?.name,
      userPhone: userDetails?.phone,
      plasticType: plasticType,
      weight: weight,
      amount: totalAmount,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      location: 'Mirpur Hub (ID: C-102)',
      proofImage: proofImage
    };

    // Simulate network delay and SMS sending time
    setTimeout(() => {
      // Log for demo purposes
      console.log(`SMS Gateway Triggered: Sending to ${txData.userPhone}`);
      
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
      setPlasticType('PET');
      setProofImage(null);
      
      // Auto hide success after 8 seconds to allow time to read the SMS
      setTimeout(() => setShowSuccess(false), 8000);
    }, 2000);
  };

  const currentUserDetails = registeredUsers.find(u => u.id === selectedUser);

  const filteredFishermen = registeredUsers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h2 className="text-2xl font-heading font-bold text-gray-800">{t('cc_portal')}</h2>
        <p className="text-gray-500">Mirpur Hub (ID: C-102)</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-brand-dark text-white">
          <p className="text-gray-400 text-xs uppercase">{t('todays_coll')}</p>
          <h3 className="text-2xl font-bold">458.5 kg</h3>
        </Card>
        <Card className="bg-brand-blue text-white">
          <p className="text-blue-100 text-xs uppercase">{t('cash_paid')}</p>
          <h3 className="text-2xl font-bold">৳ 12,500</h3>
        </Card>
      </div>

      {/* Machine Alerts Section */}
      {machineAlerts.length > 0 && (
        <div className="animate-fade-in">
          <h3 className="font-heading font-bold text-lg text-red-600 mb-3 flex items-center gap-2">
            <AlertTriangle className="animate-pulse" />
            {t('urgent_alerts')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {machineAlerts.map(machine => (
              <div key={machine.id} className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                <div className="flex items-center gap-4 w-full md:w-auto">
                   <div className="relative">
                     <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-25"></div>
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-500 shadow-md relative border-4 border-red-100 z-10">
                       <BatteryFull size={32} />
                       <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold border border-white">!</span>
                     </div>
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-800 text-lg">{machine.name}</h4>
                     <div className="flex items-center gap-1 text-xs text-gray-500">
                       <MapPin size={12} />
                       {machine.address}
                     </div>
                     <div className="mt-1 flex items-center gap-2">
                       <span className="text-xs font-bold text-red-600">Capacity: {machine.capacity}%</span>
                       <div className="w-24 h-1.5 bg-red-200 rounded-full overflow-hidden">
                         <div className="h-full bg-red-600" style={{width: `${machine.capacity}%`}}></div>
                       </div>
                     </div>
                   </div>
                </div>
                
                <Button 
                  onClick={() => handleDispatchTruck(machine.id)}
                  isLoading={dispatchingId === machine.id}
                  className="w-full md:w-auto bg-red-600 hover:bg-red-700 shadow-red-200"
                  size="sm"
                >
                  <Truck size={16} className="mr-2" />
                  {t('dispatch_truck')}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Entry Form */}
        <div className="lg:col-span-2 relative">
          {showSuccess && lastTx && (
            <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center p-6 animate-fade-in border border-green-100 shadow-xl">
              
              <div className="flex items-center gap-2 text-green-600 mb-6">
                <CheckCircle2 size={32} />
                <h3 className="text-2xl font-bold font-heading">{t('tx_success')}</h3>
              </div>

              {/* Realistic Mobile SMS Simulation */}
              <div className="bg-gray-900 p-4 rounded-[2.5rem] w-72 shadow-2xl border-[6px] border-gray-800 relative transform transition-all hover:scale-105 ring-4 ring-gray-200/50">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-xl z-10"></div>
                 
                 <div className="h-96 flex flex-col pt-10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-50 z-0"></div>

                    <div className="text-center text-gray-200 font-thin text-6xl mb-8 z-10 tracking-tighter">
                      {lastTx.timestamp}
                    </div>

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
                         <p className="text-xs font-bold mb-1">{t('pay_received')}</p>
                         <p className="text-xs text-gray-700 leading-relaxed">
                           PlastiXide Payment Confirmed: <br/>
                           <span className="font-bold">৳{lastTx.amount}</span> sent to your account.<br/>
                           Type: <span className="font-bold">{lastTx.plasticType}</span><br/>
                           Weight: <span className="font-bold">{lastTx.weight}kg</span><br/>
                           Location: {lastTx.location}.
                         </p>
                         <div className="mt-2 pt-1 border-t border-gray-200/50">
                             <span className="text-[9px] text-gray-500 font-mono">To: {lastTx.userPhone}</span>
                         </div>
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
                <p className="text-sm text-gray-500 font-medium">
                   Automated SMS Triggered to <span className="text-brand-dark font-bold">{lastTx.userPhone}</span>
                </p>
                <Button onClick={() => setShowSuccess(false)} size="sm" variant="outline">
                   {t('start_new')}
                </Button>
              </div>
            </div>
          )}

          <Card title={t('new_entry')}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-end mb-1">
                <label className="text-xs font-bold text-gray-500 uppercase">{t('select_collector')}</label>
                <button 
                  type="button" 
                  onClick={() => setShowRegisterModal(true)}
                  className="text-[10px] font-bold text-brand-blue bg-blue-50 px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-100 transition-colors"
                >
                  <UserPlus size={12} />
                  {t('register_new')}
                </button>
              </div>
              
              <div>
                <select 
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-brand-blue transition-colors appearance-none cursor-pointer"
                  required
                >
                  <option value="">-- {t('select_collector')} --</option>
                  {registeredUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} (ID: {user.id}) - {user.phone}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Plastic Type</label>
                  <div className="relative">
                    <select 
                      value={plasticType}
                      onChange={(e) => setPlasticType(e.target.value)}
                      className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-brand-blue transition-colors appearance-none cursor-pointer text-sm font-bold"
                      required
                    >
                      {PLASTIC_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t('weight_kg')}</label>
                  <div className="relative">
                    <input 
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-brand-blue transition-colors text-xl font-mono font-bold"
                      placeholder="0.0"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">kg</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-green-100">
                <div>
                  <p className="text-xs text-green-700">{t('calc_payment')}</p>
                  <p className="font-bold text-brand-green text-xl">৳ {handleCalculate()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Rate: ৳{pricePerKg}/kg</p>
                  <button type="button" onClick={() => setPricePerKg(pricePerKg + 1)} className="text-xs text-blue-500 underline">{t('edit_rate')}</button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{t('photo')}</label>
                <div className="flex gap-3">
                  {!proofImage ? (
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 bg-white transition-colors"
                    >
                      <Camera size={20} />
                      <span className="text-sm">Capture / Upload Proof</span>
                    </button>
                  ) : (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 group">
                      <img src={proofImage} alt="Proof" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setProofImage(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 text-center">
                        Proof Attached
                      </div>
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
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full" 
                  isLoading={loading}
                  disabled={!selectedUser || !weight}
                >
                  {loading ? (
                    <span className="text-xs">
                      {t('sending_sms')}
                    </span>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      {t('confirm_pay_sms')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Directory */}
        <div className="lg:col-span-1">
           <Card title={t('directory')} className="h-full max-h-[600px] flex flex-col">
             <div className="mb-3 relative">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                 type="text" 
                 placeholder={t('search_placeholder')} 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-9 pr-3 py-2 bg-white rounded-lg text-sm border border-gray-100 focus:border-brand-blue outline-none"
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

      {/* Register New User Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-lg relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2 sticky top-0 bg-white z-10 pb-2">
              <UserPlus className="text-brand-blue" size={24} />
              {t('new_coll_reg')}
            </h3>

            <form onSubmit={handleRegisterUser} className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <h4 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2"><UserCheck size={16} /> {t('personal_info')}</h4>
                <div className="grid grid-cols-2 gap-3">
                   <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Full Name</label>
                    <input type="text" required value={newCollector.name} onChange={(e) => setNewCollector({...newCollector, name: e.target.value})}
                      className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none text-sm" placeholder="e.g. Abdul Karim" />
                   </div>
                   <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Phone Number</label>
                    <input type="tel" required value={newCollector.phone} onChange={(e) => setNewCollector({...newCollector, phone: e.target.value})}
                      className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none text-sm" placeholder="017..." />
                   </div>
                   <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Emergency Contact</label>
                    <input type="tel" value={newCollector.emergencyContact} onChange={(e) => setNewCollector({...newCollector, emergencyContact: e.target.value})}
                      className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none text-sm" />
                   </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Role & Zone</label>
                <div className="flex gap-3 mb-3">
                  <button type="button" onClick={() => setNewCollector({...newCollector, type: 'Fisherman'})}
                    className={`flex-1 p-3 rounded-xl border text-sm font-semibold transition-all ${newCollector.type === 'Fisherman' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}>Fisherman</button>
                  <button type="button" onClick={() => setNewCollector({...newCollector, type: 'Hawker'})}
                    className={`flex-1 p-3 rounded-xl border text-sm font-semibold transition-all ${newCollector.type === 'Hawker' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-white border-gray-200 text-gray-500'}`}>Hawker</button>
                </div>
                <input type="text" placeholder="Fishing Area / Working Zone" className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none text-sm"
                  value={newCollector.zone} onChange={e => setNewCollector({...newCollector, zone: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">NID Number</label>
                   <input type="text" required value={newCollector.nid} onChange={(e) => setNewCollector({...newCollector, nid: e.target.value})}
                     className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none text-sm" />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">bKash / Nagad</label>
                   <input type="text" value={newCollector.bkash} onChange={(e) => setNewCollector({...newCollector, bkash: e.target.value})}
                     className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none text-sm" placeholder="Wallet No." />
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Bank Account (Opt)</label>
                   <input type="text" value={newCollector.bankAccount} onChange={(e) => setNewCollector({...newCollector, bankAccount: e.target.value})}
                     className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none text-sm" placeholder="Acct No." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                 <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50">
                    <CreditCard size={20} />
                    <span className="text-[10px] mt-1">{t('upload_nid')}</span>
                 </div>
                 <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50">
                    <Camera size={20} />
                    <span className="text-[10px] mt-1">{t('live_photo')}</span>
                 </div>
              </div>

              <Button type="submit" className="w-full mt-2 py-3 shadow-lg shadow-blue-200">
                {t('reg_select')}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
