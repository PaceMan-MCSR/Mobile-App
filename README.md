# PaceMan App

A mobile app to query [PaceMan.gg](https://paceman.gg/).

# Tech Stack

The PaceMan App is a React Native, Expo Project, and works on Android and iOS. The following is the complete tech stack used for the app.

### Frameworks, Tools & Languages

- React Native
- Expo
- JavaScript/TypeScript

### Dependencies

- `expo-router` File-based routing
- `nativewind` Tailwind CSS for React Native
- `react-native-reanimated` App Animations
- `react-native-gesture-handler` Gesture Handling
- `@tanstack/react-query` Managing fetched data from API Endpoints

# Run Locally

### Pre-requisites

- Node.js
- Expo CLI
- Android/iOS Emulator (A Physical Device works as well)

Considering the dependencies being used in this Expo project, you should be able to run the app using Expo Go.

### Installation

1. Clone this Repository, then change directory to the React-Native-Magic-8-Ball directory.

```
git clone https://github.com/ChitrakshTarun/PaceManApp.git
```

```
cd PaceManApp
```

2. Install Dependencies

```
npm install
```

3.

```
npx expo start
```

Either scan the QR code using Expo Go on your device, or use an Android/IOS emulator with Expo Go.

# To-do (way too much)

- Configure Leaderboard Page
- Configure Events Page
- Configure Stats Page
- `/lb/[id]` File-based routing tweaks to support deep-linking.
- Add support for more color themes (look into `tw-colors`)
- Animations for FlatList (identify how to manage prev vs curr data in Query)
- Android bugs (tab bar icons disappearing, etc.)
- Look into Push Notifications (will need to find a way to configure without spamming the API in the background)
