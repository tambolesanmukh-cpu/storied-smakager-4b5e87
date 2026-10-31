import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  Search,
  Sparkles,
  CalendarCheck,
  QrCode,
  FileText,
  Bell,
  CheckCircle,
  Building2,
  UserCheck,
  ChevronDown,
  PlusCircle,
  BarChart3,
  AlertTriangle,
  Clock,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { UserProfile, Institution, Notification, UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserProfile | null;
  currentInstitution: Institution | null;
  notifications: Notification[];
  onSwitchRole: (role: UserRole) => void;
  onOpenAddResource: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
  onStartDemoScenario: () => void;
  onMarkAllNotificationsRead: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  currentInstitution,
  notifications,
  onSwitchRole,
  onOpenAddResource,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  onStartDemoScenario,
  onMarkAllNotificationsRead,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; org: string; color: string }> = {
    RESOURCE_OWNER: { label: 'Resource Owner (Hospital)', org: 'Apollo Specialty Hospital', color: 'bg-blue-900 text-blue-100' },
    RESOURCE_SEEKER: { label: 'Resource Seeker (Clinic)', org: 'Metro Heart Clinic', color: 'bg-teal-900 text-teal-100' },
    RESOURCE_MANAGER: { label: 'Resource Manager (BioMed)', org: 'Safety & Logistics', color: 'bg-emerald-900 text-emerald-100' },
    PLATFORM_ADMIN: { label: 'Platform Administrator', org: 'State Health Compliance', color: 'bg-purple-900 text-purple-100' },
  };

  const navItems = [
    { id: 'marketplace', label: 'Marketplace', icon: Search },
    { id: 'medimatch', label: 'MediMatch AI', icon: Sparkles },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'qr', label: 'QR Handover', icon: QrCode },
    { id: 'inspections', label: 'Inspections', icon: ShieldCheck },
    { id: 'analytics', label: 'Admin & Metrics', icon: BarChart3 },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. TOP BAR CONTRACT: Brand — Nav Links — Primary Action & Session */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('landing')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-lg bg-[#102A43] flex items-center justify-center text-teal-400 shadow-xs">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-[#102A43] whitespace-nowrap">
                  MediShare AI
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-teal-700 -mt-1">
                  Healthcare Resource Exchange
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 single-line clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 py-1.5 text-sm transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    isActive
                      ? 'text-teal-700 font-semibold border-teal-600'
                      : 'text-slate-600 hover:text-slate-900 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Quick Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <>
                {/* List Resource (for Owners/Admins) */}
                {(currentUser.role === 'RESOURCE_OWNER' || currentUser.role === 'PLATFORM_ADMIN') && (
                  <button
                    onClick={onOpenAddResource}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors shadow-xs whitespace-nowrap shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    List Resource
                  </button>
                )}

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifDropdown && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Notifications ({unreadCount} new)
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={onMarkAllNotificationsRead}
                            className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.slice(0, 6).map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3 text-xs hover:bg-slate-50 transition-colors ${
                                !notif.read ? 'bg-teal-50/50' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-semibold text-slate-900">{notif.title}</span>
                                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Role Switcher Pill & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-md text-xs transition-colors border border-slate-200"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#102A43] text-teal-400 flex items-center justify-center font-bold text-[10px]">
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <div className="hidden md:flex flex-col text-left leading-tight">
                      <span className="font-semibold text-slate-800 truncate max-w-[110px]">
                        {currentUser.fullName.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-teal-700 font-medium">
                        {currentUser.role.replace('_', ' ')}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
                  </button>

                  {/* Role Dropdown */}
                  {showRoleDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/70">
                        <p className="text-xs font-semibold text-slate-900">{currentUser.fullName}</p>
                        <p className="text-[11px] text-slate-500">{currentInstitution?.name}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          NABH / NMC Verified Organization
                        </div>
                      </div>

                      <div className="p-2">
                        <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Switch Role
                        </p>
                        {(['RESOURCE_OWNER', 'RESOURCE_SEEKER', 'RESOURCE_MANAGER', 'PLATFORM_ADMIN'] as UserRole[]).map((r) => {
                          const info = roleLabels[r];
                          const isSelected = currentUser.role === r;
                          return (
                            <button
                              key={r}
                              onClick={() => {
                                onSwitchRole(r);
                                setShowRoleDropdown(false);
                              }}
                              className={`w-full flex items-start gap-2.5 px-3 py-2 text-left rounded-md transition-colors text-xs ${
                                isSelected ? 'bg-teal-50 text-teal-900 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <UserCheck className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                              <div>
                                <div className="font-medium">{info.label}</div>
                                <div className="text-[11px] text-slate-500">{info.org}</div>
                              </div>
                            </button>
                          );
                        })}

                        {/* Sign Out Action */}
                        <div className="pt-2 mt-2 border-t border-slate-100">
                          <button
                            onClick={() => {
                              setShowRoleDropdown(false);
                              onLogout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-md text-xs text-red-600 hover:bg-red-50 transition-colors font-medium"
                          >
                            <LogOut className="w-4 h-4 text-red-500" />
                            Sign Out of Terminal
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#102A43] hover:bg-slate-100 rounded-md transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-teal-600" />
                  Sign In
                </button>
                <button
                  onClick={onOpenRegister}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. DEMO SHORTCUT BAR */}
      {currentUser && (
        <div className="bg-[#102A43] text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-teal-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Active Session:
            </span>
            <span className="bg-slate-800/80 px-2 py-0.5 rounded text-slate-200 font-medium border border-slate-700">
              {roleLabels[currentUser.role]?.label || currentUser.fullName}
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden md:inline">
              Institution: <strong className="text-white">{currentInstitution?.name}</strong> ({currentInstitution?.city})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLogin}
              className="text-slate-300 hover:text-white px-2 py-0.5 rounded text-xs transition-colors underline"
            >
              Switch Account
            </button>
            <button
              onClick={onStartDemoScenario}
              className="flex items-center gap-1.5 px-3 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded transition-colors shadow-xs"
            >
              <Clock className="w-3.5 h-3.5" />
              Launch Scenario Walkthrough
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
