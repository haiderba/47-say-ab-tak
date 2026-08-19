# 🇵🇰 47 Say Ab Tak (1947 سے اب تک)
### The Comprehensive National Citizen Legal Portal, Encrypted Vault & Real-Time Newsroom

[![PWA Ready](https://img.shields.io/badge/PWA-Installable-emerald.svg)](https://47sayabtak.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-SSR_Fullstack-green.svg)](https://tanstack.com/start)
[![Google AdSense](https://img.shields.io/badge/Monetization-Google_AdSense_Ready-gold.svg)](#monetization--google-adsense)
[![AES-256 Encryption](https://img.shields.io/badge/Security-AES--256--GCM-red.svg)](#encrypted-citizen-vault)

---

## 🏛️ Project Vision & Purpose

**47 Say Ab Tak** is Pakistan's premier citizen legal platform dedicated to demystifying 79 years of administrative procedures, land records, constitutional identity, and civic documentation from 1947 to 2026.

Designed with a **Mobile-First Progressive Web App (PWA)** architecture and built for high-performance scale, this platform empowers over 240 million citizens and overseas Pakistanis with:
- **30+ Departmental Step-by-Step Legal Guides** (NADRA, Land Revenue/PLRA, Courts, Excise, Passport, Union Council).
- **Encrypted Sovereign Citizen Vault** (AES-256-GCM browser-side sealed storage for CNIC, FRC, Fard, and Domicile).
- **100% Free Live Pakistani Breaking Newsroom** (Direct verified RSS feeds from DAWN News, The Express Tribune, The News International, and Daily Times with complete in-app reading).
- **Interactive Civic Utility Suite** (Inheritance/Faraid Share Calculator, Stamp Paper Affidavit Generator, Fee & Tax Estimator, 24/7 Center Locator, Document Expiry Tracker).
- **3D National Monument Timeline** (Interactive 2-column engraved white marble monument plaques draped in ceremonial Pakistani flag veils with click-to-unveil physics).
- **Monetization Engine** (Google AdSense auto-ads and high-CTR placements designed to keep the platform free forever).

---

## ✨ Core Features & Architecture

### 1. 📰 Real-Time Verified National Newsroom & Full In-App Reader
* **Direct RSS Media Network**: Aggregates verified news from DAWN, The Express Tribune, The News International, and Daily Times with zero API key dependencies and zero rate limits.
* **Full Multi-Paragraph In-App Reader**: Users read complete stories directly in-app with serif editorial typography, drop caps, font size adjusters (`A`, `A+`, `A++`), and reading time estimates without external redirects.
* **Smart Topic Filtering**: Breaking News, Pakistan National, Legal & Courts, Economy & Trade, and Citizen & Tech.

### 2. 🔐 Sovereign Encrypted Citizen Vault (`AES-256-GCM`)
* Client-side zero-knowledge encrypted storage for personal citizen identity documents.
* Multi-factor verification and audit trails for maximum data sovereignty.

### 3. 🇵🇰 3D White Marble Monument Timeline (1947 → 2026)
* **2-Column Side-by-Side Monument Grid**: 16 pivotal historical eras from 1947 partition bastas to 2026 digital identity systems.
* **Ceremonial Flag Veil Reveal**: Cards are covered under a waving 3D Pakistani flag veil. Clicking any flag lifts and rolls the veil up to unveil the glistening white marble monument plaque and its legal reforms.
* **Three.js WebGL 3D Flag Canvas**: Sinusoidal cloth ripple physics with native alpha transparency.

### 4. 🧮 8 Complete Citizen Utilities
* **Inheritance (Faraid) Calculator**: Computes exact Quranic shares and PKR cash/land distributions for all legal heirs.
* **E-Stamp Succession NOC Generator**: Instantly drafts legal No-Objection & Dastbardari affidavits ready for stamp paper printing.
* **"Check My File" Readiness Checker**: Audits physical files before visiting government centers to prevent bounced applications.
* **Document Expiry Tracker**: Live countdowns and automated renewal alert calculation for CNIC, Passports, and Driving Licenses.
* **24/7 Mega Center & Mouza Locator**: Find the closest 24/7 NADRA centers, Arazi Record Centers, and Passport offices.
* **Agent Scam Radar**: Live verification rules to identify authorized official counters and avoid black-market agents.

### 5. 💰 Google AdSense & Programmatic Monetization
* Global AdSense engine in `<head>` supporting Auto Ads.
* High-converting manual ad placements:
  * Top Leaderboard Banners ($728 \times 90$)
  * Sticky Sidebar Medium Rectangles ($300 \times 250$)
  * Sticky Half-Page Skyscraper Units ($300 \times 600$)
  * In-Feed Native Sponsored Units
  * In-Article Content Monetization Slots

### 6. 📱 Mobile-First PWA (Progressive Web App)
* **Installable on iOS & Android**: Runs standalone without browser address bars.
* **Mobile Floating Bottom Nav**: Quick access to Home, News, Vault, Timeline, and Guides with active indicators and safe-area padding.
* **Offline-First Service Worker**: Caches key guides and checklists for access without internet.

### 7. 📧 Transactional Email Engine (Brevo / Sendinblue)
* Native Brevo SMTP integration for OTP verifications, password resets, and legal notifications.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [TanStack Start](https://tanstack.com/start) (Full-Stack SSR + React 19) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + Custom Emerald/Gold Theme |
| **3D Graphics** | [Three.js](https://threejs.org/) (WebGL Cloth Physics & Alpha Transparency) |
| **Database** | Embedded **PGLite** locally / **PostgreSQL (Neon)** in production |
| **Authentication** | [Better Auth](https://www.better-auth.com/) + Email/Password + Brevo OTP |
| **Email Service** | [Brevo (Sendinblue)](https://www.brevo.com/) REST API |
| **News Stream** | Direct Multi-Channel Pakistani RSS Aggregator & Content Scraper |
| **Icons & UI** | Lucide React, Sonner Toasts |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+ (Node.js 22 recommended)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone <YOUR_GIT_REPO_URL>
cd 47-say-ab-tak-app

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
# App Configuration
VITE_APP_NAME="47 Say Ab Tak"
VITE_PUBLIC_HOSTNAME="localhost:8080"

# Brevo (Sendinblue) Email Service
BREVO_API_KEY="your_brevo_api_key"
BREVO_SENDER_EMAIL="uhaider695@gmail.com"
BREVO_SENDER_NAME="47 Say Ab Tak Official"

# Google AdSense (Optional)
VITE_ADSENSE_CLIENT_ID="ca-pub-XXXXXXXXXXXXXXXX"

# Production Database (Optional - Uses embedded PGLite by default)
DATABASE_URL="postgresql://user:password@host/database"
```

### 4. Running the Dev Server
```bash
npm run dev
```
Visit **http://localhost:8080** in your browser.

---

## 🔑 Default Administrator Account
* **Email**: `Admin@47syabtak.com`
* **Password**: `112233`
* **Admin Portal**: Accessible via profile dropdown at `/admin`

---

## 📄 License & Attribution
Designed & Engineered for the Citizens of Pakistan.  
All journalistic articles are attributed to their respective verified publication desks (DAWN, The Express Tribune, The News International, Daily Times).
