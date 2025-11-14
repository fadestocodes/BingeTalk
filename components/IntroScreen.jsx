import { View, Text, SafeAreaView } from 'react-native'
import React, {useState, useEffect} from 'react'
import { LinearGradient } from 'expo-linear-gradient'

import { Image } from 'expo-image'
import { filmmakersBG } from '../constants/Images'
import Animated, { Easing, withTiming, useSharedValue, withDelay } from 'react-native-reanimated';
import SigninComponent from './SigninComponent'


const IntroComponent = () => {

    const logoOpacity = useSharedValue(0);
    const logoTranslateY = useSharedValue(60);

useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 400, easing: Easing.ease });
    logoTranslateY.value = withTiming(0, { duration: 1200, easing: Easing.bounce });
  
    });
  
  return (
    <View className='w-full h-full justify-center items-center bg-primary'>
        <Image
            source={filmmakersBG}
            contentFit='cover'
            style={{ width: '100%', height:'100%', zIndex:-1, position:'absolute'}}

        />
        <LinearGradient
                colors={['transparent', 'black']}
                style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                }}
            />
         < Animated.View style={[{ opacity: logoOpacity, transform: [{ translateY: logoTranslateY }] }]} >
           <Image
             source={require('../assets/images/icon-adaptive.png')}
             contentFit="cover"
             style={{width:85, height:85, zIndex:10}}
             transition={200}
           />
           </Animated.View>
           <View className='pt-10'>
            <SigninComponent />
           </View>

    </View>
  )
}

export default IntroComponent