import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Cpu,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import { Resource } from '../types';

interface MediMatchAIProps {
  resources: Resource[];
  onSelectResourceForBooking: (resource: Resource) => void;
}

export const MediMatchAI: React.FC<MediMatchAIProps> = ({
  resources,
  onSelectResourceForBooking,
}) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Karnataka, India');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleQueries = [
    'I need an ECG machine for two days in Mysuru for a rural cardiac camp.',
    'Find a research laboratory available next week for cell culture assay.',
    'I need an ultrasound machine with authorised staff supervision.',
    'Clinical digital microscope set near Mysuru for student telepathology.',
    'Multi-parameter patient monitor for emergency ICU standby.',
  ];

  const handleSearch = async (userQuery: string) => {
    if (!userQuery.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setQuery(userQuery);

    try {
      const data = await api.queryMediMatch(userQuery, location);
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to search using MediMatch AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#102A43] to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/10 text-teal-300 text-xs font-semibold border border-teal-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            MediMatch AI · Server-Side Gemini 3.8 Flash
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Intelligent Healthcare Resource Matcher
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Search naturally in plain language. Gemini analyzes clinical intent, verifies regulatory calibration validity, and matches available equipment and facilities across the health network.
          </p>
        </div>
      </div>

      {/* Query Search Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="e.g. 'I need an ECG machine for two days in Mysuru' or 'Research lab available next week'..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <button
            onClick={() => handleSearch(query)}
            disabled={loading || !query.trim()}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Analyzing Query...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Match Resources
              </>
            )}
          </button>
        </div>

        {/* Quick sample pills */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-slate-500 block mb-2">
            Suggested clinical search queries:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(sample)}
                className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors text-left"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">AI Matcher Notice:</span> {errorMsg}
          </div>
        </div>
      )}

      {/* Results Container */}
      {result && (
        <div className="space-y-6">
          {/* Extracted Intent Card */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-600" />
                Extracted Clinical Parameters
              </span>
              <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-medium">
                Structured Parsing Complete
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-md border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Category</span>
                <strong className="text-slate-800 font-semibold">
                  {result.extractedIntent?.resourceCategory || 'EQUIPMENT'}
                </strong>
              </div>
              <div className="bg-white p-2.5 rounded-md border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Target Item</span>
                <strong className="text-slate-800 font-semibold truncate block">
                  {result.extractedIntent?.requestedItem || query}
                </strong>
              </div>
              <div className="bg-white p-2.5 rounded-md border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Requested Duration</span>
                <strong className="text-slate-800 font-semibold">
                  {result.extractedIntent?.requestedDurationDays ? `${result.extractedIntent.requestedDurationDays} Days` : 'Flexible'}
                </strong>
              </div>
              <div className="bg-white p-2.5 rounded-md border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Target Location</span>
                <strong className="text-slate-800 font-semibold">
                  {result.extractedIntent?.locationPreference || 'Mysuru / Bengaluru'}
                </strong>
              </div>
            </div>

            {result.summary && (
              <p className="text-xs text-slate-700 italic border-l-2 border-teal-500 pl-3 py-0.5 mt-2">
                "{result.summary}"
              </p>
            )}
          </div>

          {/* Matched Resources List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#102A43]">
              Ranked Verified Database Matches ({result.matches?.length || 0})
            </h3>

            {(!result.matches || result.matches.length === 0) ? (
              <div className="p-8 bg-white text-center rounded-xl border border-slate-200 text-xs text-slate-500">
                No matching verified equipment was found in the database for this specific request. Try broader search terms.
              </div>
            ) : (
              result.matches.map((m: any, idx: number) => {
                const resourceObj = resources.find((r) => r.id === m.resourceId);
                return (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {resourceObj && (
                        <img
                          src={resourceObj.imageUrl}
                          alt={resourceObj.name}
                          className="w-20 h-20 rounded-lg object-cover border border-slate-200 shrink-0 hidden sm:block"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                            Match Score: {m.matchScore}%
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {resourceObj?.subcategory || 'Medical Resource'}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900">
                          {resourceObj?.name || m.resourceId}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {m.matchReason}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {resourceObj?.ownerInstitutionName} ({resourceObj?.city})
                          </span>
                          <span className="flex items-center gap-1 text-emerald-700">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            {m.safetyClearance || `Calibration valid to ${resourceObj?.calibrationExpiryDate}`}
                          </span>
                        </div>

                        {m.supervisionRequirement && (
                          <div className="text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded inline-block">
                            Supervision: {m.supervisionRequirement}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 w-full md:w-auto">
                      <button
                        onClick={() => {
                          if (resourceObj) {
                            onSelectResourceForBooking(resourceObj);
                          }
                        }}
                        className="w-full md:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                      >
                        Request This Resource <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* AI Boundary & Disclaimer Strip */}
          <div className="p-4 bg-slate-100/80 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800 block">
              MediMatch AI Boundary Policy:
            </span>
            <p>
              {result.aiDisclaimer ||
                'MediMatch AI assists resource discovery based on verified database records. Final bookings require institutional authorization. AI models never approve bookings or certify medical equipment as clinically safe.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
