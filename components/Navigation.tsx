import React from 'react';
import { Home, Scan, ShoppingBag, User, BarChart3, Wallet, Archive } from 'lucide-react';
import { UserRole } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onMenuToggle?: () => void;
  logoUrl?: string | null;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, userRole }) => {
  // Dynamic Nav Items based on Role
  const isCitizenOrFisherman = userRole === UserRole.CITIZEN || userRole === UserRole.FISHERMAN;
  
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe pt-2 px-4 z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'dashboard' ? 'text-brand-green' : 'text-gray-400'}`}
        >
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* Role Specific Center Button */}
        {isCitizenOrFisherman ? (
          <button 
            onClick={() => setActiveTab('scan')}
            className="relative -top-6 bg-brand-green text-white p-4 rounded-full shadow-lg shadow-emerald-200 hover:scale-105 transition-transform"
          >
            <Scan size={28} />
          </button>
        ) : (
           // For Collection Centers/Corp, show Analytics or Stats in middle
           <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'analytics' ? 'text-brand-green' : 'text-gray-400'}`}
           >
            <BarChart3 size={24} />
            <span className="text-[10px] font-medium">Stats</span>
           </button>
        )}

        {/* Right Side Icons */}
        {isCitizenOrFisherman ? (
           <button 
             onClick={() => setActiveTab('marketplace')}
             className={`flex flex-col items-center space-y-1 ${activeTab === 'marketplace' ? 'text-brand-green' : 'text-gray-400'}`}
           >
             <ShoppingBag size={24} />
             <span className="text-[10px] font-medium">Rewards</span>
           </button>
        ) : (
            <button 
            onClick={() => setActiveTab('wallet')} // Corporate/Admin mobile wallet access
            className={`flex flex-col items-center space-y-1 ${activeTab === 'wallet' ? 'text-brand-green' : 'text-gray-400'}`}
          >
            <Wallet size={24} />
            <span className="text-[10px] font-medium">Wallet</span>
          </button>
        )}
        
        {isCitizenOrFisherman && (
          <button 
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'wallet' ? 'text-brand-green' : 'text-gray-400'}`}
          >
            <Wallet size={24} />
            <span className="text-[10px] font-medium">Wallet</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const DesktopSidebar: React.FC<NavigationProps> = ({ activeTab, setActiveTab, userRole, logoUrl }) => {
  const getNavItems = () => {
    const common = [
      { id: 'dashboard', icon: Home, label: 'Dashboard' },
    ];

    if (userRole === UserRole.CITIZEN || userRole === UserRole.FISHERMAN) {
      return [
        ...common,
        { id: 'scan', icon: Scan, label: 'Smart Exchange' },
        { id: 'marketplace', icon: ShoppingBag, label: 'Rewards Market' },
        { id: 'wallet', icon: Wallet, label: 'My Wallet' },
      ];
    }
    
    if (userRole === UserRole.COLLECTION_CENTER) {
      return [
        ...common,
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'inventory', icon: Archive, label: 'Inventory' },
      ];
    }

    if (userRole === UserRole.CORPORATE) {
      return [
        ...common,
        { id: 'marketplace', icon: ShoppingBag, label: 'Buy Plastic' },
        { id: 'analytics', icon: BarChart3, label: 'Impact Reports' },
        { id: 'wallet', icon: Wallet, label: 'Corporate Wallet' },
      ];
    }

    if (userRole === UserRole.ADMIN) {
      return [
        { id: 'analytics', icon: BarChart3, label: 'Console' },
        { id: 'wallet', icon: Wallet, label: 'Platform Finance' },
      ];
    }

    return common;
  };

  const items = getNavItems();

  return (
    <div className="hidden md:flex flex-col w-64 bg-white h-screen border-r border-gray-200 fixed left-0 top-0 p-6 z-50">
      <div className="flex items-center gap-3 mb-10">
        {logoUrl ? (
          <img src={logoUrl} alt="App Logo" className="w-10 h-10 rounded-xl object-contain bg-white shadow-sm border border-gray-100" />
        ) : (
          <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-200">P</div>
        )}
        <div>
          <h1 className="font-heading font-bold text-brand-dark text-xl">PlastiXide</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{userRole.replace('_', ' ')}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-brand-green/10 text-brand-green font-semibold shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="mt-auto p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100">
        <h4 className="text-brand-blue font-bold text-sm mb-1">Eco Tip 💡</h4>
        <p className="text-xs text-blue-700/80 leading-relaxed">
          Did you know? 1 ton of recycled plastic saves 5,774 kWh of energy.
        </p>
      </div>
    </div>
  );
};