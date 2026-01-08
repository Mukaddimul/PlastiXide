import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, CheckCircle, RefreshCw, QrCode, Aperture, Upload, Info, HelpCircle, RotateCcw } from 'lucide-react';
import { Button } from './ui/Button.tsx';
import { analyzePlasticImage } from '../services/geminiService.ts';
import { ScanResult } from '../types.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface SmartScannerProps {
  onScanComplete: (points: number) => void;
}

type ScanStep = 'QR' | 'PHOTO' | 'RESULT';

const PLASTIC_TYPES = [
  { value: "PET", label: "PET (Polyethylene Terephthalate)" },
  { value: "HDPE", label: "HDPE (High-Density Polyethylene)" },
  { value: "PVC", label: "PVC (Polyvinyl Chloride)" },
  { value: "LDPE", label: "LDPE (Low-Density Polyethylene)" },
  { value: "PP", label: "PP (Polypropylene)" },
  { value: "PS", label: "PS (Polystyrene)" },
];

export const SmartScanner: React.FC<SmartScannerProps> = ({ onScanComplete }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<ScanStep>('QR');
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  
  // Manual Entry State
  const [manualType, setManualType] = useState<string>('PET');
  const [isCustomType, setIsCustomType] = useState(false);
  const [manualWeight, setManualWeight] = useState<string>('');
  
  // Camera State
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraActive) stopCamera();
    };
  }, [cameraActive]);

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

  const startCamera = async () => {
    try {
      setCameraActive(true);
      // Small delay to ensure video ref is mounted
      setTimeout(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions or use file upload.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        setResult(null);
        stopCamera();
      }
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    try {
      const aiResult = await analyzePlasticImage(image);
      setResult(aiResult);
      setStep('RESULT');
      
      // Initialize manual fields with AI results or defaults
      const detectedType = aiResult.plasticType && aiResult.plasticType !== 'Unknown' ? aiResult.plasticType : 'PET';
      setManualType(detectedType);
      
      // Check if the AI type is standard, otherwise enable custom mode
      const isStandard = PLASTIC_TYPES.some(t => t.value === detectedType);
      setIsCustomType(!isStandard);
      
      // Pre-fill weight if available from AI
      setManualWeight(aiResult.estimatedWeight ? aiResult.estimatedWeight.toString() : '');
      
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    const points = Math.ceil(parseFloat(manualWeight) || 0);
    if (points > 0) {
      onScanComplete(points);
    } else {
        alert("Please enter a valid weight to claim points.");
    }
  };

  const reset = () => {
    stopCamera();
    setImage(null);
    setResult(null);
    setStep('QR');
    setCameraActive(false);
    setManualType('PET');
    setIsCustomType(false);
    setManualWeight('');
  };

  return (
    <div className="flex flex-col h-full pb-20">
      <header className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-gray-800">{t('scan_title')}</h2>
        <p className="text-gray-500">
          {step === 'QR' ? t('scan_instruction') : step === 'PHOTO' ? (cameraActive ? 'Capture photo' : t('scan_desc_photo')) : t('scan_desc_process')}
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

        {/* Step 2: Plastic Photo / Camera Selection */}
        {step === 'PHOTO' && !image && !cameraActive && (
          <div className="w-full max-w-md space-y-5 animate-fade-in">
            {/* Option A: Camera */}
            <button 
               onClick={startCamera}
               className="w-full aspect-[4/3] bg-gray-900 rounded-3xl flex flex-col items-center justify-center text-white hover:bg-gray-800 transition-all shadow-xl group relative overflow-hidden"
             >
               {/* Decorative elements */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-green/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
               
               <div className="relative z-10 flex flex-col items-center">
                 <div className="bg-white/10 p-6 rounded-full mb-4 group-hover:scale-110 transition-transform backdrop-blur-sm border border-white/20">
                   <Aperture size={48} className="text-brand-green" />
                 </div>
                 <span className="font-heading font-bold text-xl">Open Camera</span>
                 <span className="text-gray-400 text-sm mt-1">Take a photo directly</span>
               </div>
             </button>

             <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                <span className="relative bg-brand-light px-4 text-sm text-gray-500 font-medium bg-opacity-100">OR</span>
             </div>
            
             {/* Option B: Upload */}
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-full p-5 bg-white rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors text-gray-500 group"
             >
                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-white transition-colors">
                  <Upload size={20} />
                </div>
                <span className="font-medium">{t('scan_tap')}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
             </div>
          </div>
        )}

        {/* Camera Interface */}
        {step === 'PHOTO' && cameraActive && !image && (
           <div className="w-full max-w-md relative bg-black rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl animate-fade-in border-4 border-gray-900">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Camera Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-10 items-center z-20">
                 <button 
                   onClick={stopCamera} 
                   className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors"
                 >
                   <X size={24} />
                 </button>
                 
                 <button 
                   onClick={capturePhoto}
                   className="w-20 h-20 bg-white rounded-full border-4 border-gray-300/50 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                 >
                   <div className="w-16 h-16 bg-white rounded-full border-2 border-black/10"></div>
                 </button>
                 
                 <div className="w-12"></div> {/* Spacer for balance */}
              </div>
           </div>
        )}

        {/* Step 3: Preview & Analyze */}
        {(step === 'PHOTO' || step === 'RESULT') && image && (
          <div className="w-full max-w-md space-y-6 animate-fade-in">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-white">
              <img src={image} alt="Scanned Item" className="w-full h-full object-cover" />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <RefreshCw className="animate-spin mb-4 text-brand-green" size={48} />
                  <p className="font-heading font-semibold text-lg">{t('scan_analyzing')}</p>
                  <p className="text-sm opacity-75 mt-1">AI is estimating weight & type...</p>
                </div>
              )}
              {!isAnalyzing && step === 'PHOTO' && (
                 <button 
                 onClick={() => setImage(null)}
                 className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/60 transition-colors"
               >
                 <X size={20} />
               </button>
              )}
            </div>

            {result && (
              <div className={`p-6 rounded-2xl border-l-4 shadow-md ${result.isPlastic ? 'bg-white border-l-brand-green' : 'bg-red-50 border-l-red-500'} animate-fade-in`}>
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
                <p className="text-gray-600 mb-4 text-sm">{result.message}</p>
                
                {/* Manual Edit Section */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                        Plastic Type {result.isPlastic && <span className="text-gray-300 font-normal">(Detected: {result.plasticType})</span>}
                        <Info size={12} className="text-brand-blue cursor-help hover:text-blue-700 transition-colors" title="Plastic types determine how items are sorted. PET and HDPE are the most commonly recyclable types." />
                      </label>
                      
                      {!isCustomType ? (
                        <select 
                            value={manualType} 
                            onChange={(e) => {
                                if (e.target.value === 'Other') {
                                    setIsCustomType(true);
                                    setManualType('');
                                } else {
                                    setManualType(e.target.value);
                                }
                            }}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-brand-dark focus:border-brand-green outline-none transition-colors"
                        >
                            {PLASTIC_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                            <option value="Other">Other / Custom Type</option>
                        </select>
                      ) : (
                        <div className="flex gap-2">
                           <input 
                             type="text"
                             value={manualType}
                             onChange={(e) => setManualType(e.target.value)}
                             placeholder="Enter plastic type (e.g. ABS)"
                             className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-brand-dark focus:border-brand-green outline-none"
                             autoFocus
                           />
                           <button 
                             onClick={() => { setIsCustomType(false); setManualType('PET'); }}
                             className="px-3 bg-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-300 transition-colors"
                           >
                             Cancel
                           </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1">
                          Weight (grams) {result.estimatedWeight && <span className="text-gray-300 font-normal">(Est: {result.estimatedWeight}g)</span>}
                          <HelpCircle size={12} className="text-brand-blue cursor-help hover:text-blue-700 transition-colors" title="Accurate weight ensures fair point distribution. 1000g = 1kg." />
                        </label>
                        {result.estimatedWeight && manualWeight !== result.estimatedWeight.toString() && (
                          <button 
                            onClick={() => setManualWeight(result.estimatedWeight!.toString())}
                            className="text-[10px] text-brand-blue font-bold flex items-center gap-1 hover:underline transition-all active:scale-95"
                            title="Reset to AI suggested weight"
                          >
                            <RotateCcw size={10} />
                            Reset to {result.estimatedWeight}g
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input 
                            type="number" 
                            value={manualWeight}
                            onChange={(e) => setManualWeight(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-brand-green focus:border-brand-green outline-none transition-colors"
                            placeholder={result.estimatedWeight ? result.estimatedWeight.toString() : "Enter weight"}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">g</span>
                      </div>
                    </div>
                </div>

                <div className="mt-4 pt-2">
                     <Button onClick={handleConfirm} className="w-full shadow-lg shadow-emerald-100">
                        Confirm & Collect {Math.ceil(parseFloat(manualWeight) || 0)} Points
                     </Button>
                </div>
              </div>
            )}

            {!result && !isAnalyzing && (
              <Button onClick={handleAnalyze} className="w-full py-4 text-lg shadow-xl shadow-emerald-200">
                {t('scan_btn_process')}
              </Button>
            )}
            
            {result && (
              <Button onClick={reset} variant="outline" className="w-full py-4 border-gray-300 text-gray-600 hover:bg-gray-50">{t('scan_next')}</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
