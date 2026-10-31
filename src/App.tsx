import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Institution,
  Resource,
  Booking,
  Inspection,
  Incident,
  MaintenanceRecord,
  Notification,
  AuditLog,
  AnalyticsSummary,
  UserRole,
} from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Marketplace } from './components/Marketplace';
import { ResourceDetailModal } from './components/ResourceDetailModal';
import { MediMatchAI } from './components/MediMatchAI';
import { BookingsView } from './components/BookingsView';
import { QRPassModal } from './components/QRPassModal';
import { QRScannerView } from './components/QRScannerView';
import { InspectionsView } from './components/InspectionsView';
import { IncidentsView } from './components/IncidentsView';
import { MaintenanceView } from './components/MaintenanceView';
import { AuditTrailView } from './components/AuditTrailView';
import { AdminDashboard } from './components/AdminDashboard';
import { AddResourceModal } from './components/AddResourceModal';
import { DemoScenarioGuide } from './components/DemoScenarioGuide';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('landing');

  // Application State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentInstitution, setCurrentInstitution] = useState<Institution | null>(null);
  const [allInstitutions, setAllInstitutions] = useState<Institution[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  // Modals & Selected items
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedBookingForQR, setSelectedBookingForQR] = useState<Booking | null>(null);
  const [qrScannerTargetBooking, setQrScannerTargetBooking] = useState<Booking | null>(null);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showDemoScenario, setShowDemoScenario] = useState(false);

  // Initial Data Load
  const fetchAllData = async () => {
    try {
      const [
        sessionData,
        instData,
        resData,
        bkData,
        inspData,
        incData,
        maintData,
        audData,
        notifData,
        anaData,
      ] = await Promise.all([
        api.getSession(),
        api.getInstitutions(),
        api.getResources(),
        api.getBookings(),
        api.getInspections(),
        api.getIncidents(),
        api.getMaintenance(),
        api.getAuditLogs(),
        api.getNotifications(),
        api.getAnalytics(),
      ]);

      setCurrentUser(sessionData.user);
      setCurrentInstitution(sessionData.institution);
      setAllInstitutions(instData);
      setResources(resData);
      setBookings(bkData);
      setInspections(inspData);
      setIncidents(incData);
      setMaintenance(maintData);
      setAuditLogs(audData);
      setNotifications(notifData);
      setAnalytics(anaData);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Role switching
  const handleSwitchRole = async (role: UserRole) => {
    try {
      const session = await api.switchRole(role);
      setCurrentUser(session.user);
      setCurrentInstitution(session.institution);
      const [bkData, notifData, audData] = await Promise.all([
        api.getBookings(),
        api.getNotifications(),
        api.getAuditLogs(),
      ]);
      setBookings(bkData);
      setNotifications(notifData);
      setAuditLogs(audData);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLoginSuccess = async (user: UserProfile, institution: Institution) => {
    setCurrentUser(user);
    setCurrentInstitution(institution);
    setCurrentTab('marketplace');
    await fetchAllData();
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setCurrentUser(null);
      setCurrentInstitution(null);
      setCurrentTab('login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    await api.markAllNotificationsRead();
    const notifs = await api.getNotifications();
    setNotifications(notifs);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[#102A43] flex items-center justify-center text-teal-400 shadow-md animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-base font-bold text-[#102A43]">Initializing MediShare AI</h2>
          <p className="text-xs text-slate-500 mt-0.5">Connecting to health network database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900 flex flex-col font-sans">
      {/* 1. TOP NAVBAR */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        currentInstitution={currentInstitution}
        notifications={notifications}
        onSwitchRole={handleSwitchRole}
        onOpenAddResource={() => setShowAddResourceModal(true)}
        onOpenLogin={() => setCurrentTab('login')}
        onOpenRegister={() => setCurrentTab('register')}
        onLogout={handleLogout}
        onStartDemoScenario={() => setShowDemoScenario(true)}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
      />

      {/* 2. MAIN VIEW ROUTING */}
      <main className="flex-1">
        {/* LOGIN VIEW */}
        {currentTab === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onGoToRegister={() => setCurrentTab('register')}
          />
        )}

        {/* REGISTER VIEW */}
        {currentTab === 'register' && (
          <RegisterPage
            onRegisterSuccess={handleLoginSuccess}
            onGoToLogin={() => setCurrentTab('login')}
          />
        )}

        {/* LANDING PAGE */}
        {currentTab === 'landing' && (
          <LandingPage
            onExplore={() => setCurrentTab('marketplace')}
            onListResource={() => {
              if (!currentUser) setCurrentTab('login');
              else setShowAddResourceModal(true);
            }}
            onOpenMediMatch={() => setCurrentTab('medimatch')}
            onStartDemoScenario={() => setShowDemoScenario(true)}
            onOpenLogin={() => setCurrentTab('login')}
            onOpenRegister={() => setCurrentTab('register')}
            resources={resources}
          />
        )}

        {/* MARKETPLACE */}
        {currentTab === 'marketplace' && (
          <Marketplace
            resources={resources}
            currentUser={currentUser || { role: 'RESOURCE_SEEKER' } as any}
            onSelectResource={(res) => setSelectedResource(res)}
            onBookResource={(res) => {
              if (!currentUser) {
                setCurrentTab('login');
              } else {
                setSelectedResource(res);
              }
            }}
            onOpenAddResource={() => {
              if (!currentUser) setCurrentTab('login');
              else setShowAddResourceModal(true);
            }}
            onOpenMediMatch={() => setCurrentTab('medimatch')}
          />
        )}

        {/* MEDIMATCH AI */}
        {currentTab === 'medimatch' && (
          <MediMatchAI
            resources={resources}
            onSelectResourceForBooking={(res) => {
              setSelectedResource(res);
              setCurrentTab('marketplace');
            }}
          />
        )}

        {/* BOOKINGS VIEW */}
        {currentTab === 'bookings' && (
          currentUser ? (
            <BookingsView
              bookings={bookings}
              currentUser={currentUser}
              onRefreshBookings={fetchAllData}
              onOpenQRPass={(b) => setSelectedBookingForQR(b)}
              onOpenQRScanner={(b) => {
                setQrScannerTargetBooking(b || null);
                setCurrentTab('qr');
              }}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-xl border border-slate-200 text-center space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Sign In Required</h2>
              <p className="text-xs text-slate-600">Please sign in to view and manage institutional bookings.</p>
              <button
                onClick={() => setCurrentTab('login')}
                className="px-6 py-2 bg-teal-600 text-white font-bold text-xs rounded-lg"
              >
                Go to Sign In
              </button>
            </div>
          )
        )}

        {/* QR HANDOVER VIEW */}
        {currentTab === 'qr' && (
          currentUser ? (
            <QRScannerView
              bookings={bookings}
              currentUser={currentUser}
              initialBooking={qrScannerTargetBooking}
              onHandoverComplete={fetchAllData}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-xl border border-slate-200 text-center space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Sign In Required</h2>
              <p className="text-xs text-slate-600">Please sign in as a Biomedical Manager or Admin to scan QR passes.</p>
              <button
                onClick={() => setCurrentTab('login')}
                className="px-6 py-2 bg-teal-600 text-white font-bold text-xs rounded-lg"
              >
                Go to Sign In
              </button>
            </div>
          )
        )}

        {/* INSPECTIONS VIEW */}
        {currentTab === 'inspections' && (
          <InspectionsView inspections={inspections} />
        )}

        {/* INCIDENTS VIEW */}
        {currentTab === 'incidents' && (
          currentUser ? (
            <IncidentsView
              incidents={incidents}
              currentUser={currentUser}
              onRefreshIncidents={fetchAllData}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-xl border border-slate-200 text-center space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Sign In Required</h2>
              <p className="text-xs text-slate-600">Please sign in to view or report incidents.</p>
              <button
                onClick={() => setCurrentTab('login')}
                className="px-6 py-2 bg-teal-600 text-white font-bold text-xs rounded-lg"
              >
                Go to Sign In
              </button>
            </div>
          )
        )}

        {/* MAINTENANCE VIEW */}
        {currentTab === 'maintenance' && (
          <MaintenanceView
            maintenance={maintenance}
            resources={resources}
            currentUser={currentUser || { role: 'RESOURCE_SEEKER' } as any}
            onRefreshMaintenance={fetchAllData}
          />
        )}

        {/* ADMIN DASHBOARD */}
        {currentTab === 'analytics' && (
          <AdminDashboard
            analytics={analytics}
            institutions={allInstitutions}
            currentUser={currentUser || { role: 'PLATFORM_ADMIN', fullName: 'Administrator' } as any}
            onRefreshData={fetchAllData}
          />
        )}

        {/* AUDIT TRAIL */}
        {currentTab === 'audit' && (
          <AuditTrailView auditLogs={auditLogs} />
        )}
      </main>

      {/* 3. MODALS */}
      {selectedResource && currentUser && (
        <ResourceDetailModal
          resource={selectedResource}
          currentUser={currentUser}
          onClose={() => setSelectedResource(null)}
          onBookingSuccess={() => {
            fetchAllData();
            setCurrentTab('bookings');
          }}
        />
      )}

      {selectedBookingForQR && (
        <QRPassModal
          booking={selectedBookingForQR}
          onClose={() => setSelectedBookingForQR(null)}
          onOpenScannerForThis={(b) => {
            setQrScannerTargetBooking(b);
            setCurrentTab('qr');
          }}
        />
      )}

      {showAddResourceModal && currentUser && (
        <AddResourceModal
          currentUser={currentUser}
          onClose={() => setShowAddResourceModal(false)}
          onSuccess={() => {
            fetchAllData();
            setCurrentTab('marketplace');
          }}
        />
      )}

      {showDemoScenario && (
        <DemoScenarioGuide
          onClose={() => setShowDemoScenario(false)}
          onSwitchRole={handleSwitchRole}
          onNavigateTab={(tab) => setCurrentTab(tab)}
        />
      )}
    </div>
  );
}
