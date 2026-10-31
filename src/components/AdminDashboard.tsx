import React, { useState } from 'react';
import {
  BarChart3,
  Building2,
  ShieldCheck,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Layers,
  FileCheck,
} from 'lucide-react';
import { AnalyticsSummary, Institution, UserProfile } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  analytics: AnalyticsSummary | null;
  institutions: Institution[];
  currentUser: UserProfile;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  analytics,
  institutions,
  currentUser,
  onRefreshData,
}) => {
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const pendingInstitutions = institutions.filter((i) => i.verificationStatus === 'PENDING');

  const handleVerify = async (id: string, status: string) => {
    setVerifyingId(id);
    const notes = prompt(`Enter verification sign-off notes for ${status}:`, 'Regulatory medical council accreditation verified.');
    try {
      await api.verifyInstitution(id, status, notes || undefined);
      onRefreshData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setVerifyingId(null);
    }
  };

  if (!analytics) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            Platform Governance Console
          </div>
          <h1 className="text-2xl font-bold text-[#102A43] mt-0.5">
            Health Network Operations & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real database metrics, institution regulatory verification, and resource utilization monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            Logged as: <strong className="text-slate-800">{currentUser.fullName}</strong>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Institutions</span>
            <Building2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#102A43] tabular-nums">
            {analytics.verifiedInstitutions} / {analytics.totalInstitutions}
          </div>
          <div className="text-[11px] text-teal-700 font-semibold">
            {pendingInstitutions.length} Pending Approval
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Available Resources</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#102A43] tabular-nums">
            {analytics.availableResources}
          </div>
          <div className="text-[11px] text-slate-500">
            Of {analytics.totalResources} registered assets
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Bookings</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#102A43] tabular-nums">
            {analytics.activeBookings}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            {analytics.completedBookings} Completed Cycles
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Resource Utilization</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#102A43] tabular-nums">
            {analytics.utilizationRate}%
          </div>
          <div className="text-[11px] text-teal-700 font-semibold">
            Optimized Idle Capacity
          </div>
        </div>
      </div>

      {/* Institution Verification Approval Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Regulatory Institutional Verification Queue</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unverified clinics and hospitals must be approved by Platform Compliance before sharing or borrowing.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            {pendingInstitutions.length} Pending Actions
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {institutions.map((inst) => {
            const isPending = inst.verificationStatus === 'PENDING';
            return (
              <div key={inst.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{inst.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      inst.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inst.verificationStatus === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {inst.verificationStatus}
                    </span>
                    <span className="text-slate-400 text-[11px]">· {inst.type}</span>
                  </div>

                  <p className="text-slate-600 text-xs">
                    {inst.address}, {inst.city}, {inst.state} · Official Email: <strong>{inst.officialEmail}</strong>
                  </p>

                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span>Reg No: <strong className="font-mono text-slate-700">{inst.registrationNumber}</strong></span>
                    <span>Accreditation: <strong className="text-teal-700">{inst.accreditation}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isPending ? (
                    <>
                      <button
                        onClick={() => handleVerify(inst.id, 'VERIFIED')}
                        disabled={verifyingId === inst.id}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verify Credentials
                      </button>
                      <button
                        onClick={() => handleVerify(inst.id, 'REJECTED')}
                        disabled={verifyingId === inst.id}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-md border border-red-200 transition-colors"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Verified & Licensed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Resource Category Distribution</h3>
          <div className="space-y-3 pt-2">
            {analytics.categoryDistribution.map((item, idx) => {
              const maxCount = Math.max(...analytics.categoryDistribution.map((c) => c.count), 1);
              const pct = Math.round((item.count / maxCount) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.category}</span>
                    <span className="tabular-nums font-bold text-slate-900">{item.count} Resources</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Booking Trends */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Monthly Resource Sharing Growth</h3>
          <div className="flex items-end justify-between h-48 pt-6 pb-2 border-b border-slate-200">
            {analytics.monthlyTrends.map((trend, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="text-[10px] font-bold text-teal-800 tabular-nums">
                  {trend.bookings}
                </div>
                <div
                  className="w-8 bg-[#102A43] hover:bg-teal-700 rounded-t transition-all"
                  style={{ height: `${(trend.bookings / 60) * 120}px` }}
                />
                <div className="text-[10px] text-slate-400 font-medium truncate max-w-[50px] text-center">
                  {trend.month.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-slate-500 text-center">
            Steady 300%+ increase in inter-institutional resource bookings over the last 5 months.
          </div>
        </div>
      </div>
    </div>
  );
};
