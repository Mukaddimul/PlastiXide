
import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from './ui/Card';
import { MOCK_CHART_DATA, MOCK_MAP_POINTS, MOCK_REGISTERED_FISHERMEN } from '../constants';
import { Users, Truck, Archive, TrendingUp, Settings, Trash2, Power, Upload, Image as ImageIcon, AlertTriangle, Phone, UserCircle, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PIE_DATA = [
  { name: 'PET Bottles', value: 400 },
  { name: 'HDPE', value: 300 },
  { name: 'LDPE', value: 300 },
  { name: 'Other', value: 200 },
];

const COLORS = ['#2ECC71', '#1A73E8', '#F1C40F', '#95A5A6'];

interface DashboardAdminProps {
  currentLogo?: string | null;
  onUpdateLogo?: (logo: string | null) => void;
  liveTransactions?: any[];
  readOnly?: boolean;
}

// Mock Users List for Management
const MOCK_USERS_LIST = [
  { id: 1, name: 'Rahim Uddin', role: 'Fisherman', status: 'Active', points: 450 },
  { id: 2, name: 'Sarah Khan', role: 'Citizen', status: 'Active', points: 120 },
  { id: 3, name: 'Green Hub 1', role: 'Collection Center', status: 'Active', points: 0 },
  { id: 4, name: 'Bad Actor', role: 'Citizen', status: 'Banned', points: 0 },
];

export const DashboardAdmin: React.FC<DashboardAdminProps> = ({ currentLogo, onUpdateLogo, liveTransactions = [], readOnly = false }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'fishermen' | 'infra' | 'settings'>('overview');
  
  // Local state for management simulation
  const [users, setUsers] = useState(MOCK_USERS_LIST);
  const [machines, setMachines] = useState(MOCK_MAP_POINTS.filter(p => p.type === 'MACHINE'));
  const fileInputRef = useRef<HTMLInputElement>(null);

  // -- Handlers --

  const toggleUserStatus = (id: number) => {
    if (readOnly) return;
    setUsers(prev => prev.map(u => {
      if (u.id === id) return { ...u, status: u.status === 'Active' ? 'Banned' : 'Active' };
      return u;
    }));
  };

  const deleteMachine = (id: string) => {
    if (readOnly) return;
    if (confirm('Are you sure you want to remove this machine?')) {
      setMachines(prev => prev.filter(m => m.id !== id));
    }
  };

  const toggleMachineStatus = (id: string) => {
    if (readOnly) return;
    setMachines(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'ONLINE' ? 'MAINTENANCE' : 'ONLINE';
        return { ...m, status: nextStatus as any };
      }
      return m;
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpdateLogo) {
      // Check file size (Limit to 1.5MB for localStorage safety)
      if (file.size > 1.5 * 1024 * 1024) {
        alert("File is too large! Please upload an image smaller than 1.5MB to ensure it saves permanently.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // -- Renderers --

  const renderOverview = () => (
    <div className="animate-fade-in space-y-6">
       {/* KPI Cards */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('total_users'), val: '12.5k', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: t('machines'), val: `${machines.length}`, icon: Archive, color: 'text-green-600', bg: 'bg-green-50' },
          { label: t('collection'), val: '8.2t', icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: t('growth'), val: '+14%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, idx) => (
          <Card key={idx} className="flex flex-col items-center justify-center text-center py-6">
            <div className={`${stat.bg} p-3 rounded-full mb-2`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <h3 className="text-2xl font-bold text-brand-dark">{stat.val}</h3>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Feed - Takes up 1/3 on large screens */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-bold text-gray-800 flex items-center gap-2">
              <Activity size={18} className="text-red-500 animate-pulse" />
              {t('live_disbursements')}
            </h3>
            <span className="text-xs text-gray-500">{liveTransactions.length} {t('today')}</span>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-[350px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
             {liveTransactions.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center p-4">
                 <Truck size={32} className="mb-2 opacity-20" />
                 <p className="text-xs">{t('waiting_tx')}</p>
               </div>
             ) : (
               liveTransactions.map((tx, idx) => (
                 <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 animate-fade-in relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${tx.location === 'Home Pickup Request' ? 'bg-orange-500' : 'bg-brand-blue'}`}></div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-xs text-gray-800">{tx.userName}</span>
                      <span className={`text-[10px] px-1.5 rounded font-bold ${
                        tx.location === 'Home Pickup Request' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {tx.location === 'Home Pickup Request' ? 'REQUEST' : 'PAID'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                       <span className="font-mono">{tx.userId}</span>
                       <span>•</span>
                       <span>{tx.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-1">
                      <span className="text-xs font-semibold text-gray-600">{tx.weight} kg</span>
                      <span className="text-sm font-bold text-brand-blue">৳ {tx.amount}</span>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>

        {/* Charts - Takes up 2/3 on large screens */}
        <div className="lg:col-span-2 space-y-6">
           <Card title={t('collection_trends')}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                  <Bar dataKey="kgCollected" fill="#2ECC71" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title={t('plastic_dist')}>
             <div className="h-48 flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={PIE_DATA}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {PIE_DATA.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                   <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                 </PieChart>
               </ResponsiveContainer>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderFishermen = () => (
    <div className="space-y-6 animate-fade-in">
      <Card title={t('reg_fishermen')}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">{t('personal_info')}</th>
                <th className="p-3">{t('scan_type')}</th>
                <th className="p-3">{t('placeholder_creds').split('/')[0].trim()}</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_REGISTERED_FISHERMEN.map(f => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono text-xs font-bold text-gray-400">{f.id}</td>
                  <td className="p-3 font-medium text-gray-800 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center text-xs font-bold">
                      {f.name.charAt(0)}
                    </div>
                    {f.name}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[10px] border ${
                      f.type === 'Fisherman' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-orange-50 border-orange-200 text-orange-600'
                    }`}>
                      {f.type}
                    </span>
                  </td>
                  <td className="p-3 font-mono flex items-center gap-2">
                    <Phone size={12} className="text-gray-400" />
                    {f.phone}
                  </td>
                  <td className="p-3 text-right">
                     <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">{t('verified')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={t('recent_payouts')}>
         <div className="overflow-x-auto">
            {liveTransactions.length === 0 ? (
               <div className="p-6 text-center text-gray-400 text-sm">No recent payment transactions recorded today.</div>
            ) : (
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Collector Name</th>
                    <th className="p-3">Collector ID</th>
                    <th className="p-3">Weight</th>
                    <th className="p-3 text-right">Paid Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {liveTransactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-mono text-xs">{tx.timestamp}</td>
                      <td className="p-3 font-bold text-gray-800">{tx.userName}</td>
                      <td className="p-3 font-mono text-xs text-gray-500">{tx.userId}</td>
                      <td className="p-3">{tx.weight} kg</td>
                      <td className="p-3 text-right font-bold text-brand-blue">৳ {tx.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
         </div>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <Card title={t('user_mgmt')} className="animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Points</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 font-medium text-gray-800">{u.name}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-[10px] border ${
                    u.role === 'Fisherman' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                    u.role === 'Collection Center' ? 'bg-orange-50 border-orange-200 text-orange-600' :
                    'bg-gray-50 border-gray-200 text-gray-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3 font-mono">{u.points}</td>
                <td className="p-3">
                   <span className={`font-bold text-xs ${u.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                     {u.status === 'Active' ? t('active') : t('banned')}
                   </span>
                </td>
                <td className="p-3 text-right">
                   {!readOnly && (
                     <button 
                      onClick={() => toggleUserStatus(u.id)}
                      className={`text-xs font-semibold underline ${u.status === 'Active' ? 'text-red-500' : 'text-green-500'}`}
                     >
                       {u.status === 'Active' ? t('ban_user') : t('activate')}
                     </button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderInfra = () => (
    <div className="space-y-6 animate-fade-in">
      <Card title={t('infra_control')} className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {machines.map(m => (
            <div key={m.id} className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between bg-white hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-brand-dark">{m.name}</h4>
                  <p className="text-xs text-gray-500">{m.address}</p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 ${
                  m.status === 'ONLINE' ? 'bg-green-100 text-green-700' : 
                  m.status === 'MAINTENANCE' ? 'bg-orange-100 text-orange-700' : 
                  'bg-red-100 text-red-700'
                }`}>
                  {m.status === 'MAINTENANCE' && <AlertTriangle size={10} />}
                  {m.status === 'ONLINE' ? t('status_online') : m.status === 'MAINTENANCE' ? t('status_maintenance') : t('status_full')}
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
                <button 
                  onClick={() => toggleMachineStatus(m.id)}
                  disabled={readOnly}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Power size={14} />
                  {m.status === 'ONLINE' ? t('set_maint') : t('set_online')}
                </button>
                <button 
                  onClick={() => deleteMachine(m.id)}
                  disabled={readOnly}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <Card title={t('branding')}>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Logo Preview */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-32 h-32 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group bg-pattern">
              {currentLogo ? (
                <img src={currentLogo} alt="App Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <ImageIcon className="text-gray-400" size={40} />
              )}
            </div>
            <p className="text-xs text-gray-400">Recommended: 512x512 PNG</p>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('upload_logo')}</label>
              <div className="flex gap-3 items-center">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={readOnly}
                  className="bg-brand-blue text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={16} />
                  {t('upload_logo')}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleLogoUpload}
                />
                {currentLogo && (
                   <button 
                   onClick={() => onUpdateLogo && onUpdateLogo(null)}
                   disabled={readOnly}
                   className="px-4 py-2 border border-red-200 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {t('reset_default')}
                 </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                This logo will be instantly updated across the <strong>Mobile App Header</strong>, <strong>Desktop Sidebar</strong>, and <strong>Login Screen</strong> for all users.
              </p>
            </div>

            <hr className="border-gray-100" />

            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">{t('maint_mode')}</label>
               <div className="flex items-center gap-3">
                 <div className="w-12 h-6 bg-gray-200 rounded-full p-1 cursor-pointer transition-colors hover:bg-gray-300">
                   <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                 </div>
                 <span className="text-sm text-gray-500">Off (Normal Operation)</span>
               </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  // -- Main Render --

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <header className="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800">{readOnly ? t('center_analytics') : t('admin_console')}</h2>
          <p className="text-gray-500">{readOnly ? t('view_only') : t('master_control')}</p>
        </div>
        
        {/* Admin Nav Tabs */}
        <div className="bg-white p-1 rounded-xl shadow-sm inline-flex border border-gray-200 overflow-x-auto max-w-full">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'fishermen', label: 'Fishermen', icon: UserCircle },
            { id: 'users', label: 'App Users', icon: Users },
            { id: 'infra', label: 'Infrastructure', icon: Archive },
            !readOnly && { id: 'settings', label: 'Settings', icon: Settings },
          ].filter(Boolean).map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-brand-dark text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'fishermen' && renderFishermen()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'infra' && renderInfra()}
      {activeTab === 'settings' && !readOnly && renderSettings()}
    </div>
  );
};
