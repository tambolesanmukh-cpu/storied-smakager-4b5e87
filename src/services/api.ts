import {
  Institution,
  UserProfile,
  Resource,
  Booking,
  Inspection,
  Incident,
  MaintenanceRecord,
  WaitlistEntry,
  Notification,
  AuditLog,
  AnalyticsSummary,
} from '../types';

export const api = {
  // Session
  async getSession(): Promise<{ user: UserProfile; institution: Institution; allUsers: UserProfile[] }> {
    const res = await fetch('/api/session/current');
    if (!res.ok) throw new Error('Failed to fetch session');
    return res.json();
  },

  async switchRole(role: UserProfile['role']): Promise<{ user: UserProfile; institution: Institution }> {
    const res = await fetch('/api/session/switch-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error('Failed to switch role');
    return res.json();
  },

  async login(email?: string, role?: UserProfile['role'], password?: string): Promise<{ user: UserProfile; institution: Institution }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async register(
    userData: any,
    institutionData: any
  ): Promise<{ user: UserProfile; institution: Institution }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData, institutionData }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' });
  },

  // Institutions
  async getInstitutions(): Promise<Institution[]> {
    const res = await fetch('/api/institutions');
    if (!res.ok) throw new Error('Failed to fetch institutions');
    return res.json();
  },

  async createInstitution(data: Partial<Institution>): Promise<Institution> {
    const res = await fetch('/api/institutions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to register institution');
    return res.json();
  },

  async verifyInstitution(id: string, status: string, notes?: string): Promise<Institution> {
    const res = await fetch(`/api/institutions/${id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) throw new Error('Failed to verify institution');
    return res.json();
  },

  // Resources
  async getResources(category?: string, city?: string, availableOnly?: boolean): Promise<Resource[]> {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (city) params.set('city', city);
    if (availableOnly) params.set('availableOnly', 'true');
    const res = await fetch(`/api/resources?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch resources');
    return res.json();
  },

  async getResource(id: string): Promise<{ resource: Resource; bookings: Booking[]; maintenance: MaintenanceRecord[] }> {
    const res = await fetch(`/api/resources/${id}`);
    if (!res.ok) throw new Error('Failed to fetch resource');
    return res.json();
  },

  async createResource(data: Partial<Resource>): Promise<Resource> {
    const res = await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create resource');
    return res.json();
  },

  async updateResource(id: string, data: Partial<Resource>): Promise<Resource> {
    const res = await fetch(`/api/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update resource');
    return res.json();
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    const res = await fetch('/api/bookings');
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async getBooking(id: string): Promise<{ booking: Booking; resource: Resource; inspections: Inspection[]; incidents: Incident[] }> {
    const res = await fetch(`/api/bookings/${id}`);
    if (!res.ok) throw new Error('Failed to fetch booking');
    return res.json();
  },

  async createBooking(data: {
    resourceId: string;
    startDate: string;
    endDate: string;
    purpose: string;
    clinicalSpeciality: string;
    assignedPhysicianName?: string;
    physicianRegistrationNo?: string;
  }): Promise<Booking> {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      const err = new Error(result.error || 'Failed to submit booking');
      (err as any).isConflict = result.isConflict;
      throw err;
    }
    return result;
  },

  async updateBookingStatus(id: string, status: string, reason?: string): Promise<Booking> {
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason }),
    });
    if (!res.ok) throw new Error('Failed to update booking status');
    return res.json();
  },

  async joinWaitlist(data: {
    resourceId: string;
    startDate: string;
    endDate: string;
    purpose?: string;
  }): Promise<WaitlistEntry> {
    const res = await fetch('/api/bookings/join-waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to join waitlist');
    return res.json();
  },

  // QR & Handover
  async getQRToken(bookingId: string): Promise<{ bookingId: string; token: string; resourceName: string; seekerInstitutionName: string; status: string; expiresAt: string }> {
    const res = await fetch(`/api/qr/token/${bookingId}`);
    if (!res.ok) throw new Error('Failed to fetch QR token');
    return res.json();
  },

  async verifyAndScanQR(data: {
    token: string;
    action: 'CHECK_IN' | 'CHECK_OUT';
    condition: string;
    notes?: string;
    photoUrl?: string;
    damageIdentified?: boolean;
    damageDescription?: string;
  }): Promise<{ success: boolean; message: string; booking: Booking; inspection: Inspection; incident?: Incident }> {
    const res = await fetch('/api/qr/verify-and-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to scan QR token');
    return result;
  },

  // Inspections, Incidents, Maintenance, Waitlist, Audit, Notifications
  async getInspections(): Promise<Inspection[]> {
    const res = await fetch('/api/inspections');
    if (!res.ok) throw new Error('Failed to fetch inspections');
    return res.json();
  },

  async getIncidents(): Promise<Incident[]> {
    const res = await fetch('/api/incidents');
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  async createIncident(data: Partial<Incident>): Promise<Incident> {
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to report incident');
    return res.json();
  },

  async resolveIncident(id: string, status: string, resolutionNotes: string): Promise<Incident> {
    const res = await fetch(`/api/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, resolutionNotes }),
    });
    if (!res.ok) throw new Error('Failed to resolve incident');
    return res.json();
  },

  async getMaintenance(): Promise<MaintenanceRecord[]> {
    const res = await fetch('/api/maintenance');
    if (!res.ok) throw new Error('Failed to fetch maintenance');
    return res.json();
  },

  async createMaintenance(data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const res = await fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to record maintenance');
    return res.json();
  },

  async getWaitlist(): Promise<WaitlistEntry[]> {
    const res = await fetch('/api/waitlist');
    if (!res.ok) throw new Error('Failed to fetch waitlist');
    return res.json();
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/audit-logs');
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  async getNotifications(): Promise<Notification[]> {
    const res = await fetch('/api/notifications');
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
  },

  async markAllNotificationsRead(): Promise<void> {
    await fetch('/api/notifications/read-all', { method: 'POST' });
  },

  async getAnalytics(): Promise<AnalyticsSummary> {
    const res = await fetch('/api/analytics/dashboard');
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Gemini AI Endpoints
  async queryMediMatch(query: string, seekerLocation?: string) {
    const res = await fetch('/api/ai/medimatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, seekerLocation }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'AI resource search failed');
    }
    return res.json();
  },

  async analyzeCondition(data: {
    beforeCondition: string;
    afterCondition: string;
    comments: string;
    damageDescription?: string;
    resourceName: string;
  }) {
    const res = await fetch('/api/ai/condition-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'AI condition analysis failed');
    }
    return res.json();
  },
};
