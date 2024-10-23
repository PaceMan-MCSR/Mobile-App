# PaceMan App

A mobile app to query [PaceMan.gg](https://paceman.gg/).

# Tech Stack

The PaceMan App is a React Native, Expo Project, and works on Android and iOS. The following is the complete tech stack used for the app.

### Frameworks, Tools & Languages

- React Native
- Expo
- JavaScript/TypeScript

### Dependencies

- `zeego` - Native Dropdown and Context Menus
- `nativewind` Tailwind CSS for React Native
- `expo-router` File-based routing
- `react-native-mmkv` Key-Value Storage for User Preferences
- `@gorhom/bottom-sheet` Bottom Sheet component
- `@tanstack/react-query` Managing fetched data from API Endpoints
- `react-native-reanimated` App Animations
- `react-native-gesture-handler` Gesture Handling

# Run Locally

The app requires an Expo Development Build to be able to run on Android or iOS, due to the dependencies it is using. This section of the README will be updated with steps on how to create and install the development build for yourself.

# To-do

- Implement Settings Page
- Refactor Version Picker
- Implement `Events` and `Stats` pages
- Make /lb/ page more performant [Lag spikes on Android]
- Add support for more color themes (look into `tw-colors`)
- Animations for FlatList/FlashList (identify how to manage prev vs curr data in Query)
- Look into Push Notifications (will need to find a way to configure without spamming the API in the background, such as webhooks)
