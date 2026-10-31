import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Lock,
  PlusCircle,
  Clock,
  X,
} from 'lucide-react';
import { MaintenanceRecord, Resource, UserProfile } from '../types';
import { api } from '../services/api';

interface MaintenanceViewProps {
  maintenance: MaintenanceRecord[];
  resources: Resource[];
  currentUser: UserProfile;
  onRefreshMaintenance: () => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  maintenance,
  resources,
  currentUser,
  onRefreshMaintenance,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState(resources[0]?.id || '');
  const [performedDate, setPerformedDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextDate, setNextDate] = useState('2027-04-15');
  const [calibrationExpiry, setCalibrationExpiry] = useState('2027-05-01');
  const [passed, setPassed] = useState(true);
  const [notes, setNotes] = useState('Routine calibration and safety test passed under IEC 60601-1 standard.');
  const [restriction, setRestriction] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const resObj = resources.find((r) => r.id === selectedResourceId);
    try {
      await api.createMaintenance({
        resourceId: selectedResourceId,
        resourceName: resObj?.name || 'Medical Equipment',
        performedDate,
        nextScheduledDate: nextDate,
        calibrationExpiryDate: calibrationExpiry,
        passedCertification: passed,
        notes,
        activeRestriction: restriction,
      });
      setShowAddModal(false);
      onRefreshMaintenance();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">Maintenance & Calibration Governance</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Strict regulatory compliance: Automated booking restrictions when calibration expires or safety alerts trigger.
          </p>
        </div>

        {(currentUser.role === 'RESOURCE_MANAGER' || currentUser.role === 'PLATFORM_ADMIN') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#102A43] hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
            Record Calibration / Service
          </button>
        )}
      </div>

      {/* Safety Status Cards for Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((res) => {
          const isBlocked = res.isMaintenanceBlocked;
          return (
            <div
              key={res.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {res.subcategory}
                  </span>
                  {isBlocked ? (
                    <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3 text-red-600" />
                      Booking Locked
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Certified Safe
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">{res.name}</h3>
                <div className="text-[11px] text-slate-500">SN: {res.serialNumber}</div>

                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Next Service:</span>
                    <strong className="tabular-nums">{res.nextMaintenanceDate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Calibration Valid:</span>
                    <strong className="tabular-nums text-emerald-700">{res.calibrationExpiryDate}</strong>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Maintenance Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70">
          <h3 className="font-bold text-sm text-slate-800">Biomedical Service & Calibration History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Equipment</th>
                <th className="py-3 px-4">Service Date</th>
                <th className="py-3 px-4">Certified By</th>
                <th className="py-3 px-4">Calibration Expiry</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Biomedical Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {maintenance.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">{m.resourceName}</td>
                  <td className="py-3 px-4 text-slate-600 tabular-nums">{m.performedDate}</td>
                  <td className="py-3 px-4 text-slate-700">{m.performedBy}</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold tabular-nums">{m.calibrationExpiryDate}</td>
                  <td className="py-3 px-4">
                    {m.passedCertification ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Passed IEC 60601-1
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        Failed Safety Check
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{m.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Record Equipment Calibration</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Resource</label>
                <select
                  value={selectedResourceId}
                  onChange={(e) => setSelectedResourceId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden"
                >
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.serialNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Performed Date</label>
                  <input
                    type="date"
                    value={performedDate}
                    onChange={(e) => setPerformedDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Calibration Expiry Date</label>
                  <input
                    type="date"
                    value={calibrationExpiry}
                    onChange={(e) => setCalibrationExpiry(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Engineer / Safety Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={passed}
                    onChange={(e) => setPassed(e.target.checked)}
                    className="rounded-sm text-teal-600 focus:ring-teal-500"
                  />
                  <span>Passed Electrical Safety IEC 60601-1</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-red-800">
                  <input
                    type="checkbox"
                    checked={restriction}
                    onChange={(e) => setRestriction(e.target.checked)}
                    className="rounded-sm text-red-600 focus:ring-red-500"
                  />
                  <span>Lock Resource with Mandatory Safety Restriction</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#102A43] hover:bg-slate-800 text-white font-bold rounded-md shadow-xs"
                >
                  {submitting ? 'Recording...' : 'Save Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
