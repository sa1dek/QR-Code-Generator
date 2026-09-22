import React, { useState } from "react";
import {
<<<<<<< HEAD
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
} from "lucide-react";
import { type Card, getCardStatus, type CardStatus } from "../../types/card";
import { getShortCardUrl } from "../../lib/utils";
import { useToast } from "../ui/Toast";

interface CardRowProps {
  card: Card;
  onEdit: (card: Card) => void;
  onShowQR: (card: Card) => void;
  onDelete: (card: Card) => void;
  onSimulateScan: (card: Card) => void;
}

export const CardRow: React.FC<CardRowProps> = ({
  card,
  onEdit,
  onShowQR,
  onDelete,
  onSimulateScan,
}) => {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const status: CardStatus = getCardStatus(card);
  const shortUrl = getShortCardUrl(card.card_id);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    success("تم نسخ الرابط المختصر للكارت");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestTargetUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (card.target_url) {
      window.open(card.target_url, "_blank", "noopener,noreferrer");
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(card);
  };

  return (
    <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-200/70 text-right group">
      {/* 1. Card ID & Short Link */}
      <td className="py-4 px-4 align-middle">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-slate-900 tracking-wide">
              {card.card_id}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              title="نسخ رابط NFC / QR"
              className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <a
            href={`/r/${encodeURIComponent(card.card_id)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-blue-600 hover:text-blue-800 hover:underline dir-ltr text-right inline-flex items-center gap-1 max-w-[180px]"
            title="فتح رابط التحويل (تجربة الرابط)"
          >
            <span>/r/{card.card_id}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>
        </div>
      </td>

      {/* 2. Status Badge */}
      <td className="py-4 px-4 align-middle">
        {status === "active" && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>مُفعّل (Active)</span>
          </span>
        )}
        {status === "unassigned" && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>غير مخصص (Unassigned)</span>
          </span>
        )}
        {status === "inactive" && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>معطل (Inactive)</span>
          </span>
        )}
      </td>

      {/* 3. Client Name */}
      <td className="py-4 px-4 align-middle font-medium text-sm text-slate-800">
        {card.client_name ? (
          <span>{card.client_name}</span>
        ) : (
          <span className="text-xs text-slate-400 italic">
            لم يُعيّن عميل بعد
          </span>
        )}
      </td>

      {/* 4. Target URL / Google Review Link */}
      <td className="py-4 px-4 align-middle max-w-[220px]">
        {card.target_url ? (
          <div className="flex items-center gap-1.5">
            <span
              className="text-xs font-mono text-slate-500 truncate dir-ltr"
              title={card.target_url}
            >
              {card.target_url}
            </span>
            <a
              href={card.target_url}
              target="_blank"
              rel="noopener noreferrer"
              title="فتح رابط الوجهة مباشرة"
              className="p-1 rounded text-blue-600 hover:text-blue-800 hover:bg-blue-50 shrink-0 inline-flex items-center"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">—</span>
        )}
      </td>

      {/* 5. Scan Count */}
      <td className="py-4 px-4 align-middle text-center">
        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 font-mono text-xs font-semibold text-slate-800">
          {(card.scan_count || 0).toLocaleString()}
        </span>
      </td>

      {/* 6. Actions */}
      <td className="py-4 px-4 align-middle text-left">
        <div className="flex items-center justify-end gap-1">
          {/* Quick scan simulator */}
          <button
            type="button"
            onClick={() => onSimulateScan(card)}
            title="محاكاة مسح الكارت عبر NFC / QR"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* QR Code */}
          <button
            type="button"
            onClick={() => onShowQR(card)}
            title="عرض وطباعة QR Code"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Edit / Assign */}
          <button
            type="button"
            onClick={() => onEdit(card)}
            title="تعديل أو تخصيص الكارت"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={handleDeleteClick}
            title="حذف الكارت"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
=======
  Search,
  Plus,
  RefreshCw,
  CreditCard,
  QrCode,
  Copy,
  ExternalLink,
  Edit2,
  Trash2,
  Check,
  Eye,
} from "lucide-react";
import { Card, getCardStatus } from "../../types/card";
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filters = [
    { id: "all", label: "الكل" },
    { id: "active", label: "المفعلة" },
    { id: "unassigned", label: "غير مخصصة" },
    { id: "inactive", label: "معطلة" },
  ];

  const handleCopyLink = (cardId: string) => {
    navigator.clipboard.writeText(getShortCardUrl(cardId));
    setCopiedId(cardId);
    success("تم نسخ الرابط المختصر للكارت");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden"
      dir="rtl"
    >
      {/* Table Toolbar Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="w-full md:w-80">
          <Input
            placeholder="بحث بمعرف الكارت أو اسم العميل..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftElement={<Search className="w-4 h-4" />}
            className="text-xs sm:text-sm"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2">
          {/* Filter Chips */}
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

      {/* Desktop Table View */}
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
                  <p className="text-base font-bold text-slate-800">
                    لا توجد كروت مطابقة
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards View (ظاهر على التليفون والمقاسات الصغيرة) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {isLoading && cards.length === 0 ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={`m-skel-${i}`} className="p-4 space-y-3 animate-pulse">
              <div className="h-5 w-32 bg-slate-100 rounded" />
              <div className="h-4 w-48 bg-slate-100 rounded" />
              <div className="h-8 w-full bg-slate-100 rounded" />
            </div>
          ))
        ) : cards.length > 0 ? (
          cards.map((card) => {
            const status = getCardStatus(card);
            return (
              <div
                key={card.card_id}
                className="p-4 space-y-3 bg-white hover:bg-slate-50/50 transition-colors"
              >
                {/* Header: ID + Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {card.card_id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(card.card_id)}
                      className="p-1 rounded bg-slate-100 text-slate-500 hover:text-slate-800"
                      title="نسخ الرابط"
                    >
                      {copiedId === card.card_id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div>
                    {status === "active" && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        مُفعّل
                      </span>
                    )}
                    {status === "unassigned" && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        غير مخصص
                      </span>
                    )}
                    {status === "inactive" && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        معطل
                      </span>
                    )}
                  </div>
                </div>

                {/* Client Name */}
                <div className="text-xs text-slate-700">
                  <span className="text-slate-400 block text-[11px]">
                    العميل المخصص:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {card.client_name || "— لم يُعيّن عميل بعد —"}
                  </span>
                </div>

                {/* Redirect Link */}
                {card.target_url && (
                  <div className="flex items-center justify-between text-xs font-mono text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                    <span className="truncate dir-ltr text-right flex-1 text-[11px]">
                      {card.target_url}
                    </span>
                    <a
                      href={card.target_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-blue-600 hover:text-blue-800 shrink-0 mr-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Bottom Actions Bar on Mobile */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">
                    المسحات:{" "}
                    <strong className="font-mono text-slate-900 font-bold">
                      {card.scan_count || 0}
                    </strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* QR Code Button */}
                    <button
                      type="button"
                      onClick={() => onShowQR(card)}
                      className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg font-medium flex items-center gap-1"
                      title="عرض QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                      <span className="text-[11px]">QR</span>
                    </button>

                    {/* Simulate Button */}
                    <button
                      type="button"
                      onClick={() => onSimulateScan(card)}
                      className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg"
                      title="تجربة"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => onEditCard(card)}
                      className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg"
                      title="تعديل"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => onDeleteCard(card)}
                      className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center p-4">
            <p className="text-sm font-bold text-slate-700">
              لا توجد كروت حتى الآن
            </p>
          </div>
        )}
      </div>
    </div>
>>>>>>> 30474e6 (Update responsive layout for QR codes and mobile design)
  );
};
