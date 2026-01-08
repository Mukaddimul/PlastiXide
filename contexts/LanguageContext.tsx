import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { translations, Language } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Load from local storage if available
  useEffect(() => {
    try {
        const savedLang = localStorage.getItem('plastixide_lang') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'bn')) {
          setLanguage(savedLang);
        }
    } catch(e) {
        console.error("Language storage access error", e);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
        localStorage.setItem('plastixide_lang', lang);
    } catch(e) {
        console.error("Language storage write error", e);
    }
  };

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};