import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { Colors } from '../../constants/Colors';
import React, {useEffect} from 'react'
import { Handshake } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';


const ToastMessage = ({ message, onComplete }) => {
    const { width, height } = Dimensions.get('window'); // Get screen dimensions

    const opacity = useSharedValue(0);
    const translateY = useSharedValue(50); // Start below the screen (off-screen)

  
    useEffect(() => {
      if (message) {
        // Fade in + spring animation
        opacity.value = withTiming(1, { duration: 500 }); // Fade in
        translateY.value = withSpring(0, { damping: 6, stiffness: 100 }); // Spring into view
  
        // After a delay, fade out the message
        setTimeout(() => {
          opacity.value = withTiming(0, { duration: 500 });
          translateY.value = withSpring(50, { damping: 6, stiffness: 100 }); // Move offscreen
        }, 3000); // Wait for 2 seconds before fading out
  
        // Call the onComplete callback when the animation finishes
        setTimeout(() => {
          onComplete(); // Clear message
        }, 3500);
      }
    }, [message]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
          opacity: opacity.value,
          transform: [{ translateY: translateY.value }],
        };
      });
      if (!message) return null;

      return (
        <Animated.View
          style={[
            animatedStyle,
            {
              position: 'absolute',
              top: '50%',
              left: width/2 - 100, // Center horizontally
              alignItems: 'center',
              backgroundColor: 'black',
              padding: 15,
              borderRadius: 15,
              justifyContent:'center',
              alignItems:'center',
              height:100,
              width:200,
              zIndex:40,
              gap:10
            },
          ]}
        >
                <Handshake  color={Colors.secondary} size={30} />
                <Text className='font-psemibold' style={{ color: 'white' }}>{message}</Text>
        </Animated.View>
      );
}

export default ToastMessage

