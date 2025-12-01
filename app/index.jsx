

import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Redirect } from "expo-router";
import { View, Text, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Colors } from "../constants/Colors";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Animated, { Easing, withTiming, useSharedValue } from "react-native-reanimated";
import { fetchUser } from "../api/user";
import { postPushToken } from "../api/notification";
import { useGetUser, useGetUserFull } from "../api/auth";
import IntroComponent from "../components/IntroScreen";
import BadgeLevelUpModal from "../components/BadgeLevelUpModal";

WebBrowser.maybeCompleteAuthSession();



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
        // const { status } = await Notifications.requestPermissionsAsync();
        // if (status !== "granted") return;

        if (!projectId) {
          console.error("Missing projectId — check app.json or EAS config");
          return;
        }

        // const token = await Notifications.getExpoPushTokenAsync({ projectId });
        // if (!token?.data) throw new Error("Failed to get Expo push token");

        const token = await Notifications.getExpoPushTokenAsync({ projectId });
        const pushToken = token?.data ?? token; // token could be string directly

        const existingToken = await AsyncStorage.getItem(`${pushToken}-${userSimple.id}`)
        if (existingToken) {
          return
        }


        
        
        const res = await postPushToken({
          userId: userSimple.id,
          token: token.data,
          deviceType: Platform.OS,
        });

        await AsyncStorage.setItem(`${pushToken}-${userSimple.id}`, pushToken)

      } catch (error) {
        console.error("Error getting push token", error);
      }
    };

    getPushNotificationPermissions();
  }, [userSimple, projectId]);



  if (userSimple && !userSimple.accountType){
    return <Redirect href ="(onboarding)/step1?noAccountType=true" />
  }
  
  if (userSimple) {
    return <Redirect href="(home)/homeIndex" />;
  }

  return <IntroComponent />;
}
