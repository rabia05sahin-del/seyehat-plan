import React, { useState, useEffect } from 'react';
import { TravelPlan, TravelPlanRequest } from './types/travel';
import { SAMPLE_CAPPADOCIA_PLAN } from './data/presetTrips';
import { generateSmartTravelPlan } from './services/smartTravelEngine';
import { Navbar } from './components/Navbar';
import { TravelPlannerForm } from './components/TravelPlannerForm';
import { MustSeePlacesList } from './components/MustSeePlacesList';
import { ItineraryView } from './components/ItineraryView';
import { BudgetBreakdownCard } from './components/BudgetBreakdownCard';
import { CuisineSection } from './components/CuisineSection';
import { PackingChecklist } from './components/PackingChecklist';
import { TripAssistantChat } from './components/TripAssistantChat';
import { SavedTripsModal } from './components/SavedTripsModal';
import {
  Calendar,
  Clock,
  Wallet,
  MapPin,
  Bookmark,
  Share2,
  Printer,
  Sparkles,
  Compass,
  AlertCircle,
  Copy,
  Check,
  ChevronLeft,
  Info,
  ShieldCheck,
  PhoneCall,
  CreditCard,
  FileCheck,
} from 'lucide-react';

export default function App() {
  const [currentPlan, setCurrentPlan] = useState<TravelPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    'itinerary' | 'mustSee' | 'budget' | 'cuisine' | 'packing' | 'practical'
  >('itinerary');

  // Saved trips in LocalStorage
  const [savedTrips, setSavedTrips] = useState<TravelPlan[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState<boolean>(false);

  // Load saved trips on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rotayolcu_saved_trips');
      if (stored) {
        setSavedTrips(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved trips:', e);
    }
  }, []);

  // Save trip to LocalStorage
  const handleSaveCurrentPlan = () => {
    if (!currentPlan) return;
    const tripToSave = {
      ...currentPlan,
      id: currentPlan.id || `trip-${Date.now()}`,
      createdAt: currentPlan.createdAt || new Date().toISOString(),
    };

    const exists = savedTrips.some(
      (t) => t.summary.title === tripToSave.summary.title && t.id === tripToSave.id
    );

    let updatedList = savedTrips;
    if (!exists) {
      updatedList = [tripToSave, ...savedTrips];
    } else {
      updatedList = savedTrips.map((t) => (t.id === tripToSave.id ? tripToSave : t));
    }

    setSavedTrips(updatedList);
    localStorage.setItem('rotayolcu_saved_trips', JSON.stringify(updatedList));
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const handleDeleteSavedTrip = (id: string) => {
    const updated = savedTrips.filter((t) => t.id !== id);
    setSavedTrips(updated);
    localStorage.setItem('rotayolcu_saved_trips', JSON.stringify(updated));
  };

  // Generate travel plan via Express + Gemini API or Smart Engine
  const handleGeneratePlan = async (params: TravelPlanRequest) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let plan: TravelPlan | null = null;

      try {
        const response = await fetch('/api/generate-travel-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.plan) {
            plan = {
              ...data.plan,
              id: `trip-${Date.now()}`,
              createdAt: new Date().toISOString(),
              requestParams: params,
            };
          }
        }
      } catch (fetchErr) {
        console.warn('Backend API request skipped or offline, using smart engine:', fetchErr);
      }

      // If backend was not reached or returned no plan, use client-side smart engine
      if (!plan) {
        plan = generateSmartTravelPlan(params);
      }

      setCurrentPlan(plan);
      setShowForm(false);
      setActiveTab('itinerary');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error generating plan:', err);
      // Even on unexpected error, fallback to smart engine
      try {
        const fallbackPlan = generateSmartTravelPlan(params);
        setCurrentPlan(fallbackPlan);
        setShowForm(false);
        setActiveTab('itinerary');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        setErrorMessage(
          err.message || 'Seyahat planı oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load preset sample Cappadocia trip
  const handleLoadSampleTrip = () => {
    setCurrentPlan(SAMPLE_CAPPADOCIA_PLAN);
    setShowForm(false);
    setActiveTab('itinerary');
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  // Copy plan summary to clipboard
  const handleCopySummary = () => {
    if (!currentPlan) return;
    const text = `🌟 ${currentPlan.summary.title}
📍 Destinasyon: ${currentPlan.summary.destination} (${currentPlan.summary.durationDays} Gün)
💰 Bütçe: ${currentPlan.summary.budgetOverview.estimatedTotalCost}
📅 Tarih: ${currentPlan.summary.datesFormatted}

Görülmesi Gereken Önemli Yerler:
${currentPlan.mustSeePlaces.map((p, i) => `${i + 1}. ${p.name} - ${p.shortDescription}`).join('\n')}

Planın detayları RotaYolcu AI Seyahat Planlayıcısı ile hazırlandı.`;

    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased flex flex-col">
      {/* Navbar */}
      <Navbar
        onNewTripClick={() => {
          setShowForm(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onLoadSampleTrip={handleLoadSampleTrip}
        onPrintClick={handlePrint}
        hasCurrentPlan={!!currentPlan}
        savedTripsCount={savedTrips.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold">Bir Sorun Oluştu: </strong>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700 font-bold text-xs"
            >
              Kapat
            </button>
          </div>
        )}

        {/* If showForm is true OR no plan has been loaded yet */}
        {showForm || !currentPlan ? (
          <div className="space-y-8">
            <TravelPlannerForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
          </div>
        ) : (
          /* Travel Plan Display View */
          <div className="space-y-8">
            {/* Top Return & Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kriterleri Değiştir / Yeni Plan Yap</span>
              </button>

              <div className="flex items-center space-x-2">
                {/* Save Button */}
                <button
                  onClick={handleSaveCurrentPlan}
                  className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
                  title="Seyahati Kaydet"
                >
                  <Bookmark className="w-4 h-4 text-sky-600" />
                  <span>{saveSuccessToast ? 'Kaydedildi! ✓' : 'Planı Kaydet'}</span>
                </button>

                {/* Copy Summary */}
                <button
                  onClick={handleCopySummary}
                  className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
                  title="Plan Özetini Kopyala"
                >
                  {copiedToast ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-600" />
                  )}
                  <span>{copiedToast ? 'Kopyalandı!' : 'Özeti Kopyala'}</span>
                </button>

                {/* Print button */}
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Yazdır / PDF</span>
                </button>
              </div>
            </div>

            {/* Plan Hero Summary Banner */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
              <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4 max-w-4xl">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {currentPlan.summary.tripType === 'domestic' ? '🇹🇷 Yurt İçi' : '🌍 Yurt Dışı'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    <span>{currentPlan.summary.durationDays} Günlük Rota</span>
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center space-x-1">
                    <Wallet className="w-3.5 h-3.5 mr-1" />
                    <span>{currentPlan.summary.budgetOverview.level}</span>
                  </span>
                </div>

                {/* Main Title */}
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  {currentPlan.summary.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  {currentPlan.summary.tagline}
                </p>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>
                      <strong className="text-white">Hedef:</strong> {currentPlan.summary.destination}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>
                      <strong className="text-white">Tarih:</strong> {currentPlan.summary.datesFormatted}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong className="text-white">Tahmini Bütçe:</strong>{' '}
                      {currentPlan.summary.budgetOverview.estimatedTotalCost}
                    </span>
                  </div>
                </div>

                {/* Season Advice Notice */}
                {currentPlan.summary.seasonAdvice && (
                  <div className="mt-2 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-xs text-sky-100 flex items-start space-x-2.5">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong className="text-white font-bold">Mevsim & Hava Durumu Tavsiyesi: </strong>
                      {currentPlan.summary.seasonAdvice}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-b border-slate-200 print:hidden scrollbar-none">
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer flex items-center space-x-2 ${
                  activeTab === 'itinerary'
                    ? 'border-sky-600 text-sky-700 bg-sky-50/50 rounded-t-xl'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🗓️ Gün Gün Gezi Programı</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200 text-slate-700 font-semibold">
                  {currentPlan.itinerary.length} Gün
                </span>
              </button>

              <button
                onClick={() => setActiveTab('mustSee')}
                className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer flex items-center space-x-2 ${
                  activeTab === 'mustSee'
                    ? 'border-sky-600 text-sky-700 bg-sky-50/50 rounded-t-xl'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📍 Görülmesi Gereken Yerler</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200 text-slate-700 font-semibold">
                  {currentPlan.mustSeePlaces.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('budget')}
                className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer flex items-center space-x-2 ${
                  activeTab === 'budget'
                    ? 'border-sky-600 text-sky-700 bg-sky-50/50 rounded-t-xl'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>💰 Bütçe Analizi & Tasarruf</span>
              </button>

              <button
                onClick={() => setActiveTab('cuisine')}
                className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer flex items-center space-x-2 ${
                  activeTab === 'cuisine'
                    ? 'border-sky-600 text-sky-700 bg-sky-50/50 rounded-t-xl'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🍽️ Ne Yenir & Restoranlar</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200 text-slate-700 font-semibold">
                  {currentPlan.localCuisine.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('packing')}
                className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer flex items-center space-x-2 ${
                  activeTab === 'packing'
                    ? 'border-sky-600 text-sky-700 bg-sky-50/50 rounded-t-xl'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🧳 Bavul Listesi</span>
              </button>

              <button
                onClick={() => setActiveTab('practical')}
                className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer flex items-center space-x-2 ${
                  activeTab === 'practical'
                    ? 'border-sky-600 text-sky-700 bg-sky-50/50 rounded-t-xl'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>ℹ️ Ulaşım & Pratik Bilgiler</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Area (2 Cols in LG) */}
              <div className="lg:col-span-2 space-y-8">
                {activeTab === 'itinerary' && (
                  <ItineraryView
                    itinerary={currentPlan.itinerary}
                    destinationName={currentPlan.summary.destination}
                  />
                )}

                {activeTab === 'mustSee' && (
                  <MustSeePlacesList
                    places={currentPlan.mustSeePlaces}
                    destinationName={currentPlan.summary.destination}
                  />
                )}

                {activeTab === 'budget' && (
                  <BudgetBreakdownCard
                    budgetOverview={currentPlan.summary.budgetOverview}
                    userBudgetAmount={currentPlan.requestParams?.budgetAmount}
                    currency={currentPlan.requestParams?.currency || 'TRY'}
                  />
                )}

                {activeTab === 'cuisine' && (
                  <CuisineSection
                    dishes={currentPlan.localCuisine}
                    destinationName={currentPlan.summary.destination}
                  />
                )}

                {activeTab === 'packing' && (
                  <PackingChecklist
                    initialItems={currentPlan.packingChecklist}
                    destinationName={currentPlan.summary.destination}
                  />
                )}

                {activeTab === 'practical' && (
                  <div className="space-y-6">
                    {/* Şehir İçi Ulaşım Rehberi */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                          <Compass className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">
                          Şehir İçi Ulaşım & Transfer Tavsiyeleri
                        </h3>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        {currentPlan.transportAdvice}
                      </p>
                    </div>

                    {/* Vize, Ödeme & Acil Bilgiler */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Vize ve Giriş Şartları */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2.5 shadow-xs">
                        <div className="flex items-center space-x-2 text-indigo-700">
                          <FileCheck className="w-5 h-5" />
                          <h4 className="font-bold text-slate-900 text-base">Giriş & Evrak Bilgisi</h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {currentPlan.emergencyAndPracticalInfo.visaOrEntryNote}
                        </p>
                      </div>

                      {/* Para & Kart Kullanımı */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2.5 shadow-xs">
                        <div className="flex items-center space-x-2 text-emerald-700">
                          <CreditCard className="w-5 h-5" />
                          <h4 className="font-bold text-slate-900 text-base">Para Birimi & Kartlar</h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {currentPlan.emergencyAndPracticalInfo.currencyAndPaymentTips}
                        </p>
                      </div>
                    </div>

                    {/* Acil Durum Numaraları */}
                    <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-6 flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-rose-950 text-base">
                          Acil Durum & İletişim Numaraları
                        </h4>
                        <p className="text-xs text-rose-900 mt-1">
                          {currentPlan.emergencyAndPracticalInfo.localEmergencyNumbers}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar: AI Trip Assistant & Quick Highlights (1 Col in LG) */}
              <div className="space-y-6 print:hidden">
                {/* AI Chat Assistant */}
                <TripAssistantChat
                  destination={currentPlan.summary.destination}
                  planSummary={`${currentPlan.summary.title} - ${currentPlan.summary.durationDays} Gün - ${currentPlan.summary.budgetOverview.level}`}
                />

                {/* Quick Must-See Snapshot in Sidebar if on another tab */}
                {activeTab !== 'mustSee' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-sky-600" />
                        Görülmesi Gereken Özet ({currentPlan.mustSeePlaces.length})
                      </h4>
                      <button
                        onClick={() => setActiveTab('mustSee')}
                        className="text-xs text-sky-600 hover:text-sky-800 font-bold"
                      >
                        Tümünü Gör
                      </button>
                    </div>

                    <div className="space-y-2">
                      {currentPlan.mustSeePlaces.slice(0, 5).map((place, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-slate-800 truncate mr-2">
                            {place.name}
                          </span>
                          <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                            {place.estimatedDuration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-sky-600" />
            <span className="font-semibold text-slate-700">RotaYolcu</span>
            <span>— Yapay Zeka Destekli Akıllı Seyahat Planlayıcı</span>
          </div>
          <p>© {new Date().getFullYear()} RotaYolcu. Yurt içi ve yurt dışı gezi planlarınız için kişiselleştirilmiş rehber.</p>
        </div>
      </footer>

      {/* Saved Trips Modal */}
      <SavedTripsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedTrips={savedTrips}
        onSelectTrip={(trip) => {
          setCurrentPlan(trip);
          setShowForm(false);
          setActiveTab('itinerary');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDeleteTrip={handleDeleteSavedTrip}
      />
    </div>
  );
}
