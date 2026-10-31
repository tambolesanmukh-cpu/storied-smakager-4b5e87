import type {
  Institution,
  UserProfile,
  Resource,
  Booking,
  QREvent,
  Inspection,
  Incident,
  MaintenanceRecord,
  WaitlistEntry,
  Notification,
  AuditLog,
  AnalyticsSummary,
  BookingStatus,
  ResourceCondition
} from '../src/types/index.ts';

// In-Memory Database store with rich seed data for the 48-hour hackathon demonstration
export class MediShareDatabase {
  institutions: Institution[] = [];
  users: UserProfile[] = [];
  resources: Resource[] = [];
  bookings: Booking[] = [];
  qrTokens: Map<string, { bookingId: string; expiresAt: string; token: string }> = new Map();
  qrEvents: QREvent[] = [];
  inspections: Inspection[] = [];
  incidents: Incident[] = [];
  maintenanceRecords: MaintenanceRecord[] = [];
  waitlistEntries: WaitlistEntry[] = [];
  notifications: Notification[] = [];
  auditLogs: AuditLog[] = [];

  currentUser: UserProfile;

  constructor() {
    this.seedInitialData();
    // Default logged in user is Apollo Hospital Resource Owner, but switchable
    this.currentUser = this.users[0];
  }

  private seedInitialData() {
    // 1. Institutions
    this.institutions = [
      {
        id: 'inst-1',
        name: 'Apollo Specialty Hospital',
        type: 'HOSPITAL',
        officialEmail: 'resources@apollohospital.org',
        contactNumber: '+91 80 2630 4000',
        address: '154/11 Bannerghatta Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        registrationNumber: 'KA-HOSP-2018-9941',
        verificationStatus: 'VERIFIED',
        accreditation: 'NABH Accredited Tertiary Center',
        verifiedAt: '2025-01-15T10:00:00Z',
        createdAt: '2024-11-01T08:00:00Z'
      },
      {
        id: 'inst-2',
        name: 'Mysuru Medical College & Research Institute',
        type: 'MEDICAL_COLLEGE',
        officialEmail: 'dean@mmcri-mysore.edu',
        contactNumber: '+91 821 252 0512',
        address: 'Irwin Road, Next to Railway Station',
        city: 'Mysuru',
        state: 'Karnataka',
        registrationNumber: 'KA-MED-COL-1924-001',
        verificationStatus: 'VERIFIED',
        accreditation: 'NMC Recognized / Grade A',
        verifiedAt: '2025-02-10T09:30:00Z',
        createdAt: '2024-12-01T09:00:00Z'
      },
      {
        id: 'inst-3',
        name: 'Metro Heart & Pediatric Clinic',
        type: 'CLINIC',
        officialEmail: 'admin@metroheartclinic.in',
        contactNumber: '+91 821 241 8890',
        address: '84 Saraswathipuram 4th Main',
        city: 'Mysuru',
        state: 'Karnataka',
        registrationNumber: 'KA-CLN-2021-3482',
        verificationStatus: 'VERIFIED',
        accreditation: 'State Clinical Registry Certified',
        verifiedAt: '2025-03-01T11:00:00Z',
        createdAt: '2025-01-10T11:00:00Z'
      },
      {
        id: 'inst-4',
        name: 'Apex Precision Diagnostic Lab',
        type: 'DIAGNOSTIC_CENTER',
        officialEmail: 'quality@apexdiagnostic.com',
        contactNumber: '+91 80 4912 3300',
        address: '22 Indiranagar 100ft Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        registrationNumber: 'KA-LAB-2022-7721',
        verificationStatus: 'VERIFIED',
        accreditation: 'NABL ISO 15189 Certified',
        verifiedAt: '2025-03-20T14:00:00Z',
        createdAt: '2025-02-15T10:00:00Z'
      },
      {
        id: 'inst-5',
        name: 'St. Jude Rural Health Center',
        type: 'CLINIC',
        officialEmail: 'info@stjuderural.org',
        contactNumber: '+91 822 129 1100',
        address: 'Village Post Nanjangud Taluk',
        city: 'Mysuru',
        state: 'Karnataka',
        registrationNumber: 'KA-NGO-MED-2023-112',
        verificationStatus: 'PENDING',
        accreditation: 'Under State Medical Council Review',
        createdAt: '2026-10-15T10:00:00Z'
      }
    ];

    // 2. Users representing the 4 roles
    this.users = [
      {
        id: 'user-owner',
        email: 'owner@apollohospital.org',
        fullName: 'Dr. Rajeshwari Sen (Resource Owner)',
        role: 'RESOURCE_OWNER',
        institutionId: 'inst-1',
        department: 'Cardiology & Critical Care Dept',
        designation: 'Head of Clinical Equipment & Facilities',
        phoneNumber: '+91 98450 11223',
        licenseNumber: 'KMC-DOC-44819',
        createdAt: '2024-11-01T08:00:00Z'
      },
      {
        id: 'user-seeker',
        email: 'seeker@metroheartclinic.in',
        fullName: 'Dr. Anand Kumar (Resource Seeker)',
        role: 'RESOURCE_SEEKER',
        institutionId: 'inst-3',
        department: 'Internal Medicine & Outpatient Services',
        designation: 'Chief Medical Officer',
        phoneNumber: '+91 94480 55667',
        licenseNumber: 'KMC-DOC-31298',
        createdAt: '2025-01-10T11:00:00Z'
      },
      {
        id: 'user-manager',
        email: 'manager@apollohospital.org',
        fullName: 'Suresh V. Menon (Resource Manager)',
        role: 'RESOURCE_MANAGER',
        institutionId: 'inst-1',
        department: 'Biomedical Engineering & Logistics',
        designation: 'Chief Biomedical Safety Officer',
        phoneNumber: '+91 98860 88990',
        licenseNumber: 'BME-CER-88712',
        createdAt: '2024-11-05T09:00:00Z'
      },
      {
        id: 'user-admin',
        email: 'admin@medishare.org',
        fullName: 'Pooja Krishnan (Platform Administrator)',
        role: 'PLATFORM_ADMIN',
        institutionId: 'inst-1',
        department: 'Health Network Governance Authority',
        designation: 'State Platform Compliance Officer',
        phoneNumber: '+91 97310 99887',
        createdAt: '2024-10-01T08:00:00Z'
      }
    ];

    // 3. Resources (Equipment & Facilities)
    this.resources = [
      {
        id: 'res-1',
        name: 'GE MAC 2000 Digital 12-Lead ECG System',
        category: 'EQUIPMENT',
        subcategory: 'Cardiology Diagnostics',
        description: 'Hospital-grade 12-lead electrocardiograph with Marquette 12SL ECG analysis program, high-contrast digital color screen, and thermal printout. Suitable for outpatient cardiology camps and secondary clinic screening.',
        imageUrl: '/src/assets/images/equipment_ecg_machine_1793367675254.jpg',
        galleryImages: ['/src/assets/images/equipment_ecg_machine_1793367675254.jpg'],
        ownerInstitutionId: 'inst-1',
        ownerInstitutionName: 'Apollo Specialty Hospital',
        location: 'Apollo Biomedical Wing B',
        city: 'Bengaluru',
        state: 'Karnataka',
        floorWing: 'Level 2, BioMed Depot Bay 4',
        available: true,
        minDurationHours: 4,
        maxDurationDays: 5,
        costPerDay: 0,
        isFreeSharing: true,
        requiresSupervision: true,
        supervisionDetails: 'Must be operated by a registered clinical nurse or certified ECG technician.',
        eligibilityTier: 'ANY_VERIFIED',
        usageConditions: [
          'Store in temperature-controlled room (18-24°C)',
          'Return with full lead set and original carrying case',
          'Immediate reporting if lead resistance fails impedance check'
        ],
        safetyRestrictions: [
          'Do not use in high-oxygen surgical theatres without grounding check',
          'Only use supplied medical-grade power cord'
        ],
        condition: 'EXCELLENT',
        manufacturer: 'GE Healthcare',
        modelNumber: 'MAC 2000 v4',
        serialNumber: 'GE-ECG-2023-8841',
        lastMaintenanceDate: '2026-09-15',
        nextMaintenanceDate: '2027-03-15',
        calibrationExpiryDate: '2027-04-01',
        isMaintenanceBlocked: false,
        activeBookingsCount: 1,
        totalUsageDays: 42,
        createdAt: '2025-01-20T10:00:00Z'
      },
      {
        id: 'res-2',
        name: 'Philips Affiniti 70 Ultrasound Imaging Station',
        category: 'EQUIPMENT',
        subcategory: 'Diagnostic Ultrasound',
        description: 'Comprehensive shared ultrasound system equipped with PureWave convex and linear transducers. Ideal for echocardiography, abdominal ultrasound, and musculoskeletal scans.',
        imageUrl: '/src/assets/images/equipment_ultrasound_1793367674396.jpg',
        galleryImages: ['/src/assets/images/equipment_ultrasound_1793367674396.jpg'],
        ownerInstitutionId: 'inst-1',
        ownerInstitutionName: 'Apollo Specialty Hospital',
        location: 'Diagnostic Wing A, Apollo Hospital',
        city: 'Bengaluru',
        state: 'Karnataka',
        floorWing: 'Radiology Block, Station 3',
        available: true,
        minDurationHours: 6,
        maxDurationDays: 3,
        costPerDay: 450,
        isFreeSharing: false,
        requiresSupervision: true,
        supervisionDetails: 'Certified Radiologist or MD Sonologist required on-site during clinical examinations.',
        eligibilityTier: 'TRAINED_SPECIALIST_REQUIRED',
        usageConditions: [
          'Pre-scan acoustic transducer inspection mandatory',
          'Only approved acoustic coupling gel allowed',
          'Secure wheeled transport cradle required'
        ],
        safetyRestrictions: [
          'PNDT compliance mandatory under Indian PC-PNDT Act (Form F registration)',
          'Requires pre-authorized radiologist license number'
        ],
        condition: 'GOOD',
        manufacturer: 'Philips Healthcare',
        modelNumber: 'Affiniti 70 G',
        serialNumber: 'PH-US-2022-4910',
        lastMaintenanceDate: '2026-08-10',
        nextMaintenanceDate: '2027-02-10',
        calibrationExpiryDate: '2027-03-01',
        isMaintenanceBlocked: false,
        activeBookingsCount: 0,
        totalUsageDays: 68,
        createdAt: '2025-02-01T10:00:00Z'
      },
      {
        id: 'res-3',
        name: 'Advanced Molecular Pathology & Cell Culture Suite',
        category: 'FACILITY',
        subcategory: 'Research Laboratory',
        description: 'Biosafety Level 2 (BSL-2) certified research and pathology suite equipped with Class II Type A2 biosafety cabinets, inverted fluorescent microscopes, and refrigerated benchtop centrifuges. Perfect for collaborative clinical studies.',
        imageUrl: '/src/assets/images/facility_research_lab_1793367674390.jpg',
        galleryImages: ['/src/assets/images/facility_research_lab_1793367674390.jpg'],
        ownerInstitutionId: 'inst-2',
        ownerInstitutionName: 'Mysuru Medical College & Research Institute',
        location: 'Postgraduate Research Wing',
        city: 'Mysuru',
        state: 'Karnataka',
        floorWing: 'College Central Block, Floor 3 Lab 304',
        available: true,
        minDurationHours: 4,
        maxDurationDays: 7,
        costPerDay: 0,
        isFreeSharing: true,
        requiresSupervision: true,
        supervisionDetails: 'Department Laboratory Officer oversees check-in and bio-waste protocols.',
        eligibilityTier: 'HOSPITAL_ONLY',
        usageConditions: [
          'BSL-2 certified personnel badge required',
          'All biological reagents must have SDS documentation',
          'Daily decontamination sign-off'
        ],
        safetyRestrictions: [
          'No hazardous pathogen storage beyond approved study protocols',
          'Sharps disposal strict protocol'
        ],
        condition: 'EXCELLENT',
        manufacturer: 'MMCRI Institutional Facility',
        modelNumber: 'BSL2-LAB-304',
        serialNumber: 'FAC-MMC-2021-03',
        lastMaintenanceDate: '2026-10-01',
        nextMaintenanceDate: '2027-04-01',
        calibrationExpiryDate: '2027-05-01',
        isMaintenanceBlocked: false,
        activeBookingsCount: 1,
        totalUsageDays: 110,
        createdAt: '2024-12-10T10:00:00Z'
      },
      {
        id: 'res-4',
        name: 'Olympus CX23 Clinical Digital Microscope Set',
        category: 'EQUIPMENT',
        subcategory: 'Diagnostic Pathology',
        description: 'Plan Achromat optics microscope with 4x, 10x, 40x, and 100x oil immersion objectives, equipped with 12MP high-definition CMOS digital camera for live slide projection and telepathology consultations.',
        imageUrl: '/src/assets/images/facility_research_lab_1793367674390.jpg',
        galleryImages: ['/src/assets/images/facility_research_lab_1793367674390.jpg'],
        ownerInstitutionId: 'inst-2',
        ownerInstitutionName: 'Mysuru Medical College & Research Institute',
        location: 'Department of Pathology',
        city: 'Mysuru',
        state: 'Karnataka',
        floorWing: 'Lab Wing 2, Cabinet 12',
        available: true,
        minDurationHours: 2,
        maxDurationDays: 4,
        costPerDay: 0,
        isFreeSharing: true,
        requiresSupervision: false,
        supervisionDetails: 'Self-contained clinical optical unit. Pre-inspected for optical alignment.',
        eligibilityTier: 'ANY_VERIFIED',
        usageConditions: [
          'Clean immersion oil from 100x lens immediately after use with lens tissue',
          'Use dust cover during storage'
        ],
        safetyRestrictions: [
          'Avoid liquid ingress into the condenser stage'
        ],
        condition: 'GOOD',
        manufacturer: 'Olympus Corporation',
        modelNumber: 'CX23 LED',
        serialNumber: 'OLY-MIC-2023-1109',
        lastMaintenanceDate: '2026-07-20',
        nextMaintenanceDate: '2027-01-20',
        calibrationExpiryDate: '2027-02-15',
        isMaintenanceBlocked: false,
        activeBookingsCount: 0,
        totalUsageDays: 34,
        createdAt: '2025-01-05T10:00:00Z'
      },
      {
        id: 'res-5',
        name: 'Mindray BeneVision N12 Multi-Parameter Patient Monitor',
        category: 'EQUIPMENT',
        subcategory: 'Intensive Care Telemetry',
        description: 'Portable ICU monitor measuring SpO2, NIBP, 5-lead ECG, Dual Temp, and optional EtCO2. Includes integrated rechargeable battery with 4-hour runtime for patient transport.',
        imageUrl: '/src/assets/images/medishare_hero_network_1793367674101.jpg',
        galleryImages: ['/src/assets/images/medishare_hero_network_1793367674101.jpg'],
        ownerInstitutionId: 'inst-1',
        ownerInstitutionName: 'Apollo Specialty Hospital',
        location: 'Apollo Emergency Reserve',
        city: 'Bengaluru',
        state: 'Karnataka',
        floorWing: 'ICU Reserve Room 102',
        available: true,
        minDurationHours: 6,
        maxDurationDays: 6,
        costPerDay: 200,
        isFreeSharing: false,
        requiresSupervision: false,
        supervisionDetails: 'Staff must be familiar with Mindray alarm limits and sensor calibration.',
        eligibilityTier: 'ANY_VERIFIED',
        usageConditions: [
          'Wipe with quaternary ammonium disinfectant wipes',
          'Keep power brick connected when stationed'
        ],
        safetyRestrictions: [
          'Defibrillator-proof leads must remain with unit'
        ],
        condition: 'EXCELLENT',
        manufacturer: 'Mindray Medical',
        modelNumber: 'BeneVision N12',
        serialNumber: 'MR-MON-2024-7731',
        lastMaintenanceDate: '2026-09-01',
        nextMaintenanceDate: '2027-03-01',
        calibrationExpiryDate: '2027-03-25',
        isMaintenanceBlocked: false,
        activeBookingsCount: 0,
        totalUsageDays: 52,
        createdAt: '2025-02-18T10:00:00Z'
      },
      {
        id: 'res-6',
        name: 'Clinical Skills Simulation & Laparoscopy Training Lab',
        category: 'FACILITY',
        subcategory: 'Surgical Simulation',
        description: 'State-of-the-art simulation theatre with 4 box laparoscopic trainers, virtual endotracheal intubation mannequins, and audio-video recording for post-procedure debriefing.',
        imageUrl: '/src/assets/images/facility_research_lab_1793367674390.jpg',
        galleryImages: ['/src/assets/images/facility_research_lab_1793367674390.jpg'],
        ownerInstitutionId: 'inst-2',
        ownerInstitutionName: 'Mysuru Medical College & Research Institute',
        location: 'Academic Simulation Center',
        city: 'Mysuru',
        state: 'Karnataka',
        floorWing: 'MMCRI Annex 2, Floor 1',
        available: true,
        minDurationHours: 3,
        maxDurationDays: 2,
        costPerDay: 0,
        isFreeSharing: true,
        requiresSupervision: true,
        supervisionDetails: 'Lab manager must brief visiting surgeons on simulator software calibration.',
        eligibilityTier: 'TRAINED_SPECIALIST_REQUIRED',
        usageConditions: [
          'Trainer instruments must be cleaned and re-sleeved',
          'Simulation session logs must be exported to USB'
        ],
        safetyRestrictions: [
          'No real sharps or biological tissue allowed in simulation theatre'
        ],
        condition: 'EXCELLENT',
        manufacturer: 'Surgical Science / MMCRI',
        modelNumber: 'SimSurg Pro',
        serialNumber: 'FAC-SIM-2022-09',
        lastMaintenanceDate: '2026-09-28',
        nextMaintenanceDate: '2027-03-28',
        calibrationExpiryDate: '2027-05-15',
        isMaintenanceBlocked: false,
        activeBookingsCount: 0,
        totalUsageDays: 85,
        createdAt: '2024-12-20T10:00:00Z'
      }
    ];

    // 4. Seed Bookings demonstrating the full workflow
    this.bookings = [
      {
        id: 'bk-101',
        resourceId: 'res-1',
        resourceName: 'GE MAC 2000 Digital 12-Lead ECG System',
        resourceCategory: 'EQUIPMENT',
        resourceImage: '/src/assets/images/equipment_ecg_machine_1793367675254.jpg',
        ownerInstitutionId: 'inst-1',
        ownerInstitutionName: 'Apollo Specialty Hospital',
        seekerUserId: 'user-seeker',
        seekerUserName: 'Dr. Anand Kumar',
        seekerInstitutionId: 'inst-3',
        seekerInstitutionName: 'Metro Heart & Pediatric Clinic',
        startDate: '2026-11-02',
        endDate: '2026-11-04',
        durationDays: 2,
        purpose: 'Free rural cardiac screening outreach camp in Nanjangud rural cluster.',
        clinicalSpeciality: 'Community Preventive Cardiology',
        assignedPhysicianName: 'Dr. Anand Kumar (MD)',
        physicianRegistrationNo: 'KMC-31298',
        status: 'APPROVED',
        statusReason: 'Verified institutional outreach camp with certified ECG technician assigned.',
        fairSharePriorityScore: 94,
        allocationExplanation: 'High priority due to community healthcare outreach and clean return history (0 past damages).',
        qrToken: 'MS-QR-889104-APOLLO-METRO',
        qrTokenExpiresAt: '2026-11-05T23:59:59Z',
        createdAt: '2026-10-25T14:30:00Z',
        updatedAt: '2026-10-26T09:15:00Z',
        hasIncident: false
      },
      {
        id: 'bk-102',
        resourceId: 'res-3',
        resourceName: 'Advanced Molecular Pathology & Cell Culture Suite',
        resourceCategory: 'FACILITY',
        resourceImage: '/src/assets/images/facility_research_lab_1793367674390.jpg',
        ownerInstitutionId: 'inst-2',
        ownerInstitutionName: 'Mysuru Medical College & Research Institute',
        seekerUserId: 'user-seeker',
        seekerUserName: 'Dr. Anand Kumar',
        seekerInstitutionId: 'inst-3',
        seekerInstitutionName: 'Metro Heart & Pediatric Clinic',
        startDate: '2026-11-06',
        endDate: '2026-11-08',
        durationDays: 3,
        purpose: 'Lipid biomarker separation assay for collaborative clinical study.',
        clinicalSpeciality: 'Pathology & Biochemistry',
        assignedPhysicianName: 'Dr. Anand Kumar',
        physicianRegistrationNo: 'KMC-31298',
        status: 'PENDING',
        statusReason: 'Under review by MMCRI Dean of Research.',
        fairSharePriorityScore: 78,
        allocationExplanation: 'Standard priority for inter-institutional diagnostic analysis.',
        createdAt: '2026-10-29T11:00:00Z',
        updatedAt: '2026-10-29T11:00:00Z',
        hasIncident: false
      },
      {
        id: 'bk-100',
        resourceId: 'res-1',
        resourceName: 'GE MAC 2000 Digital 12-Lead ECG System',
        resourceCategory: 'EQUIPMENT',
        resourceImage: '/src/assets/images/equipment_ecg_machine_1793367675254.jpg',
        ownerInstitutionId: 'inst-1',
        ownerInstitutionName: 'Apollo Specialty Hospital',
        seekerUserId: 'user-seeker',
        seekerUserName: 'Dr. Anand Kumar',
        seekerInstitutionId: 'inst-3',
        seekerInstitutionName: 'Metro Heart & Pediatric Clinic',
        startDate: '2026-10-10',
        endDate: '2026-10-12',
        durationDays: 2,
        purpose: 'Primary health center patient follow-up drive.',
        clinicalSpeciality: 'Cardiology',
        assignedPhysicianName: 'Dr. Anand Kumar',
        physicianRegistrationNo: 'KMC-31298',
        status: 'COMPLETED',
        statusReason: 'Returned on schedule in good working condition.',
        fairSharePriorityScore: 88,
        allocationExplanation: 'Approved under regular institutional partnership program.',
        qrToken: 'MS-QR-PAST-7712',
        checkedOutAt: '2026-10-10T09:12:00Z',
        checkedOutByManagerName: 'Suresh V. Menon',
        returnedAt: '2026-10-12T17:45:00Z',
        returnedByManagerName: 'Suresh V. Menon',
        createdAt: '2026-10-05T09:00:00Z',
        updatedAt: '2026-10-12T17:45:00Z',
        hasIncident: false
      }
    ];

    // 5. Initial QR Tokens
    this.qrTokens.set('bk-101', {
      bookingId: 'bk-101',
      token: 'MS-QR-889104-APOLLO-METRO',
      expiresAt: '2026-11-05T23:59:59Z'
    });

    // 6. Past inspections
    this.inspections = [
      {
        id: 'insp-1',
        bookingId: 'bk-100',
        resourceId: 'res-1',
        resourceName: 'GE MAC 2000 Digital 12-Lead ECG System',
        inspectionType: 'CHECK_IN_BEFORE',
        condition: 'EXCELLENT',
        inspectorId: 'user-manager',
        inspectorName: 'Suresh V. Menon',
        photographUrl: '/src/assets/images/equipment_ecg_machine_1793367675254.jpg',
        comments: 'Unit clean, battery 100%, 10 leads tested for continuous conductivity. Thermal roll full.',
        damageIdentified: false,
        authorizedConfirmed: true,
        timestamp: '2026-10-10T09:15:00Z'
      },
      {
        id: 'insp-2',
        bookingId: 'bk-100',
        resourceId: 'res-1',
        resourceName: 'GE MAC 2000 Digital 12-Lead ECG System',
        inspectionType: 'CHECK_OUT_AFTER',
        condition: 'EXCELLENT',
        inspectorId: 'user-manager',
        inspectorName: 'Suresh V. Menon',
        photographUrl: '/src/assets/images/equipment_ecg_machine_1793367675254.jpg',
        comments: 'Returned in pristine state. All 10 leads accounted for, cleaned with hospital disinfectant.',
        damageIdentified: false,
        authorizedConfirmed: true,
        timestamp: '2026-10-12T17:40:00Z'
      }
    ];

    // 7. Incidents
    this.incidents = [
      {
        id: 'inc-1',
        bookingId: 'bk-100',
        resourceId: 'res-1',
        resourceName: 'GE MAC 2000 Digital 12-Lead ECG System',
        reporterId: 'user-manager',
        reporterName: 'Suresh V. Menon',
        reporterInstitutionName: 'Apollo Specialty Hospital',
        category: 'SAFETY_CONCERN',
        description: 'Notice of minor cable strain relief bend on V4 chest lead detected during routine storage inventory.',
        severity: 'LOW',
        status: 'RESOLVED',
        evidencePhotoUrl: '/src/assets/images/equipment_ecg_machine_1793367675254.jpg',
        assignedReviewerName: 'Pooja Krishnan (Admin)',
        resolutionNotes: 'Tested impedance and insulation continuity. Replaced lead cable under standard OEM warranty pack.',
        resolvedAt: '2026-10-15T14:00:00Z',
        createdAt: '2026-10-13T10:00:00Z'
      }
    ];

    // 8. Maintenance records
    this.maintenanceRecords = [
      {
        id: 'maint-1',
        resourceId: 'res-1',
        resourceName: 'GE MAC 2000 Digital 12-Lead ECG System',
        performedDate: '2026-09-15',
        performedBy: 'GE Healthcare Certified Field Engineer',
        nextScheduledDate: '2027-03-15',
        calibrationExpiryDate: '2027-04-01',
        passedCertification: true,
        notes: 'Annual electrical safety test IEC 60601-1 and 12-lead calibration verified. Calibration sticker updated.',
        activeRestriction: false
      },
      {
        id: 'maint-2',
        resourceId: 'res-2',
        resourceName: 'Philips Affiniti 70 Ultrasound Imaging Station',
        performedDate: '2026-08-10',
        performedBy: 'Philips BioMed Service Team',
        nextScheduledDate: '2027-02-10',
        calibrationExpiryDate: '2027-03-01',
        passedCertification: true,
        notes: 'Acoustic output and Doppler sensitivity test within ±2% margin. Cleaned ventilation intake.',
        activeRestriction: false
      }
    ];

    // 9. Waitlist
    this.waitlistEntries = [
      {
        id: 'wl-1',
        resourceId: 'res-1',
        resourceName: 'GE MAC 2000 Digital 12-Lead ECG System',
        bookingId: 'bk-wait-99',
        seekerInstitutionId: 'inst-5',
        seekerInstitutionName: 'St. Jude Rural Health Center',
        requestedStartDate: '2026-11-03',
        requestedEndDate: '2026-11-04',
        priorityScore: 72,
        queuePosition: 1,
        status: 'WAITING',
        createdAt: '2026-10-27T08:00:00Z'
      }
    ];

    // 10. Notifications
    this.notifications = [
      {
        id: 'notif-1',
        recipientInstitutionId: 'inst-3',
        recipientUserId: 'user-seeker',
        title: 'Booking Approved',
        message: 'Your booking request #bk-101 for GE MAC 2000 ECG System has been APPROVED by Apollo Hospital. Your secure QR Token is now active for collection check-in.',
        type: 'BOOKING_APPROVAL',
        read: false,
        linkUrl: '/bookings/bk-101',
        createdAt: '2026-10-26T09:15:00Z'
      },
      {
        id: 'notif-2',
        recipientInstitutionId: 'inst-1',
        recipientUserId: 'user-owner',
        title: 'New Booking Request',
        message: 'Metro Heart Clinic requested booking for Molecular Pathology Suite (Nov 06 - Nov 08). Eligibility score: 78/100.',
        type: 'BOOKING_REQUEST',
        read: false,
        linkUrl: '/bookings/bk-102',
        createdAt: '2026-10-29T11:00:00Z'
      },
      {
        id: 'notif-3',
        recipientInstitutionId: 'inst-1',
        recipientUserId: 'user-manager',
        title: 'Collection Check-In Scheduled',
        message: 'Dr. Anand Kumar from Metro Heart Clinic is scheduled for equipment collection on 2026-11-02 for #bk-101. Ready for QR handover.',
        type: 'COLLECTION_DUE',
        read: true,
        linkUrl: '/qr-scanner',
        createdAt: '2026-10-29T08:00:00Z'
      }
    ];

    // 11. Immutable Audit Logs
    this.auditLogs = [
      {
        id: 'aud-1',
        actorId: 'user-owner',
        actorName: 'Dr. Rajeshwari Sen',
        institutionId: 'inst-1',
        institutionName: 'Apollo Specialty Hospital',
        action: 'RESOURCE_REGISTERED',
        entityType: 'RESOURCE',
        entityId: 'res-1',
        details: 'Registered GE MAC 2000 Digital 12-Lead ECG System under free sharing tier with clinical supervision mandate.',
        timestamp: '2025-01-20T10:00:00Z'
      },
      {
        id: 'aud-2',
        actorId: 'user-seeker',
        actorName: 'Dr. Anand Kumar',
        institutionId: 'inst-3',
        institutionName: 'Metro Heart & Pediatric Clinic',
        action: 'BOOKING_SUBMITTED',
        entityType: 'BOOKING',
        entityId: 'bk-101',
        details: 'Submitted request for rural outreach cardiac camp. FairShare priority computed at 94.',
        timestamp: '2026-10-25T14:30:00Z'
      },
      {
        id: 'aud-3',
        actorId: 'user-owner',
        actorName: 'Dr. Rajeshwari Sen',
        institutionId: 'inst-1',
        institutionName: 'Apollo Specialty Hospital',
        action: 'BOOKING_APPROVED',
        entityType: 'BOOKING',
        entityId: 'bk-101',
        details: 'Approved reservation after reviewing clinical personnel credentials. Cryptographic QR token issued.',
        timestamp: '2026-10-26T09:15:00Z'
      }
    ];
  }

