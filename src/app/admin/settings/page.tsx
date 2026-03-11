'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { apiGet, apiPost } from '@/lib/api-client';

export default function AdminSettingsPage() {
  const { changePassword } = useAuth();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg('');
    if (newPw.length < 6) {
      setPwMsg('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setPwError(true);
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg('كلمتا المرور غير متطابقتين');
      setPwError(true);
      return;
    }
    setSaving(true);
    try {
      const ok = await changePassword(currentPw, newPw);
      if (ok) {
        setPwMsg('تم تغيير كلمة المرور بنجاح');
        setPwError(false);
        setCurrentPw('');
        setNewPw('');
        setConfirmPw('');
      } else {
        setPwMsg('كلمة المرور الحالية غير صحيحة');
        setPwError(true);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await apiGet('/api/settings/export');
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ishraqah-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('فشل تصدير البيانات');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result as string);
        await apiPost('/api/settings/import', data);
        setImportMsg('تم استيراد البيانات بنجاح');
      } catch {
        setImportMsg('فشل استيراد البيانات. تأكد من صحة الملف.');
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Change Password */}
      <div className="bg-white rounded-xl border border-cream-dark/30 p-5">
        <h3 className="text-sm font-bold text-charcoal mb-4">تغيير كلمة المرور</h3>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="كلمة المرور الحالية"
            required
            disabled={saving}
            className="w-full px-3 py-2 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 disabled:opacity-50"
          />
          <input
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="كلمة المرور الجديدة"
            required
            disabled={saving}
            className="w-full px-3 py-2 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 disabled:opacity-50"
          />
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="تأكيد كلمة المرور الجديدة"
            required
            disabled={saving}
            className="w-full px-3 py-2 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 disabled:opacity-50"
          />
          {pwMsg && (
            <p className={`text-xs px-3 py-2 rounded-lg ${pwError ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>{pwMsg}</p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-charcoal hover:bg-charcoal-light rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {saving ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
          </button>
        </form>
      </div>

      {/* Export / Import */}
      <div className="bg-white rounded-xl border border-cream-dark/30 p-5">
        <h3 className="text-sm font-bold text-charcoal mb-4">النسخ الاحتياطي</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-4 py-2 text-sm font-medium text-white bg-teal hover:bg-teal-light rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {exporting && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {exporting ? 'جاري التصدير...' : 'تصدير البيانات'}
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={importing}
              className="px-4 py-2 text-sm font-medium text-charcoal bg-cream-warm hover:bg-cream-dark rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {importing && <div className="w-3.5 h-3.5 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />}
              {importing ? 'جاري الاستيراد...' : 'استيراد البيانات'}
            </button>
            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          </div>
          {importMsg && <p className="text-xs text-teal">{importMsg}</p>}
          <p className="text-xs text-charcoal-light">
            تصدير البيانات يحفظ جميع الاستشارات ونتائج الاختبار ورسائل الزوار والمقالات والاقتباسات.
          </p>
        </div>
      </div>
    </div>
  );
}
