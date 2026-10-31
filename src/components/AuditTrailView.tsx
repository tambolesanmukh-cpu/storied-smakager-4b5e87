import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Search,
  Filter,
  Clock,
  Building2,
  UserCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { AuditLog } from '../types';

interface AuditTrailViewProps {
  auditLogs: AuditLog[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ auditLogs }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesType = filterType === 'ALL' || log.entityType === filterType;
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.institutionName.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            Append-Only Regulatory Ledger
          </div>
          <h1 className="text-2xl font-bold text-[#102A43] mt-0.5">Immutable Audit History</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Cryptographically sealed timeline of all reservations, condition reports, handovers, and compliance actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
            {auditLogs.length} Events Committed
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, doctor name, institution, or keyword..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 w-full sm:w-auto"
        >
          <option value="ALL">All Entity Types</option>
          <option value="BOOKING">Booking Events</option>
          <option value="RESOURCE">Resource Updates</option>
          <option value="INSPECTION">Physical Inspections</option>
          <option value="INCIDENT">Incidents</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="SECURITY">Security & Sessions</option>
        </select>
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100 text-xs">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {log.action}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-slate-700">{log.entityType}</span>
                </div>
                <div className="text-slate-400 tabular-nums font-mono text-[11px]">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>

              <p className="text-slate-800 text-xs leading-relaxed font-medium">
                {log.details}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                  {log.actorName}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {log.institutionName}
                </span>
                <span className="font-mono text-slate-400 text-[10px]">LogID: {log.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
