import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Calendar,
  UserCheck,
  FileText,
  Clock,
} from 'lucide-react';
import { Inspection } from '../types';

interface InspectionsViewProps {
  inspections: Inspection[];
}

export const InspectionsView: React.FC<InspectionsViewProps> = ({ inspections }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-[#102A43]">Physical Condition & Handover Inspections</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Mandatory physical safety records logged by authorized biomedical engineers before collection and after return.
        </p>
      </div>

      {inspections.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No inspections logged yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Inspections are automatically recorded when QR handovers or return checks occur.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inspections.map((insp) => (
            <div
              key={insp.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    insp.inspectionType === 'CHECK_IN_BEFORE'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {insp.inspectionType === 'CHECK_IN_BEFORE' ? 'Pre-Handover Baseline' : 'Post-Return Inspection'}
                  </span>
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    {new Date(insp.timestamp).toLocaleString()}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{insp.resourceName}</h3>
                  <div className="text-[11px] text-slate-500">Booking #{insp.bookingId}</div>
                </div>

                {/* Condition badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Condition Grade:</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    insp.condition === 'EXCELLENT'
                      ? 'bg-emerald-100 text-emerald-900'
                      : insp.condition === 'GOOD'
                      ? 'bg-teal-100 text-teal-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {insp.condition}
                  </span>
                </div>

                {/* Comments */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700">
                  <span className="font-semibold block text-[11px] text-slate-400 mb-1">
                    Inspector Checklist & Observations:
                  </span>
                  {insp.comments}
                </div>

                {insp.damageIdentified && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-xs text-red-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">Damage Flagged:</strong>
                      {insp.damageDescription}
                    </div>
                  </div>
                )}
              </div>

              {/* Inspector info */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                  {insp.inspectorName}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Authorized Sign-Off
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
