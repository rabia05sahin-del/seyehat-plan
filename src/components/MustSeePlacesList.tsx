import React, { useState } from 'react';
import { MustSeePlace } from '../types/travel';
import {
  MapPin,
  Clock,
  Ticket,
  Compass,
  Lightbulb,
  ExternalLink,
  CheckCircle,
  Circle,
  Filter,
  Sparkles,
  Camera,
  Landmark,
  Trees,
  Utensils,
} from 'lucide-react';

interface MustSeePlacesListProps {
  places: MustSeePlace[];
  destinationName: string;
}

export const MustSeePlacesList: React.FC<MustSeePlacesListProps> = ({
  places,
  destinationName,
}) => {
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const toggleVisited = (id: string) => {
    setVisitedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredPlaces = places.filter((place) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'free')
      return (
        place.costCategory === 'free' ||
        place.ticketPriceEstimated.toLowerCase().includes('ücretsiz') ||
        place.ticketPriceEstimated.toLowerCase().includes('müzekart')
      );
    if (filterCategory === 'museum')
      return place.category === 'museum' || place.category === 'historic';
    if (filterCategory === 'nature')
      return place.category === 'nature' || place.category === 'viewpoint';
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'historic':
      case 'museum':
        return <Landmark className="w-4 h-4 text-amber-600" />;
      case 'nature':
      case 'viewpoint':
        return <Trees className="w-4 h-4 text-emerald-600" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-orange-600" />;
      default:
        return <Camera className="w-4 h-4 text-sky-600" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'historic':
        return 'Tarihi Miras';
      case 'museum':
        return 'Müze / Ören Yeri';
      case 'nature':
        return 'Doğa & Vadi';
      case 'viewpoint':
        return 'Seyir Noktası';
      case 'food':
        return 'Gastronomi';
      default:
        return 'Görülmesi Gereken';
    }
  };

  const progressPercent =
    places.length > 0 ? Math.round((visitedIds.length / places.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Title & Progress Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold text-slate-900">
              {destinationName} - Mutlaka Görülmesi Gereken Yerler
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
              {places.length} Önemli Nokta
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Gezdiğiniz veya görmek istediğiniz yerleri işaretleyerek listenizi takip edebilirsiniz.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium block">Gezi İlerlemesi</span>
            <span className="text-sm font-bold text-slate-900">
              {visitedIds.length} / {places.length} Yer Tamamlandı
            </span>
          </div>
          <div className="w-12 h-12 relative flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-200"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={113}
                strokeDashoffset={113 - (113 * progressPercent) / 100}
                className="text-emerald-500 transition-all duration-500"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[11px] font-black text-slate-700">
              %{progressPercent}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 flex items-center mr-1">
          <Filter className="w-3.5 h-3.5 mr-1" />
          Filtrele:
        </span>
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          Tümü ({places.length})
        </button>
        <button
          onClick={() => setFilterCategory('free')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterCategory === 'free'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          Ücretsiz & Müzekartlı Yerler
        </button>
        <button
          onClick={() => setFilterCategory('museum')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterCategory === 'museum'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          Tarih & Müzeler
        </button>
        <button
          onClick={() => setFilterCategory('nature')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterCategory === 'nature'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          Doğa & Manzaralar
        </button>
      </div>

      {/* Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlaces.map((place, index) => {
          const isVisited = visitedIds.includes(place.id || String(index));
          const mapsQuery = encodeURIComponent(
            place.googleMapsQuery || `${place.name} ${destinationName}`
          );

          return (
            <div
              key={place.id || index}
              className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
                isVisited
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <button
                      type="button"
                      onClick={() => toggleVisited(place.id || String(index))}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                      title={isVisited ? 'Gezildi olarak işaretlendi' : 'Gezildi olarak işaretle'}
                    >
                      {isVisited ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-500" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {getCategoryIcon(place.category)}
                          <span>{getCategoryLabel(place.category)}</span>
                        </span>
                      </div>
                      <h4
                        className={`text-base font-bold mt-1 ${
                          isVisited ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {place.name}
                      </h4>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                    title="Google Haritalar'da Gör"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  {place.shortDescription}
                </p>

                {/* Why visit highlight */}
                <p className="text-xs font-medium text-slate-800 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="font-bold text-sky-700">Neden Görmeli: </span>
                  {place.whyVisit}
                </p>

                {/* Meta details (Duration, Cost, Best Time) */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{place.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                    <Ticket className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{place.ticketPriceEstimated}</span>
                  </div>
                </div>

                {/* Best time */}
                <div className="mt-2 text-[11px] text-slate-500 flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>
                    <strong className="text-slate-700">En Uygun Zaman:</strong>{' '}
                    {place.bestTimeToVisit}
                  </span>
                </div>
              </div>

              {/* Insider Tip box */}
              {place.insiderTip && (
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-start space-x-2 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-900 leading-normal">
                    <strong className="font-bold text-amber-950">Yerel Halk Tüyosu:</strong>{' '}
                    {place.insiderTip}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
