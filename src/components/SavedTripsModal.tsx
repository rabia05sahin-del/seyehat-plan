import React from 'react';
import { TravelPlan } from '../types/travel';
import { X, Bookmark, Calendar, MapPin, Trash2, ArrowRight } from 'lucide-react';

interface SavedTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTrips: TravelPlan[];
  onSelectTrip: (trip: TravelPlan) => void;
  onDeleteTrip: (id: string) => void;
}

export const SavedTripsModal: React.FC<SavedTripsModalProps> = ({
  isOpen,
  onClose,
  savedTrips,
  onSelectTrip,
  onDeleteTrip,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Kaydedilen Seyahat Planlarım</h3>
              <p className="text-xs text-slate-500">
                Daha önce oluşturduğunuz ve kaydettiğiniz gezi programları
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {savedTrips.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl">
                🗺️
              </div>
              <h4 className="font-bold text-slate-800 text-base">Henüz kayıtlı bir plan yok</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Bir seyahat planı oluşturduktan sonra "Planı Kaydet" butonuna basarak seyahatlerinizi burada saklayabilirsiniz.
              </p>
            </div>
          ) : (
            savedTrips.map((trip, idx) => (
              <div
                key={trip.id || idx}
                className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100">
                      {trip.summary.durationDays} Gün
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {trip.summary.tripType === 'domestic' ? '🇹🇷 Yurt İçi' : '🌍 Yurt Dışı'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{trip.summary.title}</h4>
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trip.summary.destination}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trip.summary.datesFormatted}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      onSelectTrip(trip);
                      onClose();
                    }}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors"
                  >
                    <span>Görüntüle</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteTrip(trip.id || '')}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Planı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
