import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Redirect, router, Link } from "expo-router";
import { View, Text, ScrollView, Button, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
// import { useNavigation } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-expo'
import { useEffect } from "react";
import { Colors } from "../constants/Colors";
import { fetchUser, useFetchOwnerUser } from "../api/user";
import { useUserDB } from '../lib/UserDBContext'
import { useFetchUser } from "../api/user";
import * as Notifications from 'expo-notifications'
import { postPushToken } from "../api/notification";
import { Platform } from "react-native";
import  Constants  from 'expo-constants';




const Welcome = () => {


  
  const {user} = useUser();
  const router = useRouter();  // Access navigation object
  // const { data : ownerUser } = useFetchOwnerUser({email:user.emailAddresses[0].emailAddress})


  const [expoPushToken, setExpoPushToken] = useState(null);
  const [isTokenSent, setIsTokenSent] = useState(false);

  // Request permissions and get token
  // useEffect(() => {
  //   const getPushNotificationPermissions = async () => {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     console.log('status', status)
  //     if (status !== 'granted') {
  //       alert('You must enable push notifications!');
  //       return;
  //     }

  //     const token = await Notifications.getExpoPushTokenAsync();
  //     console.log("Expo Push Token", token.data);
  //     setExpoPushToken(token.data); // Store the token
  //     await postPushToken(token.data)
  //   };



  //   getPushNotificationPermissions();
  // }, []);

  const projectId =
  Constants?.expoConfig?.extra?.eas?.projectId ??
  Constants?.easConfig?.projectId;


useEffect(() => {
  const getPushNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('status', status);  // Log the permission status

      if (status !== 'granted') {
        alert('You must enable push notifications!');
        return;
      }

      // Attempt to get the Expo push token
      const token = await Notifications.getExpoPushTokenAsync({
        'projectId': projectId,
      });
      console.log('Expo Push Token', token.data);  // Log the token
      setExpoPushToken(token.data); // Store the token

      // Make sure to post the token to your backend
      // const params = {
      //   userId : ownerUser.id,
      //   token : token.data,
      //   deviceType : Platform.OS

      // }
      // console.log('params', params)
      // const sentToken = await postPushToken(params);
      // console.log('sent token', sentToken)

    } catch (error) {
      console.error('Error getting push token', error);  // Log any errors
    }
  };

  // Get push notification permissions and token
  getPushNotificationPermissions();
}, []);

  // Handle notifications when the app is in the foreground
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      Alert.alert('Foreground Notification', notification.request.content.body);
    });

    // Handle notification response when clicked (background)
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      Alert.alert('Notification Clicked', response.notification.request.content.body);
    });

    // Cleanup the listeners when the component unmounts
    return () => {
      subscription.remove();
      backgroundSubscription.remove();
    };
  }, []);



  if (user) {
    return <Redirect href="(home)/homeIndex" />
  }

  const handleSignUp = () => {
    router.push('(onboarding)/step1-firstName')
  }

    return (
      <View style={{ justifyContent:'center', alignItems:'center', width:'100%', height:'100%', backgroundColor:Colors.primary }} >
        <View className="items-center gap-3 text-lg font-psemibold text-white">
          <SignedIn>
          </SignedIn>
          <SignedOut>
          <Image
            source={require('../assets/images/splash.png')}
            contentFit="cover"
            style={{width:220, height:220}}
            transition={200}
          />
          {/* <Text className="text-4xl text-secondary font-pbold" style={{paddingBottom:20}}>Bingeable</Text> */}

            <TouchableOpacity onPress={handleSignUp}  style={{ borderRadius:10, backgroundColor:Colors.secondary, paddingVertical:10, paddingHorizontal:15, width:200, justifyContent:'center', alignItems:'center' }}>
              <Link href="/(onboarding)/step1-firstName"  >
                <Text className="text-primary text-lg text-center font-pbold ">Create account </Text>
              </Link>
            </TouchableOpacity>
            <Link  href="/(auth)/signIn">
              <Text  className='text-white text-lg font-semibold w-full text-center' >Sign in</Text>
            </Link>
          </SignedOut>
        </View>
      </View>
    )
};

export default Welcome;