# SM Associate Mobile

Premium Expo / React Native mobile application for the SM Associate internal management system.

## Backend

Configure `EXPO_PUBLIC_API_BASE_URL` with the deployed backend URL including `/api/v1`.

The mobile app is wired to the existing authenticated modules:

- Authentication: `/auth`
- Customers: `/customers`
- Cars and sales: `/cars`
- Loans and follow-ups: `/loans`
- Dashboard and reports: `/reports`
- Finance services: `/finance-services`
- Finance enquiries: `/finance-enquiries`

The API client restores the stored session, attaches the bearer token, and returns to login when the session expires.

## Branding

The app uses the same SM Associate website logo asset:

`https://raw.githubusercontent.com/NavanethaKrishnan-14/SM_Associate/main/public/sm-associate-site-logo.webp`

Override it with `EXPO_PUBLIC_WEB_LOGO_URL` when required.

## Design

The mobile UI uses the website's premium identity as its foundation:

- Deep midnight navy
- Warm ivory surfaces
- Champagne / muted gold accents
- Teal and burgundy for status emphasis
- High-contrast typography
- Rounded premium surfaces with restrained borders and shadows
- Mobile-first touch targets and bottom navigation

## Run locally

```bash
npm install
npx expo start
```

For Android:

```bash
npx expo start --android
```

Create `.env` from `.env.example` before connecting to the deployed backend.
