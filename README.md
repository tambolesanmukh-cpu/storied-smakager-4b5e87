# MEDISHARE AI — Healthcare Resource Exchange Platform

> **Share Resources. Improve Access. Protect Healthcare.**

[![Status](https://img.shields.io/badge/Status-Production%20Ready-emerald.svg)]()
[![Gemini 3.8 Flash](https://img.shields.io/badge/AI-Google%20Gemini%203.8%20Flash-teal.svg)]()
[![IEC 60601-1](https://img.shields.io/badge/Compliance-IEC%2060601--1%20Safety-blue.svg)]()

MediShare AI is a trusted, full-stack healthcare resource-sharing platform designed to unlock underutilized medical equipment (such as 12-lead ECG systems, diagnostic ultrasound stations, and ICU telemetry) and specialized institutional facilities (such as BSL-2 molecular laboratories and surgical simulation theatres) between hospitals, rural clinics, and medical colleges.

---

## 🌟 Key Highlights & Innovations

1. **MediMatch AI (Google Gemini 3.8 Flash Integration):**
   - Natural-language semantic query processing: Translates clinician requests like *"I need an ECG machine for 2 days near Mysuru for a rural camp"* into structured database queries.
   - Zero-hallucination constraint: Queries exclusively against verified, calibrated database records.
   - Assists Biomedical Safety Officers during return inspections by comparing before-and-after condition notes.

2. **FairShare Priority Allocation Engine:**
   - Replaces unfair "first-come first-served" queuing with a transparent 10–99 score based on clinical urgency, rural community impact, and past safety records.
   - Manages automated waiting lists when booking conflicts occur.

3. **Cryptographic QR Smart Handover:**
   - Generates unique, non-guessable single-use QR tokens for approved bookings.
   - Enforces physical pre-handover baseline inspections and post-return checks by authorized Biomedical Safety Managers.
   - Prevents duplicate scans and rejects unauthorized checkouts.

4. **Biomedical Maintenance & Calibration Locks:**
   - Automatically locks booking of any resource whose safety calibration (IEC 60601-1) has expired or has an active safety restriction.

5. **Immutable Append-Only Audit Ledger:**
   - Every reservation, status transition, condition report, and role switch is committed to an immutable audit timeline for regulatory governance.

---
## 👥 Authentication & Demo Personas (One-Click Quick Logins)

MediShare AI features an enterprise healthcare sign-in and institution onboarding suite:
- **Dedicated Sign-In:** Official institutional email & password login with "Remember Terminal" and password reset flow.
- **One-Click Quick Logins:** Immediate sign-in as any of the 4 verified personas:
  - **Dr. Rajeshwari Sen** (`RESOURCE_OWNER`) — Apollo Specialty Hospital (Bengaluru)
  - **Dr. Anand Kumar** (`RESOURCE_SEEKER`) — Metro Heart & Pediatric Clinic (Mysuru)
  - **Suresh V. Menon** (`RESOURCE_MANAGER`) — Chief Biomedical Safety Officer
  - **Pooja Krishnan** (`PLATFORM_ADMIN`) — State Health Platform Compliance Officer
- **Multi-Step Institution Registration:** Clinician identity verification, medical council registration, institutional legal details, NABH/NMC accreditation, and verification queue handling.

---

## 🚀 48-Hour Demonstration Scenario Walkthrough

Judges can click the **"Launch 48-Hour Demo Scenario Walkthrough"** button to be guided through the complete lifecycle:

1. **Step 1 (Hospital A):** Apollo Specialty Hospital lists the GE MAC 2000 12-Lead ECG Machine under the Free Sharing tier.
2. **Step 2 (Clinic B):** Metro Heart Clinic uses **MediMatch AI** to search for *"ECG machine for two days in Mysuru for rural camp"*. Gemini matches Apollo's calibrated system.
3. **Step 3 (Booking & FairShare):** Metro Clinic requests the reservation. FairShare calculates a **94/100 priority score**. Apollo Hospital approves, automatically issuing a cryptographic QR pass.
4. **Step 4 (Collection Handover):** Suresh Menon (Biomedical Safety Officer) opens the **QR Scanner**, validates the token, confirms lead impedance & battery health, and executes physical check-in.
5. **Step 5 (Return & Audit):** Equipment is returned after the rural camp. Suresh conducts post-return inspection with Gemini AI discrepancy analysis. The transaction is sealed in the **Audit Trail**.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React icons, Plus Jakarta Sans & JetBrains Mono typography.
- **Backend:** Node.js, Express, tsx.
- **AI Integration:** Google Gemini 3.8 Flash (`@google/genai` TypeScript SDK) running strictly server-side.
- **Database Architecture:** Relational PostgreSQL / Supabase schema with Row Level Security (RLS) policies (see `supabase_schema.sql`).
- **QR Cryptography:** `qrcode` library rendering hash-verified tokens.

---

## 📦 Local Setup & Execution

```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server
npm run dev
```

The application runs on `http://localhost:3000`.

---

## 🔒 Security & Medical Disclaimers

- **Zero PHI Collection:** MediShare AI does not store patient medical records or individual health data.
- **Human-in-the-Loop Clinical Authority:** AI models assist discovery and note summarization; final reservation approval and equipment safety sign-off are strictly reserved for verified human medical and biomedical personnel.
