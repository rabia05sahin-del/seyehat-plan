import React from 'react';
import { LocalDish } from '../types/travel';
import { Utensils, MapPin, Tag, ThumbsUp, DollarSign } from 'lucide-react';

interface CuisineSectionProps {
  dishes: LocalDish[];
  destinationName: string;
}

export const CuisineSection: React.FC<CuisineSectionProps> = ({
  dishes,
  destinationName,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold text-slate-900">
              {destinationName} - Ne Yenir, Nerede Yenir?
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
              {dishes.length} Lezzet
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Bölgenin en meşhur lezzetleri ve bütçenize uygun önerilen adresler.
          </p>
        </div>
        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 items-center justify-center shrink-0">
          <Utensils className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dishes.map((dish, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-base font-bold text-slate-900 flex items-center">
                  <span className="mr-2">🍽️</span>
                  {dish.dishName}
                </h4>

                {dish.budgetFriendly ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 shrink-0">
                    <ThumbsUp className="w-3 h-3" />
                    <span>Bütçe Dostu</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 shrink-0">
                    <Tag className="w-3 h-3" />
                    <span>Gurme Deneyim</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {dish.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-start space-x-2 text-xs bg-slate-50 p-2.5 rounded-xl">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 font-bold">Nerede Denenmeli: </strong>
                <span className="text-slate-600">{dish.whereToEat}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
