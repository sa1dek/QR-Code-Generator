import React, { useState } from 'react';
import { Radio, ArrowLeft, Smartphone, QrCode, ShieldCheck, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { getBaseAppUrl } from '../../lib/utils';

interface HomePageProps {
  onGoToLogin: () => void;
  onGoToDashboard: () => void;
  isAuthenticated: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  onGoToLogin,
  onGoToDashboard,
  isAuthenticated,
}) => {
  const origin = getBaseAppUrl();
  const [testCardId, setTestCardId] = useState('CARD-001');

  const handleTestRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (testCardId.trim()) {
      window.open(`/r/${encodeURIComponent(testCardId.trim())}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-slate-900 selection:text-white" dir="rtl">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900">Dynamic Review Cards</span>
              <span className="block text-[11px] text-slate-500 font-mono">نظام كروت NFC و QR التفاعلية</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button size="sm" onClick={onGoToDashboard} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                لوحة التحكم (Dashboard)
              </Button>
            ) : (
              <Button size="sm" onClick={onGoToLogin} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                تسجيل الدخول (Admin Login)
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col items-center text-center">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 border border-slate-300 text-slate-800 text-xs font-semibold mb-6">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span>توجيه فوري بدون إعادة برمجة الكارت</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          Dynamic Review Cards
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8">
          Manage your NFC &amp; QR review cards from one dashboard.
          <br className="hidden sm:inline" />
          اربط كروت التقييم الثابتة بروابط Google Review المتغيرة في أي وقت، دون الحاجة لإعادة طباعة الكارت أو برمجته مجدداً.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          <Button
            size="lg"
            onClick={isAuthenticated ? onGoToDashboard : onGoToLogin}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
          >
            {isAuthenticated ? 'الدخول إلى لوحة التحكم' : 'تسجيل دخول المسؤول (Admin Login)'}
          </Button>

          <a
            href="/r/CARD-001"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <span>تجربة مسح كارت نشط (/r/CARD-001)</span>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </a>
        </div>

        {/* Interactive Simulator Card Box */}
        <div className="w-full max-w-xl bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm text-right">
          <h2 className="text-sm font-bold text-slate-900 mb-1">
            تجربة فاحص الروابط الديناميكية (Quick Redirect Tester)
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            جرب كتابة أي معرف كارت لمعرفة كيفية استجابة النظام (نشط، غير مخصص، أو غير موجود):
          </p>

          <form onSubmit={handleTestRedirect} className="flex gap-2">
            <input
              type="text"
              value={testCardId}
              onChange={(e) => setTestCardId(e.target.value.toUpperCase())}
              placeholder="CARD-001"
              className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-mono text-slate-900 dir-ltr text-center placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <Button type="submit" size="sm">
              اختبار التوجيه
            </Button>
          </form>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>نماذج سريعة:</span>
            <button
              type="button"
              onClick={() => setTestCardId('CARD-001')}
              className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono hover:bg-emerald-100"
            >
              CARD-001 (Active)
            </button>
            <button
              type="button"
              onClick={() => setTestCardId('CARD-004')}
              className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-mono hover:bg-amber-100"
            >
              CARD-004 (Unassigned)
            </button>
            <button
              type="button"
              onClick={() => setTestCardId('CARD-999')}
              className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-mono hover:bg-rose-100"
            >
              CARD-999 (Not Found)
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-12 text-right">
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Smartphone className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 mb-1">دعم كامل لـ NFC</h3>
            <p className="text-[11px] text-slate-500 leading-normal">
              مبرمج بعنوان ثابت يوجه تلقائياً إلى رابط تقييم العميل على هواتف iOS و Android.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <QrCode className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 mb-1">مولد QR Code ديناميكي</h3>
            <p className="text-[11px] text-slate-500 leading-normal">
              توليد وطباعة وتنزيل رموز QR عالية الدقة تشير إلى المعرف المتجدد.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 mb-1">خصوصية وتحليلات مسح</h3>
            <p className="text-[11px] text-slate-500 leading-normal">
              إحصائيات تفصيلية لعدد المسحات مع تشفير وإخفاء عناوين IP احتراماً للخصوصية.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <p>Dynamic Review Cards Management &bull; Production-Ready Architecture</p>
      </footer>
    </div>
  );
};
