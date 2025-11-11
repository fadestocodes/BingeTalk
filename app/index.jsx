// import { StatusBar } from "expo-status-bar";
// import { useRef, useState } from "react";
// import { Redirect, Link } from "expo-router";
// import { View, Text, ScrollView, Button, TouchableOpacity } from "react-native";
// import { Image } from "expo-image";
// // import { useNavigation } from "expo-router";
// import { useNavigation } from "@react-navigation/native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import * as WebBrowser from 'expo-web-browser'

// import { useEffect } from "react";
// import { Colors } from "../constants/Colors";
// import { fetchUser, useFetchOwnerUser } from "../api/user";
// import { useUserDB } from '../lib/UserDBContext'
// import { useFetchUser } from "../api/user";
// import * as Notifications from 'expo-notifications'
// import { postPushToken } from "../api/notification";
// import { Platform } from "react-native";
// import  Constants  from 'expo-constants';
// import Animated, { Easing, withTiming, useSharedValue, withDelay } from 'react-native-reanimated';
// import * as StoreReview from 'expo-store-review';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useGetUser, useGetUserFull } from "../api/auth";
// import IntroComponent from "../components/IntroScreen";

// WebBrowser.maybeCompleteAuthSession()


// const REVIEW_KEY = 'last_review_prompt';
// const REVIEWED_KEY = 'user_reviewed';
// const DAYS_BEFORE_NEXT_PROMPT = 7;

// async function maybeAskForReview() {
//   const alreadyReviewed = await AsyncStorage.getItem(REVIEWED_KEY);
//   console.log('ASYNCSTORAGE', alreadyReviewed)
//   if (alreadyReviewed) return; // ✅ user has already been asked

//   const lastPrompt = await AsyncStorage.getItem(REVIEW_KEY);
//   const now = Date.now();

//   if (!lastPrompt || now - parseInt(lastPrompt, 10) > DAYS_BEFORE_NEXT_PROMPT * 24 * 60 * 60 * 1000) {
//     const canShow = await StoreReview.hasAction();
//     if (canShow) {
//       StoreReview.requestReview();

//       // Store both the prompt time AND that user was asked
//       await AsyncStorage.setItem(REVIEW_KEY, now.toString());
//       await AsyncStorage.setItem(REVIEWED_KEY, 'true');
//     }
//   }
// }


// const initializeNotification = () => {
  
//   useEffect(( ) => {
    
//     Notifications.setNotificationHandler({
//       handleNotification: async (notification) => {
        
//         return {
//           shouldShowAlert: true, // Show the alert when the notification arrives in the 
//           shouldPlaySound: true, // Play sound if you want
//           shouldSetBadge: false, // Optionally manage the badge count (e.g., unread notifications)
//         };
//       },
//     });
//     const foreground = Notifications.addNotificationReceivedListener(async (notification) => {

//           const { route, userId } = notification.request.content.data;

//           // return () => {
           
//           // };
//     });
//     const background = Notifications.addNotificationResponseReceivedListener(async (response) => {
//           const { route } = response.notification.request.content.data;

          
//           if (route) {
//             router.push(route); // Navigates to the given route
//           } 
//     });
  
//     return () => {
//       foreground.remove();
//       background.remove();
//     };

//   }, [])

// }
      

// const Welcome = () => {

//   initializeNotification()

//   // const {user} = useUser();
//   const {user:userSimple} = useGetUser()
//   console.log('user simple data', userSimple)
//   const {userFull:user} = useGetUserFull(userSimple?.id)
//   const router = useRouter(); 
//   const [expoPushToken, setExpoPushToken] = useState(null);
//   const [isTokenSent, setIsTokenSent] = useState(false);
//   // const [owner, setOwner] = useState(null)
//   const notificationListener = useRef()
//   const responseListener = useRef()
//   const [notification, setNotification]  = useState(null)
//   const projectId =
//   Constants?.expoConfig?.extra?.eas?.projectId ??
//   Constants?.easConfig?.projectId;

//   console.log('projectId from root....', projectId)

//   const logoOpacity = useSharedValue(0);
//   const logoTranslateY = useSharedValue(60);


// useEffect(() => {
//   logoOpacity.value = withTiming(1, { duration: 400, easing: Easing.ease });
//   logoTranslateY.value = withTiming(0, { duration: 1200, easing: Easing.bounce });
//   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//     setNotification(notification);
//   });


//    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
//     const { route } = response.notification.request.content.data;
    
    
//     if (route) {
//       console.log('pushnotif route', route)

//       router.push(route); // Navigates to the given route
//     }
//   });
//   if (user){

//     const getPushNotificationPermissions = async () => {
  
     
//       try {
//         const { status } = await Notifications.requestPermissionsAsync();
  
//         if (status !== 'granted') {
//           return;
//         }
  
//         const token = await Notifications.getExpoPushTokenAsync({
//           'projectId': projectId,
//         });
//         setExpoPushToken(token.data); // Store the token
//         const owner = await fetchUser({email : user.emailAddresses[0].emailAddress})
//         // setOwner(owner)
//         const params = {
//           userId : owner.id,
//           token : token.data,
//           deviceType : Platform.OS
  
//         }
//         const sentToken = await postPushToken(params);
  
//       } catch (error) {
//         console.log('Error getting push token', error);  // Log any errors
//       }
//     };
  
