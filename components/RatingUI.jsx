import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import {Pointer} from 'lucide-react-native'



const SLIDER_WIDTH = 300;
const INITIAL_BOX_SIZE = 50;

const RatingUI = ({ setRating, rating , handlePost, prevRating}) => {
    // const [rating, setRating] = useState(5.0); // Starting at 5.0 rating
    const [ started, setStarted ] = useState(false)
    const offset = useSharedValue(0);
    const MAX_VALUE = SLIDER_WIDTH - INITIAL_BOX_SIZE;
  
    // Animation for rating number changes
    // const numberOpacity = useSharedValue(0);
    const numberScale = useSharedValue(1); // To scale the number when it changes
    const numberY = useSharedValue(0); // Vertical position for bouncing effect
  
    // Pan gesture to move the slider
    const pan = Gesture.Pan().onStart(() => {
        // Set started to true when the gesture starts
        runOnJS(setStarted)(true);
      }).onChange((event) => {
      // Calculate the offset properly
      offset.value =
        Math.abs(offset.value) <= MAX_VALUE
          ? offset.value + event.changeX <= 0
            ? 0
            : offset.value + event.changeX >= MAX_VALUE
            ? MAX_VALUE
            : offset.value + event.changeX
          : offset.value;
  
      // Correct the calculation for rating scale (5 to 10)
      const newRating = 4 + (offset.value / MAX_VALUE) * 6; // Scale to 5-10
      const roundedRating = parseFloat(newRating.toFixed(1)); // Round to 1 decimal place
  
      // Only update the state if the rating has changed
      if (roundedRating !== rating) {
        runOnJS(setRating)(roundedRating);
        // Trigger the number change animation
        // numberOpacity.value = withTiming(1, { duration: 150 }); // Fade in
        numberScale.value = withSpring(1.3, { damping: 10, stiffness: 150 }); // Scale up with bounce
        numberY.value = withSpring(-10, { damping: 10, stiffness: 150 }); // Bounce effect (move vertically)
      }
    }).onEnd(() => {
      // Snap to the nearest whole or decimal number after release
      const snappedRating = 4 + (offset.value / MAX_VALUE) * 6; // Round to one decimal place
      runOnJS(setRating)(snappedRating);
  
      // Optional: Add a smooth "settling" effect after releasing the slider
      numberScale.value = withSpring(1, { damping: 8, stiffness: 100 }); // Return to normal size
      numberY.value = withSpring(0, { damping: 8, stiffness: 100 }); // Return to original vertical position
    });
  
    // Animated styles for number
    const numberStyle = useAnimatedStyle(() => {
      return {
        // opacity: numberOpacity.value,
        transform: [
          { scale: numberScale.value },
          { translateY: numberY.value }, // Add vertical bounce movement
        ],
      };
    });
  
    // Animated styles for the slider handle
    const sliderStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: offset.value }],
      };
    });
  
    return (
      <GestureHandlerRootView style={styles.container}>
        {/* Animated number with scaling and vertical bounce */}
     
        <Animated.View style={[styles.ratingTextContainer, numberStyle]}>
            {
              !started ? (
                <>
                    { prevRating ? (
                         <View>
                         <Text className='text-white text-lg font-pbold '>Prev rating</Text>
                       <Text style={styles.ratingText}>{prevRating}</Text>
                       </View>    
                    ) : (
                        <Text className='text-white text-lg font-pbold'>Slide to rate</Text>
                    ) }
                
                </>

            ) : (
                <View>
                <Text className='text-white text-lg font-pbold '>Your rating</Text>
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
              </View>
            ) }
        </Animated.View>
  
        {/* Slider track and handle */}
        <View style={styles.sliderTrack}>
          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.sliderHandle, sliderStyle]} >
            <Pointer  color={Colors.primary} />    
            </Animated.View>
          </GestureDetector>
        </View>

        <TouchableOpacity onPress={()=>handlePost()} style={{ backgroundColor:Colors.secondary, paddingHorizontal:30, paddingVertical:15, borderRadius:20, marginTop:50 }}>
            <Text className='text-primary font-pbold'>Post rating</Text>
        </TouchableOpacity>
      </GestureHandlerRootView>

    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  sliderTrack: {
    width: SLIDER_WIDTH,
    height: 50,
    backgroundColor: Colors.mainGrayDark,
    borderRadius: 25,
    justifyContent: 'center',
    padding: 5,
  },
  sliderHandle: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    position: 'absolute',
    left: 5,
    justifyContent:'center',
    alignItems:'center'
  },
  ratingTextContainer: {
    marginBottom: 20,

  },
  ratingText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default RatingUI;
