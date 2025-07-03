import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect , useState} from 'react';
import {StyleSheet, Text, View, Alert, Platform} from 'react-native'
import 'react-native-reanimated';
import '../global.css'
import { Slot } from "expo-router"
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';
import { ClerkProvider, ClerkLoaded, useUser, useClerk } from '@clerk/clerk-expo'
import {tokenCache} from '@/cache'
import { UserDBProvider } from '../lib/UserDBContext'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/tanStackClient'; // Import the query client
import {DialogueProvider} from '../lib/DialoguePostContext'
import {PostRemoveProvider} from '../lib/PostToRemoveContext'
import * as Notifications from 'expo-notifications'
import {postPushToken} from '../api/notification'
import { useFetchOwnerUser } from '@/api/user';
import {NotificationProvider} from '../lib/NotificationCountContext'
import {CreateProvider} from '../lib/CreateContext'
import {SignUpProvider} from '../lib/SignUpContext'
import * as Sentry from '@sentry/react-native';



SplashScreen.preventAutoHideAsync();

Sentry.init({
  dsn: 'https://888eaec7d31a00bfb53c76ad74337462@o4509142159327232.ingest.us.sentry.io/4509142210445312',
  enabled: !__DEV__,
  replaysSessionSampleRate: 0.2,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.mobileReplayIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// SplashScreen.setOptions({
//   duration: 1000,
//   fade: true,
// });




export default Sentry.wrap(function RootLayout() {

  

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
  
  

  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
    )
  }

  const [fontsLoaded, error] = useFonts({
    "Geist-Black": require("../assets/fonts/Geist-Black.ttf"),
    "Geist-Bold": require("../assets/fonts/Geist-Bold.ttf"),
    "Geist-ExtraBold": require("../assets/fonts/Geist-ExtraBold.ttf"),
    "Geist-ExtraLight": require("../assets/fonts/Geist-ExtraLight.ttf"),
    "Geist-Light": require("../assets/fonts/Geist-Light.ttf"),
    "Geist-Medium": require("../assets/fonts/Geist-Medium.ttf"),
    "Geist-Regular": require("../assets/fonts/Geist-Regular.ttf"),
    "Geist-SemiBold": require("../assets/fonts/Geist-SemiBold.ttf"),
    "Geist-Thin": require("../assets/fonts/Geist-Thin.ttf"),
    "Courier" : require("../assets/fonts/Courier.ttf"),
  });
  
  const router = useRouter()

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);


  if (!fontsLoaded) {
    return null;
  }





  return (
    
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey} >
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <SignUpProvider>
        <UserDBProvider>
          <NotificationProvider>
          <DialogueProvider>
            <PostRemoveProvider>
              <CreateProvider>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor:Colors.primary }}>
          <StatusBar
            backgroundColor={Colors.mainGray}
          />
          <Stack  >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(root)" options={{headerShown: false}} />
            <Stack.Screen name="(auth)" options={{headerShown: false}} />
            <Stack.Screen name="(onboarding)" options={{headerShown: false}} />
            <Stack.Screen name="(profileSetup)" options={{headerShown: false}} />
            <Stack.Screen name="+not-found" />
          </Stack>
          </GestureHandlerRootView>
          </CreateProvider>
          </PostRemoveProvider>
          </DialogueProvider>
          </NotificationProvider>
          </UserDBProvider>
          </SignUpProvider>
        </QueryClientProvider>
      </ ClerkLoaded >
    </ClerkProvider >
  );
});