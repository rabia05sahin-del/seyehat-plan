import React, { useState } from 'react';
import { DayItinerary } from '../types/travel';
import {
  Sun,
  Sunset,
  Moon,
  MapPin,
  Utensils,
  Lightbulb,
  Wallet,
  Calendar,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

interface ItineraryViewProps {
  itinerary: DayItinerary[];
  destinationName: string;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  destinationName,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | 'all'>('all');

  const displayedDays =
    selectedDayIndex === 'all'
      ? itinerary
      : [itinerary[selectedDayIndex as number]];

  return (
    <div className="space-y-6">
      {/* Day Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedDayIndex('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer ${
            selectedDayIndex === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Tüm Günleri Göster ({itinerary.length} Gün)
        </button>

        {itinerary.map((day, idx) => (
          <button
            key={day.dayNumber || idx}
            onClick={() => setSelectedDayIndex(idx)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all flex items-center space-x-1.5 cursor-pointer ${
              selectedDayIndex === idx
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{day.dayNumber}. Gün</span>
          </button>
        ))}
      </div>

      {/* Days List */}
      <div className="space-y-8">
        {displayedDays.map((day) => (
          <div
            key={day.dayNumber}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs"
          >
            {/* Day Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-6 py-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-sky-500 text-white text-xs font-black tracking-wider uppercase">
                    {day.dayNumber}. Gün
                  </span>
                  <span className="text-xs text-sky-200 font-semibold">{day.theme}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mt-1 text-white">{day.title}</h3>
              </div>

              {/* Day Budget Badge */}
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 self-start sm:self-auto">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <div className="text-right">
                  <span className="text-[10px] text-slate-300 block">Günlük Tahmini Harcama</span>
                  <span className="text-xs font-bold text-white">{day.estimatedDayBudget}</span>
                </div>
              </div>
            </div>

            {/* Time Blocks: Sabah, Öğle, Akşam */}
            <div className="p-6 space-y-6">
              {/* 1. SABAH */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs border border-amber-200">
                  <Sun className="w-5 h-5" />
                </div>
                <div className="flex-1 bg-amber-50/40 border border-amber-100/80 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black tracking-wider uppercase text-amber-800">
                      Sabah Rotası
                    </span>
                    {day.morning.costEstimate && (
                      <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {day.morning.costEstimate}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mt-1">
                    {day.morning.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {day.morning.description}
                  </p>
                  <div className="mt-2.5 flex items-center space-x-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-medium text-slate-700">{day.morning.location}</span>
                  </div>
                </div>
              </div>

              {/* 2. ÖĞLE */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 shadow-xs border border-sky-200">
                  <Sunset className="w-5 h-5" />
                </div>
                <div className="flex-1 bg-sky-50/40 border border-sky-100/80 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black tracking-wider uppercase text-sky-800">
                      Öğle & Öğleden Sonra
                    </span>
                    {day.afternoon.costEstimate && (
                      <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {day.afternoon.costEstimate}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mt-1">
                    {day.afternoon.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {day.afternoon.description}
                  </p>
                  <div className="mt-2.5 flex items-center space-x-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" />
                    <span className="font-medium text-slate-700">{day.afternoon.location}</span>
                  </div>

                  {/* Lunch recommendation */}
                  {day.afternoon.lunchRecommendation && (
                    <div className="mt-3 pt-2.5 border-t border-sky-200/60 flex items-start space-x-2 text-xs bg-white p-2.5 rounded-xl border border-sky-200/50">
                      <Utensils className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800 font-bold">Öğle Yemeği Önerisi: </strong>
                        <span className="text-slate-600">
                          {day.afternoon.lunchRecommendation}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. AKŞAM */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 shadow-xs border border-indigo-200">
                  <Moon className="w-5 h-5" />
                </div>
                <div className="flex-1 bg-indigo-50/40 border border-indigo-100/80 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black tracking-wider uppercase text-indigo-800">
                      Akşam & Gece
                    </span>
                    {day.evening.costEstimate && (
                      <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {day.evening.costEstimate}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mt-1">
                    {day.evening.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {day.evening.description}
                  </p>

                  {/* Dinner recommendation */}
                  {day.evening.dinnerRecommendation && (
                    <div className="mt-3 pt-2.5 border-t border-indigo-200/60 flex items-start space-x-2 text-xs bg-white p-2.5 rounded-xl border border-indigo-200/50">
                      <Utensils className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800 font-bold">Akşam Yemeği & Mekan: </strong>
                        <span className="text-slate-600">
                          {day.evening.dinnerRecommendation}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Day Tips */}
              {day.dayTips && (
                <div className="mt-2 bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-start space-x-2.5 text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-slate-700 leading-normal">
                    <strong className="font-bold text-slate-900">Günün Kritik İpucu: </strong>
                    {day.dayTips}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