//     getPushNotificationPermissions();
//     maybeAskForReview()
//   }
// }, [user ]);



//   if (user) {
//     return <Redirect href="(home)/homeIndex" />
//   } 
  
//   // else {
//   //   return <Redirect href="(onboarding)/step4-password" />
//   // }

//   const handleSignUp = () => {
//     router.push('(onboarding)/step1-firstName')
//   }

//     return (
//       <IntroComponent />
//       // <View style={{ justifyContent:'center', alignItems:'center', width:'100%', height:'100%', backgroundColor:Colors.primary }} >
//       //   <View className="items-center gap-3 text-lg font-psemibold text-white">
//       //       < Animated.View style={[{ opacity: logoOpacity, transform: [{ translateY: logoTranslateY }] }]} >
//       //     <Image
//       //       source={require('../assets/images/splash.png')}
//       //       contentFit="cover"
//       //       style={{width:220, height:220}}
//       //       transition={200}
//       //     />
//       //     </Animated.View>
//       //     {/* <Text className="text-4xl text-secondary font-pbold" style={{paddingBottom:20}}>Bingeable</Text> */}

//       //       <TouchableOpacity onPress={handleSignUp}  style={{ borderRadius:30, backgroundColor:Colors.secondary, paddingVertical:10, paddingHorizontal:15, width:200, justifyContent:'center', alignItems:'center' }}>
//       //         <Link href="/(onboarding)/step1-firstName"  >
//       //           <Text className="text-primary text-lg text-center font-pbold ">Create account </Text>
//       //         </Link>
//       //       </TouchableOpacity>
//       //       <Link  href="/(auth)/signIn">
//       //         <Text  className='text-white text-lg font-semibold w-full text-center' >Sign in</Text>
//       //       </Link>
//       //   </View>
//       // </View>
//     )
// };

// export default Welcome;




import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Redirect } from "expo-router";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../constants/Colors";
import * as Notifications from "expo-notifications";
import * as StoreReview from "expo-store-review";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Animated, { Easing, withTiming, useSharedValue } from "react-native-reanimated";
import { fetchUser } from "../api/user";
import { postPushToken } from "../api/notification";
import { useGetUser, useGetUserFull } from "../api/auth";
import IntroComponent from "../components/IntroScreen";

WebBrowser.maybeCompleteAuthSession();

const REVIEW_KEY = "last_review_prompt";
const REVIEWED_KEY = "user_reviewed";
const DAYS_BEFORE_NEXT_PROMPT = 7;

async function maybeAskForReview() {
  const alreadyReviewed = await AsyncStorage.getItem(REVIEWED_KEY);
  if (alreadyReviewed) return;

  const lastPrompt = await AsyncStorage.getItem(REVIEW_KEY);
  const now = Date.now();

  if (!lastPrompt || now - parseInt(lastPrompt, 10) > DAYS_BEFORE_NEXT_PROMPT * 86400000) {
    const canShow = await StoreReview.hasAction();
    if (canShow) {
      await StoreReview.requestReview();
      await AsyncStorage.setItem(REVIEW_KEY, now.toString());
      await AsyncStorage.setItem(REVIEWED_KEY, "true");
    }
  }
}

// ✅ Custom hook version of your notification setup
function useInitializeNotifications(router) {
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    const foreground = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Foreground notification:", notification);
    });

    const background = Notifications.addNotificationResponseReceivedListener((response) => {
      const { route } = response.notification.request.content.data;
      if (route) router.push(route);
    });

    return () => {
      foreground.remove();
      background.remove();
    };
  }, [router]);
}

export default function Welcome() {
  const router = useRouter();
  useInitializeNotifications(router); // ✅ correct usage

  const { user: userSimple } = useGetUser();

  const [expoPushToken, setExpoPushToken] = useState(null);
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  console.log("projectId resolved:", projectId);

  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(60);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 400, easing: Easing.ease });
    logoTranslateY.value = withTiming(0, { duration: 1200, easing: Easing.bounce });
  }, []);

  useEffect(() => {
    if (!userSimple) return;

    const getPushNotificationPermissions = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") return;

        if (!projectId) {
          console.error("Missing projectId — check app.json or EAS config");
          return;
        }

        // const token = await Notifications.getExpoPushTokenAsync({ projectId });
        // if (!token?.data) throw new Error("Failed to get Expo push token");

        const token = await Notifications.getExpoPushTokenAsync({ projectId });
        const pushToken = token?.data ?? token; // token could be string directly
        console.log('token...', token)
        console.log('push token...', pushToken)

        const existingToken = await AsyncStorage.getItem(`${pushToken}-${userSimple.id}`)
        if (existingToken) {
          console.log('token already saved in async storage...')
          return
        }


        
        
        const res = await postPushToken({
          userId: userSimple.id,
          token: token.data,
          deviceType: Platform.OS,
        });
        console.log('response trying to post push token...', res)

        await AsyncStorage.setItem(`${pushToken}-${userSimple.id}`, pushToken)

      } catch (error) {
        console.log("Error getting push token", error);
      }
    };

    getPushNotificationPermissions();
    maybeAskForReview();
  }, [userSimple, projectId]);

  if (userSimple) {
    return <Redirect href="(home)/homeIndex" />;
  }

  return <IntroComponent />;
}
