import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ShoppingCart, Download, Globe } from 'lucide-react';

export const CorporatePortal: React.FC = () => {
  return (
    <div className="space-y-6 pb-20">
      <header>
        <h2 className="text-2xl font-heading font-bold text-gray-800">Corporate Partner</h2>
        <p className="text-gray-500">Buy Recycled Plastic & Track Impact</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-purple-600 text-white">
          <p className="text-purple-200 text-xs uppercase">Your CSR Score</p>
          <h3 className="text-3xl font-bold">92/100</h3>
          <p className="text-xs mt-2 text-purple-100">+12% from last month</p>
        </Card>
        <Card>
          <p className="text-gray-500 text-xs uppercase">Total Purchased</p>
          <h3 className="text-3xl font-bold text-brand-dark">12.5 Tons</h3>
        </Card>
        <Card>
          <p className="text-gray-500 text-xs uppercase">CO2 Offset</p>
          <h3 className="text-3xl font-bold text-brand-green">8.4 Tons</h3>
        </Card>
      </div>

      <h3 className="font-heading font-bold text-lg text-gray-700 mt-4">Marketplace: Available Stock</h3>
      
      <div className="space-y-4">
        {[
          { type: 'PET Flakes (Clear)', qty: '500 kg', price: '৳ 65/kg', loc: 'Mirpur Hub' },
          { type: 'HDPE Pellets (Blue)', qty: '200 kg', price: '৳ 85/kg', loc: 'Savar Center' },
          { type: 'LDPE Soft Plastic', qty: '1.2 Tons', price: '৳ 45/kg', loc: 'Gazipur Hub' },
        ].map((item, idx) => (
          <Card key={idx} className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-lg text-brand-dark">{item.type}</h4>
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Verified</span>
              </div>
              <p className="text-sm text-gray-500">Location: {item.loc}</p>
              <p className="font-mono font-semibold text-brand-blue mt-1">{item.qty} Available</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
               <div className="text-right hidden sm:block">
                 <p className="text-xs text-gray-400">Price</p>
                 <p className="font-bold text-xl">{item.price}</p>
               </div>
               <Button size="sm" className="w-full sm:w-auto">
                 <ShoppingCart size={16} className="mr-2" />
                 Buy Stock
               </Button>
            </div>
          </Card>
        ))}
      </div>

      <h3 className="font-heading font-bold text-lg text-gray-700 mt-4">Reports</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-gray-600">
          <Download size={24} />
          <span className="text-sm font-semibold">Monthly Invoice</span>
        </button>
        <button className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-brand-green">
          <Globe size={24} />
          <span className="text-sm font-semibold">CSR Certificate</span>
        </button>
      </div>
    </div>
  );
};
