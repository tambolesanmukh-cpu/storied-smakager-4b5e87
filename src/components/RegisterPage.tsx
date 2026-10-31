import React, { useState } from 'react';
import {
  Activity,
  Building2,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Mail,
  Lock,
} from 'lucide-react';
import { InstitutionType, UserRole, UserProfile, Institution } from '../types';
import { api } from '../services/api';

interface RegisterPageProps {
  onRegisterSuccess: (user: UserProfile, institution: Institution) => void;
  onGoToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onGoToLogin,
}) => {
  // Step 1 vs Step 2
  const [step, setStep] = useState<1 | 2>(1);

  // User fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('RESOURCE_SEEKER');
  const [department, setDepartment] = useState('Outpatient & Diagnostic Services');
  const [designation, setDesignation] = useState('Medical Director / Lead Physician');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // Institution fields
  const [institutionName, setInstitutionName] = useState('');
  const [institutionType, setInstitutionType] = useState<InstitutionType>('CLINIC');
  const [officialEmail, setOfficialEmail] = useState('');
  const [instPhone, setInstPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mysuru');
  const [state, setState] = useState('Karnataka');
  const [regNumber, setRegNumber] = useState(`KA-MED-REG-${Math.floor(1000 + Math.random() * 9000)}`);
  const [accreditation, setAccreditation] = useState('State Clinical Establishments Registry / NABH Quality Standard');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName.trim() || !officialEmail.trim() || !fullName.trim()) {
      setErrorMsg('Please complete all required fields for verification.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await api.register(
        {
          fullName,
          email,
          role,
          department,
          designation,
          phoneNumber,
          licenseNumber,
        },
        {
          name: institutionName,
          type: institutionType,
          officialEmail,
          contactNumber: instPhone || phoneNumber,
          address,
          city,
          state,
          registrationNumber: regNumber,
          accreditation,
        }
      );

      onRegisterSuccess(data.user, data.institution);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#102A43] text-teal-400 shadow-md mb-2">
            <Activity className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A43]">
            Institutional Onboarding & Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            MediShare AI connects verified healthcare institutions to share and discover medical equipment with cryptographic safety and regulatory compliance.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-center gap-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              step === 1 ? 'bg-[#102A43] text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-teal-500 text-slate-900 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <span>Clinician Credentials</span>
          </button>

          <span className="text-slate-300">——</span>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              step === 2 ? 'bg-[#102A43] text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-teal-500 text-slate-900 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <span>Organization Verification</span>
          </button>
        </div>

        {/* Registration Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitRegistration} className="space-y-6">
            {/* STEP 1: USER DETAILS */}
            {step === 1 && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Step 1: Clinical & Professional Details</h3>
                  <p className="text-[11px] text-slate-500">Provide official identity and clinical registry information.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Kavita Rao, MD"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Official Clinical Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kavita.rao@cityhealth.org"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Platform Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
                    >
                      <option value="RESOURCE_SEEKER">Resource Seeker (Clinic / Health Unit)</option>
                      <option value="RESOURCE_OWNER">Resource Owner (Hospital / Lab / Medical College)</option>
                      <option value="RESOURCE_MANAGER">Resource Manager (Biomedical Safety Officer)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Medical Council / License No.</label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. KMC-DOC-48912"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Cardiology, Radiology, BioMed"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Chief Medical Officer, Consultant"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Direct Contact Phone</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98450 00000"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!fullName.trim() || !email.trim()) {
                        setErrorMsg('Please enter your full name and official email before proceeding.');
                        return;
                      }
                      setErrorMsg(null);
                      setStep(2);
                    }}
                    className="px-6 py-2.5 bg-[#102A43] hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-xs"
                  >
                    Continue to Organization Details
                    <ArrowRight className="w-4 h-4 text-teal-400" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: INSTITUTION DETAILS */}
            {step === 2 && (
              <div className="space-y-4 text-xs">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Step 2: Healthcare Institution Registration</h3>
                  <p className="text-[11px] text-slate-500">
                    State regulatory accreditation and verified organizational contact details.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Institution Legal Name</label>
                    <input
                      type="text"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="e.g. Kaveri Care Clinic & Diagnostics"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Organization Type</label>
                    <select
                      value={institutionType}
                      onChange={(e) => setInstitutionType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option value="HOSPITAL">Hospital (Tertiary / Secondary)</option>
                      <option value="CLINIC">Clinic / Primary Health Center</option>
                      <option value="MEDICAL_COLLEGE">Medical College & Teaching Hospital</option>
                      <option value="DIAGNOSTIC_CENTER">Diagnostic / Imaging Center</option>
                      <option value="RESEARCH_INSTITUTE">Research Laboratory</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Official Org Email</label>
                    <input
                      type="email"
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                      placeholder="admin@kavericare.org"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Org Registration / License No.</label>
                    <input
                      type="text"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Physical Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, Landmark, Ward"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Accreditation & Quality Certifications
                  </label>
                  <input
                    type="text"
                    value={accreditation}
                    onChange={(e) => setAccreditation(e.target.value)}
                    placeholder="e.g. NABH Accredited / NABL ISO 15189 Certified"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-200 text-teal-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    Regulatory Trust Policy
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    To maintain clinical safety, newly registered organizations are marked as <strong>PENDING</strong> verification. The Platform Administrator verifies official clinical registry credentials before equipment sharing or borrowing can be executed.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-2"
                  >
                    {loading ? 'Submitting Credentials...' : 'Submit Institutional Registration'}
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered with MediShare AI?{' '}
            <button
              onClick={onGoToLogin}
              className="font-bold text-teal-700 hover:text-teal-800"
            >
              Sign In to Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
