import React, { useState } from 'react';
import { UserRole } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface AuthProps {
  onLogin: (role: UserRole, name: string) => void;
  logoUrl?: string | null;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, logoUrl }) => {
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CITIZEN);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin(selectedRole, name || 'New User');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in flex flex-col items-center">
          {logoUrl ? (
            <img src={logoUrl} alt="PlastiXide Logo" className="w-24 h-24 object-contain mb-4 drop-shadow-xl rounded-2xl bg-white p-2" />
          ) : (
            <div className="w-20 h-20 bg-brand-green rounded-2xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-xl shadow-emerald-200">
              P
            </div>
          )}
          <h1 className="font-heading font-bold text-3xl text-brand-dark">PlastiXide</h1>
          <p className="text-gray-500">Collect. Recycle. Reward.</p>
        </div>

        <Card className="shadow-2xl border-0">
          {step === 'role' ? (
            <div className="space-y-4 animate-fade-in">
              <h2 className="font-heading font-semibold text-xl text-center mb-6">Choose your account type</h2>
              
              <button onClick={() => handleRoleSelect(UserRole.CITIZEN)} className="w-full p-4 rounded-xl border border-gray-200 hover:border-brand-green hover:bg-emerald-50 transition-all flex items-center gap-4 group text-left">
                <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full group-hover:bg-emerald-200">👤</div>
                <div>
                  <h3 className="font-bold text-brand-dark">Citizen Recycler</h3>
                  <p className="text-xs text-gray-500">Earn points for recycling plastic</p>
                </div>
              </button>

              <button onClick={() => handleRoleSelect(UserRole.FISHERMAN)} className="w-full p-4 rounded-xl border border-gray-200 hover:border-brand-blue hover:bg-blue-50 transition-all flex items-center gap-4 group text-left">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full group-hover:bg-blue-200">🎣</div>
                <div>
                  <h3 className="font-bold text-brand-dark">Fisherman</h3>
                  <p className="text-xs text-gray-500">Get paid for river cleanups</p>
                </div>
              </button>

              <button onClick={() => handleRoleSelect(UserRole.COLLECTION_CENTER)} className="w-full p-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center gap-4 group text-left">
                <div className="bg-orange-100 text-orange-600 p-3 rounded-full group-hover:bg-orange-200">🏭</div>
                <div>
                  <h3 className="font-bold text-brand-dark">Collection Center</h3>
                  <p className="text-xs text-gray-500">Manage staff and inventory</p>
                </div>
              </button>

              <button onClick={() => handleRoleSelect(UserRole.CORPORATE)} className="w-full p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center gap-4 group text-left">
                <div className="bg-purple-100 text-purple-600 p-3 rounded-full group-hover:bg-purple-200">🏢</div>
                <div>
                  <h3 className="font-bold text-brand-dark">Corporate Partner</h3>
                  <p className="text-xs text-gray-500">Buy plastic and view CSR</p>
                </div>
              </button>
              
              <div className="text-center mt-4">
                <button onClick={() => handleRoleSelect(UserRole.ADMIN)} className="text-xs text-gray-400 hover:text-gray-600 underline">
                  Admin Login
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-6">
                <button type="button" onClick={() => setStep('role')} className="text-gray-400 hover:text-brand-dark">← Back</button>
                <h2 className="font-heading font-semibold text-xl ml-auto mr-auto">Login Details</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                  placeholder="+880 1XXX XXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>

              <Button type="submit" className="w-full py-4" isLoading={loading}>
                {loading ? 'Verifying...' : 'Send OTP'}
              </Button>

              <p className="text-center text-xs text-gray-400">
                By continuing, you agree to our Terms of Service & Privacy Policy.
              </p>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};