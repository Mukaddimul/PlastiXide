
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Upload, User, Building, MapPin, Briefcase, FileText, Camera, ArrowRight, ArrowLeft, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthProps {
  onLogin: (role: UserRole, name: string) => void;
  logoUrl?: string | null;
}

type AuthMode = 'LOGIN' | 'REGISTER_ROLE_SELECT' | 'REGISTER_FORM';

export const Auth: React.FC<AuthProps> = ({ onLogin, logoUrl }) => {
  const { t, language, setLanguage } = useLanguage();
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [loading, setLoading] = useState(false);

  // Login State
  const [loginCreds, setLoginCreds] = useState({ identifier: '', password: '' });

  // Registration States
  const [citizenData, setCitizenData] = useState({
    fullName: '', phone: '', email: '', dob: '', gender: 'Male',
    address: '', city: '', nid: '', password: '', pin: ''
  });

  const [corpData, setCorpData] = useState({
    companyName: '', type: 'Recycling', contactPerson: '', email: '', phone: '',
    licenseNo: '', website: '', industry: '', address: '', plasticReq: '', voucherOption: 'Yes'
  });

  const [centerData, setCenterData] = useState({
    fullName: '', centerName: '', location: '', phone: '', email: '',
    designation: 'Manager', workingHours: '', nid: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // Simulate logic to determine role based on input or selection (mock)
      onLogin(role, 'Demo User');
      setLoading(false);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      let name = '';
      if (role === UserRole.CITIZEN) name = citizenData.fullName;
      if (role === UserRole.CORPORATE) name = corpData.companyName;
      if (role === UserRole.COLLECTION_CENTER) name = centerData.centerName;
      
      onLogin(role, name);
      setLoading(false);
    }, 1500);
  };

  // --- Sub-components for Forms ---

  const renderLogin = () => (
    <form onSubmit={handleLogin} className="space-y-5 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('role_select')}</label>
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-brand-green"
        >
          <option value={UserRole.CITIZEN}>{t('role_citizen')}</option>
          <option value={UserRole.FISHERMAN}>{t('role_fisherman')}</option>
          <option value={UserRole.COLLECTION_CENTER}>{t('role_center')}</option>
          <option value={UserRole.CORPORATE}>{t('role_corporate')}</option>
          <option value={UserRole.ADMIN}>{t('role_admin')}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('placeholder_creds')}</label>
        <input 
          type="text" 
          required
          value={loginCreds.identifier}
          onChange={(e) => setLoginCreds({...loginCreds, identifier: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-brand-green outline-none transition-all"
          placeholder="Enter your credentials"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('placeholder_pass')}</label>
        <input 
          type="password" 
          required
          value={loginCreds.password}
          onChange={(e) => setLoginCreds({...loginCreds, password: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-brand-green outline-none transition-all"
          placeholder="••••••"
        />
      </div>

      <Button type="submit" className="w-full py-4" isLoading={loading}>
        {t('btn_login')}
      </Button>
      
      <p className="text-center text-sm text-gray-500">
        {t('dont_have_account')} <button type="button" onClick={() => setMode('REGISTER_ROLE_SELECT')} className="text-brand-green font-bold hover:underline">{t('btn_register_now')}</button>
      </p>
    </form>
  );

  const renderRoleSelect = () => (
    <div className="space-y-4 animate-fade-in">
      <button onClick={() => setMode('LOGIN')} className="text-sm text-gray-400 flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> {t('back_login')}
      </button>
      <h2 className="font-heading font-bold text-xl text-center mb-6">{t('register_title')}</h2>

      <button onClick={() => { setRole(UserRole.CITIZEN); setMode('REGISTER_FORM'); }} className="w-full p-4 rounded-xl border border-gray-200 hover:border-brand-green hover:bg-emerald-50 transition-all flex items-center gap-4 group text-left bg-white">
        <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full group-hover:bg-emerald-200">👤</div>
        <div>
          <h3 className="font-bold text-brand-dark">{t('role_citizen')}</h3>
          <p className="text-xs text-gray-500">Collect plastic, earn points & rewards</p>
        </div>
      </button>

      <button onClick={() => { setRole(UserRole.CORPORATE); setMode('REGISTER_FORM'); }} className="w-full p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center gap-4 group text-left bg-white">
        <div className="bg-purple-100 text-purple-600 p-3 rounded-full group-hover:bg-purple-200">🏢</div>
        <div>
          <h3 className="font-bold text-brand-dark">{t('role_corporate')}</h3>
          <p className="text-xs text-gray-500">Buy plastic, CSR & vouchers</p>
        </div>
      </button>

      <button onClick={() => { setRole(UserRole.COLLECTION_CENTER); setMode('REGISTER_FORM'); }} className="w-full p-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center gap-4 group text-left bg-white">
        <div className="bg-orange-100 text-orange-600 p-3 rounded-full group-hover:bg-orange-200">🏭</div>
        <div>
          <h3 className="font-bold text-brand-dark">{t('role_center')}</h3>
          <p className="text-xs text-gray-500">Apply to become a hub agent</p>
        </div>
      </button>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mt-4">
        <h4 className="font-bold text-brand-blue text-sm mb-1 flex items-center gap-2">
          <User size={16} /> {t('role_fisherman')}?
        </h4>
        <p className="text-xs text-gray-600">
          Please visit your nearest <strong>PlastiXide Collection Center</strong>. An agent will register you, verify your ID, and issue your collector account.
        </p>
      </div>
    </div>
  );

  const renderCitizenForm = () => (
    <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
      <h3 className="font-heading font-bold text-lg text-emerald-600">Citizen Registration</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
          <input type="text" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
            value={citizenData.fullName} onChange={e => setCitizenData({...citizenData, fullName: e.target.value})} placeholder="e.g. Sarah Khan" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Phone (OTP)</label>
          <input type="tel" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
            value={citizenData.phone} onChange={e => setCitizenData({...citizenData, phone: e.target.value})} placeholder="017..." />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Date of Birth</label>
          <input type="date" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
            value={citizenData.dob} onChange={e => setCitizenData({...citizenData, dob: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Gender</label>
          <select className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm"
            value={citizenData.gender} onChange={e => setCitizenData({...citizenData, gender: e.target.value})}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <div>
           <label className="text-xs font-bold text-gray-500 uppercase">District</label>
           <input type="text" className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
             value={citizenData.city} onChange={e => setCitizenData({...citizenData, city: e.target.value})} placeholder="Dhaka" />
        </div>
        <div className="col-span-2">
           <label className="text-xs font-bold text-gray-500 uppercase">Full Address</label>
           <input type="text" className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
             value={citizenData.address} onChange={e => setCitizenData({...citizenData, address: e.target.value})} placeholder="House / Road / Area" />
        </div>
        <div>
           <label className="text-xs font-bold text-gray-500 uppercase">NID (Optional)</label>
           <input type="text" className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
             value={citizenData.nid} onChange={e => setCitizenData({...citizenData, nid: e.target.value})} placeholder="Number" />
        </div>
        <div>
           <label className="text-xs font-bold text-gray-500 uppercase">Profile Photo</label>
           <div className="w-full p-2.5 bg-white rounded-xl border border-gray-200 text-sm flex items-center justify-center text-gray-400 cursor-pointer">
             <Camera size={16} />
           </div>
        </div>
        <div className="col-span-2">
           <label className="text-xs font-bold text-gray-500 uppercase">Set Password</label>
           <input type="password" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
             value={citizenData.password} onChange={e => setCitizenData({...citizenData, password: e.target.value})} placeholder="••••••" />
        </div>
      </div>

      <Button type="submit" className="w-full" isLoading={loading}>{t('btn_register')}</Button>
    </form>
  );

  const renderCorporateForm = () => (
    <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
      <h3 className="font-heading font-bold text-lg text-purple-600">Corporate Registration</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Company Name</label>
          <input type="text" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
            value={corpData.companyName} onChange={e => setCorpData({...corpData, companyName: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
          <select className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm"
            value={corpData.type} onChange={e => setCorpData({...corpData, type: e.target.value})}>
            <option>Recycling</option><option>CSR Partner</option><option>Retail</option><option>E-commerce</option>
          </select>
        </div>
        <div>
           <label className="text-xs font-bold text-gray-500 uppercase">Trade License</label>
           <input type="text" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
             value={corpData.licenseNo} onChange={e => setCorpData({...corpData, licenseNo: e.target.value})} />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Contact Person</label>
          <input type="text" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
            value={corpData.contactPerson} onChange={e => setCorpData({...corpData, contactPerson: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
          <input type="tel" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
            value={corpData.phone} onChange={e => setCorpData({...corpData, phone: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Plastic Req (kg/mo)</label>
          <input type="number" className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
            value={corpData.plasticReq} onChange={e => setCorpData({...corpData, plasticReq: e.target.value})} />
        </div>
        <div className="col-span-2">
           <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
             <Upload size={12} /> Upload Docs (License, Logo)
           </label>
           <input type="file" className="w-full p-2 bg-white rounded-xl border border-gray-200 text-xs" multiple />
        </div>
      </div>
      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 shadow-purple-200" isLoading={loading}>{t('btn_register')}</Button>
    </form>
  );

  const renderCenterForm = () => (
    <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
      <h3 className="font-heading font-bold text-lg text-orange-600">Collection Center App.</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Center Name</label>
          <input type="text" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
            value={centerData.centerName} onChange={e => setCenterData({...centerData, centerName: e.target.value})} />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Center Location</label>
          <input type="text" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
            value={centerData.location} onChange={e => setCenterData({...centerData, location: e.target.value})} placeholder="District, Area" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Manager Name</label>
          <input type="text" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
            value={centerData.fullName} onChange={e => setCenterData({...centerData, fullName: e.target.value})} />
        </div>
        <div>
           <label className="text-xs font-bold text-gray-500 uppercase">Phone (OTP)</label>
           <input type="tel" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
             value={centerData.phone} onChange={e => setCenterData({...centerData, phone: e.target.value})} />
        </div>
        <div>
           <label className="text-xs font-bold text-gray-500 uppercase">Working Hours</label>
           <input type="text" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
             value={centerData.workingHours} onChange={e => setCenterData({...centerData, workingHours: e.target.value})} placeholder="e.g. 8AM - 8PM" />
        </div>
        <div>
           <label className="text-xs font-bold text-gray-500 uppercase">NID Number</label>
           <input type="text" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
             value={centerData.nid} onChange={e => setCenterData({...centerData, nid: e.target.value})} />
        </div>
      </div>
      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 shadow-orange-200" isLoading={loading}>{t('btn_register')}</Button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light p-4">
      {/* Language Toggle Absolute */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
          className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200 flex items-center gap-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <Languages size={16} />
          {language === 'en' ? 'ENG' : 'বাংলা'}
        </button>
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in flex flex-col items-center">
          {logoUrl ? (
            <img src={logoUrl} alt="PlastiXide Logo" className="w-32 h-32 object-contain mb-4 filter drop-shadow-xl hover:scale-105 transition-transform" />
          ) : (
            <div className="w-20 h-20 bg-brand-green rounded-2xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-xl shadow-emerald-200">
              P
            </div>
          )}
          <h1 className="font-heading font-bold text-3xl text-brand-dark">{t('appName')}</h1>
          <p className="text-gray-500">{t('tagline')}</p>
        </div>

        <Card className="shadow-2xl border-0 relative">
          {mode === 'REGISTER_FORM' && (
            <button onClick={() => setMode('REGISTER_ROLE_SELECT')} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </button>
          )}

          {mode === 'LOGIN' && renderLogin()}
          {mode === 'REGISTER_ROLE_SELECT' && renderRoleSelect()}
          {mode === 'REGISTER_FORM' && role === UserRole.CITIZEN && renderCitizenForm()}
          {mode === 'REGISTER_FORM' && role === UserRole.CORPORATE && renderCorporateForm()}
          {mode === 'REGISTER_FORM' && role === UserRole.COLLECTION_CENTER && renderCenterForm()}

        </Card>
        
        <p className="text-center text-xs text-gray-400 mt-8">
          &copy; 2024 PlastiXide Ecosystem. All rights reserved.
        </p>
      </div>
    </div>
  );
};