  // Session & Role management
  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUserRole(role: UserProfile['role']) {
    const user = this.users.find(u => u.role === role);
    if (user) {
      this.currentUser = user;
      return user;
    }
    return this.currentUser;
  }

  loginUser(email: string, role?: UserProfile['role']) {
    let user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user && role) {
      user = this.users.find(u => u.role === role);
    }
    if (!user) {
      // Find default demo user or create session user
      user = this.users[0];
    }
    this.currentUser = user;
    return user;
  }

  registerUser(
    userData: {
      fullName: string;
      email: string;
      role: UserProfile['role'];
      department: string;
      designation: string;
      phoneNumber: string;
      licenseNumber?: string;
    },
    institutionData: {
      name: string;
      type: any;
      officialEmail: string;
      contactNumber?: string;
      address?: string;
      city: string;
      state?: string;
      registrationNumber?: string;
      accreditation?: string;
    }
  ) {
    // 1. Create or link institution
    let inst = this.institutions.find(
      i => i.name.toLowerCase() === institutionData.name.toLowerCase() ||
           i.officialEmail.toLowerCase() === institutionData.officialEmail.toLowerCase()
    );

    if (!inst) {
      inst = {
        id: `inst-${Date.now()}`,
        name: institutionData.name,
        type: institutionData.type || 'CLINIC',
        officialEmail: institutionData.officialEmail,
        contactNumber: institutionData.contactNumber || userData.phoneNumber || '+91 80 0000 0000',
        address: institutionData.address || 'Medical Enclave',
        city: institutionData.city || 'Bengaluru',
        state: institutionData.state || 'Karnataka',
        registrationNumber: institutionData.registrationNumber || `REG-${Date.now().toString().slice(-6)}`,
        verificationStatus: 'PENDING',
        accreditation: institutionData.accreditation || 'State Clinical Establishment Registry Review',
        createdAt: new Date().toISOString(),
      };
      this.institutions.push(inst);

      this.createNotification(
        'inst-1',
        'New Institution Pending Verification',
        `${inst.name} (${inst.type}) registered under registration #${inst.registrationNumber}. Requires compliance review.`,
        'MAINTENANCE_ALERT',
        '/analytics'
      );
    }

    // 2. Create user profile
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role || 'RESOURCE_SEEKER',
      institutionId: inst.id,
      department: userData.department || 'Outpatient Services',
      designation: userData.designation || 'Staff Physician',
      phoneNumber: userData.phoneNumber || '+91 99999 00000',
      licenseNumber: userData.licenseNumber || 'MED-REG-PENDING',
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.currentUser = newUser;

    this.logAudit(
      newUser,
      'USER_REGISTERED',
      'SECURITY',
      newUser.id,
      `Registered new user account: ${newUser.fullName} (${newUser.role}) at ${inst.name}`
    );

    return { user: newUser, institution: inst };
  }

  // Audit Logger
  logAudit(
    actor: UserProfile,
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string,
    metadata?: Record<string, any>
  ) {
    const inst = this.institutions.find(i => i.id === actor.institutionId);
    const log: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorId: actor.id,
      actorName: actor.fullName,
      institutionId: actor.institutionId,
      institutionName: inst ? inst.name : 'Unknown Institution',
      action,
      entityType,
      entityId,
      details,
      metadata,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    return log;
  }

  // Notification Generator
  createNotification(
    recipientInstitutionId: string,
    title: string,
    message: string,
    type: Notification['type'],
    linkUrl?: string,
    recipientUserId?: string
  ) {
    const notif: Notification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientInstitutionId,
      recipientUserId,
      title,
      message,
      type,
      read: false,
      linkUrl,
      createdAt: new Date().toISOString()
    };
    this.notifications.unshift(notif);
    return notif;
  }

  // FairShare Allocation Algorithm
  calculateFairSharePriority(
    seekerInstitutionId: string,
    purpose: string,
    durationDays: number
  ): { score: number; explanation: string } {
    let score = 70; // baseline

    // Factor 1: Institution type bonus for rural or primary clinic
    const inst = this.institutions.find(i => i.id === seekerInstitutionId);
    if (inst?.type === 'CLINIC') score += 12;
    if (inst?.type === 'MEDICAL_COLLEGE') score += 8;

    // Factor 2: High medical necessity keyword detection
    const lowerPurpose = purpose.toLowerCase();
    if (lowerPurpose.includes('emergency') || lowerPurpose.includes('rural') || lowerPurpose.includes('camp') || lowerPurpose.includes('critical')) {
      score += 15;
    }

    // Factor 3: Past booking frequency and damage penalties
    const pastBookings = this.bookings.filter(b => b.seekerInstitutionId === seekerInstitutionId);
    const pastDamages = this.incidents.filter(inc => {
      const b = this.bookings.find(bk => bk.id === inc.bookingId);
      return b && b.seekerInstitutionId === seekerInstitutionId;
    });

    if (pastDamages.length > 0) {
      score -= pastDamages.length * 20;
    } else if (pastBookings.length > 0) {
      // Good track record bonus
      score += 5;
    }

    // Factor 4: Shorter duration promotes higher sharing turnover
    if (durationDays <= 3) score += 5;
    else if (durationDays > 7) score -= 10;

    // Clamp score between 10 and 99
    score = Math.max(10, Math.min(99, score));

    const explanation = `FairShare Score ${score}/100 based on ${inst?.type || 'Institution'} status, clean safety track record (${pastDamages.length} incidents), and purpose assessment.`;
    return { score, explanation };
  }

  // Check booking conflict with transactions-like lock
  checkBookingConflict(resourceId: string, startDate: string, endDate: string, excludeBookingId?: string): boolean {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return this.bookings.some(b => {
      if (b.id === excludeBookingId) return false;
      if (b.resourceId !== resourceId) return false;
      if (!['APPROVED', 'CHECKED_OUT'].includes(b.status)) return false;

      const bStart = new Date(b.startDate).getTime();
      const bEnd = new Date(b.endDate).getTime();

      // Overlap condition
      return (start <= bEnd && end >= bStart);
    });
  }

  // Check Safety & Maintenance block
  isResourceEligibleForBooking(resourceId: string): { eligible: boolean; reason?: string } {
    const res = this.resources.find(r => r.id === resourceId);
    if (!res) return { eligible: false, reason: 'Resource not found' };

    if (!res.available) {
      return { eligible: false, reason: 'Resource is marked as currently unavailable by the owner institution.' };
    }

    if (res.isMaintenanceBlocked) {
      return { eligible: false, reason: 'Resource is locked: mandatory maintenance inspection or active safety notice.' };
    }

    const today = new Date().toISOString().split('T')[0];
    if (res.calibrationExpiryDate && res.calibrationExpiryDate < today) {
      return { eligible: false, reason: 'Calibration expired on ' + res.calibrationExpiryDate + '. Clinical safety laws prohibit sharing until recertification.' };
    }

    return { eligible: true };
  }

  // Analytics Computation from real database state
  getAnalyticsSummary(): AnalyticsSummary {
    const totalInst = this.institutions.length;
    const verifiedInst = this.institutions.filter(i => i.verificationStatus === 'VERIFIED').length;
    const totalRes = this.resources.length;
    const availRes = this.resources.filter(r => r.available && !r.isMaintenanceBlocked).length;
    const activeBks = this.bookings.filter(b => ['APPROVED', 'CHECKED_OUT'].includes(b.status)).length;
    const completedBks = this.bookings.filter(b => b.status === 'COMPLETED').length;
    const waitlisted = this.waitlistEntries.filter(w => w.status === 'WAITING').length;
    const incs = this.incidents.length;

    const totalDaysUsed = this.resources.reduce((acc, r) => acc + (r.totalUsageDays || 0), 0);
    const utilizationRate = Math.min(100, Math.round((totalDaysUsed / (totalRes * 60)) * 100));

    const categoryMap: Record<string, number> = {};
    for (const r of this.resources) {
      const sub = r.subcategory || r.category;
      categoryMap[sub] = (categoryMap[sub] || 0) + 1;
    }
    const categoryDistribution = Object.entries(categoryMap).map(([category, count]) => ({ category, count }));

    const monthlyTrends = [
      { month: 'Jun 2026', bookings: 14, completed: 12 },
      { month: 'Jul 2026', bookings: 22, completed: 20 },
      { month: 'Aug 2026', bookings: 31, completed: 28 },
      { month: 'Sep 2026', bookings: 45, completed: 41 },
      { month: 'Oct 2026', bookings: 58, completed: 52 }
    ];

    const topSharedResources = this.resources
      .slice()
      .sort((a, b) => b.totalUsageDays - a.totalUsageDays)
      .slice(0, 4)
      .map(r => ({
        name: r.name,
        category: r.category,
        daysUsed: r.totalUsageDays,
        institution: r.ownerInstitutionName
      }));

    return {
      totalInstitutions: totalInst,
      verifiedInstitutions: verifiedInst,
      totalResources: totalRes,
      availableResources: availRes,
      activeBookings: activeBks,
      completedBookings: completedBks,
      waitlistedRequests: waitlisted,
      reportedIncidents: incs,
      utilizationRate,
      categoryDistribution,
      monthlyTrends,
      topSharedResources
    };
  }
}

export const db = new MediShareDatabase();
