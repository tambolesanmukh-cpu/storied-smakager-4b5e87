export type UserRole = 'RESOURCE_OWNER' | 'RESOURCE_SEEKER' | 'RESOURCE_MANAGER' | 'PLATFORM_ADMIN';

export type InstitutionType = 
  | 'HOSPITAL' 
  | 'CLINIC' 
  | 'MEDICAL_COLLEGE' 
  | 'DIAGNOSTIC_CENTER' 
  | 'RESEARCH_INSTITUTE';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'REQUIRES_INFO';

export type ResourceCategory = 'EQUIPMENT' | 'FACILITY';

export type ResourceCondition = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'MAINTENANCE_REQUIRED';

export type BookingStatus = 
  | 'PENDING'
  | 'ELIGIBILITY_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'WAITLISTED'
  | 'CHECKED_OUT'
  | 'RETURNED'
  | 'COMPLETED'
  | 'INCIDENT_REVIEW'
  | 'CANCELLED';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 'REPORTED' | 'UNDER_REVIEW' | 'AWAITING_INFO' | 'RESOLVED' | 'CLOSED';

export type InspectionType = 'CHECK_IN_BEFORE' | 'CHECK_OUT_AFTER' | 'ROUTINE';

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  officialEmail: string;
  contactNumber: string;
  address: string;
  city: string;
  state: string;
  registrationNumber: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  accreditation: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  institutionId: string;
  department: string;
  designation: string;
  phoneNumber: string;
  avatarUrl?: string;
  licenseNumber?: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  subcategory: string;
  description: string;
  imageUrl: string;
  galleryImages: string[];
  ownerInstitutionId: string;
  ownerInstitutionName: string;
  location: string;
  city: string;
  state: string;
  floorWing: string;
  available: boolean;
  minDurationHours: number;
  maxDurationDays: number;
  costPerDay: number; // 0 = Free sharing
  isFreeSharing: boolean;
  requiresSupervision: boolean;
  supervisionDetails?: string;
  eligibilityTier: 'ANY_VERIFIED' | 'HOSPITAL_ONLY' | 'TRAINED_SPECIALIST_REQUIRED';
  usageConditions: string[];
  safetyRestrictions: string[];
  condition: ResourceCondition;
  manufacturer: string;
  modelNumber: string;
  serialNumber: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  calibrationExpiryDate: string;
  isMaintenanceBlocked: boolean;
  activeBookingsCount: number;
  totalUsageDays: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceCategory: ResourceCategory;
  resourceImage: string;
  ownerInstitutionId: string;
  ownerInstitutionName: string;
  seekerUserId: string;
  seekerUserName: string;
  seekerInstitutionId: string;
  seekerInstitutionName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  durationDays: number;
  purpose: string;
  clinicalSpeciality: string;
  assignedPhysicianName?: string;
  physicianRegistrationNo?: string;
  status: BookingStatus;
  statusReason?: string;
  fairSharePriorityScore: number;
  allocationExplanation: string;
  qrToken?: string;
  qrTokenExpiresAt?: string;
  checkedOutAt?: string;
  checkedOutByManagerName?: string;
  returnedAt?: string;
  returnedByManagerName?: string;
  hasIncident: boolean;
  incidentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QREvent {
  id: string;
  bookingId: string;
  resourceId: string;
  action: 'CHECK_IN' | 'CHECK_OUT';
  scannedByUserId: string;
  scannedByUserName: string;
  managerInstitutionId: string;
  timestamp: string;
  equipmentCondition: ResourceCondition;
  notes: string;
  tokenHash: string;
}

export interface Inspection {
  id: string;
  bookingId: string;
  resourceId: string;
  resourceName: string;
  inspectionType: InspectionType;
  condition: ResourceCondition;
  inspectorId: string;
  inspectorName: string;
  photographUrl?: string;
  comments: string;
  damageIdentified: boolean;
  damageDescription?: string;
  aiDamageSummary?: string;
  authorizedConfirmed: boolean;
  timestamp: string;
}

export interface Incident {
  id: string;
  bookingId: string;
  resourceId: string;
  resourceName: string;
  reporterId: string;
  reporterName: string;
  reporterInstitutionName: string;
  category: 'EQUIPMENT_DAMAGE' | 'DELAYED_RETURN' | 'MISSING_ACCESSORIES' | 'SCHEDULING_CONFLICT' | 'SAFETY_CONCERN' | 'OTHER';
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  evidencePhotoUrl?: string;
  assignedReviewerName?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  resourceId: string;
  resourceName: string;
  performedDate: string;
  performedBy: string;
  nextScheduledDate: string;
  calibrationExpiryDate: string;
  passedCertification: boolean;
  notes: string;
  certificateDocumentUrl?: string;
  activeRestriction: boolean;
}

export interface WaitlistEntry {
  id: string;
  resourceId: string;
  resourceName: string;
  bookingId: string;
  seekerInstitutionId: string;
  seekerInstitutionName: string;
  requestedStartDate: string;
  requestedEndDate: string;
  priorityScore: number;
  queuePosition: number;
  status: 'WAITING' | 'OFFERED' | 'ACCEPTED' | 'EXPIRED';
  createdAt: string;
}

export interface Notification {
  id: string;
  recipientInstitutionId: string;
  recipientUserId?: string;
  title: string;
  message: string;
  type: 'BOOKING_REQUEST' | 'BOOKING_APPROVAL' | 'BOOKING_REJECTION' | 'WAITLIST' | 'COLLECTION_DUE' | 'RETURN_DUE' | 'INCIDENT' | 'MAINTENANCE_ALERT';
  read: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  institutionId: string;
  institutionName: string;
  action: string;
  entityType: 'RESOURCE' | 'BOOKING' | 'INSPECTION' | 'INCIDENT' | 'MAINTENANCE' | 'INSTITUTION' | 'SECURITY';
  entityId: string;
  details: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalInstitutions: number;
  verifiedInstitutions: number;
  totalResources: number;
  availableResources: number;
  activeBookings: number;
  completedBookings: number;
  waitlistedRequests: number;
  reportedIncidents: number;
  utilizationRate: number;
  categoryDistribution: { category: string; count: number }[];
  monthlyTrends: { month: string; bookings: number; completed: number }[];
  topSharedResources: { name: string; category: string; daysUsed: number; institution: string }[];
}
