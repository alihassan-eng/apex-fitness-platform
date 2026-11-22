# Apex Fitness Platform — Full-Stack Health & Nutrition Web App

**Live Production App:** [https://apex-fitness-platform-beta.vercel.app/](https://apex-fitness-platform-beta.vercel.app/)

Apex Fitness Platform is a full-stack health, fitness, and nutrition tracking application built with **Next.js, TypeScript, Clerk Authentication, and Neon Serverless PostgreSQL**. It enables users to calculate personalized daily BMI, calorie, and macronutrient targets, persist health records securely in the database, and export structured 7-day nutrition plans.

---

## Key Features

- **Personalized Health Calculators:** Computes accurate daily BMI, BMR/TDEE calorie targets, and macro breakdowns (protein, carbs, fats) tailored to user fitness goals.
- **Secure Authentication & User Profiles:** Integrated **Clerk Authentication** for seamless sign-up/sign-in and protected user-specific health dashboards.
- **Serverless Database Persistence:** Uses **Neon PostgreSQL** with **Drizzle ORM** and typed REST/Server Action endpoints to store and retrieve historical user metrics.
- **Downloadable 7-Day Nutrition Plans:** Generates clean, structured 7-day meal and nutrition plan reports ready for download.
- **Responsive UI & Social Metadata:** Built mobile-first with **Tailwind CSS**, OpenGraph social cards, and automated secret-scanning (`Gitleaks`) in the Git workflow.

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Authentication:** Clerk Auth
- **Backend & Database:** Typed REST API Routes, PostgreSQL (Neon), Drizzle ORM
- **Security & Deployment:** Gitleaks Pre-Commit Scanning, Vercel CI/CD

---

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd apex-fitness-platform
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables (`.env`):**
   ```env
   DATABASE_URL="your_neon_postgres_url"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

---

## Author

**Ali Hassan** — Full-Stack Product Engineer 
- **LinkedIn:** [https://www.linkedin.com/in/alihassan-eng/](https://www.linkedin.com/in/alihassan-eng/)
- **X (Twitter):** [@alihassan_eng](https://x.com/alihassan_eng) | [@WebXrayApp](https://x.com/WebXrayApp)
- **Flagship SaaS:** [WebXray](https://webxray-virid.vercel.app/)
