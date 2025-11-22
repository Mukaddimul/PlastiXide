import React, { useState, useRef } from 'react';
import { Camera, X, CheckCircle, RefreshCw, QrCode } from 'lucide-react';
import { Button } from './ui/Button';
import { analyzePlasticImage } from '../services/geminiService';
import { ScanResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SmartScannerProps {
  onScanComplete: (points: number) => void;
}

type ScanStep = 'QR' | 'PHOTO' | 'RESULT';

export const SmartScanner: React.FC<SmartScannerProps> = ({ onScanComplete }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<ScanStep>('QR');
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate QR Scan
  const handleQRScan = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep('PHOTO');
    }, 1500);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    try {
      const aiResult = await analyzePlasticImage(image);
      setResult(aiResult);
      setStep('RESULT');
      
      if (aiResult.isPlastic && aiResult.estimatedWeight) {
        const earnedPoints = Math.ceil(aiResult.estimatedWeight);
        // Delay triggering parent update to let user see result
        setTimeout(() => onScanComplete(earnedPoints), 3000); 
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setStep('QR');
  };

  return (
    <div className="flex flex-col h-full pb-20">
      <header className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-gray-800">{t('scan_title')}</h2>
        <p className="text-gray-500">
          {step === 'QR' ? t('scan_instruction') : step === 'PHOTO' ? t('scan_desc_photo') : t('scan_desc_process')}
        </p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        
        {/* Step 1: QR Scan Simulation */}
        {step === 'QR' && (
          <div className="w-full max-w-md flex flex-col items-center space-y-6 animate-fade-in">
             <div className="relative w-64 h-64 border-4 border-brand-green/30 rounded-3xl flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 border-t-4 border-brand-green animate-scan"></div>
               <QrCode size={100} className="text-gray-300 opacity-50" />
             </div>
             <p className="text-center text-gray-500 max-w-xs">{t('scan_desc_qr')}</p>
             <Button onClick={handleQRScan} isLoading={isAnalyzing} className="w-full">
               {isAnalyzing ? 'Connecting...' : t('scan_btn_simulate')}
             </Button>
          </div>
        )}

        {/* Step 2: Plastic Photo */}
        {step === 'PHOTO' && !image && (
          <div className="w-full max-w-md aspect-square bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group animate-fade-in">
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <div className="bg-white p-6 rounded-full shadow-lg mb-4 group-hover:scale-110 transition-transform">
              <Camera size={40} className="text-brand-green" />
            </div>
            <p className="font-semibold text-gray-600">{t('scan_tap')}</p>
            <p className="text-xs text-gray-400 mt-2">Ensure clear visibility</p>
          </div>
        )}

        {/* Step 3: Preview & Analyze */}
        {(step === 'PHOTO' || step === 'RESULT') && image && (
          <div className="w-full max-w-md space-y-6 animate-fade-in">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
              <img src={image} alt="Scanned Item" className="w-full h-full object-cover" />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <RefreshCw className="animate-spin mb-4" size={48} />
                  <p className="font-heading font-semibold">{t('scan_analyzing')}</p>
                  <p className="text-sm opacity-75">Estimating weight & type</p>
                </div>
              )}
              {!isAnalyzing && step === 'PHOTO' && (
                 <button 
                 onClick={() => setImage(null)}
                 className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40"
               >
                 <X size={20} />
               </button>
              )}
            </div>

            {result && (
              <div className={`p-6 rounded-2xl border ${result.isPlastic ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} animate-fade-in`}>
                <div className="flex items-center gap-3 mb-3">
                  {result.isPlastic ? (
                    <CheckCircle className="text-green-600" size={24} />
                  ) : (
                    <X className="text-red-500" size={24} />
                  )}
                  <h3 className={`font-bold text-lg ${result.isPlastic ? 'text-green-800' : 'text-red-800'}`}>
                    {result.isPlastic ? t('scan_accepted') : t('scan_rejected')}
                  </h3>
                </div>
                <p className="text-gray-600 mb-2">{result.message}</p>
                {result.isPlastic && (
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-green-200">
                    <div>
                      <p className="text-xs text-green-600 uppercase font-bold">{t('scan_type')}</p>
                      <p className="font-medium">{result.plasticType || 'Unknown'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-green-600 uppercase font-bold">{t('scan_est_weight')}</p>
                      <p className="font-medium">{result.estimatedWeight}g</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!result && !isAnalyzing && (
              <Button onClick={handleAnalyze} className="w-full py-4 text-lg shadow-xl shadow-emerald-200">
                {t('scan_btn_process')}
              </Button>
            )}
            
            {result && (
              <Button onClick={reset} variant="outline" className="w-full">{t('scan_next')}</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};