# Skate Spots

A mobile app for discovering and sharing skateboarding spots. Built with React Native (Expo) and Supabase.

## Features

- **Discovery Feed** — Browse all shared spots with photos, categories, and location info
- **Register Spot** — Publish a new spot with a photo, designation, category, and intel/details
- **Spot Details** — View full details for any spot
- **Authentication** — Email/password sign-up & login, plus Google OAuth
- **Profile** — View your stats and progression

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React Native](https://reactnative.dev/) via [Expo](https://expo.dev/) |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based) |
| Styling | [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for RN) |
| Backend / Auth | [Supabase](https://supabase.com/) |
| Language | TypeScript |

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- A [Supabase](https://supabase.com/) project

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Open `.env` and set the following values (find them at **Supabase Dashboard → Project Settings → API**):

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

For OAuth redirect configuration see the comments inside `.env.example`.

### 3. Apply database migrations

Run the SQL migrations in order against your Supabase project (via the **SQL Editor** in the dashboard or the Supabase CLI):

```
supabase/migrations/20260401120000_spots_skaters.sql
supabase/migrations/20260402120000_spot_images_storage.sql
supabase/migrations/20260403130000_spot_images_public_anon_read.sql
```

### 4. Start the development server

```bash
# Expo Go / development build
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## Project Structure

```
src/
├── app/              # Expo Router file-based routes
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── spot-details.tsx
│   └── auth/
├── pages/            # Full-screen page components
│   ├── FeedPage.tsx
│   ├── AddSpotPage.tsx
│   ├── SpotDetailsPage.tsx
│   ├── ProfilePage.tsx
│   └── OnboardingPage.tsx
├── components/       # Shared UI components
├── contexts/         # React contexts (AuthContext)
├── lib/              # Supabase client, OAuth helpers, image upload
├── types/            # TypeScript type definitions
└── constants/        # App-wide constants
supabase/
└── migrations/       # SQL migration files
```

## Authentication

The app supports:

- **Email / Password** — standard sign-up and login
- **Google OAuth** — via Supabase Auth + `expo-auth-session`

After signing in, the session is persisted securely using `expo-secure-store`.

## License

This project is private.
