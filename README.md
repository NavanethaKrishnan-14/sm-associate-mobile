# SM Associate Mobile

React Native + Expo + TypeScript.

## Local development

```bash
npm install
npm start
```

Android emulator uses `http://10.0.2.2:5000/api/v1`. A physical phone should use your computer LAN IP.

## Android APK test build

This project is configured for an Expo EAS preview APK:

```bash
npm install
npx eas login
npm run build:android
```

The `preview` profile produces an installable Android APK.

For a real phone test, set `EXPO_PUBLIC_API_URL` to a backend URL reachable from the phone before building, for example:

```bash
EXPO_PUBLIC_API_URL=https://your-backend.example.com/api/v1 npm run build:android
```

Do not use `localhost` or `10.0.2.2` for a physical-phone production-style APK.
