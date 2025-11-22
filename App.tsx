import React, { useState, useEffect } from 'react';
import { Navigation, DesktopSidebar } from './components/Navigation';
import { DashboardCitizen } from './components/DashboardCitizen';
import { SmartScanner } from './components/SmartScanner';
import { Marketplace } from './components/Marketplace';
import { DashboardAdmin } from './components/DashboardAdmin';
import { CollectionCenterPortal } from './components/CollectionCenterPortal';
import { CorporatePortal } from './components/CorporatePortal';
import { Wallet } from './components/Wallet';
import { Auth } from './components/Auth';
import { UserRole, User, Transaction } from './types';
import { LogOut } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Shared State for Admin Monitoring
  // In a real app, this would come from a websocket or backend polling
  const [liveTransactions, setLiveTransactions] = useState<any[]>([]);

  // Global App Settings State with Persistence
  const [appLogo, setAppLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('plastixide_app_logo');
    }
    return null;
  });

  // Update Logo Handler with Persistence
  const handleUpdateLogo = (newLogo: string | null) => {
    setAppLogo(newLogo);
    if (newLogo) {
      localStorage.setItem('plastixide_app_logo', newLogo);
    } else {
      localStorage.removeItem('plastixide_app_logo');
    }
  };

  // Handlers
  const handleLogin = (role: UserRole, name: string) => {
    setCurrentUser({
      id: 'u1',
      name: name,
      role: role,
      points: 1250,
      walletBalance: 50000, // Higher default balance for corporate demo
      totalPlasticRecycled: 24.5,
      impactScore: 85,
      phone: '01700000000'
    });
    setIsAuthenticated(true);
    setActiveTab(role === UserRole.ADMIN ? 'analytics' : 'dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleScanComplete = (pointsEarned: number) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? ({
      ...prev,
      points: prev.points + pointsEarned,
      totalPlasticRecycled: prev.totalPlasticRecycled + (pointsEarned / 1000), // g to kg roughly
      impactScore: prev.impactScore + 1
    }) : null);
    alert(`Successfully recycled! Earned ${pointsEarned} points.`);
    setActiveTab('wallet'); // Go to wallet to see points
  };

  const handleRedeem = (cost: number) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? ({
      ...prev,
      points: prev.points - cost
    }) : null);
    alert('Voucher redeemed successfully! Check your email.');
  };

  // Callback for Collection Center to push data to Admin
  const handleCenterTransaction = (data: any) => {
    setLiveTransactions(prev => [data, ...prev]);
  };

  // View Router
  const renderView = () => {
    if (!currentUser) return null;

    // Admin Views
    if (currentUser.role === UserRole.ADMIN) {
        if (activeTab === 'wallet') return <Wallet user={currentUser} />;
        return <DashboardAdmin 
          currentLogo={appLogo} 
          onUpdateLogo={handleUpdateLogo} 
          liveTransactions={liveTransactions}
        />;
    }

    // Collection Center Views
    if (currentUser.role === UserRole.COLLECTION_CENTER) {
        switch(activeTab) {
            case 'dashboard': 
              return <CollectionCenterPortal onNewTransaction={handleCenterTransaction} />;
            case 'analytics': 
              return <DashboardAdmin liveTransactions={liveTransactions} readOnly={true} />; 
            default: 
              return <CollectionCenterPortal onNewTransaction={handleCenterTransaction} />;
        }
    }

    // Corporate Views
    if (currentUser.role === UserRole.CORPORATE) {
        switch(activeTab) {
            case 'dashboard': return <CorporatePortal />;
            case 'marketplace': return <CorporatePortal />; // Buying
            case 'wallet': return <Wallet user={currentUser} />;
            default: return <CorporatePortal />;
        }
    }

    // Citizen & Fisherman Views
    switch (activeTab) {
      case 'dashboard':
        return <DashboardCitizen user={currentUser} onNavigateToMap={() => setActiveTab('dashboard')} />; // Map is inside dashboard now
      case 'scan':
        return <SmartScanner onScanComplete={handleScanComplete} />;
      case 'marketplace':
        return <Marketplace user={currentUser} onRedeem={handleRedeem} />;
      case 'wallet':
        return <Wallet user={currentUser} />;
      default:
        return <DashboardCitizen user={currentUser} onNavigateToMap={() => {}} />;
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} logoUrl={appLogo} />;
  }

  return (
    <div className="min-h-screen bg-brand-light flex font-sans">
      {/* Sidebar for Desktop */}
      <DesktopSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={currentUser!.role}
        logoUrl={appLogo}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {/* Top Bar (Mobile Header & Logout) */}
        <div className="flex justify-between items-center mb-6">
          <div className="md:hidden flex items-center gap-3">
             {appLogo ? (
               <img src={appLogo} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white border border-gray-100" />
             ) : (
               <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center text-white font-bold shadow-sm">P</div>
             )}
             <span className="font-heading font-bold text-brand-dark text-lg">PlastiXide</span>
          </div>
          
          <div className="ml-auto flex gap-2">
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"
             >
               <LogOut size={14} />
               Logout
             </button>
          </div>
        </div>

        {renderView()}
      </main>

      {/* Mobile Navigation */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={currentUser!.role}
        onMenuToggle={() => setActiveTab('wallet')}
      />
    </div>
  );
};

export default App;