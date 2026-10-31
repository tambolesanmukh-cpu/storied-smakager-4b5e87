import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  QrCode,
  CalendarCheck,
  FileText,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import { UserRole } from '../types';

interface DemoScenarioGuideProps {
  onClose: () => void;
  onSwitchRole: (role: UserRole) => void;
  onNavigateTab: (tab: string) => void;
}

export const DemoScenarioGuide: React.FC<DemoScenarioGuideProps> = ({
  onClose,
  onSwitchRole,
  onNavigateTab,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: 'Step 1: Hospital A Lists ECG System',
      role: 'RESOURCE_OWNER' as UserRole,
      roleName: 'Dr. Rajeshwari Sen (Apollo Hospital)',
      tab: 'marketplace',
      description:
        'Apollo Hospital has listed a GE MAC 2000 12-lead ECG machine under the Free Institutional Sharing tier with valid IEC 60601-1 electrical safety certification.',
      actionLabel: 'Switch to Apollo Hospital & View Listing',
    },
    {
      step: 2,
      title: 'Step 2: Clinic B Discovers with MediMatch AI',
      role: 'RESOURCE_SEEKER' as UserRole,
      roleName: 'Dr. Anand Kumar (Metro Heart Clinic)',
      tab: 'medimatch',
      description:
        'Metro Heart Clinic searches for "I need an ECG machine for two days in Mysuru for a rural cardiac camp". Google Gemini extracts clinical parameters and matches Apollo Hospital\'s calibrated unit.',
      actionLabel: 'Switch to Metro Clinic & Run MediMatch AI',
    },
    {
      step: 3,
      title: 'Step 3: FairShare Request & Approval',
      role: 'RESOURCE_OWNER' as UserRole,
      roleName: 'Dr. Rajeshwari Sen (Apollo Hospital)',
      tab: 'bookings',
      description:
        'Metro Clinic submits the booking request. FairShare algorithm assigns a 94/100 priority score (rural preventive cardiology bonus). Apollo Hospital approves the request, automatically generating a cryptographic QR token.',
      actionLabel: 'Switch to Apollo Hospital & Review Bookings',
    },
    {
      step: 4,
      title: 'Step 4: Biomedical Manager QR Check-In',
      role: 'RESOURCE_MANAGER' as UserRole,
      roleName: 'Suresh V. Menon (Biomedical Safety Officer)',
      tab: 'qr',
      description:
        'At physical collection, the manager validates the single-use QR token, verifies cable resistance and battery health, records the baseline condition, and confirms the checkout.',
      actionLabel: 'Switch to BioMed Manager & Scan Check-In',
    },
    {
      step: 5,
      title: 'Step 5: Equipment Return & AI Inspection Audit',
      role: 'RESOURCE_MANAGER' as UserRole,
      roleName: 'Suresh V. Menon (Biomedical Safety Officer)',
      tab: 'inspections',
      description:
        'Following the 2-day rural camp, the equipment is returned. The manager conducts a return inspection with Gemini AI discrepancy analysis. The entire transaction is sealed in the append-only audit trail.',
      actionLabel: 'View Inspection & Audit Trail Log',
    },
  ];

  const active = steps[currentStep - 1];

  const handleStepAction = () => {
    onSwitchRole(active.role);
    onNavigateTab(active.tab);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-white rounded-2xl shadow-2xl border-2 border-teal-500 overflow-hidden text-xs transition-all">
      {/* Header */}
      <div className="bg-[#102A43] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span className="font-bold tracking-wide">48-Hour Demo Scenario Guide</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress pill indicator */}
      <div className="flex bg-slate-100 h-1.5">
        {steps.map((s) => (
          <div
            key={s.step}
            className={`flex-1 transition-all ${
              s.step <= currentStep ? 'bg-teal-600' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded uppercase">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            Role: <strong>{active.roleName.split('(')[0]}</strong>
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900">{active.title}</h3>
        <p className="text-slate-600 leading-relaxed">{active.description}</p>

        {/* Action button */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={handleStepAction}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            {active.actionLabel}
          </button>

          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="hover:text-slate-700 disabled:opacity-30"
            >
              Previous Step
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              disabled={currentStep === steps.length}
              className="font-bold text-teal-700 hover:text-teal-900 disabled:opacity-30 flex items-center gap-1"
            >
              Next Step <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
