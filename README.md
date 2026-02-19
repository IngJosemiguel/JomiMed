# JomiMed - Clinical SaaS Platform

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue)

**JomiMed** is a comprehensive, multi-tenant SaaS platform designed for medical clinics. It provides a seamless experience for **Doctors**, **Patients**, and **Administrators**, featuring robust financial management, digital medical records (EMR), and automated scheduling.

## 🚀 Key Features

### 🏢 Multi-Tenancy & SaaS

- **Subscription Tiers:** Free, Pro, and Enterprise plans with strictly enforced limits (Storage, Users, Patients).
- **Clinic Isolation:** Data strict separation per clinic using `clinicId` at the database level.
- **Branding:** Customizable clinic settings (Logo, Colors, Currency).

### 🩺 Doctor Portal

- **Smart Agenda:** Visual daily schedule with status tracking (Waiting, In-Progress, Completed).
- **Consultation Mode:**
  - Structured SOAP Notes (Subjective, Objective, Assessment, Plan).
  - Medical History context (Allergies, Chronic Conditions).
  - **PDF Prescriptions:** One-click generation of professional recipes.
  - **Auto-Email:** Patients receive a summary of their visit automatically.

### 🏥 Patient Portal

- **Self-Service:** Patients can view their own medical history, lab results, and prescriptions.
- **Appointments:** Book, reschedule, or cancel appointments online.
- **Secure Access:** Dedicated login portal separate from administrative staff.

### 💰 Finance & Administration

- **Invoicing:** Create professional invoices with tax calculations.
- **Payments:** Record partial or full payments (Cash, Card, Transfer) with balance tracking.
- **Dashboard:** Real-time financial analytics, patient growth charts, and occupancy rates.
- **Audit Logs:** Full traceability of system actions for security and compliance.

## 🛠️ Technology Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- **Database:** PostgreSQL (Managed via [Prisma ORM](https://www.prisma.io/))
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication:** Custom Secure JWT with RBAC (Role-Based Access Control).
- **PDF Generation:** `jspdf` & `jspdf-autotable`.
- **Email:** `nodemailer`.

## 📦 Installation & Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-repo/jomimed.git
    cd jomimed
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Environment Setup:**
    Create a `.env` file in the root:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/jomimed?schema=public"
    JWT_SECRET="super-secret-key-change-me"
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```

4. **Database Migration:**

    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed  # (Optional) Seeds initial admin user
    ```

5. **Run Development Server:**

    ```bash
    npm run dev
    ```

## 🏗️ Project Structure

```bash
src/
├── app/                 # Next.js App Router (Pages & API)
│   ├── api/             # Backend API Routes
│   ├── dashboard/       # Admin & Doctor Dashboard
│   ├── portal/          # Patient Portal
│   └── (auth)/          # Login & Signup Pages
├── core/                # Business Logic (Clean Architecture)
│   ├── application/     # Use Cases & Services
│   └── domain/          # Entities & Interfaces
├── infrastructure/      # External Services (DB, Auth, Email)
└── lib/                 # Shared Utilities
```

## 📜 License

This project is proprietary software developed for JomiMed Inc.
