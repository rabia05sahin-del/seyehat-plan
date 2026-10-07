import React from 'react';
import { Compass, Sparkles, Bookmark, Printer, RefreshCw, MapPin } from 'lucide-react';

interface NavbarProps {
  onNewTripClick: () => void;
  onOpenSavedModal: () => void;
  onLoadSampleTrip: () => void;
  onPrintClick?: () => void;
  hasCurrentPlan: boolean;
  savedTripsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewTripClick,
  onOpenSavedModal,
  onLoadSampleTrip,
  onPrintClick,
  hasCurrentPlan,
  savedTripsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 print:hidden shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewTripClick}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-slate-900 bg-gradient-to-r from-sky-700 to-indigo-800 bg-clip-text text-transparent">
                RotaYolcu
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                <Sparkles className="w-3 h-3 mr-1 text-amber-500" />
                AI Planlayıcı
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              Yurt İçi & Yurt Dışı Bütçeye Özel Seyahat Rehberi
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onLoadSampleTrip}
            className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Örnek 3 Günlük Kapadokya Planını Görüntüle"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Örnek Rota: Kapadokya</span>
          </button>

          <button
            onClick={onOpenSavedModal}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors relative"
            title="Kaydedilen Planlar"
          >
            <Bookmark className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">Kaydedilenler</span>
            {savedTripsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-sky-600 text-white rounded-full text-[11px] font-bold">
                {savedTripsCount}
              </span>
            )}
          </button>

          {hasCurrentPlan && onPrintClick && (
            <button
              onClick={onPrintClick}
              className="hidden sm:flex items-center space-x-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Planı Yazdır veya PDF Kaydet"
            >
              <Printer className="w-4 h-4 text-indigo-600" />
              <span>Yazdır / PDF</span>
            </button>
          )}

          <button
            onClick={onNewTripClick}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm hover:from-sky-700 hover:to-indigo-700 transition-all hover:shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Yeni Plan Oluştur</span>
          </button>
        </div>
      </div>
    </header>
  );
};
