import React from 'react';
import { MOCK_VOUCHERS } from '../constants';
import { Button } from './ui/Button';
import { Clock, Tag } from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MarketplaceProps {
  user: User;
  onRedeem: (points: number) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ user, onRedeem }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h2 className="text-2xl font-heading font-bold text-gray-800">{t('market_title')}</h2>
        <p className="text-gray-500">{t('market_subtitle')} {user.points} {t('points')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_VOUCHERS.map((voucher) => {
          const canAfford = user.points >= voucher.costPoints;
          
          return (
            <div key={voucher.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group">
               <div className="absolute top-0 right-0 bg-brand-green/10 text-brand-green text-xs font-bold px-3 py-1 rounded-bl-xl">
                 {voucher.category}
               </div>
               
               <div className="flex items-start gap-4 mb-4">
                 <img 
                   src={voucher.logoUrl} 
                   alt={voucher.partnerName} 
                   className="w-16 h-16 rounded-xl object-cover bg-gray-50"
                 />
                 <div>
                   <h3 className="font-bold text-brand-dark text-lg">{voucher.partnerName}</h3>
                   <p className="text-sm text-gray-500 leading-tight">{voucher.description}</p>
                 </div>
               </div>

               <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                 <div className="flex items-center gap-1 text-gray-400 text-xs">
                   <Clock size={14} />
                   <span>{t('market_exp')}: {voucher.expiryDate}</span>
                 </div>
                 
                 <div className="flex flex-col items-end gap-2 w-full mt-3">
                    <span className="font-bold text-brand-green">{voucher.costPoints} {t('points')}</span>
                    <Button 
                      size="sm" 
                      className="w-full" 
                      disabled={!canAfford}
                      onClick={() => onRedeem(voucher.costPoints)}
                      variant={canAfford ? 'primary' : 'outline'}
                    >
                      {canAfford ? t('market_redeem') : t('market_need_points')}
                    </Button>
                 </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};