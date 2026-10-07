import React, { useState } from 'react';
import { CheckSquare, Square, Luggage, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface PackingChecklistProps {
  initialItems: string[];
  destinationName: string;
}

export const PackingChecklist: React.FC<PackingChecklistProps> = ({
  initialItems,
  destinationName,
}) => {
  const [items, setItems] = useState<{ id: string; text: string; checked: boolean }[]>(
    initialItems.map((text, idx) => ({ id: String(idx), text, checked: false }))
  );
  const [newItemText, setNewItemText] = useState('');

  const toggleCheck = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newItemText.trim(), checked: false },
    ]);
    setNewItemText('');
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const completedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Luggage className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {destinationName} İçin Akıllı Bavul Listesi
            </h3>
            <p className="text-xs text-slate-500">
              Mevsime, hava koşullarına ve bölgeye özel hazırlanmış bavul kontrol listeniz.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            {completedCount} / {totalCount} Hazır
          </span>
        </div>
      </div>

      {/* Add new item input */}
      <form onSubmit={handleAddItem} className="flex gap-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Listeye yeni bir eşya ekle..."
          className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center space-x-1 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ekle</span>
        </button>
      </form>

      {/* Checklist items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
              item.checked
                ? 'bg-emerald-50/50 border-emerald-200 text-slate-400'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
            }`}
          >
            <div className="flex items-center space-x-2.5 overflow-hidden">
              {item.checked ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0" />
              )}
              <span
                className={`text-xs sm:text-sm font-medium truncate ${
                  item.checked ? 'line-through text-slate-400' : ''
                }`}
              >
                {item.text}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteItem(item.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-opacity"
              title="Sil"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
