import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  Lock,
  Mail,
  UserCheck,
  Building2,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  X,
} from 'lucide-react';
import { UserRole, UserProfile, Institution } from '../types';
import { api } from '../services/api';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile, institution: Institution) => void;
  onGoToRegister: () => void;
  onCancel?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onCancel,
}) => {
  const [email, setEmail] = useState('owner@apollohospital.org');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Quick Demo Logins
  const demoAccounts = [
    {
      role: 'RESOURCE_OWNER' as UserRole,
      title: 'Resource Owner (Hospital)',
      name: 'Dr. Rajeshwari Sen',
      email: 'owner@apollohospital.org',
      institution: 'Apollo Specialty Hospital',
      department: 'Cardiology & Critical Care',
      badge: 'Hospital / Facility Owner',
    },
    {
      role: 'RESOURCE_SEEKER' as UserRole,
      title: 'Resource Seeker (Clinic)',
      name: 'Dr. Anand Kumar',
      email: 'seeker@metroheartclinic.in',
      institution: 'Metro Heart & Pediatric Clinic',
      department: 'Internal Medicine & Outpatient',
      badge: 'Verified Seeker / Clinic',
    },
    {
      role: 'RESOURCE_MANAGER' as UserRole,
      title: 'Resource Manager (BioMed)',
      name: 'Suresh V. Menon',
      email: 'manager@apollohospital.org',
      institution: 'BioMed Logistics Authority',
      department: 'Biomedical Engineering & Safety',
      badge: 'Safety & QR Inspector',
    },
    {
      role: 'PLATFORM_ADMIN' as UserRole,
      title: 'Platform Administrator',
      name: 'Pooja Krishnan',
      email: 'admin@medishare.org',
      institution: 'State Health Compliance Authority',
      department: 'Governance & Verification',
      badge: 'State Compliance Officer',
    },
  ];

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your official institutional email.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await api.login(email, undefined, password);
      onLoginSuccess(data.user, data.institution);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: UserRole, demoEmail: string) => {
    setLoading(true);
    setErrorMsg(null);
    setEmail(demoEmail);

    try {
      const data = await api.login(demoEmail, role);
      onLoginSuccess(data.user, data.institution);
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setResetSuccess(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Brand & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#102A43] text-teal-400 shadow-md mb-2">
            <Activity className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A43]">
            MediShare AI Healthcare Exchange
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Authorized institutional login for registered hospitals, clinics, medical colleges, and biomedical safety personnel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Standard Credentials Sign-In */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Sign In to Your Account</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Access your organization's resources, bookings, and inspection records.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleStandardLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.org"
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setShowForgotModal(true);
                    }}
                    className="text-[11px] text-teal-700 hover:text-teal-800 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded-sm text-teal-600 focus:ring-teal-500"
                  />
                  <span>Remember this terminal</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#102A43] hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500">Need to register your institution? </span>
              <button
                onClick={onGoToRegister}
                className="text-xs font-bold text-teal-700 hover:text-teal-800"
              >
                Register Organization
              </button>
            </div>
          </div>

          {/* Right Column: Instant 1-Click Demo Accounts */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Instant Demo Sign-In</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any pre-verified role below to immediately test the platform from that perspective:
                  </p>
                </div>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  4 Roles
                </span>
              </div>

              <div className="space-y-2.5">
                {demoAccounts.map((demo) => (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => handleQuickDemoLogin(demo.role, demo.email)}
                    disabled={loading}
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-teal-50/50 hover:border-teal-300 transition-all text-left flex items-start justify-between gap-3 group"
                  >
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs group-hover:text-teal-900">
                          {demo.name}
                        </span>
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-100/60 px-1.5 py-0.2 rounded">
                          {demo.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        {demo.institution}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {demo.department} · {demo.email}
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 shrink-0 mt-2 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  All demo accounts are linked to live database records with verified NABH/NMC credentials, equipment listings, and audit history.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">Reset Password</h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Password Reset Instructions Sent
                </div>
                <p>
                  A secure reset link has been dispatched to <strong>{resetEmail}</strong>. Please check your institutional inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  Enter your verified institutional email address. We will verify your organization membership and dispatch a secure password reset token.
                </p>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#102A43] hover:bg-slate-800 text-white font-bold rounded-md"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
