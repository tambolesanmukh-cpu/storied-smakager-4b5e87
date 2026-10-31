import React, { useState } from 'react';
import {
  CalendarCheck,
  QrCode,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building2,
  User,
  ArrowRight,
  Filter,
  Eye,
  FileCheck,
} from 'lucide-react';
import { Booking, BookingStatus, UserProfile } from '../types';
import { api } from '../services/api';

interface BookingsViewProps {
  bookings: Booking[];
  currentUser: UserProfile;
  onRefreshBookings: () => void;
  onOpenQRPass: (booking: Booking) => void;
  onOpenQRScanner: (booking?: Booking) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  currentUser,
  onRefreshBookings,
  onOpenQRPass,
  onOpenQRScanner,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'CHECKED_OUT' | 'COMPLETED' | 'INCIDENT_REVIEW'>('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filtered = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    return b.status === activeTab;
  });

  const handleApprove = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      await api.updateBookingStatus(bookingId, 'APPROVED', 'Verified by clinical equipment authority.');
      onRefreshBookings();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (bookingId: string) => {
    const reason = prompt('Please specify rejection reason for the applicant:', 'Scheduling conflict or equipment reallocation');
    if (!reason) return;

    setActionLoading(bookingId);
    try {
      await api.updateBookingStatus(bookingId, 'REJECTED', reason);
      onRefreshBookings();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Approved · Ready for QR
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending Review
          </span>
        );
      case 'CHECKED_OUT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            Checked Out (In Clinical Use)
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <FileCheck className="w-3 h-3 text-slate-500" />
            Returned & Audited
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" />
            Declined
          </span>
        );
      case 'INCIDENT_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            <AlertTriangle className="w-3 h-3 text-purple-600" />
            Incident Review Active
          </span>
        );
      default:
        return <span className="text-[11px] text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">Booking Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track resource reservations, review FairShare priority scores, issue cryptographic QR passes, and oversee handovers.
          </p>
        </div>

        <button
          onClick={() => onOpenQRScanner()}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
        >
          <QrCode className="w-4 h-4" />
          Open Handover QR Scanner
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs font-medium">
        {[
          { id: 'ALL', label: `All Bookings (${bookings.length})` },
          { id: 'PENDING', label: `Pending (${bookings.filter((b) => b.status === 'PENDING').length})` },
          { id: 'APPROVED', label: `Approved (${bookings.filter((b) => b.status === 'APPROVED').length})` },
          { id: 'CHECKED_OUT', label: `Active (${bookings.filter((b) => b.status === 'CHECKED_OUT').length})` },
          { id: 'COMPLETED', label: `Completed (${bookings.filter((b) => b.status === 'COMPLETED').length})` },
          { id: 'INCIDENT_REVIEW', label: `Incidents (${bookings.filter((b) => b.status === 'INCIDENT_REVIEW').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <CalendarCheck className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No bookings in this category</h3>
          <p className="text-xs text-slate-500 mt-1">Bookings will appear here when requested or updated.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => {
            const isOwner = currentUser.role === 'RESOURCE_OWNER' || currentUser.role === 'PLATFORM_ADMIN';
            const isManager = currentUser.role === 'RESOURCE_MANAGER' || currentUser.role === 'PLATFORM_ADMIN';

            return (
              <div
                key={b.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">#{b.id}</span>
                    {getStatusBadge(b.status)}
                    <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      FairShare Score: {b.fairSharePriorityScore}/100
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{b.resourceName}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      <strong>Purpose:</strong> {b.purpose}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-500 pt-1">
                    <div>
                      <span className="text-slate-400">Seeker:</span>{' '}
                      <strong className="text-slate-700">{b.seekerInstitutionName}</strong>
                      <div className="text-[11px] text-slate-500">Dr: {b.assignedPhysicianName}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Owner:</span>{' '}
                      <strong className="text-slate-700">{b.ownerInstitutionName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Dates:</span>{' '}
                      <strong className="tabular-nums text-slate-800">
                        {b.startDate} to {b.endDate} ({b.durationDays} days)
                      </strong>
                    </div>
                  </div>

                  {b.allocationExplanation && (
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                      FairShare Reasoning: {b.allocationExplanation}
                    </div>
                  )}

                  {b.statusReason && (
                    <div className="text-[11px] text-slate-700">
                      <strong>Note:</strong> {b.statusReason}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {/* If Approved or Checked Out, allow viewing QR pass */}
                  {(b.status === 'APPROVED' || b.status === 'CHECKED_OUT') && (
                    <button
                      onClick={() => onOpenQRPass(b)}
                      className="px-3.5 py-2 bg-[#102A43] hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                    >
                      <QrCode className="w-3.5 h-3.5 text-teal-400" />
                      View QR Pass
                    </button>
                  )}

                  {/* Owner Controls for Pending */}
                  {b.status === 'PENDING' && isOwner && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(b.id)}
                        disabled={actionLoading === b.id}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(b.id)}
                        disabled={actionLoading === b.id}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-md border border-red-200 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {/* Manager Controls for Check-In Handover */}
                  {b.status === 'APPROVED' && isManager && (
                    <button
                      onClick={() => onOpenQRScanner(b)}
                      className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Perform QR Check-In
                    </button>
                  )}

                  {/* Manager Controls for Return Handover */}
                  {b.status === 'CHECKED_OUT' && isManager && (
                    <button
                      onClick={() => onOpenQRScanner(b)}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Perform QR Return
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
