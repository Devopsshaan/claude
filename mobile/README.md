# ONE PRAYER — iPhone app

The iOS app for [oneprayer.church](https://oneprayer.church), built with Expo (SDK 57) and Expo Router.

## What's in this version
- **The door** (first open each day): Revelation 3:20 → "Open the door". A GPU-rendered sky with
  turning rays of light, stars and dust motes; two wooden doors on real 3D hinges; a figure of
  Jesus standing in the light (no face, as on the website); gyro parallax; haptic knock, doors and
  light. Skippable, and instant when Reduce Motion is on.
- **Your Word for Today**: scratch-to-reveal, with "Reveal it for me". Same verse rule as the
  website (`src/lib/word.ts` mirrors the site's `src/lib/word/daily.ts`), so the app and the site
  show the same Word every day. Reflection, prayer, share and a daily streak.
- **Pray**: live prayer requests from the website's public API.
- **Membership**: the membership offer (purchases come next, with RevenueCat).

## Run it on your iPhone
```bash
cd mobile
npm install
npx expo start
```
Scan the QR code with the **Expo Go** app on your iPhone.

## Checks
```bash
npm run typecheck
npx expo export --platform ios   # full iOS bundle build
```

## Content
`src/content/verses.ts`, `word-reflections.ts` and `types.ts` are copied from the website repo
(`src/content/`). Keep them in sync when the site's verse list changes.
