import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Clock,
  UserCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Scale,
} from 'lucide-react';
import { Resource, UserProfile } from '../types';
import { api } from '../services/api';

interface ResourceDetailModalProps {
  resource: Resource | null;
  currentUser: UserProfile;
  onClose: () => void;
  onBookingSuccess: () => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  currentUser,
  onClose,
  onBookingSuccess,
}) => {
  if (!resource) return null;

  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [purpose, setPurpose] = useState(
    currentUser.role === 'RESOURCE_SEEKER'
      ? 'Primary community health screening and outpatient diagnostic drive.'
      : 'Institutional diagnostic support.'
  );
  const [speciality, setSpeciality] = useState('Cardiology & Critical Care');
  const [doctorName, setDoctorName] = useState(currentUser.fullName);
  const [doctorRegNo, setDoctorRegNo] = useState(currentUser.licenseNumber || 'KMC-DOC-REG');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [conflictDetected, setConflictDetected] = useState(false);
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  const durationDays = Math.max(
    1,
    Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setConflictDetected(false);

    try {
      await api.createBooking({
        resourceId: resource.id,
        startDate,
        endDate,
        purpose,
        clinicalSpeciality: speciality,
        assignedPhysicianName: doctorName,
        physicianRegistrationNo: doctorRegNo,
      });

      onBookingSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
      if (err.isConflict) {
        setConflictDetected(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinWaitlist = async () => {
    setLoading(true);
    try {
      await api.joinWaitlist({
        resourceId: resource.id,
        startDate,
        endDate,
        purpose,
      });
      setWaitlistJoined(true);
      setTimeout(() => {
        onBookingSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                {resource.category} · {resource.subcategory}
              </span>
              {resource.isFreeSharing ? (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Free Institutional Sharing
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  ₹{resource.costPerDay} / day
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-[#102A43] mt-1">{resource.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visuals & Specifications */}
          <div className="lg:col-span-7 space-y-6">
            <div className="h-64 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={resource.imageUrl}
                alt={resource.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Description & Clinical Overview</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{resource.description}</p>
            </div>

            {/* Technical Specifications Grid */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-slate-800 mb-2">Technical & Regulatory Specifications</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400">Manufacturer:</span>{' '}
                  <strong className="text-slate-800">{resource.manufacturer}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Model:</span>{' '}
                  <strong className="text-slate-800">{resource.modelNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Serial No:</span>{' '}
                  <strong className="font-mono text-slate-800">{resource.serialNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Location:</span>{' '}
                  <strong className="text-slate-800">{resource.floorWing}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Last Calibrated:</span>{' '}
                  <strong className="tabular-nums text-slate-800">{resource.lastMaintenanceDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Calibration Expiry:</span>{' '}
                  <strong className="tabular-nums text-emerald-700">{resource.calibrationExpiryDate}</strong>
                </div>
              </div>
            </div>

            {/* Safety & Protocol Guidance */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Mandatory Usage Conditions
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                  {resource.usageConditions.map((cond, i) => (
                    <li key={i}>{cond}</li>
                  ))}
                </ul>
              </div>

              {resource.requiresSupervision && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Clinical Supervision Mandate
                  </div>
                  <p>{resource.supervisionDetails}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Reservation Form */}
          <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Request Resource Reservation</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Evaluated transparently via FairShare Allocation Engine.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Notice:</span> {errorMsg}
                  </div>
                </div>
              )}

              {conflictDetected && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900 space-y-2">
                  <p className="font-semibold">Schedule Conflict Detected</p>
                  <p className="text-[11px] leading-relaxed">
                    Another verified institution has reserved this resource for these dates. Join the waiting list to automatically be notified if the slot opens.
                  </p>
                  <button
                    type="button"
                    onClick={handleJoinWaitlist}
                    disabled={loading || waitlistJoined}
                    className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded transition-colors"
                  >
                    {waitlistJoined ? '✓ Joined Waiting List!' : 'Join FairShare Waiting List'}
                  </button>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Duration: <strong>{durationDays} Days</strong></span>
                <span>Max allowed: <strong>{resource.maxDurationDays} Days</strong></span>
              </div>

              {/* Purpose */}
              <div className="text-xs">
                <label className="block font-medium text-slate-700 mb-1">Clinical Purpose & Context</label>
                <textarea
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Detail the clinical camp, study, or screening necessity..."
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500 text-xs"
                />
              </div>

              {/* Specialty & Assigned Doctor */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Specialty</label>
                  <input
                    type="text"
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Physician In-Charge</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-800"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-medium text-slate-700 mb-1">Physician Reg / License No.</label>
                <input
                  type="text"
                  value={doctorRegNo}
                  onChange={(e) => setDoctorRegNo(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-800 font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || resource.isMaintenanceBlocked || !resource.available}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs disabled:opacity-50"
                >
                  {loading ? 'Validating FairShare Eligibility...' : 'Submit Institutional Request'}
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500 text-center">
              Protected by MediShare cryptographic QR handover & physical safety checklist.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
