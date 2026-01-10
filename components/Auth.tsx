import React, { useState, useRef } from 'react';
import { UserRole } from '../types.ts';
import { Button } from './ui/Button.tsx';
import { Card } from './ui/Card.tsx';
import { Upload, User, Building, MapPin, Briefcase, FileText, Camera, ArrowRight, ArrowLeft, Languages, Image as ImageIcon, X, Map, Phone, Mail, Globe, ChevronDown, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { MapView } from './Map.tsx';
import { supabase } from '../services/supabase.ts';

interface AuthProps {
  onLogin: (role: UserRole, name: string) => void;
  logoUrl?: string | null;
}

type AuthMode = 'LOGIN' | 'REGISTER_ROLE_SELECT' | 'REGISTER_FORM';

const COUNTRIES = ["Bangladesh", "United States", "India", "United Kingdom", "Canada"];

export const Auth: React.FC<AuthProps> = ({ onLogin, logoUrl }) => {
  const { t, language, setLanguage } = useLanguage();
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Public View States
  const [showPublicMap, setShowPublicMap] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Login State
  const [loginCreds, setLoginCreds] = useState({ identifier: '', password: '' });

  // Registration States
  const [citizenData, setCitizenData] = useState({
    fullName: '', phone: '', email: '', dob: '', gender: 'Male',
    address: '', city: '', country: 'Bangladesh', nid: '', password: '', pin: ''
  });

  const [corpData, setCorpData] = useState({
    companyName: '', type: 'Recycling', contactPerson: '', email: '', phone: '',
    licenseNo: '', website: '', industry: '', address: '', country: 'Bangladesh', plasticReq: '', voucherOption: 'Yes', password: ''
  });

  const [centerData, setCenterData] = useState({
    fullName: '', centerName: '', location: '', country: 'Bangladesh', phone: '', email: '',
    designation: 'Manager', workingHours: '', nid: '', password: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = loginCreds.identifier.includes('@') 
      ? loginCreds.identifier 
      : `${loginCreds.identifier}@plastixide.internal`;

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: loginCreds.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let email = '';
    let password = '';
    let metadata = {};

    if (role === UserRole.CITIZEN) {
      email = citizenData.email || `${citizenData.phone}@plastixide.internal`;
      password = citizenData.password;
      metadata = { full_name: citizenData.fullName, role, phone: citizenData.phone };
    } else if (role === UserRole.CORPORATE) {
      email = corpData.email;
      password = corpData.password;
      metadata = { full_name: corpData.companyName, role, phone: corpData.phone };
    } else if (role === UserRole.COLLECTION_CENTER) {
      email = centerData.email;
      password = centerData.password;
      metadata = { full_name: centerData.centerName, role, phone: centerData.phone };
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Create profile record
      await supabase.from('profiles').insert([{
        id: data.user.id,
        name: (metadata as any).full_name,
        role: role,
        phone: (metadata as any).phone,
        points: 0,
        wallet_balance: 0,
        total_plastic_recycled: 0,
        impact_score: 0
      }]);
    }
    
    setLoading(false);
  };

  const renderCountrySelect = (value: string, onChange: (val: string) => void) => (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
        <Globe size={10} /> Country
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-green transition-all appearance-none cursor-pointer hover:bg-gray-50"
        >
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><ChevronDown size={14} /></div>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="space-y-6 animate-fade-in">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('placeholder_creds')}</label>
          <input 
            type="text" required
            value={loginCreds.identifier}
            onChange={(e) => setLoginCreds({...loginCreds, identifier: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-brand-green outline-none transition-all"
            placeholder="Phone or Email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('placeholder_pass')}</label>
          <input 
            type="password" required
            value={loginCreds.password}
            onChange={(e) => setLoginCreds({...loginCreds, password: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-brand-green outline-none transition-all"
            placeholder="••••••"
          />
        </div>
        <Button type="submit" className="w-full py-4" isLoading={loading}>{t('btn_login')}</Button>
        <p className="text-center text-sm text-gray-500">
          {t('dont_have_account')} <button type="button" onClick={() => setMode('REGISTER_ROLE_SELECT')} className="text-brand-green font-bold hover:underline">{t('btn_register_now')}</button>
        </p>
      </form>
      <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
        <button onClick={() => setShowPublicMap(true)} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-blue-50 text-brand-blue hover:bg-blue-100 border border-blue-100"><Map size={24} /><span className="text-xs font-bold">{t('find_locations')}</span></button>
        <button onClick={() => setShowContact(true)} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-green-50 text-brand-green hover:bg-green-100 border border-green-100"><Phone size={24} /><span className="text-xs font-bold">{t('contact_us')}</span></button>
      </div>
    </div>
  );

  const renderRoleSelect = () => (
    <div className="space-y-4 animate-fade-in">
      <button onClick={() => setMode('LOGIN')} className="text-sm text-gray-400 flex items-center gap-1 mb-4"><ArrowLeft size={14} /> {t('back_login')}</button>
      <h2 className="font-heading font-bold text-xl text-center mb-6">{t('register_title')}</h2>
      <button onClick={() => { setRole(UserRole.CITIZEN); setMode('REGISTER_FORM'); }} className="w-full p-4 rounded-xl border border-gray-200 hover:border-brand-green hover:bg-emerald-50 transition-all flex items-center gap-4 group bg-white text-left">
        <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full group-hover:bg-emerald-200">👤</div>
        <div><h3 className="font-bold text-brand-dark">{t('role_citizen')}</h3><p className="text-xs text-gray-500">Collect plastic, earn points & rewards</p></div>
      </button>
      <button onClick={() => { setRole(UserRole.CORPORATE); setMode('REGISTER_FORM'); }} className="w-full p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center gap-4 group bg-white text-left">
        <div className="bg-purple-100 text-purple-600 p-3 rounded-full group-hover:bg-purple-200">🏢</div>
        <div><h3 className="font-bold text-brand-dark">{t('role_corporate')}</h3><p className="text-xs text-gray-500">Buy plastic, CSR & vouchers</p></div>
      </button>
      <button onClick={() => { setRole(UserRole.COLLECTION_CENTER); setMode('REGISTER_FORM'); }} className="w-full p-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center gap-4 group bg-white text-left">
        <div className="bg-orange-100 text-orange-600 p-3 rounded-full group-hover:bg-orange-200">🏭</div>
        <div><h3 className="font-bold text-brand-dark">{t('role_center')}</h3><p className="text-xs text-gray-500">Apply to become a hub agent</p></div>
      </button>
    </div>
  );

  const renderCitizenForm = () => (
    <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
      <h3 className="font-heading font-bold text-lg text-emerald-600">Citizen Registration</h3>
      {error && <div className="text-red-500 text-xs">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Full Name</label><input type="text" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" value={citizenData.fullName} onChange={e => setCitizenData({...citizenData, fullName: e.target.value})} placeholder="e.g. Sarah Khan" /></div>
        <div><label className="text-xs font-bold text-gray-500 uppercase">Phone</label><input type="tel" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" value={citizenData.phone} onChange={e => setCitizenData({...citizenData, phone: e.target.value})} placeholder="017..." /></div>
        <div><label className="text-xs font-bold text-gray-500 uppercase">Email (Optional)</label><input type="email" className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" value={citizenData.email} onChange={e => setCitizenData({...citizenData, email: e.target.value})} /></div>
        <div className="col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Set Password</label><input type="password" required className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" value={citizenData.password} onChange={e => setCitizenData({...citizenData, password: e.target.value})} placeholder="••••••" /></div>
      </div>
      <Button type="submit" className="w-full" isLoading={loading}>{t('btn_register')}</Button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in flex flex-col items-center">
          {logoUrl ? <img src={logoUrl} alt="Logo" className="w-32 h-32 object-contain mb-4 filter drop-shadow-xl" /> : <div className="w-20 h-20 bg-brand-green rounded-2xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-xl">P</div>}
          <h1 className="font-heading font-bold text-3xl text-brand-dark">{t('appName')}</h1>
          <p className="text-gray-500">{t('tagline')}</p>
        </div>
        <Card className="shadow-2xl border-0">
          {mode === 'LOGIN' && renderLogin()}
          {mode === 'REGISTER_ROLE_SELECT' && renderRoleSelect()}
          {mode === 'REGISTER_FORM' && role === UserRole.CITIZEN && renderCitizenForm()}
        </Card>
      </div>
    </div>
  );
};