import React, { useState } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  CreditCard,
  Copy,
  ExternalLink,
  QrCode,
  Edit2,
  Trash2,
} from "lucide-react";
import { type Card, getCardStatus } from "../../types/card";
import { CardRow } from "./CardRow";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { getShortCardUrl } from "../../lib/utils";
import { useToast } from "../ui/Toast";

interface CardsTableProps {
  cards: Card[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: string;
  onFilterChange: (f: string) => void;
  onOpenCreateModal: () => void;
  onEditCard: (card: Card) => void;
  onShowQR: (card: Card) => void;
  onDeleteCard: (card: Card) => void;
  onSimulateScan: (card: Card) => void;
  onRefresh: () => void;
}

export const CardsTable: React.FC<CardsTableProps> = ({
  cards,
  isLoading,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onOpenCreateModal,
  onEditCard,
  onShowQR,
  onDeleteCard,
  onSimulateScan,
  onRefresh,
}) => {
  const { success } = useToast();
  const [mobileCopiedId, setMobileCopiedId] = useState<string | null>(null);

  const filters = [
    { id: "all", label: "الكل" },
    { id: "active", label: "المفعلة" },
    { id: "unassigned", label: "غير مخصصة" },
    { id: "inactive", label: "معطلة" },
  ];

  const handleMobileCopy = (cardId: string) => {
    navigator.clipboard.writeText(getShortCardUrl(cardId));
    setMobileCopiedId(cardId);
    success("تم نسخ الرابط المختصر");
    setTimeout(() => setMobileCopiedId(null), 2000);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden"
      dir="rtl"
    >
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <Input
            placeholder="بحث بمعرف الكارت أو اسم العميل..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftElement={<Search className="w-4 h-4" />}
            className="text-xs sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2">
          <div className="inline-flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl">
            {filters.map((f) => (
              <button
                type="button"
                key={f.id}
                onClick={() => onFilterChange(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none ${
                  activeFilter === f.id
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              title="تحديث البيانات"
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>

            <Button
              type="button"
              size="sm"
              onClick={onOpenCreateModal}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              إضافة كروت
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">معرف الكارت</th>
              <th className="py-3 px-4">الحالة</th>
              <th className="py-3 px-4">العميل المخصص</th>
              <th className="py-3 px-4">رابط التقييم (Google Review)</th>
              <th className="py-3 px-4 text-center">عمليات المسح</th>
              <th className="py-3 px-4 text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && cards.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 bg-slate-100 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-20 bg-slate-100 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-32 bg-slate-100 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-48 bg-slate-100 rounded" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="h-4 w-8 bg-slate-100 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-left">
                    <div className="h-6 w-24 bg-slate-100 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : cards.length > 0 ? (
              cards.map((card) => (
                <CardRow
                  key={card.card_id}
                  card={card}
                  onEdit={onEditCard}
                  onShowQR={onShowQR}
                  onDelete={onDeleteCard}
                  onSimulateScan={onSimulateScan}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-800">
                        لا توجد كروت مطابقة
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {searchQuery
                          ? "جرب البحث بكلمات أخرى أو تغيير الفلتر"
                          : "ابدأ بإنشاء أول كارت ديناميكي"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onOpenCreateModal}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      إنشاء كارت جديد
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
