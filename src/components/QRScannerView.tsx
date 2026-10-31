import React, { useState, useEffect } from 'react';
import {
  QrCode,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Camera,
  Sparkles,
  FileText,
  UserCheck,
  Building2,
  Clock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { Booking, ResourceCondition, UserProfile } from '../types';
import { api } from '../services/api';

interface QRScannerViewProps {
  bookings: Booking[];
  currentUser: UserProfile;
  initialBooking?: Booking | null;
  onHandoverComplete: () => void;
}

export const QRScannerView: React.FC<QRScannerViewProps> = ({
  bookings,
  currentUser,
  initialBooking,
  onHandoverComplete,
}) => {
  const [tokenInput, setTokenInput] = useState(initialBooking?.qrToken || '');
  const [action, setAction] = useState<'CHECK_IN' | 'CHECK_OUT'>(
    initialBooking?.status === 'CHECKED_OUT' ? 'CHECK_OUT' : 'CHECK_IN'
  );
  const [condition, setCondition] = useState<ResourceCondition>('EXCELLENT');
  const [comments, setComments] = useState(
    'Inspected serial plate, patient lead resistance, battery health 100%, original carry case present.'
  );
  const [damageIdentified, setDamageIdentified] = useState(false);
  const [damageDescription, setDamageDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter bookings that have active QR tokens
  const activeTokenBookings = bookings.filter(
    (b) => (b.status === 'APPROVED' || b.status === 'CHECKED_OUT') && b.qrToken
  );

  useEffect(() => {
    if (initialBooking && initialBooking.qrToken) {
      setTokenInput(initialBooking.qrToken);
      setAction(initialBooking.status === 'CHECKED_OUT' ? 'CHECK_OUT' : 'CHECK_IN');
    }
  }, [initialBooking]);

  const selectedBooking = bookings.find((b) => b.qrToken === tokenInput);

  const handleRunAiConditionAnalysis = async () => {
    setAiAnalyzing(true);
    setErrorMessage(null);
    try {
      const data = await api.analyzeCondition({
        beforeCondition: 'EXCELLENT',
        afterCondition: condition,
        comments,
        damageDescription: damageIdentified ? damageDescription : undefined,
        resourceName: selectedBooking?.resourceName || 'Biomedical Resource',
      });
      setAiAnalysisResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'AI condition analysis failed');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleExecuteScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setErrorMessage('Please provide or select a verified QR token.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await api.verifyAndScanQR({
        token: tokenInput,
        action,
        condition,
        notes: comments,
        damageIdentified,
        damageDescription: damageIdentified ? damageDescription : undefined,
      });

      setSuccessMessage(res.message);
      onHandoverComplete();
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-teal-700 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          Biomedical Safety & Logistics Authority
        </div>
        <h1 className="text-2xl font-bold text-[#102A43] mt-1">
          Cryptographic QR Check-In & Return Handover
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Verify digital tokens, record physical condition baseline, and execute authorized equipment transfer.
        </p>
      </div>

      {/* Role Verification Check */}
      {currentUser.role !== 'RESOURCE_MANAGER' && currentUser.role !== 'PLATFORM_ADMIN' && (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Role Limitation:</strong>
            You are currently browsing as <strong>{currentUser.role.replace('_', ' ')}</strong>. Physical handovers and condition sign-offs require an authorized <strong>Resource Manager</strong> or <strong>Platform Administrator</strong>. You can switch roles at the top of the screen to simulate this operation.
          </div>
        </div>
      )}

      {/* Quick Token Selectors */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          Simulate Camera QR Detection / Active Tokens
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeTokenBookings.length === 0 ? (
            <div className="text-xs text-slate-400 p-2 italic">
              No approved bookings currently awaiting QR handover. Create or approve a booking first.
            </div>
          ) : (
            activeTokenBookings.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setTokenInput(b.qrToken || '');
                  setAction(b.status === 'CHECKED_OUT' ? 'CHECK_OUT' : 'CHECK_IN');
                }}
                className={`p-3 rounded-lg border text-left transition-all text-xs flex flex-col justify-between ${
                  tokenInput === b.qrToken
                    ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono text-[11px] font-bold text-slate-700">{b.qrToken}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    b.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {b.status === 'APPROVED' ? 'Ready for Check-In' : 'Ready for Return'}
                  </span>
                </div>
                <div className="font-semibold text-slate-900 truncate">{b.resourceName}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {b.seekerInstitutionName} · {b.assignedPhysicianName}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Handover Inspection Form */}
      <form onSubmit={handleExecuteScan} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Handover Denied:</span> {errorMessage}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Transaction Committed:</span> {successMessage}
            </div>
          </div>
        )}

        {/* Action Type */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Handover Phase
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAction('CHECK_IN')}
              className={`py-2.5 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                action === 'CHECK_IN'
                  ? 'bg-[#102A43] text-white border-[#102A43] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Check-In (Equipment Collection)
            </button>
            <button
              type="button"
              onClick={() => setAction('CHECK_OUT')}
              className={`py-2.5 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                action === 'CHECK_OUT'
                  ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              Check-Out (Equipment Return)
            </button>
          </div>
        </div>

        {/* Token Input Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            QR Pass Cryptographic Token String
          </label>
          <div className="relative">
            <QrCode className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="e.g. MS-QR-889104-APOLLO-METRO"
              required
              className="w-full pl-10 pr-4 py-2 font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Verified Target Card if Token Matches */}
        {selectedBooking && (
          <div className="p-4 bg-teal-50/60 rounded-lg border border-teal-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-900">Token Verified in Database</span>
              <span className="text-[10px] text-teal-700 font-semibold uppercase">Booking #{selectedBooking.id}</span>
            </div>
            <p className="text-slate-800">
              <strong>Equipment:</strong> {selectedBooking.resourceName}
            </p>
            <p className="text-slate-600">
              <strong>Borrower:</strong> {selectedBooking.seekerInstitutionName} ({selectedBooking.assignedPhysicianName})
            </p>
          </div>
        )}

        {/* Physical Condition Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Physical & Clinical Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ResourceCondition)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            >
              <option value="EXCELLENT">EXCELLENT — Pristine / Factory Spec</option>
              <option value="GOOD">GOOD — Normal wear / Certified</option>
              <option value="FAIR">FAIR — Minor cosmetic wear</option>
              <option value="MAINTENANCE_REQUIRED">MAINTENANCE_REQUIRED — Defect noted</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Authorized Inspector
            </label>
            <div className="text-xs px-3 py-2 bg-slate-100 rounded-lg text-slate-700 font-medium">
              {currentUser.fullName} ({currentUser.department})
            </div>
          </div>
        </div>

        {/* Inspection Comments */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Biomedical Inspection Checklist & Notes
          </label>
          <textarea
            rows={2}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Flag Damage Toggle */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
            <input
              type="checkbox"
              checked={damageIdentified}
              onChange={(e) => setDamageIdentified(e.target.checked)}
              className="rounded-sm text-red-600 focus:ring-red-500"
            />
            <span className="text-red-700 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Flag Visible Damage / Missing Accessory Incident
            </span>
          </label>

          {damageIdentified && (
            <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
              <label className="block font-medium text-red-900">Damage or Defect Description</label>
              <textarea
                rows={2}
                value={damageDescription}
                onChange={(e) => setDamageDescription(e.target.value)}
                placeholder="Describe damage (e.g. cracked transducer casing, broken lead cable, liquid damage)..."
                required
                className="w-full px-3 py-1.5 text-xs bg-white border border-red-300 rounded text-slate-800 focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {/* AI Condition Analysis Button */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={handleRunAiConditionAnalysis}
            disabled={aiAnalyzing}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-slate-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            {aiAnalyzing ? 'Evaluating Notes with Gemini...' : 'Run AI Condition Assistant'}
          </button>
        </div>

        {/* AI Analysis Preview if run */}
        {aiAnalysisResult && (
          <div className="p-4 bg-teal-50/70 rounded-lg border border-teal-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-teal-900">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                AI Biomedical Discrepancy Assessment
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                aiAnalysisResult.severityFlag === 'CRITICAL_DEFECT' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Flag: {aiAnalysisResult.severityFlag || 'NORMAL'}
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed">{aiAnalysisResult.summary}</p>
            {aiAnalysisResult.recommendedVerificationSteps && (
              <div className="pt-1">
                <span className="font-semibold text-slate-800 text-[11px]">Recommended Engineering Verification:</span>
                <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 mt-0.5">
                  {aiAnalysisResult.recommendedVerificationSteps.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-[10px] text-slate-500 italic pt-1 border-t border-teal-200">
              {aiAnalysisResult.disclaimer || 'AI recommendations do not replace biomedical safety certification.'}
            </div>
          </div>
        )}

        {/* Final Execution Button */}
        <div className="pt-3 border-t border-slate-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#102A43] hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            {loading ? 'Validating Handover in Audit Log...' : `Authorize & Record Physical ${action === 'CHECK_IN' ? 'Check-In' : 'Return'}`}
          </button>
        </div>
      </form>
    </div>
  );
};
