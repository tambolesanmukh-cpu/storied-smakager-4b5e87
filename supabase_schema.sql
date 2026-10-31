-- =====================================================================
-- MEDISHARE AI: PRODUCTION POSTGRESQL & SUPABASE DATABASE SCHEMA
-- Includes Row Level Security (RLS), Foreign Keys, Constraints & Indexes
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('RESOURCE_OWNER', 'RESOURCE_SEEKER', 'RESOURCE_MANAGER', 'PLATFORM_ADMIN');
CREATE TYPE institution_type AS ENUM ('HOSPITAL', 'CLINIC', 'MEDICAL_COLLEGE', 'DIAGNOSTIC_CENTER', 'RESEARCH_INSTITUTE');
CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'REQUIRES_INFO');
CREATE TYPE resource_category AS ENUM ('EQUIPMENT', 'FACILITY');
CREATE TYPE resource_condition AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'MAINTENANCE_REQUIRED');
CREATE TYPE booking_status AS ENUM ('PENDING', 'ELIGIBILITY_REVIEW', 'APPROVED', 'REJECTED', 'WAITLISTED', 'CHECKED_OUT', 'RETURNED', 'COMPLETED', 'INCIDENT_REVIEW', 'CANCELLED');
CREATE TYPE incident_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE incident_status AS ENUM ('REPORTED', 'UNDER_REVIEW', 'AWAITING_INFO', 'RESOLVED', 'CLOSED');

-- 3. INSTITUTIONS TABLE
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type institution_type NOT NULL DEFAULT 'HOSPITAL',
    official_email VARCHAR(255) UNIQUE NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    verification_status verification_status NOT NULL DEFAULT 'PENDING',
    verification_notes TEXT,
    accreditation VARCHAR(255),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'RESOURCE_SEEKER',
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
    department VARCHAR(150),
    designation VARCHAR(150),
    phone_number VARCHAR(50),
    license_number VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. RESOURCES TABLE
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category resource_category NOT NULL,
    subcategory VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    owner_institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    floor_wing VARCHAR(100),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    min_duration_hours INT NOT NULL DEFAULT 4,
    max_duration_days INT NOT NULL DEFAULT 5,
    cost_per_day NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_free_sharing BOOLEAN NOT NULL DEFAULT TRUE,
    requires_supervision BOOLEAN NOT NULL DEFAULT FALSE,
    supervision_details TEXT,
    eligibility_tier VARCHAR(50) NOT NULL DEFAULT 'ANY_VERIFIED',
    usage_conditions TEXT[],
    safety_restrictions TEXT[],
    condition resource_condition NOT NULL DEFAULT 'EXCELLENT',
    manufacturer VARCHAR(150) NOT NULL,
    model_number VARCHAR(150) NOT NULL,
    serial_number VARCHAR(150) UNIQUE NOT NULL,
    last_maintenance_date DATE NOT NULL,
    next_maintenance_date DATE NOT NULL,
    calibration_expiry_date DATE NOT NULL,
    is_maintenance_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    active_bookings_count INT NOT NULL DEFAULT 0,
    total_usage_days INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE RESTRICT,
    owner_institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
    seeker_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    seeker_institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INT NOT NULL,
    purpose TEXT NOT NULL,
    clinical_speciality VARCHAR(150) NOT NULL,
    assigned_physician_name VARCHAR(255),
    physician_registration_no VARCHAR(100),
    status booking_status NOT NULL DEFAULT 'PENDING',
    status_reason TEXT,
    fair_share_priority_score INT NOT NULL DEFAULT 70,
    allocation_explanation TEXT,
    qr_token VARCHAR(255) UNIQUE,
    qr_token_expires_at TIMESTAMPTZ,
    checked_out_at TIMESTAMPTZ,
    checked_out_by_manager_id UUID REFERENCES profiles(id),
    returned_at TIMESTAMPTZ,
    returned_by_manager_id UUID REFERENCES profiles(id),
    has_incident BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- 7. QR EVENTS TABLE
CREATE TABLE IF NOT EXISTS qr_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL,
    scanned_by_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    manager_institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    equipment_condition resource_condition NOT NULL,
    notes TEXT,
    token_hash VARCHAR(64) NOT NULL
);

-- 8. INSPECTIONS TABLE
CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    inspection_type VARCHAR(50) NOT NULL,
    condition resource_condition NOT NULL,
    inspector_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    photograph_url TEXT,
    comments TEXT NOT NULL,
    damage_identified BOOLEAN NOT NULL DEFAULT FALSE,
    damage_description TEXT,
    ai_damage_summary TEXT,
    authorized_confirmed BOOLEAN NOT NULL DEFAULT TRUE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. INCIDENTS TABLE
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    severity incident_severity NOT NULL DEFAULT 'MEDIUM',
    status incident_status NOT NULL DEFAULT 'REPORTED',
    evidence_photo_url TEXT,
    assigned_reviewer_id UUID REFERENCES profiles(id),
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. MAINTENANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    performed_date DATE NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    next_scheduled_date DATE NOT NULL,
    calibration_expiry_date DATE NOT NULL,
    passed_certification BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT NOT NULL,
    active_restriction BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. WAITLIST ENTRIES TABLE
CREATE TABLE IF NOT EXISTS waitlist_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    seeker_institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    requested_start_date DATE NOT NULL,
    requested_end_date DATE NOT NULL,
    priority_score INT NOT NULL DEFAULT 70,
    queue_position INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'WAITING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    recipient_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. AUDIT LOGS TABLE (APPEND-ONLY)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID NOT NULL,
    actor_name VARCHAR(255) NOT NULL,
    institution_id UUID NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    metadata JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public verified institutions visible to authenticated users" 
ON institutions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Resources visible to all authenticated users" 
ON resources FOR SELECT TO authenticated USING (true);

CREATE POLICY "Bookings visible to participating institutions and admins"
ON bookings FOR SELECT TO authenticated USING (
    seeker_institution_id = (SELECT institution_id FROM profiles WHERE id = auth.uid()) OR
    owner_institution_id = (SELECT institution_id FROM profiles WHERE id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'PLATFORM_ADMIN')
);

CREATE POLICY "Audit logs append-only for authenticated users"
ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Audit logs visible to platform admins and institution members"
ON audit_logs FOR SELECT TO authenticated USING (
    institution_id = (SELECT institution_id FROM profiles WHERE id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'PLATFORM_ADMIN')
);

-- 15. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_available ON resources(available, is_maintenance_blocked);
CREATE INDEX IF NOT EXISTS idx_bookings_resource_dates ON bookings(resource_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_qr_tokens ON bookings(qr_token);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_institution_id, read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
