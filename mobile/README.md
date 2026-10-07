# Sanctuary — a chapel built one prayer at a time

iOS app (Expo SDK 57, Expo Router, Skia, Reanimated). Every day the user prays for two
minutes, their chapel on the hill gains a piece: stones for ten days, then a door, stained
glass, a roof, a second window, a cross, a bell, and full light at day 40. Missing a day dims
the light; nothing built is ever lost.

## Screens
- `src/app/onboarding.tsx` – name, why you pray, when you pray, a promise → paywall
- `src/app/paywall.tsx` – yearly (7-day trial) / weekly; RevenueCat via `src/lib/purchases.ts`
  (mocked in Expo Go and web so the flow can be tested before the store build)
- `src/app/index.tsx` – home: the chapel (`src/components/Chapel.tsx`), today's Scripture, Pray, Share
- `src/app/pray.tsx` – breathe → Word → pray → Amen; the chapel grows on return

## Content
`src/lib/days.ts`: 40 daily prayers. Scripture is the King James Version (public domain);
titles and prayers are original. `src/lib/sanctuary.ts` holds the milestone schedule.

## Run on a phone
```bash
cd mobile && npm install && npx expo start
```
Scan the QR code with Expo Go. Purchases and notifications need a development/TestFlight
build (`eas build --profile development|production`).

## Before the App Store build
- Set `expo.extra.revenueCatIosKey` in `app.json` (public SDK key) and create products
  `annual` and `weekly` with entitlement `sanctuary` in RevenueCat / App Store Connect.
- `eas init` then `eas build --platform ios --profile production`.

## Checks
```bash
npm run typecheck && npx expo-doctor && npx expo export --platform ios
```
Design previews: `npx expo start --web` and screenshot (web is preview-only).
