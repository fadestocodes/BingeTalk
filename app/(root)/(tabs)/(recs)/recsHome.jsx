import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useGetUser, useGetUserFull } from '../../../../api/auth'
import RecommendationListScreen from '../../../../components/Screens/RecommendationListScreen'
import { useEffect } from 'react'
import { useCheckNotificationPrompt } from '../../../../api/notification'
import NotificationPromptUI from '../../../../components/Screens/NotificationPromptUI'
import Animated, { Easing, withTiming, useSharedValue, withDelay } from 'react-native-reanimated';
import {  useAnimatedStyle } from 'react-native-reanimated'


const recsHome = () => {
    const {showModal, handleNoCustomPrompt, handleYesCustomPrompt} =  useCheckNotificationPrompt()
    const translateY = useSharedValue(50); // start below
    const opacity = useSharedValue(0);

    useEffect(() => {
      if (showModal) {
        opacity.value = withDelay(200, withTiming(1, { duration: 500 }));
        translateY.value = withDelay(
            200, // delay in ms
            withTiming(0, { duration: 500, easing: Easing.out(Easing.exp) })
          );
      } else {
        opacity.value = withTiming(0, { duration: 100 });
        translateY.value = withTiming(50, { duration: 300 });
      }
    });
    
    const translateStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    }));


  return (
    <View  className='flex-1 relative'>
        <RecommendationListScreen />
        { showModal && (
            <Animated.View style={[translateStyle, { position: 'absolute', inset: 0 }]}>
                <NotificationPromptUI handleNo={handleNoCustomPrompt} handleYes={handleYesCustomPrompt} />
            </Animated.View>
        ) }
    </View>
  )
}

export default recsHome

const styles = StyleSheet.create({})