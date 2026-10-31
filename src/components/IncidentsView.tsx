import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  PlusCircle,
  ShieldAlert,
  UserCheck,
  Building2,
  FileText,
  X,
} from 'lucide-react';
import { Incident, IncidentSeverity, UserProfile } from '../types';
import { api } from '../services/api';

interface IncidentsViewProps {
  incidents: Incident[];
  currentUser: UserProfile;
  onRefreshIncidents: () => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  currentUser,
  onRefreshIncidents,
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [resourceName, setResourceName] = useState('');
  const [category, setCategory] = useState<Incident['category']>('EQUIPMENT_DAMAGE');
  const [severity, setSeverity] = useState<IncidentSeverity>('MEDIUM');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createIncident({
        resourceName,
        category,
        severity,
        description,
      });
      setShowReportModal(false);
      setDescription('');
      setResourceName('');
      onRefreshIncidents();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (id: string) => {
    const notes = prompt('Enter resolution summary for institutional record:', 'Issue inspected and cleared by biomedical authority.');
    if (!notes) return;

    try {
      await api.resolveIncident(id, 'RESOLVED', notes);
      onRefreshIncidents();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">Incident & Safety Governance</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent dispute resolution, damage claims, and institutional safety investigations.
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Report Incident
        </button>
      </div>

      {incidents.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No active incidents reported</h3>
          <p className="text-xs text-slate-500 mt-1">Platform operations are currently operating in full safety compliance.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    inc.severity === 'CRITICAL'
                      ? 'bg-red-100 text-red-900 border border-red-300'
                      : inc.severity === 'HIGH'
                      ? 'bg-orange-100 text-orange-900 border border-orange-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    Severity: {inc.severity}
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    inc.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {inc.status}
                  </span>

                  <span className="text-[11px] text-slate-400 font-mono">#{inc.id}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{inc.resourceName}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{inc.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>Reporter: <strong>{inc.reporterName}</strong> ({inc.reporterInstitutionName})</span>
                  <span>Logged: <strong className="tabular-nums">{new Date(inc.createdAt).toLocaleDateString()}</strong></span>
                </div>

                {inc.resolutionNotes && (
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 mt-2">
                    <strong>Resolution Record:</strong> {inc.resolutionNotes}
                  </div>
                )}
              </div>

              {inc.status !== 'RESOLVED' && (currentUser.role === 'PLATFORM_ADMIN' || currentUser.role === 'RESOURCE_OWNER') && (
                <div className="shrink-0">
                  <button
                    onClick={() => handleResolve(inc.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
                  >
                    Resolve Incident
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">File Incident Report</h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource Name</label>
                <input
                  type="text"
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  placeholder="e.g. GE MAC 2000 12-Lead ECG"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden"
                  >
                    <option value="EQUIPMENT_DAMAGE">Equipment Damage</option>
                    <option value="DELAYED_RETURN">Delayed Return</option>
                    <option value="MISSING_ACCESSORIES">Missing Accessories</option>
                    <option value="SAFETY_CONCERN">Safety Concern</option>
                    <option value="SCHEDULING_CONFLICT">Scheduling Conflict</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Incident Description & Evidence</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail what occurred, visible wear/breakage, and immediate actions taken..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md shadow-xs"
                >
                  {submitting ? 'Submitting...' : 'File Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
