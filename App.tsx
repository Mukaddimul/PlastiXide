import React, { useState, useEffect } from 'react';
import { Navigation, DesktopSidebar } from './components/Navigation.tsx';
import { DashboardCitizen } from './components/DashboardCitizen.tsx';
import { SmartScanner } from './components/SmartScanner.tsx';
import { Marketplace } from './components/Marketplace.tsx';
import { DashboardAdmin } from './components/DashboardAdmin.tsx';
import { CollectionCenterPortal } from './components/CollectionCenterPortal.tsx';
import { CorporatePortal } from './components/CorporatePortal.tsx';
import { Wallet } from './components/Wallet.tsx';
import { Auth } from './components/Auth.tsx';
import { UserRole, User } from './types.ts';
import { LogOut, Languages, Loader2 } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext.tsx';
import { DEFAULT_LOGO_URL } from './constants.ts';
import { supabase } from './services/supabase.ts';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { language, setLanguage } = useLanguage();
  const [liveTransactions, setLiveTransactions] = useState<any[]>([]);

  const [appLogo, setAppLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('plastixide_app_logo');
        return saved || DEFAULT_LOGO_URL;
      } catch (e) {
        return DEFAULT_LOGO_URL;
      }
    }
    return DEFAULT_LOGO_URL;
  });

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.user_metadata);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setIsInitializing(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, metadata: any) => {
    // Attempt to fetch from profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setCurrentUser(data as User);
    } else {
      // Fallback to metadata if table doesn't exist or is empty
      setCurrentUser({
        id: userId,
        name: metadata.full_name || 'User',
        role: metadata.role || UserRole.CITIZEN,
        points: metadata.points || 0,
        walletBalance: 0,
        totalPlasticRecycled: 0,
        impactScore: 0,
        phone: metadata.phone || '',
      });
    }
  };

  const handleUpdateLogo = (newLogo: string | null) => {
    try {
      const logoToSet = newLogo || DEFAULT_LOGO_URL;
      setAppLogo(logoToSet);
      if (newLogo) localStorage.setItem('plastixide_app_logo', newLogo);
      else localStorage.removeItem('plastixide_app_logo');
    } catch (error) {
      alert("Unable to save logo permanently: Image file is too large.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleScanComplete = (pointsEarned: number) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? ({
      ...prev,
      points: prev.points + pointsEarned,
      totalPlasticRecycled: prev.totalPlasticRecycled + (pointsEarned / 1000),
      impactScore: prev.impactScore + 1
    }) : null);
    alert(`Successfully recycled! Earned ${pointsEarned} points.`);
    setActiveTab('wallet');
  };

  const handleRedeem = (cost: number) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? ({
      ...prev,
      points: prev.points - cost
    }) : null);
    alert('Voucher redeemed successfully! Check your email.');
  };

  const handleCenterTransaction = (data: any) => {
    setLiveTransactions(prev => [data, ...prev]);
  };

  const renderView = () => {
    if (!currentUser) return null;

    if (currentUser.role === UserRole.ADMIN) {
        if (activeTab === 'wallet') return <Wallet user={currentUser} />;
        return <DashboardAdmin currentLogo={appLogo} onUpdateLogo={handleUpdateLogo} liveTransactions={liveTransactions} />;
    }

    if (currentUser.role === UserRole.COLLECTION_CENTER) {
        switch(activeTab) {
            case 'dashboard': return <CollectionCenterPortal onNewTransaction={handleCenterTransaction} />;
            case 'analytics': return <DashboardAdmin liveTransactions={liveTransactions} readOnly={true} />; 
            default: return <CollectionCenterPortal onNewTransaction={handleCenterTransaction} />;
        }
    }

    if (currentUser.role === UserRole.CORPORATE) {
        switch(activeTab) {
            case 'dashboard': return <CorporatePortal />;
            case 'marketplace': return <CorporatePortal />;
            case 'wallet': return <Wallet user={currentUser} />;
            default: return <CorporatePortal />;
        }
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardCitizen user={currentUser} onNavigateToMap={() => setActiveTab('dashboard')} onNewTransaction={handleCenterTransaction} />;
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

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <Loader2 className="w-12 h-12 text-brand-green animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onLogin={() => {}} logoUrl={appLogo} />;
  }

  return (
    <div className="min-h-screen bg-brand-light flex font-sans">
      <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={currentUser!.role} logoUrl={appLogo} />
      <main className="flex-1 md:ml-64 p-4 md:p-8 max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="md:hidden flex items-center gap-3">
             {appLogo ? <img src={appLogo} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white border border-gray-100" /> : <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center text-white font-bold shadow-sm">P</div>}
             <span className="font-heading font-bold text-brand-dark text-lg">PlastiXide</span>
          </div>
          <div className="ml-auto flex gap-2">
             <button onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')} className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-brand-blue bg-blue-50 rounded-xl border border-blue-100 md:hidden"><Languages size={14} />{language === 'en' ? 'EN' : 'বাংলা'}</button>
             <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"><LogOut size={14} />{language === 'bn' ? 'লগ আউট' : 'Logout'}</button>
          </div>
        </div>
        {renderView()}
      </main>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} userRole={currentUser!.role} onMenuToggle={() => setActiveTab('wallet')} />
    </div>
  );
};

export default App;