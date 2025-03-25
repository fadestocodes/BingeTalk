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
import { ClerkProvider, ClerkLoaded, useUser } from '@clerk/clerk-expo'
import {tokenCache} from '@/cache'
import { UserDBProvider } from '../lib/UserDBContext'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/tanStackClient'; // Import the query client
import {DialogueProvider} from '../lib/DialoguePostContext'
import {PostRemoveProvider} from '../lib/PostToRemoveContext'
import * as Notifications from 'expo-notifications'
import {postPushToken} from '../api/notification'
import { useFetchOwnerUser } from '@/api/user';



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
  

  // const {user:clerkUser} = useUser()
  // const { data : ownerUser } = useFetchOwnerUser({email:clerkUser?.emailAddresses[0].emailAddress})

  // useEffect(() => {
  //   // Foreground notification handler
  //   const subscription = Notifications.addNotificationReceivedListener(notification => {
  //     console.log('Notification received:', notification);
  //   });

  //   // Background notification handler
  //   const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log('Notification response received:', response);
  //   });

  //   return () => {
  //     subscription.remove();
  //     backgroundSubscription.remove();
  //   };
  // }, []);

//   const [expoPushToken, setExpoPushToken] = useState(null);
//   const [isTokenSent, setIsTokenSent] = useState(false);

//   console.log('token', expoPushToken)
//   // Request permissions and get token
//   // useEffect(() => {
//   //   const getPushNotificationPermissions = async () => {
//   //     const { status } = await Notifications.requestPermissionsAsync();
//   //     console.log('status', status)
//   //     if (status !== 'granted') {
//   //       alert('You must enable push notifications!');
//   //       return;
//   //     }

//   //     const token = await Notifications.getExpoPushTokenAsync();
//   //     console.log("Expo Push Token", token.data);
//   //     setExpoPushToken(token.data); // Store the token
//   //     await postPushToken(token.data)
//   //   };



//   //   getPushNotificationPermissions();
//   // }, []);


// useEffect(() => {
//   const getPushNotificationPermissions = async () => {
//     try {
//       const { status } = await Notifications.requestPermissionsAsync();
//       console.log('status', status);  // Log the permission status

//       if (status !== 'granted') {
//         alert('You must enable push notifications!');
//         return;
//       }

//       // Attempt to get the Expo push token
//       const token = await Notifications.getExpoPushTokenAsync();
//       console.log('Expo Push Token', token.data);  // Log the token
//       setExpoPushToken(token.data); // Store the token

//       // Make sure to post the token to your backend
//       // const params = {
//       //   userId : ownerUser.id,
//       //   token : token.data,
//       //   deviceType : Platform.OS

//       // }
//       await postPushToken(params);

//     } catch (error) {
//       console.error('Error getting push token', error);  // Log any errors
//     }
//   };

//   // Get push notification permissions and token
//   getPushNotificationPermissions();
// }, []);

//   // Handle notifications when the app is in the foreground
//   useEffect(() => {
//     const subscription = Notifications.addNotificationReceivedListener(notification => {
//       console.log('Notification received in foreground:', notification);
//       Alert.alert('Foreground Notification', notification.request.content.body);
//     });

//     // Handle notification response when clicked (background)
//     const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
//       console.log('Notification response received:', response);
//       Alert.alert('Notification Clicked', response.notification.request.content.body);
//     });

//     // Cleanup the listeners when the component unmounts
//     return () => {
//       subscription.remove();
//       backgroundSubscription.remove();
//     };
//   }, []);





  if (!fontsLoaded) {
    return null;
  }





  return (
    
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
        <UserDBProvider>
          <DialogueProvider>
            <PostRemoveProvider>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor:Colors.primary }}>
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
          </PostRemoveProvider>
          </DialogueProvider>
          </UserDBProvider>
        </QueryClientProvider>
      </ ClerkLoaded >
    </ClerkProvider >
  );
}
