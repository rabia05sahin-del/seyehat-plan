import React, { useState } from 'react';
import { BudgetOverview } from '../types/travel';
import {
  Wallet,
  PieChart,
  TrendingDown,
  Sparkles,
  BedDouble,
  Utensils,
  Landmark,
  Bus,
  CheckCircle2,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

interface BudgetBreakdownCardProps {
  budgetOverview: BudgetOverview;
  userBudgetAmount?: number;
  currency: string;
}

export const BudgetBreakdownCard: React.FC<BudgetBreakdownCardProps> = ({
  budgetOverview,
  userBudgetAmount,
  currency,
}) => {
  const [budgetMultiplier, setBudgetMultiplier] = useState<number>(1);

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'EUR':
        return '€';
      case 'USD':
        return '$';
      default:
        return '₺';
    }
  };

  const currSymbol = getCurrencySymbol(currency);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-800 p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md mb-2">
              <Wallet className="w-3.5 h-3.5 text-emerald-300" />
              <span>Bütçe Optimizasyonu & Harcama Tahmini</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              {budgetOverview.level}
            </h3>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
            <span className="text-[11px] text-emerald-200 block">Tahmini Toplam Maliyet</span>
            <span className="text-lg sm:text-xl font-extrabold text-white">
              {budgetOverview.estimatedTotalCost}
            </span>
            <span className="text-[11px] text-white/80 block mt-0.5">
              {budgetOverview.dailyPerPersonCost}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Category Breakdown Grid */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
            <PieChart className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            Harcama Kalemleri Dağılımı
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Konaklama */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <BedDouble className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-900 block">Konaklama</span>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {budgetOverview.costBreakdown.accommodation}
                </p>
              </div>
            </div>

            {/* Yeme - İçme */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 block">Yeme & İçme</span>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {budgetOverview.costBreakdown.foodAndDrink}
                </p>
              </div>
            </div>

            {/* Aktiviteler ve Müzeler */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-900 block">Müzeler & Turlar</span>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {budgetOverview.costBreakdown.activitiesAndMuseums}
                </p>
              </div>
            </div>

            {/* Yerel Ulaşım */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-900 block">Şehir İçi Ulaşım</span>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {budgetOverview.costBreakdown.localTransport}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Saving Tips */}
        {budgetOverview.savingTips && budgetOverview.savingTips.length > 0 && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4.5 space-y-3">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center">
              <TrendingDown className="w-4 h-4 mr-1.5 text-emerald-600" />
              Bütçenize Özel Tasarruf Tüyoları
            </h4>
            <div className="space-y-2">
              {budgetOverview.savingTips.map((tip, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Specified Budget Check */}
        {userBudgetAmount && userBudgetAmount > 0 && (
          <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 flex items-start space-x-3">
            <DollarSign className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs text-sky-950">
              <strong className="font-bold">Belirlediğiniz Hedef Bütçe: </strong>
              {userBudgetAmount.toLocaleString('tr-TR')} {currSymbol}
              <p className="mt-1 text-sky-800">
                Oluşturulan seyahat planı ve yeme-içme rotaları bu bütçe tavanı dikkate alınarak dengelenmiştir.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
