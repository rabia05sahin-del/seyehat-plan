import React, { useState, useEffect } from 'react';
import {
  TripType,
  BudgetLevel,
  TravelPlanRequest,
} from '../types/travel';
import {
  POPULAR_DESTINATIONS,
  TRAVEL_STYLES,
  PopularDestination,
} from '../data/presetTrips';
import {
  MapPin,
  Calendar,
  Wallet,
  Clock,
  Compass,
  Sparkles,
  Users,
  CheckCircle2,
  Globe2,
  Building2,
  ChevronRight,
  Plane,
  HeartHandshake,
  DollarSign,
  Info,
} from 'lucide-react';

interface TravelPlannerFormProps {
  onSubmit: (params: TravelPlanRequest) => void;
  isLoading: boolean;
}

export const TravelPlannerForm: React.FC<TravelPlannerFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  // Form State
  const [tripType, setTripType] = useState<TripType>('domestic');
  const [destination, setDestination] = useState<string>('Kapadokya (Nevşehir)');
  const [departureCity, setDepartureCity] = useState<string>('İstanbul');
  
  // Date and Days
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(defaultEnd);
  const [totalDays, setTotalDays] = useState<number>(3);

  // Budget
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>('moderate');
  const [budgetAmount, setBudgetAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'TRY' | 'USD' | 'EUR'>('TRY');
  const [travelersCount, setTravelersCount] = useState<number>(2);

  // Travel Styles
  const [selectedStyles, setSelectedStyles] = useState<string[]>([
    'Tarih & Müzeler',
    'Gastronomi & Yerel Lezzetler',
  ]);
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Loading animation state messages
  const [loadingStep, setLoadingStep] = useState<number>(0);

  const loadingSteps = [
    'Destinasyon ve mevsim koşulları analiz ediliyor...',
    'Bütçenize göre en uygun rotalar ve konaklama tipleri optimize ediliyor...',
    'Görülmesi gereken ikonik yerler ve gizli cevherler belirleniyor...',
    'Gün gün sabah, öğle ve akşam rotası mantıksal sırayla diziliyor...',
    'Bölgenin meşhur yerel yemekleri ve akıllı bavul listesi hazırlanıyor...',
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Sync date difference with totalDays
  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (val && endDate) {
      const start = new Date(val);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays >= 1 && diffDays <= 30) {
        setTotalDays(diffDays);
      }
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    if (startDate && val) {
      const start = new Date(startDate);
      const end = new Date(val);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays >= 1 && diffDays <= 30) {
        setTotalDays(diffDays);
      }
    }
  };

  const handleDaysChange = (days: number) => {
    const validDays = Math.max(1, Math.min(30, days));
    setTotalDays(validDays);
    if (startDate) {
      const start = new Date(startDate);
      const newEnd = new Date(start.getTime() + (validDays - 1) * 24 * 60 * 60 * 1000);
      setEndDate(newEnd.toISOString().split('T')[0]);
    }
  };

  // Quick select popular destination
  const handleSelectPopular = (dest: PopularDestination) => {
    setDestination(dest.name);
    setTripType(dest.type);
    setTotalDays(dest.popularDays);
    setBudgetLevel(dest.suggestedBudgetLevel);
    if (dest.type === 'international') {
      setCurrency('EUR');
    } else {
      setCurrency('TRY');
    }
    if (startDate) {
      const start = new Date(startDate);
      const newEnd = new Date(start.getTime() + (dest.popularDays - 1) * 24 * 60 * 60 * 1000);
      setEndDate(newEnd.toISOString().split('T')[0]);
    }
  };

  const toggleStyle = (styleLabel: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleLabel)
        ? prev.filter((s) => s !== styleLabel)
        : [...prev, styleLabel]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    onSubmit({
      tripType,
      destination: destination.trim(),
      departureCity: departureCity.trim() || undefined,
      startDate,
      endDate,
      totalDays,
      budgetLevel,
      budgetAmount: budgetAmount ? parseFloat(budgetAmount) : undefined,
      currency,
      travelersCount,
      travelStyle: selectedStyles,
      specialRequests: specialRequests.trim() || undefined,
    });
  };

  // Filtered popular destinations based on domestic / international
  const currentPopularList = POPULAR_DESTINATIONS.filter((d) => d.type === tripType);

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-indigo-700 to-indigo-900 px-6 sm:px-10 py-8 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Globe2 className="w-80 h-80" />
        </div>
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-sky-100 text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kişiselleştirilmiş Yapay Zeka Seyahat Motoru</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Hayalindeki Seyahati Planla
          </h1>
          <p className="mt-2 text-sky-100 text-sm sm:text-base leading-relaxed">
            Yurt içi veya yurt dışı rotanı seç; kaç gün kalacağını, bütçeni ve seyahat tarihini belirle.
            Görmen gereken yerler, gün gün rota ve tasarruf tüyoları anında hazır olsun!
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
        {/* 1. SEYAHAT TÜRÜ (Yurt İçi mi Yurt Dışı mı?) */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-800 tracking-wide uppercase">
            1. Seyahat Türü: Yurt İçi mi, Yurt Dışı mı?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setTripType('domestic');
                setCurrency('TRY');
                if (tripType !== 'domestic') {
                  setDestination('Kapadokya (Nevşehir)');
                }
              }}
              className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start space-x-4 cursor-pointer ${
                tripType === 'domestic'
                  ? 'border-sky-600 bg-sky-50/70 shadow-md shadow-sky-600/10'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="text-3xl p-2 bg-white rounded-xl shadow-xs border border-slate-100">
                🇹🇷
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-lg">Yurt İçi Seyahat</h3>
                  {tripType === 'domestic' && (
                    <CheckCircle2 className="w-5 h-5 text-sky-600 inline" />
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  Türkiye'nin tarihi şehirleri, Ege ve Akdeniz kıyıları, Karadeniz yaylaları ve Doğu kültürü.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setTripType('international');
                setCurrency('EUR');
                if (tripType !== 'international') {
                  setDestination('Roma, İtalya');
                }
              }}
              className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start space-x-4 cursor-pointer ${
                tripType === 'international'
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-md shadow-indigo-600/10'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="text-3xl p-2 bg-white rounded-xl shadow-xs border border-slate-100">
                🌍
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-lg">Yurt Dışı Seyahat</h3>
                  {tripType === 'international' && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 inline" />
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  Avrupa başkentleri, vizesiz Balkanlar & Kafkaslar, Asya ve dünyanın dört bir yanı.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 2. NEREYE GİTMEK İSTİYORSUNUZ? (HEDEF ŞEHİR) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-800 tracking-wide uppercase">
              2. Nereye Gitmek İstiyorsunuz?
            </label>
            <span className="text-xs text-slate-500 font-medium">
              Örnek: "Mardin", "İstanbul", "Paris", "Barselona"
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-5 h-5 text-sky-600" />
            </div>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={
                tripType === 'domestic'
                  ? 'Örn: Kapadokya, Antalya & Kaş, Trabzon & Rize, Mardin...'
                  : 'Örn: Roma (İtalya), Barselona (İspanya), Tokyo (Japonya), Saraybosna...'
              }
              required
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-hidden transition-all text-base"
            />
          </div>

          {/* Popüler Hızlı Seçimler */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
              Popüler {tripType === 'domestic' ? 'Türkiye' : 'Dünya'} Rotalarından Seçin:
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {currentPopularList.map((dest) => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handleSelectPopular(dest)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    destination.toLowerCase().includes(dest.name.toLowerCase().slice(0, 4))
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{dest.emoji}</span>
                  <span>{dest.name}</span>
                  <span className="text-[10px] opacity-75">({dest.popularDays} Gün)</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. KAÇ GÜN VE SEYAHAT TARİHLERİ */}
        <div className="space-y-4 pt-2">
          <label className="block text-sm font-bold text-slate-800 tracking-wide uppercase">
            3. Kaç Gün & Seyahat Tarihleri
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kaç Gün Sayacı */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <span className="text-xs font-bold text-slate-600 uppercase flex items-center mb-2">
                <Clock className="w-4 h-4 mr-1 text-sky-600" />
                Toplam Gün Sayısı
              </span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleDaysChange(totalDays - 1)}
                  disabled={totalDays <= 1}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center text-lg"
                >
                  -
                </button>
                <div className="flex-1 text-center">
                  <span className="text-2xl font-black text-slate-900">{totalDays}</span>
                  <span className="text-xs font-bold text-slate-500 ml-1">GÜN</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDaysChange(totalDays + 1)}
                  disabled={totalDays >= 30}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center text-lg"
                >
                  +
                </button>
              </div>

              {/* Hızlı Gün Butonları */}
              <div className="flex justify-between gap-1 mt-3 pt-2 border-t border-slate-200/60">
                {[2, 3, 5, 7, 10].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDaysChange(d)}
                    className={`flex-1 py-1 rounded-md text-xs font-semibold transition-all ${
                      totalDays === d
                        ? 'bg-sky-600 text-white'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {d}G
                  </button>
                ))}
              </div>
            </div>

            {/* Başlangıç Tarihi */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <span className="text-xs font-bold text-slate-600 uppercase flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-1 text-indigo-600" />
                Başlangıç Tarihi
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-2">
                Mevsim analizine göre kıyafet ve hava tavsiyesi üretilir.
              </p>
            </div>

            {/* Bitiş Tarihi */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <span className="text-xs font-bold text-slate-600 uppercase flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-1 text-indigo-600" />
                Bitiş Tarihi
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-2">
                Gün sayısı ile otomatik senkronizedir.
              </p>
            </div>
          </div>
        </div>

        {/* 4. BÜTÇE AYARLAMASI */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-800 tracking-wide uppercase">
              4. Bütçe Tercihi & Kişi Sayısı
            </label>
            <span className="text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md font-semibold">
              Yemek, konaklama ve aktiviteler bütçenize göre şekillenecektir
            </span>
          </div>

          {/* Bütçe Seviyeleri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ekonomik */}
            <button
              type="button"
              onClick={() => setBudgetLevel('budget')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                budgetLevel === 'budget'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-md shadow-emerald-600/10'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🎒</span>
                {budgetLevel === 'budget' && (
                  <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Seçildi
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-900 text-base">Ekonomik / Sırt Çantalı</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Uygun pansiyon/hosteller, esnaf lokantaları & sokak tatları, toplu taşıma, ücretsiz & Müzekart rotaları.
              </p>
            </button>

            {/* Orta / Dengeli */}
            <button
              type="button"
              onClick={() => setBudgetLevel('moderate')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                budgetLevel === 'moderate'
                  ? 'border-sky-600 bg-sky-50/70 shadow-md shadow-sky-600/10'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⚖️</span>
                {budgetLevel === 'moderate' && (
                  <span className="text-xs font-bold bg-sky-600 text-white px-2 py-0.5 rounded-full">
                    Seçildi
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-900 text-base">Dengeli / Orta Bütçe</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Butik oteller, popüler yerel restoranlar, metro ve kısa taksi transferleri, rehberli ören yeri turları.
              </p>
            </button>

            {/* Lüks */}
            <button
              type="button"
              onClick={() => setBudgetLevel('luxury')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                budgetLevel === 'luxury'
                  ? 'border-purple-600 bg-purple-50/70 shadow-md shadow-purple-600/10'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">✨</span>
                {budgetLevel === 'luxury' && (
                  <span className="text-xs font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full">
                    Seçildi
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-900 text-base">Lüks & Konforlu</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                5 yıldızlı ve seçkin oteller, gurme fine dining akşamları, özel araç transferleri, VIP deneyimler.
              </p>
            </button>
          </div>

          {/* Bütçe Miktarı & Kişi Sayısı */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center">
                <Wallet className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Hedef Bütçe Tutarı (Opsiyonel)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  placeholder="Örn: 15000"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Para Birimi
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                <option value="TRY">₺ TRY (Türk Lirası)</option>
                <option value="EUR">€ EUR (Euro)</option>
                <option value="USD">$ USD (Amerikan Doları)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center">
                <Users className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Kişi Sayısı
              </label>
              <select
                value={travelersCount}
                onChange={(e) => setTravelersCount(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                <option value={1}>1 Kişi (Yalnız Seyahat Eden)</option>
                <option value={2}>2 Kişi (Çift / Arkadaşlar)</option>
                <option value={3}>3 Kişi (Küçük Grup)</option>
                <option value={4}>4 Kişi (Aile / Arkadaş Grubu)</option>
                <option value={5}>5+ Kişi (Grup)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 5. SEYAHAT İLGİ ALANLARI & ÖZEL TALEPLER */}
        <div className="space-y-4 pt-2">
          <label className="block text-sm font-bold text-slate-800 tracking-wide uppercase">
            5. Seyahat İlgi Alanları & Notlar
          </label>
          <div className="flex flex-wrap gap-2">
            {TRAVEL_STYLES.map((style) => {
              const isSelected = selectedStyles.includes(style.label);
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => toggleStyle(style.label)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  <span>{style.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <input
              type="text"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Özel İstekleriniz (Örn: Çocukla seyahat ediyoruz, vejetaryen seçenekler olsun, yürüme mesafeleri kısa olsun...)"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON & PROGRESS */}
        <div className="pt-4 border-t border-slate-200">
          {isLoading ? (
            <div className="p-6 bg-sky-50/80 rounded-2xl border border-sky-200 text-center space-y-4">
              <div className="inline-flex p-3 rounded-full bg-sky-600 text-white animate-spin">
                <Compass className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Seyahat Planınız Hazırlanıyor...
                </h3>
                <p className="text-sm font-semibold text-sky-700 mt-1 transition-all duration-300 animate-pulse">
                  {loadingSteps[loadingStep]}
                </p>
              </div>
              <div className="w-full bg-sky-200 h-2 rounded-full overflow-hidden max-w-md mx-auto">
                <div
                  className="bg-gradient-to-r from-sky-600 to-indigo-600 h-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min(95, ((loadingStep + 1) / loadingSteps.length) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-4.5 px-8 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-indigo-700 text-white font-extrabold text-lg sm:text-xl shadow-lg shadow-sky-600/25 hover:from-sky-700 hover:via-indigo-700 hover:to-indigo-800 transition-all flex items-center justify-center space-x-3 cursor-pointer group hover:scale-[1.005] active:scale-[0.995]"
            >
              <Sparkles className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Bana Özel {totalDays} Günlük Gezi Planı Oluştur</span>
              <ChevronRight className="w-6 h-6 text-sky-200 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
