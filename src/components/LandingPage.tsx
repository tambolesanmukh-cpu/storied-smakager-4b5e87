import React from 'react';
import {
  Activity,
  ShieldCheck,
  Search,
  Sparkles,
  QrCode,
  FileCheck,
  Building2,
  CheckCircle2,
  CalendarCheck,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Microscope,
  Scale,
  Award,
  AlertCircle,
  Clock,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { Resource } from '../types';

interface LandingPageProps {
  onExplore: () => void;
  onListResource: () => void;
  onOpenMediMatch: () => void;
  onStartDemoScenario: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  resources: Resource[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExplore,
  onListResource,
  onOpenMediMatch,
  onStartDemoScenario,
  onOpenLogin,
  onOpenRegister,
  resources,
}) => {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Vision & Primary Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Trusted Inter-Institutional Medical Exchange
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#102A43] leading-[1.15]">
                Unlock Healthcare Resources. Connect Institutions. <span className="text-teal-600">Improve Access.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                A trusted AI-powered platform helping hospitals, clinics and medical colleges share underused medical equipment and facilities safely.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onExplore}
                  className="px-6 py-3 bg-[#102A43] hover:bg-slate-800 text-white font-semibold text-sm rounded-lg transition-all shadow-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <Search className="w-4 h-4 text-teal-400" />
                  Explore Resources
                </button>

                <button
                  onClick={onOpenMediMatch}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-lg transition-all shadow-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  Try MediMatch AI
                </button>

                {onOpenLogin && (
                  <button
                    onClick={onOpenLogin}
                    className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-lg transition-colors border border-slate-300 flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                  >
                    Portal Login
                  </button>
                )}

                {onOpenRegister && (
                  <button
                    onClick={onOpenRegister}
                    className="px-5 py-3 bg-teal-50 hover:bg-teal-100 text-teal-900 font-semibold text-sm rounded-lg transition-colors border border-teal-200 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    Register Institution
                  </button>
                )}
              </div>

              {/* Verified Trust Strip */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  NABH & NMC Verified Organizations
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Immutable Audit Trail
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Biomedical Safety Verified
                </div>
              </div>
            </div>

            {/* Right Column: Hero Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 group">
                <img
                  src="/src/assets/images/medishare_hero_network_1793367674101.jpg"
                  alt="Modern Hospital Medical Equipment Sharing Hub"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/90 via-[#102A43]/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                    <Activity className="w-4 h-4 text-teal-400" />
                    Active Hub Telemetry
                  </div>
                  <h3 className="text-lg font-bold text-white">Apollo Specialty Hospital Depot Wing B</h3>
                  <p className="text-xs text-slate-200 mt-1">
                    12-Lead ECG Systems & Diagnostic Ultrasound currently staged for verified clinic sharing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE METRICS STRIP */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-extrabold text-[#102A43] tabular-nums">5</div>
              <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Verified Institutions</div>
              <div className="text-[11px] text-teal-700 font-semibold mt-0.5">Bengaluru & Mysuru Cluster</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-extrabold text-[#102A43] tabular-nums">6</div>
              <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Active Medical Resources</div>
              <div className="text-[11px] text-teal-700 font-semibold mt-0.5">ICU, Cardiology & Labs</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-extrabold text-[#102A43] tabular-nums">100%</div>
              <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Calibration Compliance</div>
              <div className="text-[11px] text-teal-700 font-semibold mt-0.5">IEC 60601-1 Certified</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-extrabold text-[#102A43] tabular-nums">393h</div>
              <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Clinical Hours Shared</div>
              <div className="text-[11px] text-teal-700 font-semibold mt-0.5">0 Incidents / Full Safety</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Operational Protocol</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#102A43] mt-2">
            How MediShare AI Protects and Allocates Healthcare Resources
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            From verified registration to return condition sign-off, every step is protected by role-based access, cryptographic QR passes, and biomedical verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Institutional Onboarding</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hospitals and clinics undergo regulatory verification (registration number, accreditation, medical council license). No unverified organization can list or borrow.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">MediMatch AI & FairShare</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gemini extracts clinical requirements from natural language. The FairShare engine evaluates clinical necessity and historical safety to prevent hoarding.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Cryptographic QR Handover</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Approved bookings receive a one-time cryptographic QR token. Authorized Biomedical Managers scan and inspect equipment baseline before releasing it.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm mb-4">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">AI Condition & Return Audit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upon return, condition is re-inspected. Gemini AI analyzes discrepancy notes for human safety confirmation. The entire event is committed to an immutable audit log.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURED RESOURCES SHOWCASE */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Live Inventory</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#102A43] mt-1">Available Medical Equipment & Facilities</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Calibrated diagnostics, patient telemetry, and certified laboratories ready for institutional reservation.
              </p>
            </div>
            <button
              onClick={onExplore}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              View Full Marketplace <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.slice(0, 3).map((res) => (
              <div
                key={res.id}
                className="bg-[#F5F7FA] rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative h-48 bg-slate-200 overflow-hidden">
                  <img
                    src={res.imageUrl}
                    alt={res.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#102A43]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wide">
                    {res.category}
                  </div>
                  {res.isFreeSharing ? (
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                      Free Sharing
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                      ₹{res.costPerDay}/day
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-teal-700 font-semibold mb-1">{res.subcategory}</div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">{res.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {res.description}
                    </p>

                    <div className="text-[11px] text-slate-500 space-y-1 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{res.ownerInstitutionName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Calibration valid to: <strong>{res.calibrationExpiryDate}</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onExplore}
                    className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-md border border-slate-300 transition-colors"
                  >
                    View Specifications & Reserve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AI & TRUST ARCHITECTURE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#102A43] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/10 text-teal-300 text-xs font-semibold mb-4 border border-teal-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                Google Gemini 3.8 Flash Powered
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                MediMatch AI & Condition Intelligence
              </h2>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                MediShare AI employs server-side Gemini 3.8 Flash to interpret natural language requests like <em>"I need an ECG machine for 2 days near Mysuru"</em>, querying verified database records with strict zero-hallucination constraints.
              </p>

              <div className="mt-6 space-y-3 text-xs text-slate-200">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                  <span><strong>Zero Hallucination Guardrail:</strong> AI matches strictly from actual active database records; it never fabricates equipment availability.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                  <span><strong>Human-in-the-Loop Clinical Boundary:</strong> AI never approves reservations or declares medical equipment clinically certified.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                  <span><strong>Discrepancy Inspector:</strong> Assists Biomedical Engineers by comparing before and after handover inspection notes to detect wear.</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={onOpenMediMatch}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Launch MediMatch AI Assistant
                </button>
              </div>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700/80 font-mono text-xs text-slate-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700 text-teal-300 font-sans text-xs font-semibold">
                <span>Natural Language Query Stream</span>
                <span className="text-[10px] text-slate-400">Server-Side Evaluation</span>
              </div>
              <div className="mt-3 space-y-2 text-[11px] leading-relaxed">
                <div className="text-teal-400 font-semibold">&gt; Query: "Find a 12-lead ECG machine for 2 days near Mysuru for rural camp"</div>
                <div className="text-slate-400 pl-3 border-l border-slate-700">
                  <div>[Gemini 3.8 Flash Extraction]</div>
                  <div>- Category: EQUIPMENT (Cardiology Diagnostics)</div>
                  <div>- Requested Duration: 2 Days</div>
                  <div>- Purpose: Community Preventive Cardiology</div>
                  <div>- Match: GE MAC 2000 (Apollo Depot Wing B)</div>
                  <div>- Calibration Status: Valid to 2027-04-01</div>
                  <div>- FairShare Score: 94/100 (Rural Outreach Priority)</div>
                </div>
                <div className="text-emerald-400 font-bold mt-2">✓ Verified Match Found: Res-1 (Ready for Handover)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS (LABELLED FICTIONAL DEMO CONTENT) */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Institutional Feedback (Clearly Labelled Fictional Demonstration)
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Trusted Across Medical Centers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg border border-slate-200 text-xs">
              <p className="text-slate-600 italic mb-4 leading-relaxed">
                "MediShare AI enabled us to conduct a 200-patient rural cardiology screening camp in Nanjangud by borrowing an idle GE MAC 2000 ECG from Apollo Hospital. The QR handover was seamless and safe."
              </p>
              <div className="font-bold text-slate-900">Dr. Anand Kumar, MD</div>
              <div className="text-[11px] text-teal-700">Chief Medical Officer, Metro Heart & Pediatric Clinic</div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 text-xs">
              <p className="text-slate-600 italic mb-4 leading-relaxed">
                "Our BSL-2 molecular research suite had 40% unused hours during semester breaks. Through MediShare, regional colleges can conduct clinical studies while maintaining strict bio-waste protocols."
              </p>
              <div className="font-bold text-slate-900">Dr. Rajeshwari Sen</div>
              <div className="text-[11px] text-teal-700">Head of Clinical Equipment, Apollo Specialty Hospital</div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 text-xs">
              <p className="text-slate-600 italic mb-4 leading-relaxed">
                "As Biomedical Safety Officer, the automated calibration block is paramount. If our safety certificate is within 30 days of expiry, the platform automatically restricts booking until recertification."
              </p>
              <div className="font-bold text-slate-900">Suresh V. Menon</div>
              <div className="text-[11px] text-teal-700">Chief Biomedical Engineer, BioMed Logistics Authority</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Common Questions</span>
          <h2 className="text-2xl font-bold text-[#102A43] mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-1">How is medical equipment safety guaranteed?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every equipment record mandates verified maintenance and calibration dates under IEC 60601-1 standards. If calibration expires, the database automatically disables booking. At collection and return, an authorized Biomedical Manager records photographic and technical condition inspections.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-1">How does the FairShare Allocation engine work?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rather than a first-come first-served lottery, FairShare transparently calculates a 10-99 score based on clinical necessity (e.g. rural camps vs routine elective), organization type, past return punctuality, and zero-incident track records. It also manages an automated waiting list when dates conflict.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-1">What role does Google Gemini AI play?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gemini 3.8 Flash handles natural-language resource search, semantic feature matching against real verified database records, and aids the Biomedical Safety Officer during return inspections by detecting discrepancies in condition notes. Crucially, AI is assistive: all final approvals and safety sign-offs remain strictly human.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-[#102A43] text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">MediShare AI</div>
              <div className="text-[11px] text-teal-300">Share Resources. Improve Access. Protect Healthcare.</div>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right">
            Inter-Institutional Healthcare Resource Exchange Platform.
            <div className="text-[10px] text-slate-500 mt-1">
              NABH & NMC Verified Clinical Organizations · IEC 60601-1 Equipment Safety Standards.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
