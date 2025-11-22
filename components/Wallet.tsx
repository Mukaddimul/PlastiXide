import React, { useState } from 'react';
import { User, UserRole, Transaction } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import { ArrowDownLeft, ArrowUpRight, History, Building, CreditCard, Plus, Download, Upload } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface WalletProps {
  user: User;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNo: string;
  title: string;
}

const BusinessWallet: React.FC<{ user: User }> = ({ user }) => {
  const { t } = useLanguage();
  const [balance, setBalance] = useState(user.walletBalance);
  const [showAddBank, setShowAddBank] = useState(false);
  const [transferMode, setTransferMode] = useState<'DEPOSIT' | 'WITHDRAW' | null>(null);
  const [linkedBanks, setLinkedBanks] = useState<BankAccount[]>([
    { id: '1', bankName: 'Dutch-Bangla Bank', accountNo: '**** 1234', title: 'Corporate Main' }
  ]);
  
  // Form States
  const [newBank, setNewBank] = useState({ name: '', account: '' });
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setLinkedBanks([...linkedBanks, { 
        id: Date.now().toString(), 
        bankName: newBank.name, 
        accountNo: `**** ${newBank.account.slice(-4)}`, 
        title: 'New Account' 
      }]);
      setNewBank({ name: '', account: '' });
      setShowAddBank(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    setIsLoading(true);
    setTimeout(() => {
      if (transferMode === 'DEPOSIT') {
        setBalance(prev => prev + val);
      } else {
        setBalance(prev => prev - val);
      }
      setAmount('');
      setTransferMode(null);
      setIsLoading(false);
    }, 1500);
  };

  const walletTitle = user.role === UserRole.ADMIN ? t('admin_finance_title') : t('corp_wallet_title');

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
       <header>
        <h2 className="text-2xl font-heading font-bold text-gray-800">
          {walletTitle}
        </h2>
        <p className="text-gray-500">{t('wallet_subtitle_biz')}</p>
      </header>

      {/* Business Balance Card */}
      <div className="bg-gradient-to-r from-brand-dark to-gray-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
        
        <div className="relative z-10">
          <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">{t('avail_funds')}</p>
          <h3 className="text-5xl font-bold font-heading mb-6 flex items-baseline gap-2">
            <span className="text-2xl text-gray-400">{t('currency')}</span>
            {balance.toLocaleString()}
          </h3>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setTransferMode('DEPOSIT')}
              className="bg-brand-green hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
            >
              <Download size={18} />
              {t('load_funds')}
            </button>
            <button 
              onClick={() => setTransferMode('WITHDRAW')}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors backdrop-blur-sm"
            >
              <Upload size={18} />
              {t('withdraw')}
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {transferMode && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
           <Card className="w-full max-w-md animate-fade-in">
             <h3 className="font-bold text-xl mb-1">
               {transferMode === 'DEPOSIT' ? t('load_funds') : t('withdraw')}
             </h3>
             <p className="text-sm text-gray-500 mb-4">
               {transferMode === 'DEPOSIT' 
                 ? 'Transfer money from your linked bank to App Wallet.' 
                 : 'Transfer available funds to your bank account.'}
             </p>

             <form onSubmit={handleTransfer} className="space-y-4">
               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase">Amount (BDT)</label>
                 <input 
                   type="number" 
                   required
                   value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                   className="w-full p-3 text-2xl font-bold border-b-2 border-brand-blue outline-none focus:border-brand-green bg-white"
                   placeholder="0.00"
                 />
               </div>

               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Select Bank</label>
                 <select className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none">
                   {linkedBanks.map(b => (
                     <option key={b.id} value={b.id}>{b.bankName} ({b.accountNo})</option>
                   ))}
                 </select>
               </div>

               <div className="flex gap-3 pt-4">
                 <Button type="button" variant="outline" className="flex-1" onClick={() => setTransferMode(null)}>
                   Cancel
                 </Button>
                 <Button type="submit" className="flex-1" isLoading={isLoading}>
                   Confirm
                 </Button>
               </div>
             </form>
           </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Linked Accounts */}
        <Card title={t('linked_acc')}>
          <div className="space-y-3">
             {linkedBanks.map(bank => (
               <div key={bank.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                 <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-brand-blue">
                   <Building size={20} />
                 </div>
                 <div className="flex-1">
                   <h4 className="font-bold text-sm text-brand-dark">{bank.bankName}</h4>
                   <p className="text-xs text-gray-500">{bank.accountNo} • {bank.title}</p>
                 </div>
                 <div className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded">
                   VERIFIED
                 </div>
               </div>
             ))}
             
             {!showAddBank ? (
                <button 
                  onClick={() => setShowAddBank(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-brand-blue hover:text-brand-blue transition-all"
                >
                  <Plus size={18} />
                  {t('link_new')}
                </button>
             ) : (
                <form onSubmit={handleAddBank} className="p-4 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in space-y-3">
                   <input 
                     type="text" 
                     placeholder="Bank Name"
                     required
                     value={newBank.name}
                     onChange={e => setNewBank({...newBank, name: e.target.value})}
                     className="w-full p-2 rounded-lg border border-gray-200 text-sm bg-white"
                   />
                   <input 
                     type="text" 
                     placeholder="Account Number"
                     required
                     value={newBank.account}
                     onChange={e => setNewBank({...newBank, account: e.target.value})}
                     className="w-full p-2 rounded-lg border border-gray-200 text-sm bg-white"
                   />
                   <div className="flex gap-2">
                     <Button type="submit" size="sm" className="flex-1" isLoading={isLoading}>Link Account</Button>
                     <button type="button" onClick={() => setShowAddBank(false)} className="px-3 text-xs text-gray-500 underline">Cancel</button>
                   </div>
                </form>
             )}
          </div>
        </Card>

        {/* Recent Transfers */}
        <Card title={t('recent_trans')}>
          <div className="space-y-4">
             {[
               { id: 1, type: 'DEPOSIT', amount: 50000, date: 'Today, 10:00 AM', status: 'COMPLETED' },
               { id: 2, type: 'WITHDRAW', amount: 12000, date: 'Yesterday', status: 'PENDING' },
               { id: 3, type: 'DEPOSIT', amount: 25000, date: '18 May', status: 'COMPLETED' },
             ].map(tx => (
               <div key={tx.id} className="flex justify-between items-center border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                     {tx.type === 'DEPOSIT' ? <Download size={16} /> : <CreditCard size={16} />}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-brand-dark">{tx.type === 'DEPOSIT' ? t('funds_loaded') : t('withdrawal')}</p>
                     <p className="text-xs text-gray-400">{tx.date}</p>
                   </div>
                 </div>
                 <div className="text-right">
                    <p className={`font-bold text-sm ${tx.type === 'DEPOSIT' ? 'text-brand-green' : 'text-brand-dark'}`}>
                      {tx.type === 'DEPOSIT' ? '+' : '-'} ৳{tx.amount.toLocaleString()}
                    </p>
                    <p className={`text-[10px] font-bold ${tx.status === 'COMPLETED' ? 'text-gray-400' : 'text-orange-500'}`}>
                      {tx.status}
                    </p>
                 </div>
               </div>
             ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export const Wallet: React.FC<WalletProps> = ({ user }) => {
  const { t } = useLanguage();
  const isBusiness = user.role === UserRole.CORPORATE || user.role === UserRole.ADMIN;

  if (isBusiness) {
    return <BusinessWallet user={user} />;
  }

  // Original Citizen/Fisherman Wallet
  return (
    <div className="space-y-6 pb-20">
      <header>
        <h2 className="text-2xl font-heading font-bold text-gray-800">{t('wallet_title')}</h2>
        <p className="text-gray-500">{t('wallet_subtitle')}</p>
      </header>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-brand-dark to-gray-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-gray-400 text-sm mb-1">{t('current_balance')}</p>
            <h3 className="text-4xl font-bold font-heading">{user.points.toLocaleString()} <span className="text-lg font-normal text-brand-green">{t('points')}</span></h3>
          </div>
          <div className="bg-white/10 p-2 rounded-lg">
            <div className="w-8 h-5 rounded border-2 border-white/30 flex items-center justify-center text-[8px] tracking-widest">
              PLST
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <ArrowDownLeft size={16} />
              <span className="text-xs font-bold">{t('earned')}</span>
            </div>
            <p className="font-semibold">2,450</p>
          </div>
          <div className="flex-1 bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-red-400 mb-1">
              <ArrowUpRight size={16} />
              <span className="text-xs font-bold">{t('spent')}</span>
            </div>
            <p className="font-semibold">1,200</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <History className="text-gray-400" size={20} />
          <h3 className="font-heading font-semibold text-gray-700">{t('history')}</h3>
        </div>

        <div className="space-y-3">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <h4 className="font-semibold text-brand-dark text-sm">{tx.location}</h4>
                  <p className="text-xs text-gray-500">{tx.date} • {tx.type}</p>
                </div>
              </div>
              <div className={`text-right ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-brand-dark'}`}>
                <p className="font-bold">{tx.type === 'DEPOSIT' ? '+' : ''}{tx.pointsEarned} {t('points')}</p>
                {tx.amountKg && <p className="text-xs text-gray-400">{tx.amountKg} kg</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};