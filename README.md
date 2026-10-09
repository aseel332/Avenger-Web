# Avenger-Web: Gamified Mission Platform

**3rd place in a team web development contest.** An Avengers-themed platform where admins create missions, heroes accept them, attendance is verified by email OTP, and rewards are paid out through a simulated payment system.

## Features

- **Roles:** an admin view for running the team, and a member view for each hero.
- **Missions:** create, assign and accept missions, shown in a list and on an interactive globe.
- **Attendance:** admins send one-time codes by email, and members check in with their OTP. Attendance is charted per member.
- **Payments:** a mock UPI-style payment API with accounts, balances, transfers, salary payouts and transaction history.
- **Announcements and posts:** admins broadcast announcements by email and publish posts with images.
- **Live timer and dashboards:** real-time mission timers and analytics charts.

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite, Recharts, Cloudinary (image upload), Firebase Auth |
| Backend | Node.js, Express, Nodemailer (OTP and announcement emails), Firebase Admin |
| Data | Firebase Firestore, JSON data store for the mock payment API |

## Getting started

```bash
git clone https://github.com/aseel332/Avenger-Web.git
cd Avenger-Web

# backend
cd backend && npm install
# .env: PORT, EMAIL_USER, EMAIL_PASS (an app password for the sending account)
npm start

# frontend (new terminal)
cd avenger-web && npm install
# .env: VITE_BACKEND_API, VITE_CLOUD_NAME, VITE_PRESET, VITE_FIREBASE_*
npm run dev
```

## Project structure

```
avenger-web/   React app: missions, attendance, payments, posts, admin and member views
backend/       Express API: accounts, OTP, transfers, attendance and announcement emails
```
