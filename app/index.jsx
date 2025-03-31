import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
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


const initializeNotification = () => {
  useEffect(( ) => {
    
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        
        const { route, userId } = notification.request.content.data;
        console.log(" Notification Data:", notification.request.content.data); // Debugging log
        return {
          shouldShowAlert: true, // Show the alert when the notification arrives in the 
          shouldPlaySound: true, // Play sound if you want
          shouldSetBadge: false, // Optionally manage the badge count (e.g., unread notifications)
        };
      },
    });
    const foreground = Notifications.addNotificationReceivedListener(async (notification) => {
          console.log('Foreground notification received:', notification.request.content.data);
          const { route, userId } = notification.request.content.data;
          return () => {
           
          };
    });
    const background = Notifications.addNotificationResponseReceivedListener(async (response) => {
          console.log('Notification clicked!', response.notification.request.content.data);
          const { route } = response.notification.request.content.data;
          
          if (route) {
            console.log('Navigating to route:', route);
            router.push(route); // Navigates to the given route
          } else {
            console.log('No route found in the notification');
          }
          return () => {
          
          };
    });
  
    return () => {
      foreground.remove();
      background.remove();
    };

  }, [])

}
      

const Welcome = () => {
  initializeNotification()

  const {user} = useUser();

  
  const router = useRouter(); 
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [isTokenSent, setIsTokenSent] = useState(false);
  const [owner, setOwner] = useState(null)
  const notificationListener = useRef()
  const responseListener = useRef()
  const [notification, setNotification]  = useState(null)
  const projectId =
  Constants?.expoConfig?.extra?.eas?.projectId ??
  Constants?.easConfig?.projectId;


useEffect(() => {
  notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    console.log('from here now')
    setNotification(notification);
  });

  console.log('now here?')

  // Add the background response listener (when clicked)
   responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('Notification clicked!', response.notification.request.content.data);
    const { route } = response.notification.request.content.data;
    
    if (route) {
      console.log('Navigating to route:', route);
      router.push(route); // Navigates to the given route
    } else {
      console.log('No route found in the notification');
    }
  });
  if (user){

    const getPushNotificationPermissions = async () => {
  
     
      try {
        const { status } = await Notifications.requestPermissionsAsync();
  
        if (status !== 'granted') {
          alert('You must enable push notifications!');
          return;
        }
  
        // Attempt to get the Expo push token
        const token = await Notifications.getExpoPushTokenAsync({
          'projectId': projectId,
        });
        setExpoPushToken(token.data); // Store the token
        const owner = await fetchUser({email : user.emailAddresses[0].emailAddress})
        setOwner(owner)
  
  
  
        const params = {
          userId : owner.id,
          token : token.data,
          deviceType : Platform.OS
  
        }
        const sentToken = await postPushToken(params);
  
      } catch (error) {
        console.error('Error getting push token', error);  // Log any errors
      }
    };
  
    getPushNotificationPermissions();

  console.log('here!!')
  
  console.log('finally here')

  

  }
}, [user ]);


// useEffect(() => {
 

//   console.log('here!!')
//   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//     console.log('from here now')
//     setNotification(notification);
//   });


//   // Add the background response listener (when clicked)
//    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
//     console.log('Notification clicked!', response.notification.request.content.data);
//     const { route } = response.notification.request.content.data;
    
//     if (route) {
//       console.log('Navigating to route:', route);
//       router.push(route); // Navigates to the given route
//     } else {
//       console.log('No route found in the notification');
//     }
//   });

//   // Return cleanup function for background listener
//   return () => {
//     notificationListener.current &&
//         Notifications.removeNotificationSubscription(notificationListener.current);
//       responseListener.current &&
//         Notifications.removeNotificationSubscription(responseListener.current);
//   };
// }, []);

// useEffect(() => {

//   const foregroundSubscription = Notifications.addNotificationReceivedListener(async (notification) => {
//     console.log('Foreground notification received:', notification.request.content.data);
//     const { route, userId } = notification.request.content.data;
//   });

//   const backgroundSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
//     console.log('Notification clicked:', response.notification.request.content.data);
//     const { route, userId } = response.notification.request.content.data;

//     if (route) {
//       console.log('Navigating to route:', route);
//       router.push(route); // Navigates to the given route
//     } else {
//       console.log('No route found in the notification');
//     }
//   });

//   return () => {
//     foregroundSubscription.remove();
//     backgroundSubscription.remove();
//   };
// })

  // useEffect(() => {
  //   const subscription = Notifications.addNotificationReceivedListener(notification => {
  //     Alert.alert('Foreground Notification', notification.request.content.body);
  //     const { route , userId} = notification.request.content.data;

  //       if (route) {
  //         router.push(route)
  //       }
      
  //   });

  //   // Handle notification response when clicked (background)
  //   const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
  //     Alert.alert('Notification Clicked', response.notification.request.content.body);
  //     const { route, userId } = response.notification.request.content.data;

  //       if (route) {
  //         router.push(route)
  //       }
  //   });

  //   // Cleanup the listeners when the component unmounts
  //   return () => {
  //     subscription.remove();
  //     backgroundSubscription.remove();
  //   };
  // }, []);


  // useEffect(() => {
  
  //   const foregroundSubscription = Notifications.addNotificationReceivedListener(async (notification) => {
  //     const { route, userId } = notification.request.content.data;
  //     console.log('Foreground notification received:', notification.request.content.data);
  //   });
 
  //   const backgroundSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
  //     console.log('Notification clicked:', response.notification.request.content.data);
  //     const { route, userId } = response.notification.request.content.data;

  //     if (route) {
  //       console.log('Navigating to route:', route);
  //       router.push(route); // Navigates to the given route
  //     } else {
  //       console.log('No route found in the notification');
  //     }
  //   });

  //   return () => {
  //     foregroundSubscription.remove();
  //     backgroundSubscription.remove();
  //   };
  // }, []);



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