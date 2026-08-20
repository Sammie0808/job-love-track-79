# HireMe — Job Application Tracker

A clean, minimal job application tracker built with React, TanStack Start, and Tailwind CSS. HireMe helps you organize your job search, stay on top of follow-ups, and understand your progress through simple analytics.

![Tech stack](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tech stack](https://img.shields.io/badge/TanStack%20Start-1-FF4154?logo=react)
![Tech stack](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwindcss)

---

## Features

- **Add & edit applications** — record company, role, date applied, and current status.
- **Status tracking** — categorize applications as Applied, Interview, Offer, or Rejected.
- **Reminders** — set follow-up email reminders and interview dates so nothing slips through the cracks.
- **Document uploads** — attach your CV and cover letter to each application (stored locally as base64).
- **Dashboard** — see total applications, interview rate, success rate, and upcoming reminders at a glance.
- **Analytics** — visualize applications per month and conversion rates with charts.
- **Mobile-friendly** — responsive layout that works well on phones, tablets, and desktops.
- **Local storage** — all data is saved in your browser; no account required.

---

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19, file-based routing)
- **Styling:** Tailwind CSS v4 with custom navy / ice-blue / grey design tokens
- **UI Components:** shadcn/ui (Dialog, Select, Button, Input, Label, Table, Card)
- **Charts:** Recharts
- **Notifications:** Sonner
- **State:** React hooks + `localStorage`

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ApplicationDialog.tsx   # Add / edit application form
│   ├── StatCard.tsx            # Dashboard KPI cards
│   └── StatusBadge.tsx         # Color-coded status labels
├── lib/
│   └── applications.ts         # Data model, local storage hook, and analytics helpers
├── routes/
│   ├── __root.tsx              # App shell with navigation and Toaster
│   ├── index.tsx               # Dashboard
│   ├── applications.tsx        # Application list and search
│   └── analytics.tsx           # Charts and conversion metrics
├── router.tsx
├── server.ts
├── start.ts
└── styles.css                  # Theme tokens and Tailwind imports
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- A package manager such as `npm`, `yarn`, `pnpm`, or `bun`

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build for production

```bash
npm run build
```

---

## How It Works

### Data Model

Each application is a plain JavaScript object:

```typescript
interface Application {
  id: string;
  company: string;
  role: string;
  dateApplied: string;   // YYYY-MM-DD
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  followUpDate?: string; // optional YYYY-MM-DD
  followUpNote?: string; // optional reminder text
  interviewDate?: string; // optional YYYY-MM-DD
  cv?: StoredFile;        // { name, dataUrl }
  coverLetter?: StoredFile;
}
```

### Persistence

Applications are serialized to `localStorage` under the key `hireme.applications.v1`. A custom hook broadcasts changes across all open tabs and components, so the dashboard, list, and analytics stay in sync.

### Analytics

Derived statistics are calculated from the stored application array:

- **Interview rate:** percentage of applications that reached Interview or Offer.
- **Success rate:** percentage of applications that resulted in an Offer.
- **Monthly series:** counts of applications and offers over the last six months.
- **Upcoming reminders:** sorted list of follow-ups and interviews by date.

---

## Design

HireMe uses a professional navy, white, and grey palette:

- **Primary:** deep navy (`#0F1F3D`)
- **Accent:** ice blue (`#E6F0FA`)
- **Surfaces:** white and soft greys
- **Status colors:**
  - Applied — blue
  - Interview — amber
  - Offer — green
  - Rejected — red

The layout is mobile-first, with a sticky top navigation, responsive grids, and accessible form controls.

---

## Future Improvements

- Cloud sync and user accounts
- Due-date notifications / email reminders
- Export to CSV or PDF
- Application notes and interview feedback
- Job description parser

---

## License

This project was built with [Lovable](https://lovable.dev) and is yours to modify and deploy.
