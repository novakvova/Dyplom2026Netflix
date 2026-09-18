// src/components/LanguageSwitcher.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setIsOpen(false); 
  };

  const currentLanguage = i18n.language.toUpperCase();

  return (
    <div className="relative inline-block text-left z-50">
      <div>
        <button
          type="button"
          className="inline-flex justify-center items-center gap-x-1.5 rounded-lg bg-transparent px-3 py-2 text-white font-semibold transition hover:bg-white/5"
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentLanguage}
          <ChevronDown
            className="-mr-1 h-5 w-5 text-white/50 transition-transform duration-200"
            aria-hidden="true"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-20 origin-top-right rounded-xl border border-white/10 bg-[#120D1D]/95 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.55)] ring-0 focus:outline-none">
          <div className="py-1">
            <button
              onClick={() => changeLanguage('ua')}
              className="text-white/70 hover:bg-purple-500/10 hover:text-white block w-full text-left px-4 py-2 text-sm transition"
            >
              UA
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className="text-white/70 hover:bg-purple-500/10 hover:text-white block w-full text-left px-4 py-2 text-sm transition"
            >
              EN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;