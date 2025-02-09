import React, { useRef , useCallback} from "react";
import { View, Image, Animated, PanResponder, Text, StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";

const SwipeCard = ({ item, setItem, onLike, onReject, onSwipeUp, onAnimationEnd, nextItem }) => {
  const swipe = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const titlSign = useRef(new Animated.Value(1)).current;
  const { height } = Dimensions.get('screen');
  const router = useRouter()


  const posterURL = "https://image.tmdb.org/t/p/original";

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: swipe.x,
            dy: swipe.y,
          },
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, { dx, dy }) => {
        if (dx > 120) {
          // Swiped Right
          Animated.timing(swipe, {
            toValue: { x: 500, y: 0 },
            duration: 500,
            useNativeDriver: false,
          }).start(() => {
            onLike(item);  // Call after animation completes
            swipe.setValue({ x: 0, y: 0 });
            opacity.setValue(0); // Fade out current card
            onAnimationEnd(); // Notify TinderSwipeCard to set the new movie after animation is complete
          });
        } else if (dx < -120) {
          // Swiped Left
          Animated.timing(swipe, {
            toValue: { x: -500, y: 0 },
            duration: 500,
            useNativeDriver: false,
          }).start(() => {
            onReject(item);  // Call after animation completes
            swipe.setValue({ x: 0, y: 0 });
            opacity.setValue(0); // Fade out current card
            onAnimationEnd(); // Notify TinderSwipeCard to set the new movie after animation is complete
          });
        } else if (dy < -120) {

            Animated.timing(swipe, {
                toValue: { x: 0, y: -1100 },
                duration: 600,
                useNativeDriver: false,
              }).start(() => {

                onSwipeUp(item)
                // setItem(item);
                swipe.setValue({ x: 0, y: 0 });
                // opacity.setValue(0); // Fade out current card
                // if (item.media_type === 'movie') {
                //     router.push(`/movie/${item.id}`)
                // } else if (item.media_type === 'tv') {
                //     router.push(`/tv/${item.id}`)
                // }
                // onAnimationEnd(); // Notify TinderSwipeCard to set the new movie after animation is complete
              });
           
        } else {
            // Reset Position
            Animated.spring(swipe, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }).start();

        }
      },
    })
  ).current;

// const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: (_, {dx, dy, y0}) => {
//         swipe.setValue({x: dx, y: dy});
//         titlSign.setValue(y0 > (height * 0.9) / 2 ? 1 : -1);
//       },
//       onPanResponderRelease: (_, {dx, dy}) => {
//         const direction = Math.sign(dx);
//         const isSwipedOffScreen = Math.abs(dx) > 100;

//         if (isSwipedOffScreen) {
//           Animated.timing(swipe, {
//             duration: 500,
//             toValue: {
//               x: direction * 500,
//               y: dy,
//             },
//             useNativeDriver: true,
//           }).start(removeTopCard);
//           return;
//         }

//         Animated.spring(swipe, {
//           toValue: {
//             x: 0,
//             y: 0,
//           },
//           useNativeDriver: true,
//           friction: 5,
//         }).start();
//       },
//     }),
//   ).current;

//   const removeTopCard = useCallback(() => {
//     setItem(prevState => {
//     //   onSwipeUser(swipe, prevState);
//       return prevState.slice(1);
//     });
//     swipe.setValue({x: 0, y: 0});
//   }, [swipe]);
    

  // Opacity on swipe direction
  const likeOpacity = swipe.x.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const rejectOpacity = swipe.x.interpolate({
    inputRange: [-50, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const rotate = Animated.multiply(swipe.x, titlSign).interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ['8deg', '0deg', '-8deg'],
  });

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), { rotate }],
  };


  return (
    <View className='h-full w-full'>
        <Animated.View
        style={[
            styles.card,
            {
            transform: swipe.getTranslateTransform(),
            opacity, // Apply opacity transition for smooth fade
            },
        ]}
        {...panResponder.panHandlers}
        >
        <View style={styles.choiceContainer}>
            {/* Swipe Feedback */}
            <Animated.Text style={[styles.interested, animatedCardStyle, { opacity: likeOpacity }]}>
            ADD TO WATCHLIST
            </Animated.Text>
            <Animated.Text style={[styles.notInterested, animatedCardStyle, { opacity: rejectOpacity }]}>
            NOT INTERESTED
            </Animated.Text>
        </View>

        {/* Poster Image */}
        <Image
            source={{ uri: `${posterURL}${item.poster_path}` }}
            style={styles.poster}
        />

        {/* <Text style={styles.text}>
            {item.media_type === "movie" ? item.title : item.name}
        </Text> */}
     
        </Animated.View>

    </View>
  );
};

export default SwipeCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    // shadowColor: "#000",
    // shadowOpacity: 0.3,
    // shadowOffset: { width: 0, height: 5 },
    // shadowRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 0, // No padding
    position:'relative'
  },
  choiceContainer: {
    position: "relative",

    zIndex: 30,
    justifyContent : 'center',
    alignItems : 'center',
    borderRadius : 2,
    borderWidth : 0,

    
  },
  interested: {
    fontSize: 32,
    color:'green',
    fontWeight: "bold",
    textAlign: "center",
    borderWidth:2,
    borderColor:'green',
    paddingVertical:5,
    paddingHorizontal:10,
    borderRadius:10,
    left: 0,
    transform: [{rotate: '-30deg'}],
  },
  notInterested: {
    fontSize: 32,
    color:'red',
    fontWeight: "bold",
    textAlign: "center",
    borderWidth:2,
    borderColor:'red',
    paddingVertical:5,
    paddingHorizontal:10,
    borderRadius:10,
    right: 0,
    position:'absolute',
    transform: [{rotate: '30deg'}],
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    // color:Colors.secondary
  },
  poster: {
    borderRadius: 50,
    width: 400,
    height: 800,
    resizeMode: "cover",
    marginBottom: 0,
    position:'absolute',
    top: 420,

  },
});
