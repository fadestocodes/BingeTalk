import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    FlatList
  } from 'react-native';
  import React, { useState } from 'react';
  import { useRouter } from 'expo-router';
  import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring,
    useAnimatedKeyboard
  } from 'react-native-reanimated';
  import {
    GestureDetector,
    Gesture,
  } from 'react-native-gesture-handler';
  import { Colors } from '../../../../constants/Colors';
  import { feed } from '../../../../lib/fakeData';
  
  const CommentsModal = () => {
    const router = useRouter();
    const { dialogueId } = router;
    console.log(dialogueId);
  
    const [input, setInput] = useState('');
    const keyboard = useAnimatedKeyboard(); // Auto tracks keyboard height
    const translateY = useSharedValue(0); // Tracks modal position
    const atTop = useSharedValue(true); // Track if at top of FlatList
  
    // Move input with keyboard automatically
    const animatedStyle = useAnimatedStyle(() => ({
      bottom: withTiming(keyboard.height.value, { duration: 0 }),
    }));
  
    // Detect if FlatList is at the top
    const handleScroll = (event) => {
      const scrollOffset = event.nativeEvent.contentOffset.y;
      atTop.value = scrollOffset <= 0;
    };
  
    // Gesture for swipe-to-close (only when at top)
    const panGesture = Gesture.Pan()
      .onUpdate((event) => {
        if (atTop.value && event.translationY > 0) {
          translateY.value = event.translationY;
        }
      })
      .onEnd((event) => {
        if (event.translationY > 100) {
          translateY.value = withSpring(500, { damping: 10 }); // Close modal
        } else {
          translateY.value = withSpring(0); // Snap back
        }
      });
  
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
  
            {/* FlatList */}
            <FlatList
              data={feed}
              keyExtractor={(item, index) => index.toString()}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingBottom: 80 }}
              renderItem={({ item }) => (
                <View className='w-full px-8 justify-center items-center gap-3 my-3'>
                  <Text className='text-secondary uppercase font-pcourier'>{item.user}</Text>
                  <Text className='text-white font-pcourier'>{item.dialogue}</Text>
                </View>
              )}
            />
  
            {/* Animated Input */}
            <Animated.View style={[styles.inputContainer, animatedStyle]}>
              <View className="relative">
                <TextInput
                  multiline
                  placeholder="Add a comment..."
                  placeholderTextColor="#888"
                  scrollEnabled={true}
                  value={input}
                  onChangeText={setInput}
                  style={styles.textInput}
                />
                {input && (
                  <TouchableOpacity
                    disabled={!input}
                    style={styles.sendButton}
                  >
                    <Text style={{ color: Colors.primary }}>↑</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
  
          </Animated.View>
        </GestureDetector>
      </TouchableWithoutFeedback>
    );
  };
  
  export default CommentsModal;
  
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: Colors.primary,
      borderRadius: 30,
    },
    inputContainer: {
      width: '100%',
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: '#111',
      position: 'absolute',
      left: 0,
      right: 0,
      paddingBottom: 50,
      paddingTop: 10,
      borderTopWidth: 0.5,
      borderColor: '#333',
    },
    textInput: {
      backgroundColor: '#222',
      color: 'white',
      fontFamily: 'courier',
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 20,
      minHeight: 40,
      maxHeight: 150,
      textAlignVertical: 'center',
    },
    sendButton: {
      position: 'absolute',
      bottom: 12,
      right: 20,
      backgroundColor: Colors.secondary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 15,
    },
  });
  