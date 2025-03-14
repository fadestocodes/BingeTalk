import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import {StyleSheet, Text, View} from 'react-native'
import 'react-native-reanimated';
import '../global.css'
import { Slot } from "expo-router"
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import {tokenCache} from '@/cache'
import { UserDBProvider } from '../lib/UserDBContext'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/tanStackClient'; // Import the query client
import {DialogueProvider} from '../lib/DialoguePostContext'



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

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
    
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
        <UserDBProvider>
          <DialogueProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar
            backgroundColor={Colors.mainGray} // Any color for background, use a color or hex
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
          </DialogueProvider>
          </UserDBProvider>
        </QueryClientProvider>
      </ ClerkLoaded >
    </ClerkProvider >
  );
}
