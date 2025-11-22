
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ShoppingCart, Download, Globe, X, Droplets, Zap, Leaf, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const CorporatePortal: React.FC = () => {
  const { t } = useLanguage();
  const [showCSRModal, setShowCSRModal] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const totalPurchasedTons = 12.5;

  // Impact Calculations (Mock formulas based on recycling 1 ton of plastic)
  const co2Offset = (totalPurchasedTons * 1.5).toFixed(1); 
  const energySaved = (totalPurchasedTons * 5774).toLocaleString(); 
  const waterConserved = (totalPurchasedTons * 2500).toLocaleString(); 

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setShowCSRModal(false);
      alert("CSR Impact Report downloaded successfully.");
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <header>
        <h2 className="text-2xl font-heading font-bold text-gray-800">{t('corp_partner')}</h2>
        <p className="text-gray-500">{t('buy_track')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-purple-600 text-white border-none shadow-lg shadow-purple-200">
          <p className="text-purple-200 text-xs uppercase">{t('csr_score')}</p>
          <h3 className="text-3xl font-bold">92/100</h3>
          <p className="text-xs mt-2 text-purple-100">+12% from last month</p>
        </Card>
        <Card>
          <p className="text-gray-500 text-xs uppercase">{t('total_purchased')}</p>
          <h3 className="text-3xl font-bold text-brand-dark">{totalPurchasedTons} Tons</h3>
        </Card>
        <Card>
          <p className="text-gray-500 text-xs uppercase">{t('co2_offset')}</p>
          <h3 className="text-3xl font-bold text-brand-green">{co2Offset} Tons</h3>
        </Card>
      </div>

      <h3 className="font-heading font-bold text-lg text-gray-700 mt-4">{t('market_stock')}</h3>
      
      <div className="space-y-4">
        {[
          { type: 'PET Flakes (Clear)', qty: '500 kg', price: '৳ 65/kg', loc: 'Mirpur Hub' },
          { type: 'HDPE Pellets (Blue)', qty: '200 kg', price: '৳ 85/kg', loc: 'Savar Center' },
          { type: 'LDPE Soft Plastic', qty: '1.2 Tons', price: '৳ 45/kg', loc: 'Gazipur Hub' },
        ].map((item, idx) => (
          <Card key={idx} className="flex flex-col sm:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-lg text-brand-dark">{item.type}</h4>
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{t('verified')}</span>
              </div>
              <p className="text-sm text-gray-500">Location: {item.loc}</p>
              <p className="font-mono font-semibold text-brand-blue mt-1">{item.qty} {t('available')}</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
               <div className="text-right hidden sm:block">
                 <p className="text-xs text-gray-400">{t('price')}</p>
                 <p className="font-bold text-xl">{item.price}</p>
               </div>
               <Button size="sm" className="w-full sm:w-auto shadow-lg shadow-blue-100">
                 <ShoppingCart size={16} className="mr-2" />
                 {t('buy_stock')}
               </Button>
            </div>
          </Card>
        ))}
      </div>

      <h3 className="font-heading font-bold text-lg text-gray-700 mt-4">{t('reports_certs')}</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-gray-600 group shadow-sm">
          <div className="bg-gray-100 p-3 rounded-full group-hover:bg-gray-200 transition-colors">
            <Download size={24} />
          </div>
          <span className="text-sm font-semibold">{t('monthly_invoice')}</span>
        </button>
        <button 
          onClick={() => setShowCSRModal(true)}
          className="p-4 bg-white border border-green-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-green-50 transition-colors text-brand-green group shadow-sm"
        >
          <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
            <Award size={24} />
          </div>
          <span className="text-sm font-semibold">{t('csr_report')}</span>
        </button>
      </div>

      {/* CSR Detail Modal */}
      {showCSRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setShowCSRModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 bg-white/50 p-1 rounded-full"
            >
              <X size={24} />
            </button>

            <div className="p-2 overflow-y-auto custom-scrollbar">
              <div className="text-center mb-6 pt-2">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce-subtle">
                   <Globe size={32} />
                 </div>
                 <h3 className="text-2xl font-bold text-brand-dark">{t('env_impact_cert')}</h3>
                 <p className="text-sm text-gray-500">Generated for <span className="font-bold text-gray-800">EcoPlast Industries Ltd.</span></p>
                 <p className="text-xs text-gray-400 mt-1">Period: Jan 2024 - May 2024</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl border border-green-100 mb-6 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200/50">
                  <div className="flex flex-col items-center pt-2 md:pt-0">
                    <div className="bg-white p-2 rounded-full mb-2 shadow-sm text-green-600">
                      <Leaf size={20} />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{co2Offset}t</span>
                    <span className="text-xs text-gray-500 uppercase font-bold mt-1">{t('co2_offset')} Prevented</span>
                  </div>
                  <div className="flex flex-col items-center pt-4 md:pt-0">
                    <div className="bg-white p-2 rounded-full mb-2 shadow-sm text-yellow-500">
                      <Zap size={20} />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{energySaved}</span>
                    <span className="text-xs text-gray-500 uppercase font-bold mt-1">kWh {t('energy_saved')}</span>
                  </div>
                  <div className="flex flex-col items-center pt-4 md:pt-0">
                    <div className="bg-white p-2 rounded-full mb-2 shadow-sm text-blue-500">
                      <Droplets size={20} />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{waterConserved}</span>
                    <span className="text-xs text-gray-500 uppercase font-bold mt-1">Liters {t('water_conserved')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="font-bold text-sm text-gray-700 ml-1">Detailed Breakdown</h4>
                <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm border border-gray-100">
                  <span className="text-gray-600">Total Recycled Plastic Purchased</span>
                  <span className="font-mono font-bold">{totalPurchasedTons} Tons</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm border border-gray-100">
                  <span className="text-gray-600">Landfill Diversion Rate</span>
                  <span className="font-mono font-bold text-green-600">100%</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm border border-gray-100">
                  <span className="text-gray-600">Social Impact (Fishermen Income Generated)</span>
                  <span className="font-mono font-bold text-brand-blue">৳ 450,000</span>
                </div>
              </div>

              <Button onClick={handleDownload} className="w-full py-4 text-base" isLoading={downloading}>
                <Download size={20} className="mr-2" />
                {t('download_pdf')}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
