
import React, { useState, useRef } from 'react';
import { UserRole } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Upload, User, Building, MapPin, Briefcase, FileText, Camera, ArrowRight, ArrowLeft, Languages, Image as ImageIcon, X, Map, Phone, Mail, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MapView } from './Map';

interface AuthProps {
  onLogin: (role: UserRole, name: string) => void;
  logoUrl?: string | null;
}

type AuthMode = 'LOGIN' | 'REGISTER_ROLE_SELECT' | 'REGISTER_FORM';

const COUNTRIES = [
  "Bangladesh", "United States", "United Kingdom", "Canada", "Australia", "India", 
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

export const Auth: React.FC<AuthProps> = ({ onLogin, logoUrl }) => {
  const { t, language, setLanguage } = useLanguage();
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [loading, setLoading] = useState(false);

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
    licenseNo: '', website: '', industry: '', address: '', country: 'Bangladesh', plasticReq: '', voucherOption: 'Yes'
  });

  const [centerData, setCenterData] = useState({
    fullName: '', centerName: '', location: '', country: 'Bangladesh', phone: '', email: '',
    designation: 'Manager', workingHours: '', nid: ''
  });

  // Photo Upload State
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      // Mock Login for all roles including Admin
      const name = role === UserRole.ADMIN ? 'System Admin' : 'Demo User';
      onLogin(role, name);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Sub-components for Forms ---

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
          {COUNTRIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="space-y-6 animate-fade-in">
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('role_select')}</label>
          <div className="relative">
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-brand-green appearance-none cursor-pointer"
            >
              <option value={UserRole.CITIZEN}>{t('role_citizen')}</option>
              <option value={UserRole.FISHERMAN}>{t('role_fisherman')}</option>
              <option value={UserRole.COLLECTION_CENTER}>{t('role_center')}</option>
              <option value={UserRole.CORPORATE}>{t('role_corporate')}</option>
              <option value={UserRole.ADMIN}>{t('role_admin')}</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={14} />
            </div>
          </div>
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
      
      {/* Public Finder & Contact Features */}
      <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
        <button 
          onClick={() => setShowPublicMap(true)}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-blue-50 text-brand-blue hover:bg-blue-100 transition-colors border border-blue-100"
        >
          <Map size={24} />
          <span className="text-xs font-bold">{t('find_locations')}</span>
        </button>

        <button 
          onClick={() => setShowContact(true)}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-green-50 text-brand-green hover:bg-green-100 transition-colors border border-green-100"
        >
          <Phone size={24} />
          <span className="text-xs font-bold">{t('contact_us')}</span>
        </button>
      </div>
    </div>
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
        
        {/* Country Select */}
        {renderCountrySelect(citizenData.country, (val) => setCitizenData({...citizenData, country: val}))}

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
           <label className="text-xs font-bold text-gray-500 uppercase">District/City</label>
           <input type="text" className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm" 
             value={citizenData.city} onChange={e => setCitizenData({...citizenData, city: e.target.value})} placeholder="e.g. Dhaka" />
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
           <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-2.5 bg-white rounded-xl border border-gray-200 text-sm flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 overflow-hidden relative h-[46px]"
           >
             {profilePhoto ? (
               <img src={profilePhoto} alt="Profile" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
             ) : (
               <Camera size={16} />
             )}
           </div>
           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/*"
             onChange={handleFileChange}
           />
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
        
        {/* Country Select */}
        {renderCountrySelect(corpData.country, (val) => setCorpData({...corpData, country: val}))}

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

        {/* Country Select */}
        {renderCountrySelect(centerData.country, (val) => setCenterData({...centerData, country: val}))}

        <div>
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

      {/* Public Map Modal */}
      {showPublicMap && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col relative overflow-hidden shadow-2xl">
             <div className="absolute top-4 right-4 z-20">
               <button onClick={() => setShowPublicMap(false)} className="bg-white rounded-full p-2 text-gray-600 shadow hover:text-red-500 transition-colors">
                 <X size={24} />
               </button>
             </div>
             <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-brand-blue">
                  <Map size={20} />
                </div>
                <h2 className="font-heading font-bold text-xl text-gray-800">{t('public_map_title')}</h2>
             </div>
             <div className="flex-1 relative bg-gray-100">
               <MapView />
             </div>
          </div>
        </div>
      )}

      {/* Contact Us Modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-md relative">
             <button 
               onClick={() => setShowContact(false)}
               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
             >
               <X size={20} />
             </button>
             
             <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 text-brand-green rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{t('contact_support')}</h3>
                <p className="text-gray-500 text-sm">We are here to help you 24/7</p>
             </div>

             <div className="space-y-4">
                <a href="tel:+8801876343423" className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-green hover:bg-green-50 transition-all group">
                  <div className="bg-white p-3 rounded-full text-brand-green shadow-sm group-hover:scale-110 transition-transform">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">{t('call_us')}</h4>
                    <p className="text-sm text-gray-500">+880 1876-343423</p>
                  </div>
                </a>

                <a href="mailto:plastixide.info@gmail.com" className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-blue hover:bg-blue-50 transition-all group">
                  <div className="bg-white p-3 rounded-full text-brand-blue shadow-sm group-hover:scale-110 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">{t('email_us')}</h4>
                    <p className="text-sm text-gray-500">plastixide.info@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="bg-white p-3 rounded-full text-orange-500 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">{t('visit_office')}</h4>
                    <p className="text-sm text-gray-500">Level 5, PlastiXide Tower, Gulshan 1, Dhaka</p>
                  </div>
                </div>
             </div>
          </Card>
        </div>
      )}
    </div>
  );
};
